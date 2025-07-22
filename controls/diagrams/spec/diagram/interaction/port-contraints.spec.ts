
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { MouseEvents } from './mouseevents.spec';
import { PortConstraints, ConnectorConstraints  } from '../../../src/diagram/enum/enum';
import { Node } from '../../../src/diagram/objects/node';
import { PortVisibility, DiagramTools, ShapeStyleModel } from '../../../src/diagram/index';
import { NodeConstraints } from '../../../src/index';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';

/**
* Test cases for port constraints
*/
describe('Diagram Control', () => {

    describe('Ports with constraints', () => {
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
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let nodeport1: PointPortModel = {
                offset: { x: 0.5, y: 0.5 }, visibility: PortVisibility.Visible
            };
            let nodeport2: PointPortModel = {
                offset: { x: 0.5, y: 0.5 }, visibility: PortVisibility.Visible
            };
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, ports: [nodeport1] };
            let node1: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 100, ports: [nodeport2] };
            diagram = new Diagram({

                width: '500px', height: '500px', nodes: [node, node1]
                //connectors: [connector]
            });

            diagram.appendTo('#diagram3');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking selected port dragging with constraint', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 68, 68, true);
            let node: NodeModel = diagram.nodes[0];
            node.ports[0].constraints = PortConstraints.Drag;
            //    diagramCanvas = document.getElementById('node1_' + (diagram.nodes[0] as Node).ports[0].id);
            //  let rect: ClientRect = diagramCanvas.getBoundingClientRect();
            mouseEvents.clickEvent(diagramCanvas, 102.5, 102.5);
            mouseEvents.dragAndDropEvent(diagramCanvas, 102.5, 102.5, 103, 103);
            expect(diagram.nodes[0].ports[0].offset.x).toBe(0.51);
            expect(diagram.nodes[0].ports[0].offset.y).toBe(0.51);
            diagram.clearSelection();

            done();
        });
        it('Checking selected port drawing with constraint', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 358, 68, true);
            let node: NodeModel = diagram.nodes[1];
            node.ports[0].constraints = PortConstraints.Draw | PortConstraints.OutConnect;
            mouseEvents.clickEvent(diagramCanvas, 402.5, 102.5);
            mouseEvents.mouseDownEvent(diagramCanvas, 402.5, 102.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 402.5, 104.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 402.5, 200);
            mouseEvents.mouseUpEvent(diagramCanvas, 402.5, 200);
            expect(diagram.connectors.length == 1).toBe(true);
            expect(diagram.connectors[0].sourcePortID == diagram.nodes[1].ports[0].id).toBe(true);
            done();
        });

        it('Checking port drawing more than one connenctor', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 358, 68, true);
            let node: NodeModel = diagram.nodes[1];
            node.ports[0].constraints = PortConstraints.Draw | PortConstraints.OutConnect;
            mouseEvents.clickEvent(diagramCanvas, 200, 102.5);
            mouseEvents.mouseDownEvent(diagramCanvas, 402.5, 102.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 402.5, 104.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 402.5, 250);
            mouseEvents.mouseUpEvent(diagramCanvas, 402.5, 250);
            mouseEvents.clickEvent(diagramCanvas, 200, 102.5);
            mouseEvents.mouseDownEvent(diagramCanvas, 402.5, 102.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 402.5, 104.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 402.5, 230);
            mouseEvents.mouseUpEvent(diagramCanvas, 402.5, 230);
            expect(diagram.connectors.length == 3).toBe(true);
            expect((diagram.tool & DiagramTools.SingleSelect) != 0).toBe(true);
            done();
        })
        it('CR -issue-fix for removing the connectors in collection change', (done: Function) => {
            diagram.collectionChange = (arg: any) => {
                if (arg.type === "Addition" && arg.state === "Changing") {
                    if (!(arg.element.sourcePortID && arg.element.targetPortID)) {
                        arg.cancel = true;
                    }
                }
            }
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 358, 68, true);
            let node: NodeModel = diagram.nodes[1];
            node.ports[0].constraints = PortConstraints.Draw;
            mouseEvents.clickEvent(diagramCanvas, 200, 102.5);
            mouseEvents.mouseDownEvent(diagramCanvas, 402.5, 102.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 402.5, 104.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 402.5, 250);
            mouseEvents.mouseUpEvent(diagramCanvas, 402.5, 250);
            mouseEvents.clickEvent(diagramCanvas, 200, 102.5);
            mouseEvents.mouseDownEvent(diagramCanvas, 402.5, 102.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 402.5, 104.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 402.5, 230);
            mouseEvents.mouseUpEvent(diagramCanvas, 402.5, 230);
            expect(diagram.connectors.length == 3).toBe(true);
            done();
        })
    })

    describe('Ports with constraints undo redo ', () => {
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
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let nodeport1: PointPortModel = {
                offset: { x: 0.5, y: 0.5 }, visibility: PortVisibility.Visible
            };
            let nodeport2: PointPortModel = {
                offset: { x: 0.5, y: 0.5 }, visibility: PortVisibility.Visible
            };
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, ports: [nodeport1] };
            let node1: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 100, ports: [nodeport2] };
            diagram = new Diagram({

                width: '500px', height: '500px', nodes: [node, node1]
                //connectors: [connector]
            });

            diagram.appendTo('#diagram3');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking selected port dragging undo redo ', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 68, 68, true);
            let node: NodeModel = diagram.nodes[0];
            node.ports[0].constraints = PortConstraints.Drag;
            //    diagramCanvas = document.getElementById('node1_' + (diagram.nodes[0] as Node).ports[0].id);
            //  let rect: ClientRect = diagramCanvas.getBoundingClientRect();
            mouseEvents.clickEvent(diagramCanvas, 102.5, 102.5);
            mouseEvents.dragAndDropEvent(diagramCanvas, 102.5, 102.5, 103, 103);
            expect(diagram.nodes[0].ports[0].offset.x).toBe(0.51);
            expect(diagram.nodes[0].ports[0].offset.y).toBe(0.51);
            diagram.clearSelection();
            diagram.undo();
            diagram.redo();
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
    describe('Ports with constraints undo redo ', () => {
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
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 150, annotations: [{ content: 'Node1' }],
                shape: { type: 'Basic', shape: 'Rectangle' }, constraints: NodeConstraints.Default & ~NodeConstraints.InConnect,
                ports: [
                    { id: 'node1In', height: 10, width: 10, offset: { x: 1, y: 0.5 }, constraints: PortConstraints.InConnect },
                ]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 150, annotations: [{ content: 'Node2' }],
                shape: { type: 'Basic', shape: 'Rectangle' }, constraints: NodeConstraints.Default & ~NodeConstraints.OutConnect,
                ports: [
                    { id: 'node2Out', height: 10, width: 10, offset: { x: 0, y: 0.5 }, constraints: PortConstraints.OutConnect },
                ]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 100, offsetY: 300, annotations: [{ content: 'Node3' }],
                shape: { type: 'Basic', shape: 'Rectangle' }, constraints: NodeConstraints.Default & ~NodeConstraints.InConnect,
                ports: [
                    { id: 'node3In', height: 10, width: 10, offset: { x: 1, y: 0.5 }, constraints: PortConstraints.InConnect },
                ]
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 400, offsetY: 300, annotations: [{ content: 'Node4' }],
                shape: { type: 'Basic', shape: 'Rectangle' }, constraints: NodeConstraints.Default & ~NodeConstraints.OutConnect,
                ports: [
                    { id: 'node4Out', height: 10, width: 10, offset: { x: 0, y: 0.5 }, constraints: PortConstraints.OutConnect },
                ]
            };
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1', sourcePoint: { x: 300, y: 150 }, targetPoint: { x: 200, y: 150 },
                    type: 'Orthogonal', segments: [{ type: 'Orthogonal' }], targetDecorator: { height: 10, width: 10 }
                },
                {
                    id: 'connector2', sourcePoint: { x: 300, y: 300 }, targetPoint: { x: 200, y: 300 },
                    type: 'Orthogonal', segments: [{ type: 'Orthogonal' }], targetDecorator: { height: 10, width: 10 }
                },
            ];
            diagram = new Diagram({

                width: '500px', height: '500px', nodes: [node1, node2, node3, node4],
                connectors: connectors
            });

            diagram.appendTo('#diagram4');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Port with Inconnect', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 210, 150);
            mouseEvents.mouseDownEvent(diagramCanvas, 200, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 153, 155);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.connectors[0].targetID).toBe('');
            expect(diagram.connectors[0].targetPortID).toBe('');
            diagram.clearSelection();
            done();
        });
        it('Port with OutConnect', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 150);
            mouseEvents.mouseDownEvent(diagramCanvas, 300, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 358, 155);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.connectors[0].sourceID).toBe('');
            expect(diagram.connectors[0].sourcePortID).toBe('');
            diagram.clearSelection();
            done();
        });
        it('Port with OutConnect not connect on Node', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            mouseEvents.mouseDownEvent(diagramCanvas, 300, 300);
            mouseEvents.mouseMoveEvent(diagramCanvas, 380, 300);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.connectors[1].sourceID).toBe('');
            expect(diagram.connectors[1].sourcePortID).toBe('');
            diagram.clearSelection();
            done();
        });
        it('Port with Inconnect not connect on Node', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 210, 300);
            mouseEvents.mouseDownEvent(diagramCanvas, 200, 300);
            mouseEvents.mouseMoveEvent(diagramCanvas, 120, 300);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.connectors[1].targetID).toBe('');
            expect(diagram.connectors[1].targetPortID).toBe('');
            diagram.undo();
            diagram.clearSelection();
            done();
        });
    });

    describe('Ports with group undo redo ', () => {
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
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);

            let nodes: NodeModel[] = [
                {
                    id: 'node3', width: 50, height: 100, offsetX: 300, annotations: [{ id: 'text1', content: 'Child1' }],
                    offsetY: 300,
                }, {
                    id: 'node4', width: 50, height: 100, offsetX: 400, annotations: [{ id: 'text1', content: 'Child2' }],
                    offsetY: 300
                },
                {
                    id: 'group', children: ['node3', 'node4'], annotations: [{ id: 'group1', content: 'Group' }],
                    ports: [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0.5 } },
                    { id: 'port2', visibility: PortVisibility.Hover, shape: 'Circle', offset: { x: 0.5, y: 0 } },
                    { id: 'port3', visibility: PortVisibility.Hidden, shape: 'Circle', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', visibility: PortVisibility.Connect, shape: 'Circle', offset: { x: 0.5, y: 1 } }
                    ]
                },
            ]

            diagram = new Diagram({
                width: '500px', height: '500px', nodes: nodes,
            });

            diagram.appendTo('#diagram5');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Group node with ports undo redo', (done: Function) => {
            diagram.select([diagram.nodes[2]]);
            diagram.copy();
            diagram.paste();
            diagram.undo();
            expect(document.getElementById("groupgroup_container_groupElement").children.length).toEqual(2);
            expect(document.getElementById(diagram.element.id + "_diagramPorts").children.length).toEqual(4);
            done();
        });
    });

    describe('Ports with inconnect and outconnect ', () => {
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
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);

            let nodes: NodeModel[] = [
                {
                    id: "1",
                    offsetX: 100,
                    offsetY: 150,
                    width: 100,
                    height: 100,
                    constraints: NodeConstraints.Default & ~(NodeConstraints.InConnect | NodeConstraints.OutConnect),
                    ports: [
                        {
                            offset: {
                                x: 0,
                                y: 0.5,
                            },
                            visibility: 1,
                            constraints: PortConstraints.InConnect | PortConstraints.OutConnect | PortConstraints.Draw,
                        },
                        {
                            id: "1port",
                            offset: {
                                x: 1,
                                y: 0.5,
                            },
                            visibility: 1,
                            constraints: PortConstraints.InConnect | PortConstraints.OutConnect | PortConstraints.Draw,
                        }
                    ]
                },
                {
                    id: "2",
                    offsetX: 400,
                    offsetY: 150,
                    width: 100,
                    height: 100,
                    constraints: NodeConstraints.Default & ~(NodeConstraints.InConnect | NodeConstraints.OutConnect),
                    ports: [
                        {
                            id: "2port",
                            offset: {
                                x: 0,
                                y: 0.5,
                            },
                            visibility: 1,
                            constraints: PortConstraints.InConnect | PortConstraints.OutConnect | PortConstraints.Draw,
                        },
                        {
                            offset: {
                                x: 1,
                                y: 0.5,
                            },
                            visibility: 1,
                            constraints: PortConstraints.InConnect | PortConstraints.OutConnect | PortConstraints.Draw,
                        }
                    ]
                },
                {
                    id: '3', width: 100, height: 100, offsetX: 100, offsetY: 300,
                    shape: { type: 'Basic', shape: 'Rectangle' }, constraints: NodeConstraints.Default,
                    ports: [
                        { id: '3port', visibility: 1, height: 10, width: 10, offset: { x: 1, y: 0.5 }, constraints: PortConstraints.None },
                    ]
                },
                {
                    id: '4', width: 100, height: 100, offsetX: 400, offsetY: 300, annotations: [{ content: 'Node4' }],
                    shape: { type: 'Basic', shape: 'Rectangle' }, constraints: NodeConstraints.Default,
                    ports: [
                        { id: '4port', visibility: 1, height: 10, width: 10, offset: { x: 0, y: 0.5 }, constraints: PortConstraints.InConnect | PortConstraints.OutConnect },
                    ]
                },
                {
                    id: '5', width: 100, height: 100, offsetX: 100, offsetY: 500,
                    shape: { type: 'Basic', shape: 'Rectangle' }, constraints: NodeConstraints.Default & ~(NodeConstraints.InConnect | NodeConstraints.OutConnect),
                    ports: [
                        { id: '5port', height: 10, width: 10, offset: { x: 1, y: 0.5 }, constraints: PortConstraints.InConnect | PortConstraints.OutConnect },
                    ]
                },
                {
                    id: '6', width: 100, height: 100, offsetX: 400, offsetY: 500,
                    shape: { type: 'Basic', shape: 'Rectangle' }, constraints: NodeConstraints.Default & ~(NodeConstraints.InConnect | NodeConstraints.OutConnect),
                    ports: [
                        { id: '6port', height: 10, width: 10, offset: { x: 0, y: 0.5 }, constraints: PortConstraints.InConnect | PortConstraints.OutConnect },
                    ]
                }
            ];

            let connectors: ConnectorModel[] = [{
                sourceID: "1",
                sourcePortID: "1port",
                targetID: "2",
                targetPortID: "2port",
            },
            {
                sourceID: "3",
                sourcePortID: "3port",
                targetID: "4",
                targetPortID: "4port",
            },
            {
                sourceID: "5",
                targetID: "6",
            }
            ];

            diagram = new Diagram({
                width: '500px', height: '500px', nodes: nodes, connectors: connectors
            });

            diagram.appendTo('#diagram6');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('port with inconnect and outconnect and node without inconnect and outconnect', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 160, 150);
            mouseEvents.mouseDownEvent(diagramCanvas, 155, 155);
            mouseEvents.mouseMoveEvent(diagramCanvas, 180, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 180, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 155, 155);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            done();
        });
        it('port with None and node default', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 160, 300);
            mouseEvents.mouseDownEvent(diagramCanvas, 155, 300);
            mouseEvents.mouseMoveEvent(diagramCanvas, 180, 300);
            mouseEvents.mouseMoveEvent(diagramCanvas, 180, 300);
            mouseEvents.mouseMoveEvent(diagramCanvas, 135, 300);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            done();
        });
        it('Remove port inconnect runtime', (done: Function) => {
            diagram.nodes[0].ports[1].constraints = PortConstraints.Default & ~PortConstraints.OutConnect;
            diagram.dataBind();
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 160, 150);
            mouseEvents.mouseDownEvent(diagramCanvas, 155, 155);
            mouseEvents.mouseMoveEvent(diagramCanvas, 180, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 180, 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, 155, 155);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            done();
        });
        it('sourceport and targetport not defined and port constraints as inconnect and outconnect', (done: Function) => {
            expect(diagram.connectors[2].sourcePoint.x).toBe(0);
            expect(diagram.connectors[2].sourcePoint.y).toBe(0);
            expect(diagram.connectors[2].targetPoint.x).toBe(0);
            expect(diagram.connectors[2].targetPoint.y).toBe(0);
            diagram.drag(diagram.nodes[5], 200, 550);
            expect(diagram.connectors[2].sourcePoint.x).toBe(0);
            expect(diagram.connectors[2].sourcePoint.y).toBe(0);
            expect(diagram.connectors[2].targetPoint.x).toBe(0);
            expect(diagram.connectors[2].targetPoint.y).toBe(0);
            done();
        });
    });
    describe('Port Constraints - Draw', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramannotation' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node1' }],
                ports: [
                    {
                        id: 'port11', visibility: PortVisibility.Visible, offset: { x: 0, y: 0.5 },
                        constraints: PortConstraints.Default | PortConstraints.Draw
                    },
                    {
                        id: 'port12', visibility: PortVisibility.Visible, offset: { x: 1, y: 0.5 },
                        constraints: PortConstraints.Default | PortConstraints.Draw, height: 15, width: 15
                    }
                ],
                constraints: NodeConstraints.Default & ~(NodeConstraints.InConnect | NodeConstraints.OutConnect)
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 200, annotations: [{ content: 'Node2' }],
                ports: [
                    {
                        id: 'port21', visibility: PortVisibility.Visible, offset: { x: 0, y: 0.5 },
                        constraints: PortConstraints.Default | PortConstraints.Draw
                    },
                    {
                        id: 'port22', visibility: PortVisibility.Visible, offset: { x: 1, y: 0.5 },
                        constraints: PortConstraints.Default | PortConstraints.Draw
                    }
                ],
                constraints: NodeConstraints.Default & ~(NodeConstraints.InConnect | NodeConstraints.OutConnect)
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2]

            });
            diagram.appendTo('#diagramannotation');
        });

        it('Check highlighter render or not', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100.5, 80.5);
            mouseEvents.mouseDownEvent(diagramCanvas, 250.5, 200.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 550.5, 180.5);
            mouseEvents.mouseUpEvent(diagramCanvas, 550.5, 180.5);
            let highlighter: HTMLElement = document.getElementById('diagram_diagramAdorner_svg_highlighter');
            expect(highlighter === null).toBe(true);
            done();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
    });

    describe('Node ports are gets ignored', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramannotation' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', offsetX: 100, offsetY: 100,width:100,height:100, ports:[{ id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 },constraints:PortConstraints.InConnect },
                { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 0 },constraints:PortConstraints.Drag  },
                { id: 'port3', shape: 'Circle', offset: { x: 1, y: 0.5 },constraints:PortConstraints.None  },
                { id: 'port4', shape: 'Circle', offset: { x: 0.5, y: 1 },constraints:PortConstraints.OutConnect  }]
            };
            let node2: NodeModel = { id: 'node2', offsetX: 300, offsetY: 100,width:100,height:100,ports:[{ id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 },constraints:PortConstraints.InConnect },
            { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 0 },constraints:PortConstraints.OutConnect  },
            { id: 'port3', shape: 'Circle', offset: { x: 1, y: 0.5 },constraints:PortConstraints.None  },
            { id: 'port4', shape: 'Circle', offset: { x: 0.5, y: 1 },constraints:PortConstraints.OutConnect  }]
            };
            let connector: ConnectorModel = { id: 'Connector1', sourceID: 'node1', sourcePortID: 'port3', targetID: 'node2', targetPortID: 'port3' };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node1, node2],connectors:[connector]

            });
            diagram.appendTo('#diagramannotation');
        });

        it('Node ports are gets ignored', (done: Function) => {
            expect(diagram.connectors[0].sourcePortID === '' && diagram.connectors[0].targetPortID === '').toBe(true);
            done();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
    });
    describe('EJ2-49436 - The combination of port constraints is not working', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramannotation' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 150, annotations: [{ content: 'Node1' }],
                shape: { type: 'Basic', shape: 'Rectangle' },
                constraints: NodeConstraints.Default,
                ports: [
                    { id: 'node8In', height: 10, width: 10, offset: { x: 1, y: 0.5 }, constraints:PortConstraints.Default & ~PortConstraints.InConnect },
                ]
            };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 150, annotations: [{ content: 'Node2' }],
            shape: { type: 'Basic', shape: 'Rectangle' }, constraints: NodeConstraints.Default,
            ports: [
                { id: 'node2Out', height: 10, width: 10, visibility: PortVisibility.Visible, offset: { x: 0, y: 0.5 }, constraints: PortConstraints.Default & ~(PortConstraints.InConnect | PortConstraints.OutConnect) },
            ]
            };
            let connector: ConnectorModel = {id: 'connector7',sourcePoint: { x: 300, y: 150 }, targetPoint: { x: 200, y: 150 },
            type: 'Orthogonal', segments: [{ type: 'Orthogonal' }], targetDecorator: { height: 10, width: 10 } };
            diagram = new Diagram({
                width: '1000px', height: '500px', nodes: [node1, node2],connectors:[connector]

            });
            diagram.appendTo('#diagramannotation');
        });

        it('EJ2-49436 - The combination of port constraints is not working', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            debugger;
            mouseEvents.clickEvent(diagramCanvas, 282, 158);
            mouseEvents.mouseDownEvent(diagramCanvas, 298, 148);
            mouseEvents.mouseMoveEvent(diagramCanvas, 450, 151);
            mouseEvents.mouseUpEvent(diagramCanvas, 450 ,151);
            expect(diagram.connectors[0].sourcePortID === '' && diagram.connectors[0].targetPortID === '').toBe(true);
            done();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
    });

    describe('Connection Padding ', () => {
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
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 150, offsetX: 150, offsetY: 150, annotations: [{ content: 'Node1' }],
                shape: { type: 'Basic', shape: 'Rectangle' },
                ports: [
                    { id: 'port3', visibility: PortVisibility.Visible, height: 50, width: 50, shape: 'Circle', constraints: PortConstraints.Draw | PortConstraints.OutConnect, offset: { x: 1, y: 0.5 } },
                ],
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 468, offsetY: 150, annotations: [{ content: 'Node2' }],
                shape: { type: 'Basic', shape: 'Rectangle' },
                ports: [
                    { id: 'port21', visibility: PortVisibility.Visible, height: 50, width: 50, constraints: PortConstraints.Draw | PortConstraints.InConnect, shape: 'Circle', offset: { x: 0.5, y: 0 } },
                    { id: 'port31', visibility: PortVisibility.Visible, height: 50, width: 50, shape: 'Circle', constraints: PortConstraints.Draw | PortConstraints.InConnect, offset: { x: 0, y: 0.5 } },
                    { id: 'port41', visibility: PortVisibility.Visible, height: 50, width: 50, shape: 'Circle', constraints: PortConstraints.Draw | PortConstraints.InConnect, offset: { x: 0.5, y: 1 } }
                ]
            };
            diagram = new Diagram({

                width: '1000px', height: '500px', nodes: [node1, node2],
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    if (obj.id.indexOf('connector') !== -1) {
                        obj.type = 'Orthogonal';
                        obj.targetDecorator = { shape: 'Arrow', width: 10, height: 10 };
                    }
                    obj.constraints = ConnectorConstraints.Default & ~ConnectorConstraints.ConnectToNearByNode;
                    obj.connectionPadding = 55;
                    return obj;
                },
            });

            diagram.appendTo('#diagram4');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('By Port Draw checking the ConnectToNearByPort', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseDownEvent(diagramCanvas, 196, 149);
            mouseEvents.mouseMoveEvent(diagramCanvas, 400, 160);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.connectors[0].connectionPadding).toBe(55);
            done();
        });
    });

    describe('Dragging the multiselect objects,connector removes from selection', () => {
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
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            function getNodeDefaults(obj: NodeModel): NodeModel {
                obj.width = 100;
                obj.height = 100;
                obj.shape = { type: 'Basic', shape: 'Ellipse' };
                obj.style = { fill: '#37909A', strokeColor: '#024249' };
                obj.annotations[0].margin = { left: 10, right: 10 };
                obj.annotations[0].style = {
                  color: 'white',
                  fill: 'none',
                  strokeColor: 'none',
                };
                return obj;
              }

              //Sets the default values of a Connector
              function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                connector.targetDecorator.style = { fill: '#024249', strokeColor: '#024249' };
                return { style: { strokeColor: '#024249', strokeWidth: 2 } };
              }
              function createNodes(): NodeModel[] {
                var nodes: NodeModel[] = [],
                  nodeId: string,
                  indx: number,
                  xpos: number = 200,
                  ypos: number = 200;

                for (indx = 1; indx <= 8; indx++) {
                  nodeId = 'N' + indx.toString();
                  let node: NodeModel = {
                    id: nodeId,
                    offsetX: xpos,
                    offsetY: ypos,
                    width: 100,
                    height: 100,
                    annotations: [{ content: nodeId }],
                    shape: { type: 'Basic' },
                    ports: createPorts(),
                  };

                  node.constraints =
                    NodeConstraints.Default &
                    ~(
                      NodeConstraints.Resize |
                      NodeConstraints.Rotate |
                      NodeConstraints.InConnect |
                      NodeConstraints.OutConnect |
                      NodeConstraints.Tooltip
                    );

                  xpos += 200;
                  if (indx === 4) {
                    xpos = 200;
                    ypos += 200;
                  }
                  nodes.push(node);
                }
                return nodes;
              }

              function createPorts(): PointPortModel[] {
                let ports: PointPortModel[] = [];

                ports = [
                  createPort('i1', 0, 0.2, 'green'),
                  createPort('i2', 0, 0.4, 'green'),
                  createPort('i3', 0, 0.6, 'green'),
                  createPort('i4', 0, 0.8, 'green'),

                  createPort('o1', 1, 0.2, 'red'),
                  createPort('o2', 1, 0.4, 'red'),
                  createPort('o3', 1, 0.6, 'red'),
                  createPort('o4', 1, 0.8, 'red'),
                ];

                return ports;
              }

              function createPort(
                id: string,
                xOffset: number,
                yOffset: number,
                fillColor: string
              ): PointPortModel {
                let constraints =
                  (PortConstraints.Draw |
                    PortConstraints.InConnect |
                    PortConstraints.OutConnect) &
                  ~PortConstraints.Drag;

                let shapeStyle: ShapeStyleModel = {};
                shapeStyle.fill = fillColor;
                shapeStyle.strokeColor = fillColor;
                shapeStyle.strokeWidth = 0.4;
                shapeStyle.opacity = 1;

                let pointPortModel: PointPortModel = {
                  id: id,
                  offset: { x: xOffset, y: yOffset },
                  visibility: PortVisibility.Visible,
                  width: 10,
                  height: 10,
                  shape: 'Square',
                  style: shapeStyle,
                  constraints: constraints,
                  horizontalAlignment: 'Center',
                  verticalAlignment: 'Center',
                };
                return pointPortModel;
              }
              function createConnectors(): Array<ConnectorModel> {
                var connectors: Array<ConnectorModel> = [];

                connectors.push(createConnector('Wire1', 'N1', 'o1', 'N2', 'i2'));
                connectors.push(createConnector('Wire2', 'N3', 'o2', 'N6', 'i2'));
                connectors.push(createConnector('Wire3', 'N4', 'o3', 'N7', 'i4'));
                connectors.push(createConnector('Wire4', 'N2', 'o4', 'N8', 'i3'));
                connectors.push(createConnector('Wire5', 'N3', 'o1', 'N1', 'i3'));
                connectors.push(createConnector('Wire6', 'N1', 'o3', 'N5', 'i2'));
                connectors.push(createConnector('Wire7', 'N4', 'o4', 'N2', 'i4'));
                return connectors;
              }

              function createConnector(
                connectorId: string,
                sourceNodeId: string,
                sourcePortId: string,
                targetNodeId: string,
                targetPortId: string
              ): ConnectorModel {
                var connector: ConnectorModel = {
                  id: connectorId,
                  sourceID: sourceNodeId,
                  sourcePortID: sourcePortId,
                  targetID: targetNodeId,
                  targetPortID: targetPortId,
                  type: 'Bezier',
                };
                connector.constraints =
                  ConnectorConstraints.Default |
                  ConnectorConstraints.DragSourceEnd |
                  ConnectorConstraints.DragTargetEnd;
                return connector;
            }
            diagram = new Diagram({

                width: '100%',
                height: '645px',
                nodes: createNodes(),
                connectors: createConnectors(),
                //Sets the default values of a node
                getNodeDefaults: getNodeDefaults,
                //Sets the default values of a Connector
                getConnectorDefaults: getConnectorDefaults,
            });

            diagram.appendTo('#diagram4');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('EJ2-70550 - Hovering port and dragging nodes', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 250.5, 175.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 230, 175.5);
            diagram.selectAll();
            mouseEvents.mouseDownEvent(diagramCanvas, 230, 175.5);
            mouseEvents.mouseMoveEvent(diagramCanvas, 400, 160);
            mouseEvents.mouseUpEvent(diagramCanvas, 400,160);
            expect((diagram.nodes[0] as any).outEdges.length===2).toBe(true);
            expect((diagram.connectors[0] as any).sourcePortID!="").toBe(true);
            expect((diagram.connectors[0] as any).targetPortID !="").toBe(true);
            done();
        });
    });

});