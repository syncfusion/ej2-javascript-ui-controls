import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, PathModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { SnapConstraints } from '../../../src/diagram/enum/enum';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { KeyModifiers, Keys } from '../../../src/diagram/enum/enum';
import { Connector } from '../../../src/diagram/index';
Diagram.Inject(UndoRedo);
/**
 * Connector Docking
 */
describe('Diagram Control', () => {

    describe('Port to port connection ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let pathData: string = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,' +
            '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram63' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                shape: { type: 'Path', data: pathData },
                style: { opacity: 0.5 }
            };
            node.id = 'node'; node.width = 100; node.height = 100;
            node.offsetX = 100; node.offsetY = 150;


            let nodeport: PointPortModel = {}; nodeport.shape = 'Square'; nodeport.offset = { x: 1, y: 0.5 };
            nodeport.id = 'port'; node.ports = [nodeport];

            let node1: NodeModel = { style: { opacity: 0.5 } };
            node1.id = 'node1'; node1.width = 100; node1.height = 100;
            node1.offsetX = 300; node1.offsetY = 150;
            let nodeport1: PointPortModel = {};
            nodeport1.offset = { x: 0, y: 0.5 };
            nodeport1.id = 'port1';
            nodeport1.shape = 'Square';
            node1.ports = [nodeport1];

            let node2: NodeModel = { style: { opacity: 0.5 } };
            node2.id = 'node2'; node2.width = 100; node2.height = 100;
            node2.offsetX = 500; node2.offsetY = 150;
            let nodeport2: PointPortModel = {}; nodeport2.offset = { x: 1, y: 0.5 };
            nodeport2.id = 'port2'; nodeport2.shape = 'Square'; node2.ports = [nodeport2];

            let node3: NodeModel = { style: { opacity: 0.5 } };
            node3.id = 'node3'; node3.width = 100; node3.height = 100;
            node3.offsetX = 700; node3.offsetY = 230;
            let nodeport3: PointPortModel = {}; nodeport3.offset = { x: 0, y: 0.5 };
            nodeport3.id = 'port3'; nodeport3.shape = 'Square'; node3.ports = [nodeport3];

            let node4: NodeModel = { shape: { type: 'Path', data: pathData }, style: { opacity: 0.5 } };
            node4.id = 'node4'; node4.width = 100; node4.height = 100;
            node4.offsetX = 1000; node4.offsetY = 150;
            let nodeport4: PointPortModel = {}; nodeport4.shape = 'Square'; nodeport4.offset = { x: 1, y: 0.5 };
            nodeport4.id = 'port4'; node4.ports = [nodeport4];

            let node5: NodeModel = { shape: { type: 'Path', data: pathData }, style: { opacity: 0.5 } };
            node5.id = 'node5'; node5.width = 100; node5.height = 100;
            node5.offsetX = 900; node5.offsetY = 190;
            let nodeport5: PointPortModel = {}; nodeport5.shape = 'Square'; nodeport5.offset = { x: 0, y: 0.5 };
            nodeport5.id = 'port5'; node5.ports = [nodeport5];

            let node6: NodeModel = {
                id: 'node6', offsetX: 100, offsetY: 300, width: 100, height: 100,
                ports: [{ id: 'right', offset: { x: 1, y: 0.5 } }], style: { opacity: 0.5 }
            };

            let node7: NodeModel = {
                id: 'node7', offsetX: 150, offsetY: 340, width: 100, height: 100,
                ports: [{ id: 'left', offset: { x: 0, y: 0.5 } }], style: { opacity: 0.5 }
            };

            let connector1: ConnectorModel = {};
            connector1.id = 'conn1'; connector1.type = 'Orthogonal';
            connector1.sourceID = node.id; connector1.targetID = node1.id;
            connector1.sourcePortID = nodeport.id; connector1.targetPortID = nodeport1.id;
            connector1.annotations = [{ content: 'conn1' }];

            let connector2: ConnectorModel = {};
            connector2.id = 'conn2'; connector2.type = 'Orthogonal';
            connector2.sourceID = node2.id; connector2.targetID = node3.id;
            connector2.sourcePortID = nodeport2.id; connector2.targetPortID = nodeport3.id;
            connector2.annotations = [{ content: 'conn2' }];

            let connector3: ConnectorModel = {};
            connector3.id = 'conn3'; connector3.type = 'Orthogonal';
            connector3.sourceID = node4.id; connector3.targetID = node5.id;
            connector3.sourcePortID = nodeport4.id; connector3.targetPortID = nodeport5.id;
            connector3.annotations = [{ content: 'conn3' }];

            let connector4: ConnectorModel = {
                sourceID: 'node7', targetID: 'node6', sourcePortID: 'left', targetPortID: 'right',
                type: 'Orthogonal'
            };
            connector4.annotations = [{ content: 'conn4' }];

            diagram = new Diagram({
                width: '1500px', height: '1500px', nodes: [node, node1, node2, node3, node4, node5, node6, node7],
                connectors: [connector1, connector2, connector3, connector4],
                snapSettings: { constraints: SnapConstraints.None }
            });
            diagram.appendTo('#diagram63');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking right to left connection', (done: Function) => {
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();
        });

        it('Checking right to left connection', (done: Function) => {
            //issue - changing the shape at runtime is not updated
            // (diagram.nodes[0] as Node).shape = { type: 'Path' };
            // ((diagram.nodes[0] as NodeModel).shape as PathModel).data = pathData;

            //issue in 'conn1'
            diagram.nodes[0].offsetX = 300; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 100; diagram.nodes[1].offsetY = 350;
            diagram.nodes[2].offsetX = 700; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 250;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 950; diagram.nodes[0].offsetY = 250;
            diagram.nodes[6].offsetY -= 200; diagram.nodes[7].offsetY -= 200;

            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();
        });
        it('Checking right to left connection', (done: Function) => {
            diagram.nodes[0].offsetX = 300; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 500;
            diagram.nodes[2].offsetX = 700; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 250;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();
        });
        it('Checking right to right connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 300;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 200;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 800; diagram.nodes[0].offsetY = 400;
            (diagram.nodes[0] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[1] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[2] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[3] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[4] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[5] as Node).ports[0].offset = { x: 1, y: 0.5 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();
        });

        it('Checking right to right port connection', (done: Function) => {
            diagram.nodes[0].offsetX = 300; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 200; diagram.nodes[1].offsetY = 200;
            diagram.nodes[2].offsetX = 700; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 200;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 950; diagram.nodes[0].offsetY = 500;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();
        });

        it('Checking right to right port connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 145; diagram.nodes[1].offsetY = 310;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 150;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 900; diagram.nodes[0].offsetY = 290;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });
        it('Checking right to right port connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 145; diagram.nodes[1].offsetY = 310;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });
        it('Checking right to top connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 300;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 400;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 800; diagram.nodes[0].offsetY = 400;
            (diagram.nodes[0] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[1] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[2] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[3] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[4] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[5] as Node).ports[0].offset = { x: 0.5, y: 0 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking right to top connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 200; diagram.nodes[1].offsetY = 450;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 510; diagram.nodes[3].offsetY = 350;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 900; diagram.nodes[0].offsetY = 500;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking right to top connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 145; diagram.nodes[1].offsetY = 310;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 430; diagram.nodes[3].offsetY = 270;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 650; diagram.nodes[0].offsetY = 350;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking right to bottom connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 300;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 400;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 800; diagram.nodes[0].offsetY = 400;
            (diagram.nodes[0] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[1] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[2] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[3] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[4] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[5] as Node).ports[0].offset = { x: 0.5, y: 1 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking right to bottom connection', (done: Function) => {
            diagram.nodes[0].offsetX = 300; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 200; diagram.nodes[1].offsetY = 200;
            diagram.nodes[2].offsetX = 576; diagram.nodes[2].offsetY = 324;
            diagram.nodes[3].offsetX = 558; diagram.nodes[3].offsetY = 219;
            diagram.nodes[4].offsetX = 800; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 880; diagram.nodes[0].offsetY = 270;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });
        it('Checking right to bottom connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 145; diagram.nodes[1].offsetY = 310;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking bottom to top connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 300;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 400;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 800; diagram.nodes[0].offsetY = 400;
            (diagram.nodes[0] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[1] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[2] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[3] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[4] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[5] as Node).ports[0].offset = { x: 0.5, y: 0 };
            //issue in conn3
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking bottom to top connection', (done: Function) => {
            diagram.nodes[1].offsetX = 100; diagram.nodes[1].offsetY = 400;
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 100;
            diagram.nodes[5].offsetX = 900; diagram.nodes[5].offsetY = 500;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });
        it('Checking bottom to top connection', (done: Function) => {
            diagram.nodes[0].offsetX = 300; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 100; diagram.nodes[1].offsetY = 400;
            diagram.nodes[2].offsetX = 700; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 200;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 650; diagram.nodes[0].offsetY = 350;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking bottom to bottom connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 300;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 400;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 800; diagram.nodes[0].offsetY = 400;
            (diagram.nodes[0] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[1] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[2] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[3] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[4] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[5] as Node).ports[0].offset = { x: 0.5, y: 1 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking bottom to bottom connection', (done: Function) => {
            diagram.nodes[1].offsetX = 100; diagram.nodes[1].offsetY = 400;
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 100;
            diagram.nodes[5].offsetX = 900; diagram.nodes[5].offsetY = 500;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking bottom to bottom connection', (done: Function) => {
            diagram.nodes[0].offsetX = 300; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 100; diagram.nodes[1].offsetY = 400;
            diagram.nodes[2].offsetX = 700; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 200;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 650; diagram.nodes[0].offsetY = 350;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking bottom to left connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 300;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 400;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 800; diagram.nodes[0].offsetY = 400;
            (diagram.nodes[0] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[1] as Node).ports[0].offset = { x: 0, y: 0.5 };
            (diagram.nodes[2] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[3] as Node).ports[0].offset = { x: 0, y: 0.5 };
            (diagram.nodes[4] as Node).ports[0].offset = { x: 0.5, y: 1 };
            (diagram.nodes[5] as Node).ports[0].offset = { x: 0, y: 0.5 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking bottom to left connection', (done: Function) => {
            diagram.nodes[0].offsetX = 200; diagram.nodes[0].offsetY = 400;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 300;
            diagram.nodes[2].offsetX = 600; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 250;
            diagram.nodes[4].offsetX = 1000; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 900; diagram.nodes[0].offsetY = 340;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });
        it('Checking left to left connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 300;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 400;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 800; diagram.nodes[0].offsetY = 400;
            (diagram.nodes[0] as Node).ports[0].offset = { x: 0, y: 0.5 };
            (diagram.nodes[1] as Node).ports[0].offset = { x: 0, y: 0.5 };
            (diagram.nodes[2] as Node).ports[0].offset = { x: 0, y: 0.5 };
            (diagram.nodes[3] as Node).ports[0].offset = { x: 0, y: 0.5 };
            (diagram.nodes[4] as Node).ports[0].offset = { x: 0, y: 0.5 };
            (diagram.nodes[5] as Node).ports[0].offset = { x: 0, y: 0.5 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking left to left connection', (done: Function) => {
            diagram.nodes[1].offsetX = 80; diagram.nodes[1].offsetY = 270;
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 270;
            diagram.nodes[5].offsetX = 650; diagram.nodes[5].offsetY = 350;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });


        it('Checking left to left connection', (done: Function) => {
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 270;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking left to top connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 300;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 400;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 800; diagram.nodes[0].offsetY = 400;
            (diagram.nodes[0] as Node).ports[0].offset = { x: 0, y: 0.5 };
            (diagram.nodes[1] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[2] as Node).ports[0].offset = { x: 0, y: 0.5 };
            (diagram.nodes[3] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[4] as Node).ports[0].offset = { x: 0, y: 0.5 };
            (diagram.nodes[5] as Node).ports[0].offset = { x: 0.5, y: 0 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });
        it('Checking left to top connection', (done: Function) => {
            diagram.nodes[0].offsetX = 300; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 150; diagram.nodes[1].offsetY = 450;
            diagram.nodes[2].offsetX = 800; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 330;
            diagram.nodes[4].offsetX = 1000; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 1050; diagram.nodes[0].offsetY = 450;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking left to top connection', (done: Function) => {
            diagram.nodes[0].offsetX = 300; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 200;
            diagram.nodes[2].offsetX = 700; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 710; diagram.nodes[3].offsetY = 400;
            diagram.nodes[4].offsetX = 1000; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 950; diagram.nodes[0].offsetY = 340;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking top to top connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 300;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 400;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 800; diagram.nodes[0].offsetY = 400;
            (diagram.nodes[0] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[1] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[2] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[3] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[4] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[5] as Node).ports[0].offset = { x: 0.5, y: 0 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking top to top connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 100; diagram.nodes[1].offsetY = 400;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 510; diagram.nodes[3].offsetY = 350;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 900; diagram.nodes[0].offsetY = 500;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking top to top connection', (done: Function) => {
            diagram.nodes[1].offsetX = 80; diagram.nodes[1].offsetY = 270;
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 270;
            diagram.nodes[5].offsetX = 650; diagram.nodes[5].offsetY = 350;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });

        it('Checking top to top connection', (done: Function) => {
            diagram.nodes[1].offsetX = 80; diagram.nodes[1].offsetY = 270;
            diagram.nodes[3].offsetX = 500; diagram.nodes[3].offsetY = 270;
            diagram.nodes[5].offsetX = 650; diagram.nodes[5].offsetY = 350;
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();

        });
        it('Checking port to port connection', (done: Function) => {
            diagram.nodes[0].offsetX = 100; diagram.nodes[0].offsetY = 300;
            diagram.nodes[1].offsetX = 300; diagram.nodes[1].offsetY = 300;
            diagram.nodes[2].offsetX = 500; diagram.nodes[2].offsetY = 300;
            diagram.nodes[3].offsetX = 700; diagram.nodes[3].offsetY = 400;
            diagram.nodes[4].offsetX = 900; diagram.nodes[0].offsetY = 300;
            diagram.nodes[5].offsetX = 800; diagram.nodes[0].offsetY = 400;
            (diagram.nodes[0] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[1] as Node).ports[0].offset = { x: 0, y: 0.5 };
            (diagram.nodes[2] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[3] as Node).ports[0].offset = { x: 1, y: 0.5 };
            (diagram.nodes[4] as Node).ports[0].offset = { x: 0.5, y: 0 };
            (diagram.nodes[5] as Node).ports[0].offset = { x: 0.5, y: 0 };
            //issue in conn1
            diagram.dataBind();
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                (diagram.nodes[0] as Node).outEdges[0] === 'conn1' && (diagram.nodes[1] as Node).inEdges[0] === 'conn1' &&
                diagram.connectors[1].sourceID === 'node2' && diagram.connectors[1].targetID === 'node3' &&
                (diagram.nodes[2] as Node).outEdges[0] === 'conn2' && (diagram.nodes[3] as Node).inEdges[0] === 'conn2' &&
                diagram.connectors[2].sourceID === 'node4' && diagram.connectors[2].targetID === 'node5' &&
                (diagram.nodes[4] as Node).outEdges[0] === 'conn3' && (diagram.nodes[5] as Node).inEdges[0] === 'conn3'
            ).toBe(true);
            done();
            diagram.clear();
        });
    });


    describe('Deleting dependent connectors ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {

            ele = createElement('div', { id: 'diagramconnectors' });
            document.body.appendChild(ele);
            let node1: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
            node1.id = 'textelement1';
            node1.width = 100; node1.height = 100;
            node1.offsetX = 300; node1.offsetY = 100;

            let node11: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
            node11.id = 'textelement11';
            node11.width = 100; node11.height = 100;
            node11.offsetX = 300; node11.offsetY = 300;


            let node7: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
            node7.id = 'textelement7';
            node7.width = 100; node7.height = 100;
            node7.offsetX = 100; node7.offsetY = 100;


            let node2: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
            node2.id = 'textelement2';
            node2.width = 100; node2.height = 100;
            node2.offsetX = 500; node2.offsetY = 100;

            let node3: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
            node3.id = 'textelement3';
            node3.width = 100; node3.height = 100;
            node3.offsetX = 500; node3.offsetY = 300;
            let nodeport1: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport1.offset = {
                x: 0, y: 0.5
            }; nodeport1.id = 'port1';
            nodeport1.shape = 'Square'; node3.ports = [nodeport1];

            let node4: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
            node4.id = 'textelement4';
            node4.width = 100; node4.height = 100;
            node4.offsetX = 900; node4.offsetY = 100;
            let nodeport2: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport2.offset = {
                x: 0, y: 0.5
            }; nodeport2.id = 'port2';
            nodeport2.shape = 'Square'; node4.ports = [nodeport2];

            let node5: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
            node5.id = 'textelement5';
            node5.width = 100; node5.height = 100;
            node5.offsetX = 700; node5.offsetY = 100;

            let node6: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
            node6.id = 'textelement4';
            node6.width = 100; node6.height = 100;
            node6.offsetX = 800; node6.offsetY = 300;
            let nodeport3: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport3.offset = {
                x: 0, y: 0.5
            }; nodeport3.id = 'port3';
            nodeport3.shape = 'Square'; node6.ports = [nodeport3];


            let node8: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
            node8.id = 'textelement8';
            node8.width = 100; node8.height = 100;
            node8.offsetX = 700; node8.offsetY = 300;
            let nodeport8: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport8.offset = {
                x: 1, y: 0.5
            }; nodeport8.id = 'port8';
            nodeport8.shape = 'Square'; node8.ports = [nodeport8];


            let node9: NodeModel = { shape: { shape: 'Rectangle' } as BasicShapeModel, style: {} };
            node9.id = 'textelement9';
            node9.width = 100; node9.height = 100;
            node9.offsetX = 900; node9.offsetY = 300;
            let nodeport9: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport9.offset = {
                x: 0, y: 0.5
            }; nodeport9.id = 'port9';
            nodeport9.shape = 'Square'; node9.ports = [nodeport9];


            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1',
                    type: 'Straight',
                    sourceID: node2.id,
                    targetID: node1.id,
                },
                {
                    id: 'connector3',
                    type: 'Straight',
                    sourceID: node3.id,
                    sourcePortID: nodeport1.id,
                    targetID: node1.id,
                },
                {
                    id: 'connector7',
                    type: 'Straight',
                    sourceID: node1.id,
                    targetID: node7.id,
                },

                {
                    id: 'connector5',
                    type: 'Straight',
                    sourceID: node5.id,
                    targetID: node4.id,
                    targetPortID: nodeport2.id
                },

                {
                    id: 'connector6',
                    type: 'Straight',
                    sourceID: node8.id,
                    targetID: node9.id,
                    sourcePortID: nodeport8.id,
                    targetPortID: nodeport9.id
                },

                {
                    id: 'connector77',
                    type: 'Straight',
                    sourceID: node1.id,
                    targetID: node11.id,
                },


            ];
            diagram = new Diagram({
                width: 1500, height: 2000,
                connectors: connectors
                , snapSettings: { constraints: SnapConstraints.ShowLines }, nodes: [node1, node2, node3,
                    node4, node5,
                    node7,
                    node8, node9, node11
                ], commandManager: {
                    commands: [
                        {
                            name: 'undo',
                            gesture: {
                                key: Keys.G,
                                keyModifiers: KeyModifiers.Alt
                            }
                        }

                    ]
                }
            });
            diagram.appendTo('#diagramconnectors');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('deleting the nodes with connector inedges and outedges ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 80);
            let start = diagram.connectors.length;
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            let end = diagram.connectors.length;
            expect(start != end).toBe(true);
            done()
        });

        it('checking undo -redo ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let start = diagram.connectors.length;
            mouseEvents.keyDownEvent(diagramCanvas, 'G', false, false, true);
            let end = diagram.connectors.length;
            expect(start != end).toBe(true);
            done()
        });

        it('deleting the nodes with one outedge ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 500, 80);
            let start = diagram.connectors.length;
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            let end = diagram.connectors.length;
            expect(start != end).toBe(true);
            done()
        });
        it('deleting all the  node ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let start = diagram.connectors.length;
            mouseEvents.keyDownEvent(diagramCanvas, 'A', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            let end = diagram.connectors.length;
            expect(start != end).toBe(true);
            done()
        });

        it('deleting node with one inedge ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.keyDownEvent(diagramCanvas, 'G', false, false, true);
            let start = diagram.connectors.length;
            mouseEvents.clickEvent(diagramCanvas, 270, 300);
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            let end = diagram.connectors.length;
            expect(start != end).toBe(true);
            done()
        });

        it('deleting connector alone ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let start = diagram.connectors.length;
            mouseEvents.clickEvent(diagramCanvas, 800, 100);
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            let end = diagram.connectors.length;
            expect(start != end).toBe(true);
            done()
        });
        it('reset nodes and connectors ', (done: Function) => {
            diagram.nodes = [
                {
                    id: 'node1',
                    offsetX: 100, offsetY: 100,
                    height: 100, width: 100,
                },
                {
                    id: 'node2',
                    offsetX: 300, offsetY: 100,
                    height: 100, width: 100,
                }
            ];
            diagram.connectors = [
                { sourceID: 'node1', targetID: 'node2' }
            ];
            expect(diagram.nodes.length === 2 && diagram.connectors.length === 1).toBe(true);
            diagram.dataBind();
            done()
        });

    });

    describe('Node to Node connection ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramTargetNodeOverlap' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'NewIdea', width: 150, height: 60, offsetX: 450, offsetY: 95,
                shape: { type: 'Flow', shape: 'Terminator' },
                annotations: [{
                    id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
                }],
            },
            {
                id: 'Meeting', width: 150, height: 60, offsetX: 300, offsetY: 155,
                shape: { type: 'Flow', shape: 'Process' },
                annotations: [{
                    id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
                }]
            }, {
                id: 'node3', width: 150, height: 60, offsetX: 795, offsetY: 98,
                shape: { type: 'Flow', shape: 'Terminator' },
                annotations: [{
                    id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
                }],
            },
            {
                id: 'node4', width: 150, height: 60, offsetX: 796, offsetY: 157,
                shape: { type: 'Flow', shape: 'Process' },
                annotations: [{
                    id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
                }]
            },
            {
                id: 'BoardDecision', width: 150, height: 110, offsetX: 300, offsetY: 290,
                shape: { type: 'Flow', shape: 'Decision' },
                annotations: [{
                    id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
                    margin: { left: 25, right: 25 },
                    style: { whiteSpace: 'PreserveAll' }
                }]
            },
            {
                id: 'Reject', width: 150, height: 60, offsetX: 450, offsetY: 300,
                shape: { type: 'Flow', shape: 'Process' },
                annotations: [{
                    id: 'label7', content: 'Reject and write report', offset: { x: 0.5, y: 0.5 },
                }]
            }
            ]
            diagram = new Diagram({
                width: '1500px', height: '1500px', nodes: nodes,
                connectors: [
                    {
                        id: 'connector1', type: 'Orthogonal', sourceID: 'NewIdea', targetID: 'Meeting'
                    },
                    {
                        id: 'connector2', type: 'Orthogonal', sourceID: 'node4', targetID: 'node3'
                    },
                    {
                        id: 'connector3', sourceID: 'BoardDecision', targetID: 'Reject', type: 'Orthogonal'
                    }],
                snapSettings: { constraints: SnapConstraints.None }
            });
            diagram.appendTo('#diagramTargetNodeOverlap');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Top to Bottom connection - third segment(direction - left) overlap to target node', (done: Function) => {
            expect((diagram.connectors[0] as Connector).intermediatePoints.length == 6 &&
                (diagram.connectors[0] as Connector).intermediatePoints[0].x == 525 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 95 &&
                (diagram.connectors[0] as Connector).intermediatePoints[1].x == 545 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 95 &&
                (diagram.connectors[0] as Connector).intermediatePoints[2].x == 545 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 205 &&
                (diagram.connectors[0] as Connector).intermediatePoints[3].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 205 &&
                (diagram.connectors[0] as Connector).intermediatePoints[4].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 155 &&
                (diagram.connectors[0] as Connector).intermediatePoints[5].x == 225 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 155).toBe(true);
            done();
        });
        it('Checking Top to Bottom connection - source node is overlap to target node', (done: Function) => {
            expect((diagram.connectors[1] as Connector).intermediatePoints.length == 6 &&
                (diagram.connectors[1] as Connector).intermediatePoints[0].x == 871 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 157 &&
                (diagram.connectors[1] as Connector).intermediatePoints[1].x == 891 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 157 &&
                (diagram.connectors[1] as Connector).intermediatePoints[2].x == 891 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 48 &&
                (diagram.connectors[1] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 48 &&
                (diagram.connectors[1] as Connector).intermediatePoints[4].x == 700 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 98 &&
                (diagram.connectors[1] as Connector).intermediatePoints[5].x == 720.4 && (diagram.connectors[1] as Connector).intermediatePoints[5].y == 98).toBe(true);
            done();
        });
        it('Checking Top to Bottom connection - third segment(direction-Right) overlap to target node', (done: Function) => {
            expect((diagram.connectors[2] as Connector).intermediatePoints.length == 6 &&
                (diagram.connectors[2] as Connector).intermediatePoints[0].x == 228.87 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 290 &&
                (diagram.connectors[2] as Connector).intermediatePoints[1].x == 208.87 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 290 &&
                (diagram.connectors[2] as Connector).intermediatePoints[2].x == 208.87 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 365 &&
                (diagram.connectors[2] as Connector).intermediatePoints[3].x == 545 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 365 &&
                (diagram.connectors[2] as Connector).intermediatePoints[4].x == 545 && (diagram.connectors[2] as Connector).intermediatePoints[4].y == 300 &&
                (diagram.connectors[2] as Connector).intermediatePoints[5].x == 525 && (diagram.connectors[2] as Connector).intermediatePoints[5].y == 300).toBe(true);
            done();
        });
    });

});