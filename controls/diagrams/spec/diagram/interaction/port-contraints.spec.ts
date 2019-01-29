
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { MouseEvents } from './mouseevents.spec';
import { PortConstraints } from '../../../src/diagram/enum/enum';
import { Node } from '../../../src/diagram/objects/node';
import { PortVisibility, DiagramTools } from '../../../src/diagram/index';
import { NodeConstraints } from '../../../src/index';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';

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
            node.ports[0].constraints = PortConstraints.Draw;
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
            expect((diagram.tool & DiagramTools.SingleSelect) != 0).toBe(true);
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
                    id: 'connector1', sourcePoint: { x: 300, y: 150}, targetPoint: { x: 200, y: 150},
                    type: 'Orthogonal', segments: [{ type: 'Orthogonal'}], targetDecorator: { height: 10, width: 10}
                },
                {
                    id: 'connector2', sourcePoint: { x: 300, y: 300}, targetPoint: { x: 200, y: 300},
                    type: 'Orthogonal', segments: [{ type: 'Orthogonal'}], targetDecorator: { height: 10, width: 10}
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
            expect(diagram.connectors[0].targetID).toBe('node1');
            expect(diagram.connectors[0].targetPortID).toBe('node1In');
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
            expect(diagram.connectors[0].sourceID).toBe('node2');
            expect(diagram.connectors[0].sourcePortID).toBe('node2Out');
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
});