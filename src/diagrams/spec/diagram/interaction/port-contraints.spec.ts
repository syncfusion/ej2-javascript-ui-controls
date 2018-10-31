
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { MouseEvents } from './mouseevents.spec';
import { PortConstraints } from '../../../src/diagram/enum/enum';
import { Node } from '../../../src/diagram/objects/node';
import { PortVisibility, DiagramTools } from '../../../src/diagram/index';

/**
* Test cases for port constraints
*/
describe('Diagram Control', () => {

    describe('Ports with constraints', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
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



    })
});