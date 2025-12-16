import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { SnapConstraints } from '../../../src/diagram/enum/enum';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { KeyModifiers, Keys } from '../../../src/diagram/enum/enum';
import { Connector } from '../../../src/diagram/index';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
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

            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
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
            let node8: NodeModel = {
                id: 'node8', offsetX: 250, offsetY: 150, width: 100, height: 100,
                ports: [{ id: 'right1', offset: { x: 1, y: 0.5 } }], style: { opacity: 0.5 }
            };

            let node9: NodeModel = {
                id: 'node9', offsetX: 450, offsetY: 350, width: 100, height: 100,
                ports: [{ id: 'left1', offset: { x: 0, y: 0.5 } }], style: { opacity: 0.5 }
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
            let connector5: ConnectorModel = {
                id:'con5',
                type: 'Orthogonal',
                sourceID: 'node8',
                targetID: 'node9',
                sourcePortID:'right1',targetPortID:'left1',
                connectorSpacing:5
            }

            diagram = new Diagram({
                width: '1500px', height: '1500px', nodes: [node, node1, node2, node3, node4, node5, node6, node7,node8,node9],
                connectors: [connector1, connector2, connector3, connector4,connector5],
                snapSettings: { constraints: SnapConstraints.None }
            });
            diagram.appendTo('#diagram63');
        });

        afterAll((): void => {
            diagram.destroy();
            diagram = null;
            ele.remove();
            ele = null;
        });

        it('checking right to left with connectorSpacing 5',(done: Function)=>{
            diagram.nodes[9].offsetX = 360;
            diagram.dataBind();
            expect((diagram.connectors[4] as Connector).intermediatePoints.length === 6).toBe(true);
            console.log('Right to left port Connection');
            done();
        });
        it('checking right to right with connectorSpacing 5',(done: Function)=>{
            diagram.nodes[9].ports[0].offset = {x:1,y:0.5};
            diagram.nodes[9].offsetX = 450;
            diagram.nodes[9].offsetY = 205;
            diagram.dataBind();
            expect((diagram.connectors[4] as Connector).intermediatePoints.length === 6).toBe(true);
            console.log('Right to right port Connection');
            done();
        });
        it('checking right to top with connectorSpacing 5',(done: Function)=>{
            diagram.nodes[9].ports[0].offset = {x:0.5,y:0};
            diagram.nodes[9].offsetX = 305;
            diagram.nodes[9].offsetY = 350;
            diagram.dataBind();
            expect((diagram.connectors[4] as Connector).intermediatePoints.length === 5).toBe(true);
            console.log('Right to top port Connection');
            done();
        });
        it('checking right to bottom with connectorSpacing 5',(done: Function)=>{
            diagram.nodes[9].ports[0].offset = {x:0.5,y:1};
            diagram.nodes[9].offsetX = 450;
            diagram.nodes[9].offsetY = 96;
            diagram.dataBind();
            expect((diagram.connectors[4] as Connector).intermediatePoints.length === 5).toBe(true);
            console.log('Right to bottom port Connection');
            done();
        });
        it('checking bottom to bottom with connectorSpacing 5',(done: Function)=>{
            diagram.nodes[8].ports[0].offset = {x:0.5,y:1};
            diagram.nodes[9].offsetX = 304;
            diagram.nodes[9].offsetY = 350;
            diagram.dataBind();
            expect((diagram.connectors[4] as Connector).intermediatePoints.length === 6).toBe(true);
            console.log('Bottom to bottom port Connection');
            done();
        });
        it('checking bottom to top with connectorSpacing 5',(done: Function)=>{
            diagram.nodes[9].ports[0].offset = {x:0.5,y:0};
            diagram.nodes[9].offsetX = 450;
            diagram.nodes[9].offsetY = 260;
            diagram.dataBind();
            expect((diagram.connectors[4] as Connector).intermediatePoints.length === 6).toBe(true);
            console.log('Bottom to top port Connection');
            done();
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

    // describe('Deleting dependent connectors', () => {
    //     let diagram: Diagram;
    //     let ele: HTMLElement;
    //     let mouseEvents: MouseEvents = new MouseEvents();
    //     let diagramCanvas: HTMLElement;

    //     // Utility function to wait for diagram render
    //     function waitForDiagramRender(callback: Function): void {
    //         setTimeout(() => callback(), 500);
    //     }

    //     // Utility function to create nodes
    //     function createNodes(): NodeModel[] {
    //         return [
    //             {
    //                 id: 'textelement1',
    //                 shape: { shape: 'Rectangle' } as BasicShapeModel,
    //                 width: 100,
    //                 height: 100,
    //                 offsetX: 300,
    //                 offsetY: 100,
    //                 style: {}
    //             },
    //             {
    //                 id: 'textelement11',
    //                 shape: { shape: 'Rectangle' } as BasicShapeModel,
    //                 width: 100,
    //                 height: 100,
    //                 offsetX: 300,
    //                 offsetY: 300,
    //                 style: {}
    //             },
    //             {
    //                 id: 'textelement7',
    //                 shape: { shape: 'Rectangle' } as BasicShapeModel,
    //                 width: 100,
    //                 height: 100,
    //                 offsetX: 100,
    //                 offsetY: 100,
    //                 style: {}
    //             },
    //             {
    //                 id: 'textelement2',
    //                 shape: { shape: 'Rectangle' } as BasicShapeModel,
    //                 width: 100,
    //                 height: 100,
    //                 offsetX: 500,
    //                 offsetY: 100,
    //                 style: {}
    //             },
    //             {
    //                 id: 'textelement3',
    //                 shape: { shape: 'Rectangle' } as BasicShapeModel,
    //                 width: 100,
    //                 height: 100,
    //                 offsetX: 500,
    //                 offsetY: 300,
    //                 ports: [{
    //                     id: 'port1',
    //                     offset: { x: 0, y: 0.5 },
    //                     shape: 'Square',
    //                     margin: {},
    //                     style: {}
    //                 } as PointPortModel],
    //                 style: {}
    //             },
    //             {
    //                 id: 'textelement4',
    //                 shape: { shape: 'Rectangle' } as BasicShapeModel,
    //                 width: 100,
    //                 height: 100,
    //                 offsetX: 900,
    //                 offsetY: 100,
    //                 ports: [{
    //                     id: 'port2',
    //                     offset: { x: 0, y: 0.5 },
    //                     shape: 'Square',
    //                     margin: {},
    //                     style: {}
    //                 } as PointPortModel],
    //                 style: {}
    //             },
    //             {
    //                 id: 'textelement5',
    //                 shape: { shape: 'Rectangle' } as BasicShapeModel,
    //                 width: 100,
    //                 height: 100,
    //                 offsetX: 700,
    //                 offsetY: 100,
    //                 style: {}
    //             },
    //             {
    //                 id: 'textelement6',
    //                 shape: { shape: 'Rectangle' } as BasicShapeModel,
    //                 width: 100,
    //                 height: 100,
    //                 offsetX: 800,
    //                 offsetY: 300,
    //                 ports: [{
    //                     id: 'port3',
    //                     offset: { x: 0, y: 0.5 },
    //                     shape: 'Square',
    //                     margin: {},
    //                     style: {}
    //                 } as PointPortModel],
    //                 style: {}
    //             },
    //             {
    //                 id: 'textelement8',
    //                 shape: { shape: 'Rectangle' } as BasicShapeModel,
    //                 width: 100,
    //                 height: 100,
    //                 offsetX: 700,
    //                 offsetY: 300,
    //                 ports: [{
    //                     id: 'port8',
    //                     offset: { x: 1, y: 0.5 },
    //                     shape: 'Square',
    //                     margin: {},
    //                     style: {}
    //                 } as PointPortModel],
    //                 style: {}
    //             },
    //             {
    //                 id: 'textelement9',
    //                 shape: { shape: 'Rectangle' } as BasicShapeModel,
    //                 width: 100,
    //                 height: 100,
    //                 offsetX: 900,
    //                 offsetY: 300,
    //                 ports: [{
    //                     id: 'port9',
    //                     offset: { x: 0, y: 0.5 },
    //                     shape: 'Square',
    //                     margin: {},
    //                     style: {}
    //                 } as PointPortModel],
    //                 style: {}
    //             }
    //         ];
    //     }

    //     // Utility function to create connectors
    //     function createConnectors(): ConnectorModel[] {
    //         return [
    //             {
    //                 id: 'connector1',
    //                 type: 'Straight',
    //                 sourceID: 'textelement2',
    //                 targetID: 'textelement1'
    //             },
    //             {
    //                 id: 'connector3',
    //                 type: 'Straight',
    //                 sourceID: 'textelement3',
    //                 sourcePortID: 'port1',
    //                 targetID: 'textelement1'
    //             },
    //             {
    //                 id: 'connector7',
    //                 type: 'Straight',
    //                 sourceID: 'textelement1',
    //                 targetID: 'textelement7'
    //             },
    //             {
    //                 id: 'connector5',
    //                 type: 'Straight',
    //                 sourceID: 'textelement5',
    //                 targetID: 'textelement4',
    //                 targetPortID: 'port2'
    //             },
    //             {
    //                 id: 'connector6',
    //                 type: 'Straight',
    //                 sourceID: 'textelement8',
    //                 targetID: 'textelement9',
    //                 sourcePortID: 'port8',
    //                 targetPortID: 'port9'
    //             },
    //             {
    //                 id: 'connector77',
    //                 type: 'Straight',
    //                 sourceID: 'textelement1',
    //                 targetID: 'textelement11'
    //             }
    //         ];
    //     }

    //     beforeAll((): void => {
    //         const isDef = (o: any) => o !== undefined && o !== null;
    //         if (!isDef(window.performance)) {
    //             console.log("Unsupported environment, window.performance.memory is unavailable");
    //             this.skip();
    //             return;
    //         }

    //         try {
    //             ele = createElement('div', { id: 'diagramconnectors' });
    //             document.body.appendChild(ele);

    //             diagram = new Diagram({
    //                 width: 1500,
    //                 height: 2000,
    //                 nodes: createNodes(),
    //                 connectors: createConnectors(),
    //                 snapSettings: { constraints: SnapConstraints.ShowLines },
    //                 commandManager: {
    //                     commands: [{
    //                         name: 'undo',
    //                         gesture: {
    //                             key: Keys.G,
    //                             keyModifiers: KeyModifiers.Alt
    //                         }
    //                     }]
    //                 }
    //             });

    //             diagram.appendTo('#diagramconnectors');
    //             diagramCanvas = document.getElementById(diagram.element.id + 'content') as HTMLElement;
    //         } catch (error) {
    //             console.error('Error in beforeAll:', error);
    //         }
    //     });

    //     afterAll((): void => {
    //         try {
    //             if (diagram) {
    //                 diagram.destroy();
    //                 diagram = null as any;
    //             }
    //             if (ele) {
    //                 ele.remove();
    //                 ele = null as any;
    //             }
    //             diagramCanvas = null as any;
    //         } catch (error) {
    //             console.error('Error in afterAll:', error);
    //         }
    //     });

    //     afterEach((done: DoneFn): void => {
    //         try {
    //             if (diagram) {
    //                 diagram.nodes = createNodes();
    //                 diagram.connectors = createConnectors();
    //                 diagram.dataBind();
    //                 waitForDiagramRender(() => done());
    //             } else {
    //                 done();
    //             }
    //         } catch (error) {
    //             console.error('Error in afterEach:', error);
    //             done();
    //         }
    //     });

    //     // TEST CASE 1: Deleting the nodes with connector inedges and outedges
    //     it('deleting the nodes with connector inedges and outedges', (done: DoneFn) => {
    //         try {
    //             expect(diagram).toBeDefined();
    //             expect(diagramCanvas).toBeDefined();
    //             expect(diagram.connectors.length).toBeGreaterThan(0);
    //             expect(diagram.nodes.length).toBeGreaterThan(0);

    //             const start: number = diagram.connectors.length;
    //             console.log('Initial connector count:', start);

    //             mouseEvents.clickEvent(diagramCanvas, 300, 100);

    //             waitForDiagramRender(() => {
    //                 const selectedNode: NodeModel = diagram.selectedItems.nodes[0];
    //                 expect(selectedNode).toBeDefined();
    //                 expect(selectedNode.id).toBe('textelement1');

    //                 mouseEvents.keyDownEvent(diagramCanvas, 'Delete');

    //                 waitForDiagramRender(() => {
    //                     const end: number = diagram.connectors.length;
    //                     console.log('Final connector count after delete:', end);

    //                     expect(start !== end).toBe(true);
    //                     expect(end).toBeLessThan(start);
    //                     done();
    //                 });
    //             });
    //         } catch (error) {
    //             console.error('Test 1 error:', error);
    //             done.fail(error);
    //         }
    //     });

    //     // TEST CASE 2: Checking undo-redo
    //     it('checking undo -redo', (done: Function) => {
    //         try {
    //             expect(diagram).toBeDefined();
    //             expect(diagramCanvas).toBeDefined();

    //             const start: number = diagram.connectors.length;
    //             console.log('Initial connector count:', start);

    //             // Select a node and delete it
    //             mouseEvents.clickEvent(diagramCanvas, 300, 100);

    //             waitForDiagramRender(() => {
    //                 mouseEvents.keyDownEvent(diagramCanvas, 'Delete');

    //                 waitForDiagramRender(() => {
    //                     const afterDelete: number = diagram.connectors.length;
    //                     console.log('After delete:', afterDelete);
    //                     expect(afterDelete).toBeLessThan(start); // connectors reduced

    //                     // Perform Undo (prefer Ctrl+Z unless you've remapped to Alt+G)
    //                     // If your test suite intentionally uses Alt+G, keep it; otherwise use Ctrl+Z:
    //                     // mouseEvents.keyDownEvent(diagramCanvas, 'Z', true /*ctrl*/, false /*shift*/, false /*alt*/);
    //                     mouseEvents.keyDownEvent(diagramCanvas, 'G', false, false, true); // Alt+G

    //                     waitForDiagramRender(() => {
    //                         const end: number = diagram.connectors.length;
    //                         console.log('After undo:', end);

    //                         // After undo, counts should match the initial value
    //                         expect(end).toBe(start);
    //                         done();
    //                     });
    //                 });
    //             });
    //         } catch (error) {
    //             console.error('Test undo-redo error:', error);
    //             expect(false).toBe(true);
    //             done();
    //         }
    //     });

    //     // TEST CASE 3: Deleting the nodes with one outedge
    //     it('deleting the nodes with one outedge', (done: DoneFn) => {
    //         try {
    //             expect(diagram).toBeDefined();
    //             expect(diagramCanvas).toBeDefined();

    //             const start: number = diagram.connectors.length;
    //             console.log('Initial connector count:', start);

    //             mouseEvents.clickEvent(diagramCanvas, 500, 100);

    //             waitForDiagramRender(() => {
    //                 const selectedNode: NodeModel = diagram.selectedItems.nodes[0];
    //                 expect(selectedNode).toBeDefined();
    //                 expect(selectedNode.id).toBe('textelement2');

    //                 mouseEvents.keyDownEvent(diagramCanvas, 'Delete');

    //                 waitForDiagramRender(() => {
    //                     const end: number = diagram.connectors.length;
    //                     console.log('Final connector count after delete:', end);

    //                     expect(start !== end).toBe(true);
    //                     expect(end).toBeLessThan(start);
    //                     done();
    //                 });
    //             });
    //         } catch (error) {
    //             console.error('Test 3 error:', error);
    //             done.fail(error);
    //         }
    //     });

    //     // TEST CASE 4: Deleting all the nodes
    //     it('deleting all the node', (done: DoneFn) => {
    //         try {
    //             expect(diagram).toBeDefined();
    //             expect(diagramCanvas).toBeDefined();

    //             const start: number = diagram.connectors.length;
    //             const initialNodeCount: number = diagram.nodes.length;
    //             console.log('Initial state - Nodes:', initialNodeCount, 'Connectors:', start);

    //             mouseEvents.keyDownEvent(diagramCanvas, 'A', true);

    //             waitForDiagramRender(() => {
    //                 const selectedNodesCount: number = diagram.selectedItems.nodes.length;
    //                 expect(selectedNodesCount).toBe(initialNodeCount);
    //                 console.log('Selected nodes:', selectedNodesCount);

    //                 mouseEvents.keyDownEvent(diagramCanvas, 'Delete');

    //                 waitForDiagramRender(() => {
    //                     const end: number = diagram.connectors.length;
    //                     const finalNodeCount: number = diagram.nodes.length;
    //                     console.log('Final state - Nodes:', finalNodeCount, 'Connectors:', end);

    //                     expect(start !== end).toBe(true);
    //                     expect(finalNodeCount).toBe(0);
    //                     expect(end).toBe(0);
    //                     done();
    //                 });
    //             });
    //         } catch (error) {
    //             console.error('Test 4 error:', error);
    //             done.fail(error);
    //         }
    //     });

    //     // TEST CASE 5: Deleting node with one inedge
    //     it('deleting node with one inedge', (done: DoneFn) => {
    //         try {
    //             expect(diagram).toBeDefined();
    //             expect(diagramCanvas).toBeDefined();

    //             const start: number = diagram.connectors.length;
    //             console.log('Initial connector count:', start);

    //             mouseEvents.keyDownEvent(diagramCanvas, 'G', false, false, true);

    //             waitForDiagramRender(() => {
    //                 mouseEvents.clickEvent(diagramCanvas, 300, 300);

    //                 waitForDiagramRender(() => {
    //                     const selectedNode: NodeModel = diagram.selectedItems.nodes[0];
    //                     expect(selectedNode).toBeDefined();
    //                     expect(selectedNode.id).toBe('textelement11');

    //                     mouseEvents.keyDownEvent(diagramCanvas, 'Delete');

    //                     waitForDiagramRender(() => {
    //                         const end: number = diagram.connectors.length;
    //                         console.log('Final connector count after delete:', end);

    //                         expect(start !== end).toBe(true);
    //                         expect(end).toBeLessThan(start);
    //                         done();
    //                     });
    //                 });
    //             });
    //         } catch (error) {
    //             console.error('Test 5 error:', error);
    //             done.fail(error);
    //         }
    //     });

    //     // TEST CASE 6: Deleting connector alone
    //     it('deleting connector alone', (done: DoneFn) => {
    //         try {
    //             expect(diagram).toBeDefined();
    //             expect(diagramCanvas).toBeDefined();

    //             const start: number = diagram.connectors.length;
    //             console.log('Initial connector count:', start);

    //             mouseEvents.clickEvent(diagramCanvas, 400, 100);

    //             waitForDiagramRender(() => {
    //                 const selectedConnectors: ConnectorModel[] = diagram.selectedItems.connectors;
    //                 expect(selectedConnectors).toBeDefined();
    //                 expect(selectedConnectors.length).toBeGreaterThan(0);
    //                 console.log('Selected connectors:', selectedConnectors.length);

    //                 mouseEvents.keyDownEvent(diagramCanvas, 'Delete');

    //                 waitForDiagramRender(() => {
    //                     const end: number = diagram.connectors.length;
    //                     console.log('Final connector count after delete:', end);

    //                     expect(start !== end).toBe(true);
    //                     expect(end).toBe(start - 1);
    //                     done();
    //                 });
    //             });
    //         } catch (error) {
    //             console.error('Test 6 error:', error);
    //             done.fail(error);
    //         }
    //     });

    //     // TEST CASE 7: Reset nodes and connectors
    //     it('reset nodes and connectors', (done: DoneFn) => {
    //         try {
    //             expect(diagram).toBeDefined();

    //             diagram.nodes = [
    //                 {
    //                     id: 'node1',
    //                     offsetX: 100,
    //                     offsetY: 100,
    //                     height: 100,
    //                     width: 100
    //                 },
    //                 {
    //                     id: 'node2',
    //                     offsetX: 300,
    //                     offsetY: 100,
    //                     height: 100,
    //                     width: 100
    //                 }
    //             ] as NodeModel[];

    //             diagram.connectors = [
    //                 {
    //                     id: 'connector1',
    //                     sourceID: 'node1',
    //                     targetID: 'node2'
    //                 }
    //             ] as ConnectorModel[];

    //             diagram.dataBind();

    //             waitForDiagramRender(() => {
    //                 console.log('After reset - Nodes:', diagram.nodes.length, 'Connectors:', diagram.connectors.length);

    //                 expect(diagram.nodes.length).toBe(2);
    //                 expect(diagram.connectors.length).toBe(1);

    //                 expect(diagram.nodes[0].id).toBe('node1');
    //                 expect(diagram.nodes[1].id).toBe('node2');

    //                 expect(diagram.connectors[0].sourceID).toBe('node1');
    //                 expect(diagram.connectors[0].targetID).toBe('node2');

    //                 expect((diagram.nodes.length === 2 && diagram.connectors.length === 1)).toBe(true);
    //                 done();
    //             });
    //         } catch (error) {
    //             console.error('Test 7 error:', error);
    //             done.fail(error);
    //         }
    //     });
    // });

    // describe('Node to Node connection ', () => {
    //     let diagram: Diagram;
    //     let ele: HTMLElement;
    //     beforeAll((): void => {
    //         const isDef = (o: any) => o !== undefined && o !== null;
    //             if (!isDef(window.performance)) {
    //                 console.log("Unsupported environment, window.performance.memory is unavailable");
    //                 this.skip(); //Skips test (in Chai)
    //                 return;
    //             }
    //         ele = createElement('div', { id: 'diagramTargetNodeOverlap' });
    //         document.body.appendChild(ele);
    //         let nodes: NodeModel[] = [{
    //             id: 'NewIdea', width: 150, height: 60, offsetX: 450, offsetY: 95,
    //             shape: { type: 'Flow', shape: 'Terminator' },
    //             annotations: [{
    //                 id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
    //             }],
    //         },
    //         {
    //             id: 'Meeting', width: 150, height: 60, offsetX: 300, offsetY: 155,
    //             shape: { type: 'Flow', shape: 'Process' },
    //             annotations: [{
    //                 id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
    //             }]
    //         }, {
    //             id: 'node3', width: 150, height: 60, offsetX: 795, offsetY: 98,
    //             shape: { type: 'Flow', shape: 'Terminator' },
    //             annotations: [{
    //                 id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
    //             }],
    //         },
    //         {
    //             id: 'node4', width: 150, height: 60, offsetX: 796, offsetY: 157,
    //             shape: { type: 'Flow', shape: 'Process' },
    //             annotations: [{
    //                 id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
    //             }]
    //         },
    //         {
    //             id: 'BoardDecision', width: 150, height: 110, offsetX: 300, offsetY: 290,
    //             shape: { type: 'Flow', shape: 'Decision' },
    //             annotations: [{
    //                 id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
    //                 margin: { left: 25, right: 25 },
    //                 style: { whiteSpace: 'PreserveAll' }
    //             }]
    //         },
    //         {
    //             id: 'Reject', width: 150, height: 60, offsetX: 450, offsetY: 300,
    //             shape: { type: 'Flow', shape: 'Process' },
    //             annotations: [{
    //                 id: 'label7', content: 'Reject and write report', offset: { x: 0.5, y: 0.5 },
    //             }]
    //         },
    //         {
    //             id: 'node001', width: 100, height: 100, offsetX: 250, offsetY: 250,
    //         },
    //         {
    //             id: 'node002', width: 100, height: 100, offsetX: 450, offsetY: 450,
    //         }
    //         ]
    //         diagram = new Diagram({
    //             width: '1500px', height: '1500px', nodes: nodes,
    //             connectors: [
    //                 {
    //                     id: 'connector1', type: 'Orthogonal', sourceID: 'NewIdea', targetID: 'Meeting'
    //                 },
    //                 {
    //                     id: 'connector2', type: 'Orthogonal', sourceID: 'node4', targetID: 'node3'
    //                 },
    //                 {
    //                     id: 'connector3', sourceID: 'BoardDecision', targetID: 'Reject', type: 'Orthogonal'
    //                 },
    //                 {
    //                     id: 'connector4', type: 'Orthogonal', sourceID: 'node001', targetID: 'node002',connectorSpacing: 5
    //                 },],
    //             snapSettings: { constraints: SnapConstraints.None }
    //         });
    //         diagram.appendTo('#diagramTargetNodeOverlap');
    //     });

    //     afterAll((): void => {
    //         diagram.destroy();
    //         diagram = null;
    //         ele.remove();
    //         ele = null;
    //     });

    //     it('Checking top to bottom connection with connectorSpacing 5',(done: Function)=>{
    //        diagram.nodes[7].offsetX = 250;
    //        diagram.nodes[7].offsetY = 355;
    //        diagram.dataBind();
    //        expect((diagram.connectors[3] as Connector).intermediatePoints.length === 6).toBe(true);
    //        console.log('Top to bottom node connection');
    //        done();
    //     });
    //     it('Checking bottom to top connection with connectorSpacing 5',(done: Function)=>{
    //         diagram.nodes[7].offsetY = 145;
    //         diagram.dataBind();
    //         expect((diagram.connectors[3] as Connector).intermediatePoints.length === 6).toBe(true);
    //        console.log('Bottom to top node connection');
    //         done();
    //      });
    //      it('Checking right to left connection with connectorSpacing 5',(done: Function)=>{
    //         diagram.nodes[7].offsetX = 145;
    //         diagram.nodes[7].offsetY = 300;
    //         diagram.dataBind();
    //         expect((diagram.connectors[3] as Connector).intermediatePoints.length === 6).toBe(true);
    //        console.log('Right to left node connection');
    //         done();
    //      });
    //      it('Checking left to right connection with connectorSpacing 5',(done: Function)=>{
    //         diagram.nodes[7].offsetX = 305;
    //         diagram.dataBind();
    //         expect((diagram.connectors[3] as Connector).intermediatePoints.length === 6).toBe(true);
    //        console.log('Left to right node connection');
    //         done();
    //      });

    //     it('Checking Top to Bottom connection - third segment(direction - left) overlap to target node', (done: Function) => {
    //         expect((diagram.connectors[0] as Connector).intermediatePoints.length == 6 &&
    //             (diagram.connectors[0] as Connector).intermediatePoints[0].x == 525 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 95 &&
    //             (diagram.connectors[0] as Connector).intermediatePoints[1].x == 545 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 95 &&
    //             (diagram.connectors[0] as Connector).intermediatePoints[2].x == 545 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 205 &&
    //             (diagram.connectors[0] as Connector).intermediatePoints[3].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 205 &&
    //             (diagram.connectors[0] as Connector).intermediatePoints[4].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 155 &&
    //             (diagram.connectors[0] as Connector).intermediatePoints[5].x == 225 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 155).toBe(true);
    //         done();
    //     });
    //     it('Checking Top to Bottom connection - source node is overlap to target node', (done: Function) => {
    //         expect((diagram.connectors[1] as Connector).intermediatePoints.length == 6 &&
    //             (diagram.connectors[1] as Connector).intermediatePoints[0].x == 871 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 157 &&
    //             (diagram.connectors[1] as Connector).intermediatePoints[1].x == 891 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 157 &&
    //             (diagram.connectors[1] as Connector).intermediatePoints[2].x == 891 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 48 &&
    //             (diagram.connectors[1] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 48 &&
    //             (diagram.connectors[1] as Connector).intermediatePoints[4].x == 700 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 98 &&
    //             (diagram.connectors[1] as Connector).intermediatePoints[5].x == 720.4 && (diagram.connectors[1] as Connector).intermediatePoints[5].y == 98).toBe(true);
    //         done();
    //     });
    //     it('Checking Top to Bottom connection - third segment(direction-Right) overlap to target node', (done: Function) => {
    //         expect((diagram.connectors[2] as Connector).intermediatePoints.length == 6 &&
    //             (diagram.connectors[2] as Connector).intermediatePoints[0].x == 228.87 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 290 &&
    //             (diagram.connectors[2] as Connector).intermediatePoints[1].x == 208.87 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 290 &&
    //             (diagram.connectors[2] as Connector).intermediatePoints[2].x == 208.87 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 365 &&
    //             (diagram.connectors[2] as Connector).intermediatePoints[3].x == 545 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 365 &&
    //             (diagram.connectors[2] as Connector).intermediatePoints[4].x == 545 && (diagram.connectors[2] as Connector).intermediatePoints[4].y == 300 &&
    //             (diagram.connectors[2] as Connector).intermediatePoints[5].x == 525 && (diagram.connectors[2] as Connector).intermediatePoints[5].y == 300).toBe(true);
    //         done();
    //     });
    //     it('memory leak', () => { 
    //         profile.sample();
    //         let average: any = inMB(profile.averageChange)
    //         //Check average change in memory samples to not be over 10MB
    //         expect(average).toBeLessThan(10);
    //         let memory: any = inMB(getMemoryProfile())
    //         //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    //         expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    //     })
    // });
});