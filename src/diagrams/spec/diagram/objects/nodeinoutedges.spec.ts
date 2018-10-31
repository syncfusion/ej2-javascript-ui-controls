import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, FlowShapeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Connector } from '../../../src/diagram/objects/connector';
import { PointPortModel } from '../../../src/diagram/objects/port-model';

/**
 * Node - Connector Relationships
 */
describe('Diagram Control', () => {

    describe('Connect shapes with connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel
            };
            let node2: NodeModel = {
                id: 'Meeting', width: 100, height: 100, offsetX: 200, offsetY: 300,
                shape: { type: 'Flow', shape: 'MultiDocument' } as FlowShapeModel,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 200,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel,
            };
            let node4: NodeModel = { style: {}, shape: {} }; node4.id = 'node4';
            node4.width = 100; node4.height = 100; node4.offsetX = 500; node4.offsetY = 300;
            let nodeport4: PointPortModel = {}; nodeport4.shape = 'Square'; nodeport4.offset = { x: 1, y: 0.5 };
            nodeport4.id = 'port4'; node4.ports = [nodeport4];

            let connector1: ConnectorModel = {};
            connector1.id = 'connector1';
            connector1.type = 'Straight';
            connector1.sourceID = node1.id;
            connector1.targetID = node2.id;

            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Straight';
            connector2.sourceID = node4.id;
            connector2.sourcePortID = nodeport4.id;
            connector2.targetID = node3.id;

            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node1, node2, node3, node4],
                connectors: [connector1, connector2]
            });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking in - out edges', (done: Function) => {
            expect((diagram.nodes[0] as Node).outEdges.indexOf(diagram.connectors[0].id) !== -1 &&
                (diagram.nodes[1] as Node).inEdges.indexOf(diagram.connectors[0].id) !== -1 &&
                (diagram.nodes[3] as Node).outEdges.indexOf(diagram.connectors[1].id) !== -1 &&
                (diagram.nodes[2] as Node).inEdges.indexOf(diagram.connectors[1].id) !== -1).toBe(true);
            done();
        });
        it('Checking in - out edges after sourceID change', (done: Function) => {
            diagram.connectors[0].sourceID = diagram.nodes[2].id;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[0];
            //old source
            let node: Node = diagram.nodes[0] as Node;
            //new source
            let newSource: Node = diagram.nodes[2] as Node;
            expect(node.outEdges.length === 0 && newSource.outEdges[0] === connector.id).toBe(true);
            done();
        });
        it('Checking in - out edges after targetID change', (done: Function) => {
            diagram.connectors[1].targetID = diagram.nodes[0].id;
            diagram.dataBind();
            let connector: ConnectorModel = diagram.connectors[1];
            //old source
            let node: Node = diagram.nodes[0] as Node;
            //new source
            let newSource: Node = diagram.nodes[3] as Node;
            expect(node.outEdges.length === 0 && newSource.outEdges[0] === connector.id).toBe(true);
            done();
        });
    });
});