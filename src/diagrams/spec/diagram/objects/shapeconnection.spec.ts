import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, TextModel, FlowShapeModel, BasicShapeModel, PathModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Segments } from '../../../src/diagram/enum/enum';
import { PointPortModel } from '../../../src/diagram/objects/port-model';

/**
 * Connections with shape boundaries
 */
describe('Diagram Control', () => {

    describe('Connect Flow shapes with connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram1' });
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
            node4.shape = { type: 'Path' };
            (node4.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
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
            diagram.appendTo('#diagram1');
            diagram.connectors[0].sourceID = node3.id;
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connections with flow shape', (done: Function) => {
            let failure: boolean = false;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(Math.round(connector.sourcePoint.x) === 100 && Math.round(connector.sourcePoint.y) === 200 &&
                Math.round(connector.targetPoint.x) === 200 && Math.round(connector.targetPoint.y) === 300).toBe(true);
            done();
        });
    });

    describe('Connect complex flow shape with connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: { type: 'Flow', shape: 'Document' } as FlowShapeModel
            };
            let node2: NodeModel = {
                id: 'Meeting', width: 100, height: 100, offsetX: 200, offsetY: 400,
                shape: { type: 'Flow', shape: 'Document' } as FlowShapeModel,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: { type: 'Flow', shape: 'Collate' } as FlowShapeModel
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100,
                shape: { type: 'Flow', shape: 'Collate' } as FlowShapeModel
            };
            let connector1: ConnectorModel = {};
            connector1.id = 'connector1';
            connector1.type = 'Straight';
            connector1.sourceID = node1.id;
            connector1.targetID = node2.id;
            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Straight';
            connector2.sourceID = node3.id;
            connector2.targetID = node4.id;

            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node1, node2, node3, node4],
                connectors: [connector1, connector2]
            });
            diagram.appendTo('#diagram2');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connections with complex shapes', (done: Function) => {
            let failure: boolean = false;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourcePoint.x === 116.26 && connector.sourcePoint.y === 232.52 &&
                connector.targetPoint.x === 175 && connector.targetPoint.y === 350).toBe(true);
            done();
        });
    });

    describe('Connect the shapes with rotation angle', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: { type: 'Flow', shape: 'Or' } as FlowShapeModel
            };
            let node2: NodeModel = {
                id: 'Meeting', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: { type: 'Flow', shape: 'SequentialData' } as FlowShapeModel,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200, rotateAngle: 45,
                shape: { type: 'Text', content: 'gedy' } as TextModel
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 300,
                shape: { type: 'Text', content: 'urfhrufhruihfuirh' } as TextModel
            };
            let connector1: ConnectorModel = {};
            connector1.id = 'connector1';
            connector1.type = 'Straight';
            connector1.sourceID = node1.id;
            connector1.targetID = node2.id;
            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Straight';
            connector2.sourceID = node3.id;
            connector2.targetID = node4.id;
            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node1, node2, node3, node4],
                connectors: [connector1, connector2]
            });
            diagram.appendTo('#diagram3');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connections with rotated shapes', (done: Function) => {
            let failure: boolean = false;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourcePoint.x === 144.71 && connector.sourcePoint.y === 222.35 &&
                connector.targetPoint.x === 255.17 && connector.targetPoint.y === 277.58).toBe(true);
            done();
        });
    });

    describe('Connect the complex path data shapes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: {
                    type: 'Path',
                    data: 'M0,0L33.333333333333336,0L40,20L33.333333333333336,40L0,40L6.666666666666667,20z'
                } as PathModel
            };
            let node2: NodeModel = {
                id: 'Meeting', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: {
                    type: 'Path',
                    data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z'
                } as PathModel,
            };

            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: {
                    type: 'Path',
                    data: 'M0,25L10,40L10,30L30,30L30,10L40,10L25,0L10,10L20,10L20,20L10,20L10,10z'
                } as PathModel
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 200,
                shape: {
                    type: 'Path',
                    data: 'M0,30L20,24L10,40L40,20L10,0L20,16L0,10L10,20z'
                } as PathModel
            };
            let connector1: ConnectorModel = {};
            connector1.id = 'connector1';
            connector1.type = 'Straight';
            connector1.sourceID = node1.id;
            connector1.targetID = node2.id;
            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Straight';
            connector2.sourceID = node3.id;
            connector2.targetID = node4.id;
            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node1, node2, node3, node4],
                connectors: [connector1, connector2]
            });
            diagram.appendTo('#diagram4');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connections with complex path', (done: Function) => {
            let failure: boolean = false;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(Math.round(connector.sourcePoint.x) === 143 && Math.round(connector.sourcePoint.y) === 221 &&
                Math.round(connector.targetPoint.x) === 276 && Math.round(connector.targetPoint.y) === 288).toBe(true);
            done();
        });
    });

    describe('connect the path data shapes with straight connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: {
                    type: 'Path',
                    data: 'M35.2441,25 L22.7161,49.9937 L22.7161,0.00657536 L35.2441,25 z M22.7167,25 L-0.00131226,25 M35.2441,49.6337 L35.2441,0.368951 M35.2441,25 L49.9981,25'
                } as PathModel
            };

            let node2: NodeModel = {
                id: 'Meeting', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: {
                    type: 'Path',
                    data: 'M 50 0 L 60.72 38.15 L 100 38.2 L 67.35 59.59 L 80.9 100 L 50 72.84 L 19.1 100 L 32.65 59.59 L 0 38.2 L 39.28 38.15 L 50 0 z'
                } as PathModel,
            };

            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: {
                    type: 'Path',
                    data: 'M433.4624,503.8848C429.4244,493.2388,419.1354,485.6678,407.0734,485.6678C391.4884,485.6678,378.8544,498.3018,378.8544,513.8868L384.4984,513.8868C384.4984,501.4178,394.6054,491.3108,407.0734,491.3108C415.9494,491.3108,423.6264,496.4338,427.3144,503.8848L422.9114,503.8848L426.8974,508.8848L430.8824,513.8868L434.8684,508.8848L438.8544,503.8848L433.4624,503.8848z',
                } as PathModel
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 200,
                shape: {
                    type: 'Path',
                    data: 'M35.2441,25 L22.7161,49.9937 L22.7161,0.00657536 L35.2441,25 z M22.7167,25 L-0.00131226,25 M35.2441,49.6337 L35.2441,0.368951 M35.2441,25 L49.9981,25'
                } as PathModel
            };
            let connector1: ConnectorModel = {};
            connector1.id = 'connector1';
            connector1.type = 'Straight';
            connector1.sourceID = node1.id;
            connector1.targetID = node2.id;
            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Straight';
            connector2.sourceID = node3.id;
            connector2.targetID = node4.id;
            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node1, node2, node3, node4],
                connectors: [connector1, connector2]
            });
            diagram.appendTo('#diagram5');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking straight connection with path shape', (done: Function) => {
            let failure: boolean = false;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(Math.round(connector.sourcePoint.x) === 120 && Math.round(connector.sourcePoint.y) === 210 &&
                Math.round(connector.targetPoint.x) === 276 && Math.round(connector.targetPoint.y) === 288).toBe(true);
            done();
        });
    });
    describe('Connect the flow shape with orthogonal connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel
            };
            let node2: NodeModel = {
                id: 'Meeting', width: 100, height: 100, offsetX: 200, offsetY: 300,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel,
            };
            let node4: NodeModel = { style: {}, shape: {} }; node4.id = 'node4';
            node4.width = 100; node4.height = 100; node4.offsetX = 700; node4.offsetY = 50;
            node4.shape = { type: 'Path' };
            (node4.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
            let nodeport4: PointPortModel = {}; nodeport4.shape = 'Square'; nodeport4.offset = { x: 1, y: 0.5 };
            nodeport4.id = 'port4'; node4.ports = [nodeport4];

            let connector1: ConnectorModel = {};
            connector1.id = 'connector1';
            connector1.type = 'Orthogonal';
            connector1.sourceID = node1.id;
            connector1.targetID = node2.id;

            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Orthogonal';
            connector2.sourceID = node3.id;
            connector2.targetID = node4.id;
            connector2.targetPortID = nodeport4.id;

            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node1, node2, node3, node4],
                connectors: [connector1, connector2]
            });
            diagram.appendTo('#diagram6');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking orthogonal connection with flow shapes', (done: Function) => {
            let failure: boolean = false;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourcePoint.x === 51.72 && connector.sourcePoint.y === 200 &&
                connector.targetPoint.x === 250 && connector.targetPoint.y === 300).toBe(true);
            done();
        });
    });

    describe('Connect the complex flow shapes with orthogonal connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram7' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Flow', shape: 'Document' } as FlowShapeModel
            };
            let node2: NodeModel = {
                id: 'Meeting', width: 100, height: 100, offsetX: 100, offsetY: 400,
                shape: { type: 'Flow', shape: 'Document' } as FlowShapeModel,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: { type: 'Flow', shape: 'Or' } as FlowShapeModel
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 600, offsetY: 400,
                shape: { type: 'Flow', shape: 'SequentialData' } as FlowShapeModel
            };
            let connector1: ConnectorModel = {};
            connector1.id = 'connector1';
            connector1.type = 'Orthogonal';
            connector1.sourceID = node1.id;
            connector1.targetID = node2.id;
            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Orthogonal';
            connector2.sourceID = node3.id;
            connector2.targetID = node4.id;

            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node1, node2, node3, node4],
                connectors: [connector1, connector2]
            });
            diagram.appendTo('#diagram7');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking orthogonal connection with complex flow shapes', (done: Function) => {
            let failure: boolean = false;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourcePoint.x === 300 && connector.sourcePoint.y === 240.3 &&
                connector.targetPoint.x === 100 && connector.targetPoint.y === 350).toBe(true);
            done();
        });
    });

    describe('Connect the basic shapes with orthogonal connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram8' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' } as BasicShapeModel
            };
            let node2: NodeModel = {
                id: 'Meeting', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: { type: 'Basic', shape: 'Rectangle' } as BasicShapeModel,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 600, offsetY: 300,
                shape: { type: 'Basic', shape: 'Triangle' } as BasicShapeModel
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 100,
                shape: {
                    type: 'Basic', shape: 'Triangle'
                } as BasicShapeModel
            };
            let connector1: ConnectorModel = {};
            connector1.id = 'connector1';
            connector1.type = 'Orthogonal';
            connector1.sourceID = node1.id;
            connector1.targetID = node2.id;
            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Orthogonal';
            connector2.sourceID = node3.id;
            connector2.targetID = node4.id;
            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node1, node2, node3, node4],
                connectors: [connector1, connector2]
            });
            diagram.appendTo('#diagram8');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking orthogonal segment with basic shapes', (done: Function) => {
            let failure: boolean = false;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourcePoint.x === 150 && connector.sourcePoint.y === 200 &&
                connector.targetPoint.x === 250 && connector.targetPoint.y === 300).toBe(true);
            done();
        });
    });

    describe('Connect the node to right direction port ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram9' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel
            };
            let node2: NodeModel = {
                id: 'Meeting', width: 100, height: 100, offsetX: 200, offsetY: 300,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 300,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel,
            };
            let node4: NodeModel = { style: {}, shape: {} }; node4.id = 'node4';
            node4.width = 100; node4.height = 100; node4.offsetX = 700; node4.offsetY = 300;
            node4.shape = { type: 'Path' };
            (node4.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
            let nodeport4: PointPortModel = {}; nodeport4.shape = 'Square'; nodeport4.offset = { x: 0, y: 0.5 };
            nodeport4.id = 'port4'; node4.ports = [nodeport4];

            let connector1: ConnectorModel = {};
            connector1.id = 'connector1';
            connector1.type = 'Orthogonal';
            connector1.sourceID = node1.id;
            connector1.targetID = node2.id;

            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Orthogonal';
            connector2.sourceID = node3.id;
            connector2.targetID = node4.id;
            connector2.targetPortID = nodeport4.id;

            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node1, node2, node3, node4],
                connectors: [connector1, connector2]
            });
            diagram.appendTo('#diagram9');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connections with node and right port', (done: Function) => {
            let failure: boolean = false;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourcePoint.x === 51.72 && connector.sourcePoint.y === 200 &&
                connector.targetPoint.x === 250 && connector.targetPoint.y === 300).toBe(true);
            done();
        });
    });

    describe('Connect the node with bottom direction port', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram10' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel
            };
            let node2: NodeModel = { style: {}, shape: {} }; node2.id = 'node2';
            node2.width = 100; node2.height = 100; node2.offsetX = 300; node2.offsetY = 300;
            node2.shape = { type: 'Path' };
            (node2.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
            let nodeport2: PointPortModel = {}; nodeport2.shape = 'Square'; nodeport2.offset = { x: 0.5, y: 1 };
            nodeport2.id = 'port2'; node2.ports = [nodeport2];

            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel,
            };
            let node4: NodeModel = { style: {}, shape: {} }; node4.id = 'node4';
            node4.width = 100; node4.height = 100; node4.offsetX = 700; node4.offsetY = 400;
            node4.shape = { type: 'Path' };
            (node4.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
            let nodeport4: PointPortModel = {}; nodeport4.shape = 'Square'; nodeport4.offset = { x: 0.5, y: 0 };
            nodeport4.id = 'port4'; node4.ports = [nodeport4];

            let connector1: ConnectorModel = {};
            connector1.id = 'connector1';
            connector1.type = 'Orthogonal';
            connector1.sourceID = node1.id;
            connector1.targetID = node2.id;
            connector1.targetPortID = nodeport2.id;

            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Orthogonal';
            connector2.sourceID = node3.id;
            connector2.targetID = node4.id;
            connector2.targetPortID = nodeport4.id;

            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node1, node2, node3, node4],
                connectors: [connector1, connector2]
            });
            diagram.appendTo('#diagram10');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connections with node and bottom port', (done: Function) => {
            let failure: boolean = false;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourcePoint.x === 150 && connector.sourcePoint.y === 200 &&
                connector.targetPoint.x === 300 && connector.targetPoint.y === 350).toBe(true);
            done();
        });
    });

    describe('Connect the node with right direction port ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram11' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel
            };
            let node2: NodeModel = { style: {}, shape: {} }; node2.id = 'node2';
            node2.width = 100; node2.height = 100; node2.offsetX = 300; node2.offsetY = 300;
            node2.shape = { type: 'Path' };
            (node2.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
            let nodeport2: PointPortModel = {}; nodeport2.shape = 'Square'; nodeport2.offset = { x: 1, y: 0.5 };
            nodeport2.id = 'port2'; node2.ports = [nodeport2];


            let connector1: ConnectorModel = {};
            connector1.id = 'connector1';
            connector1.type = 'Orthogonal';
            connector1.sourceID = node2.id;
            connector1.sourcePortID = nodeport2.id;
            connector1.targetID = node1.id;

            diagram = new Diagram({
                width: 1000, height: 500, nodes: [node1, node2],
                connectors: [connector1]
            });
            diagram.appendTo('#diagram11');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connections with node and right port', (done: Function) => {
            let failure: boolean = false;
            let connector: ConnectorModel = diagram.connectors[0];
            expect(connector.sourcePoint.x === 350 && connector.sourcePoint.y === 300 &&
                connector.targetPoint.x === 150 && connector.targetPoint.y === 300).toBe(true);
            done();
        });
    });
});