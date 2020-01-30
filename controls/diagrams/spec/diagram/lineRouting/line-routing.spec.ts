import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Connector } from '../../../src/diagram/objects/connector';
import { DiagramConstraints, PortVisibility, SnapConstraints } from '../../../src/diagram/enum/enum';
import { LineRouting } from '../../../src/diagram/interaction/line-routing';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { MouseEvents } from '../interaction/mouseevents.spec';
Diagram.Inject(LineRouting, UndoRedo);

/**
 * Line Routing Spec
 */

function getIntermediatePoints(Points: PointModel[], value: string): string {
    let output: string = 'expect(';
    for (let i = 0; i < Points.length; i++) {
        output += value + '.intermediatePoints[' + i + '].x ==' + Points[i].x +
            '&&' + value + '.intermediatePoints[' + i + '].y ==' + Points[i].y + '&&';
    }
    output += ').toBe(true);';
    return output;
}
let diagram: Diagram;
let ele: HTMLElement;
let connectors: ConnectorModel[];
let nodes: NodeModel[];
describe('Diagram Control', () => {
    describe('Rendering', () => {
        describe('Node to Node', () => {
            //Top to botom and Left to Right
            describe('Line Routing - Top to Bottom', () => {
                describe('Line Routing - without blocks(top to bottom)', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting1' });
                        document.body.appendChild(ele);

                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 100,

                                ports: [
                                    { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                    { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                    { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                    { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                                ]
                            },
                            {
                                id: 'node2', width: 100, offsetX: 300, offsetY: 100,

                                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                                ]
                            },
                            {
                                id: 'node3', width: 100, height: 60, offsetX: 100, offsetY: 300,

                                ports: [
                                    { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                    { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                    { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                    { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                                ]
                            },
                            {
                                id: 'node4', width: 100, offsetX: 300, offsetY: 300,

                                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                                ]
                            },
                            {
                                id: 'node5', width: 100, height: 60, offsetX: 500, offsetY: 100,

                                ports: [
                                    { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                    { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                    { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                    { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                                ]
                            },
                            {
                                id: 'node6', width: 100, offsetX: 700, offsetY: 100,

                                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                                ]
                            },
                            {
                                id: 'node7', width: 100, height: 60, offsetX: 500, offsetY: 300,

                                ports: [
                                    { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                    { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                    { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                    { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                                ]
                            },
                            {
                                id: 'node8', width: 100, offsetX: 700, offsetY: 300,

                                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                                ]
                            },
                        ]

                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'node2'
                        },
                        {
                            id: 'Connector2', sourceID: 'node2', targetID: 'node4'
                        },
                        {
                            id: 'Connector3', sourceID: 'node4', targetID: 'node3'
                        },
                        {
                            id: 'Connector4', sourceID: 'node3', targetID: 'node1'
                        },
                        {
                            id: 'Connector5', sourceID: 'node5', targetID: 'node8'
                        },
                        {
                            id: 'Connector6', sourceID: 'node6', targetID: 'node7'
                        },
                        {
                            id: 'Connector7', sourceID: 'node8', targetID: 'node5'
                        },
                        {
                            id: 'Connector8', sourceID: 'node7', targetID: 'node6'
                        }]

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                            getConnectorDefaults: function (connector: ConnectorModel) {
                                connector.type = 'Orthogonal';
                            }
                        });
                        diagram.appendTo('#diagramLineRouting1');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing ', (done: Function) => {
                        console.log('Test case 1145');
                        console.log("line routing test case begin");
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100).toBe(true);
                        expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 275).toBe(true);
                        expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 300).toBe(true);
                        expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 130).toBe(true);
                        expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 275).toBe(true);
                        expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 650 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 630 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 550 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 300).toBe(true);
                        expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 650 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 630 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 550 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 100).toBe(true);
                        expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 550 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 570 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 650 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 100).toBe(true);
                        done();
                    });
                });

                // Target block

                describe('Line Routing', () => {


                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting2' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting2');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - left side block in target node ', (done: Function) => {
                        console.log('Test case 1146');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting3' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting3');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - left and top side block in target node', (done: Function) => {
                        console.log('Test case 1147');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 330).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting4' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 300, offsetY: 330
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting4');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - left, top, bottom side block in target node', (done: Function) => {
                        console.log('Test case 1148');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
                        done();
                    });
                });



                // source - block

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting5' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            }
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting5');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - bottom side block in source node', (done: Function) => {
                        console.log('Test case 1149');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting6' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting6');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right, bottom side block in source node', (done: Function) => {
                        console.log('Test case 1150');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 300).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting7' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 100, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting7');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right, top, bottom side block in source node', (done: Function) => {
                        console.log('Test case 1151');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);
                        done();
                    });
                });

                // source - block and target - block

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting8' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting8');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - bottom side block in source node, left side of the target node', (done: Function) => {
                        console.log('Test case 1152');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 270).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting9' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting9');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - bottom side block in source node, left, top side block of the target node', (done: Function) => {
                        console.log('Test case 1153');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 330).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting10' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 300, offsetY: 330
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting10');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - bottom side block in source node, left, top, bottom side block of the target node', (done: Function) => {
                        console.log('Test case 1154');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting11' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },

                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting11');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - bottom side block in source node, left side of the target node', (done: Function) => {
                        console.log('Test case 1155');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 270).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting12' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting12');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - bottom side block in source node, left, top side block of the target node', (done: Function) => {
                        console.log('Test case 1156');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[9].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[9].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[10].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[10].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[11].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[11].y == 330).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting13' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },

                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 300, offsetY: 330
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting13');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - bottom side block in source node, left, top, bottom side block of the target node', (done: Function) => {
                        console.log('Test case 1157');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 300).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting14' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 100, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting14');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - bottom side block in source node, left side of the target node', (done: Function) => {
                        console.log('Test case 1158');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 270).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting15' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 100, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting15');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - bottom side block in source node, left, top side block of the target node', (done: Function) => {
                        console.log('Test case 1159');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 330).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting16' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 300, offsetY: 330
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 100, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting16');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - bottom side block in source node, left, top, bottom side block of the target node', (done: Function) => {
                        console.log('Test case 1160');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300).toBe(true);
                        done();
                    });
                });
            });

            // Bottom to top and Right to Left
            describe('Line Routing - Bottom to Top', () => {
                describe('Line Routing - without blocks(bottom to top)', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting17' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 }
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting17');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing ', (done: Function) => {
                        console.log('Test case 1161');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 100).toBe(true);
                        done();
                    });
                });

                // Target block

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting18' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting18');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right side block in target node ', (done: Function) => {
                        console.log('Test case 1162');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 125).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting19' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting19');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right and bottom side block in target node', (done: Function) => {
                        console.log('Test case 1163');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 300).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting20' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 100, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting20');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right, top, bottom side block in target node', (done: Function) => {
                        console.log('Test case 1164');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                        done();
                    });
                });



                // source - block

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting21' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting21');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top side block in source node', (done: Function) => {
                        console.log('Test case 1165');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 100).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting22' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting22');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, left side block in source node', (done: Function) => {
                        console.log('Test case 1166');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 100).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting23' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 300, offsetY: 330
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting23');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - bottom, top, bottom side block in source node', (done: Function) => {
                        console.log('Test case 1167');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 100).toBe(true);
                        done();
                    });
                });

                // source - block and target - block

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting24' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting24');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right side block in target node and top side block in source node ', (done: Function) => {
                        console.log('Test case 1168');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 125).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting25' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting25');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right and bottom side block in target node and top side block in source node', (done: Function) => {
                        console.log('Test case 1169');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 75).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting26' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 100, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting26');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right, top, bottom side block in target node and top side block in source node', (done: Function) => {
                        console.log('Test case 1170');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting27' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting27');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right side block in target node and Top, left side block in source node ', (done: Function) => {
                        console.log('Test case 1171');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 125).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting28' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting28');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right and bottom side block in target node and Top, left side block in source node', (done: Function) => {
                        console.log('Test case 1172');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[9].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[9].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[10].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[10].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[11].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[11].y == 75).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting29' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 100, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting29');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right, top, bottom side block in target node and Top, left side block in source node', (done: Function) => {
                        console.log('Test case 1173');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 100).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting30' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 300, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 100, offsetY: 100 },
                            {
                                id: 'block1', width: 20, height: 20, offsetX: 230, offsetY: 300
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 300, offsetY: 270
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 100, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 100, offsetY: 130
                            },
                            {
                                id: 'block8', width: 20, height: 20, offsetX: 170, offsetY: 100
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 300, offsetY: 330
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting30');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right, top, bottom side block in target node and Top, left, bottom side block in source node', (done: Function) => {
                        console.log('Test case 1174');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                        done();
                    });
                });
            });

            //Top to botom and Right to Left
            describe('Line Routing - Top to bottom', () => {
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting31' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting31');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - without blocks', (done: Function) => {
                        console.log('Test case 1175');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);
                        done();
                    });
                });

                // Source blocks

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting32' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },

                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting32');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top side block in source node', (done: Function) => {
                        console.log('Test case 1176');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting33' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting33');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Left, bottom side block in source node', (done: Function) => {
                        console.log('Test case 1177');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 300).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting34' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 300, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting34');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Left, bottom side block in source node', (done: Function) => {
                        console.log('Test case 1178');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);
                        done();
                    });
                });

                // Target block
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting35' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },

                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting35');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Right side block in target node', (done: Function) => {
                        console.log('Test case 1179');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 270).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting36' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting36');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Right side block in target node', (done: Function) => {
                        console.log('Test case 1180');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 330).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting37' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 100, offsetY: 330
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting37');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Right, bottom side block in target node', (done: Function) => {
                        console.log('Test case 1181');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300).toBe(true);
                        done();
                    });
                });

                // source and target block

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting38' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },

                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting38');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top side block in source node and Right side block in target node', (done: Function) => {
                        console.log('Test case 1182');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 270).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting39' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },

                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting39');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top side block in source node and Top, Right side block in target node', (done: Function) => {
                        console.log('Test case 1183');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 330).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting40' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 100, offsetY: 330
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },

                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting40');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top side block in source node and Top, Right, bottom side block in target node', (done: Function) => {
                        console.log('Test case 1184');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting41' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting41');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Left, bottom side block in source node and Right side block in target node', (done: Function) => {
                        console.log('Test case 1185');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 270).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting42' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting42');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Left, bottom side block in source node and Top, Right side block in target node', (done: Function) => {
                        console.log('Test case 1186');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[9].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[9].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[10].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[10].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[11].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[11].y == 330).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting43' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 100, offsetY: 330
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting43');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Left, bottom side block in source node and Top, Right, bottom side block in target node', (done: Function) => {
                        console.log('Test case 1187');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 300).toBe(true);
                        done();
                    });
                });


                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting44' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 300, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting44');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Left, bottom side block in source node and Right side block in target node', (done: Function) => {
                        console.log('Test case 1188');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 270).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting45' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 300, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting45');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Left, bottom side block in source node and Top, Right side block in target node', (done: Function) => {
                        console.log('Test case 1189');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 330).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting46' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 300, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 100, offsetY: 330
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'newNode', targetID: 'node1', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting46');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Left, bottom side block in source node and Top, Right, bottom side block in target node', (done: Function) => {
                        console.log('Test case 1190');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300).toBe(true);
                        done();
                    });
                });
            });

            // Bottom to top and Left to Right
            describe('Line Routing - Bottom to Top', () => {
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting47' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting47');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - without blocks', (done: Function) => {
                        console.log('Test case 1191');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 100).toBe(true);
                        done();
                    });
                });

                // Source blocks

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting48' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },

                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting48');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top side block in source node', (done: Function) => {
                        console.log('Test case 1192');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 100).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting49' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting49');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Right side block in source node', (done: Function) => {
                        console.log('Test case 1192');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 100).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting50' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 100, offsetY: 330
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting50');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Right, bottom side block in source node', (done: Function) => {
                        console.log('Test case 1193');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 100).toBe(true);
                        done();
                    });
                });

                // Target block
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting51' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },

                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting51');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Left side block in target node', (done: Function) => {
                        console.log('Test case 1194');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 125).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting52' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting52');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Left, Bottom side block in target node', (done: Function) => {
                        console.log('Test case 1195');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 75).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting53' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 300, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting53');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Left, bottom side block in target node', (done: Function) => {
                        console.log('Test case 1196');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                        done();
                    });
                });

                // source and target block

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting54' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },

                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting54');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top side block in source node', (done: Function) => {
                        console.log('Test case 1197');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 125).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting55' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            }

                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting55');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top side block in source node', (done: Function) => {
                        console.log('Test case 1198');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 75).toBe(true);
                        done();

                    });
                });
                describe('Line Routing', () => {
                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting56' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 300, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },

                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting56');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top side block in source node', (done: Function) => {
                        console.log('Test case 1199');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                        done();
                    });
                });

                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting57' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting57');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Right side block in source node', (done: Function) => {
                        console.log('Test case 1200');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 125).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting58' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting58');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Right side block in source node', (done: Function) => {
                        console.log('Test case 1201');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 75).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting59' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 300, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting59');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Right side block in source node', (done: Function) => {
                        console.log('Test case 1202');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                        done();
                    });
                });


                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting60' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 100, offsetY: 330
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting60');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Right, bottom side block in source node', (done: Function) => {
                        console.log('Test case 1203');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 125).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting61' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 100, offsetY: 330
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting61');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Right, bottom side block in source node', (done: Function) => {
                        console.log('Test case 1204');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 210 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 75).toBe(true);
                        done();
                    });
                });
                describe('Line Routing', () => {

                    beforeAll((): void => {
                        ele = createElement('div', { id: 'diagramLineRouting62' });
                        document.body.appendChild(ele);
                        nodes = [
                            {
                                id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,
                            },
                            { id: 'newNode', width: 100, offsetX: 300, offsetY: 100 },
                            {
                                id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                            },
                            {
                                id: 'block3', width: 20, height: 20, offsetX: 100, offsetY: 330
                            },
                            {
                                id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                            },
                            {
                                id: 'block5', width: 20, height: 20, offsetX: 240, offsetY: 100
                            },
                            {
                                id: 'block6', width: 20, height: 20, offsetX: 300, offsetY: 80
                            },
                            {
                                id: 'block7', width: 20, height: 20, offsetX: 300, offsetY: 130
                            },
                        ];


                        connectors = [{
                            id: 'Connector1', sourceID: 'node1', targetID: 'newNode', type: 'Orthogonal'
                        }];

                        diagram = new Diagram({
                            width: 1000, height: 600,
                            connectors: connectors, nodes: nodes,
                            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                        });
                        diagram.appendTo('#diagramLineRouting62');
                    });

                    afterAll((): void => {
                        diagram.destroy();
                        ele.remove();
                    });

                    it('Line routing - Top, Right, bottom side block in source node', (done: Function) => {
                        console.log('Test case 1205');
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                        done();
                    });
                });

            });
        });



        describe('Port to port', () => {

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramLineRouting63' });
                document.body.appendChild(ele);
                nodes = [
                    {
                        id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 100,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node2', width: 100, offsetX: 300, offsetY: 100,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node3', width: 100, height: 60, offsetX: 100, offsetY: 300,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node4', width: 100, offsetX: 300, offsetY: 300,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node5', width: 100, height: 60, offsetX: 500, offsetY: 100,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node6', width: 100, offsetX: 700, offsetY: 100,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node7', width: 100, height: 60, offsetX: 500, offsetY: 300,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node8', width: 100, offsetX: 700, offsetY: 300,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                ]

                connectors = [
                    {
                        id: 'Connector1',
                        targetID: 'node2', targetPortID: 'port1', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector11',
                        targetID: 'node2', targetPortID: 'port1', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector12',
                        targetID: 'node2', targetPortID: 'port1', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector13',
                        targetID: 'node2', targetPortID: 'port1', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port4'
                    },

                    {
                        id: 'Connector2111',
                        targetID: 'node2', targetPortID: 'port2', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector21',
                        targetID: 'node2', targetPortID: 'port2', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector22',
                        targetID: 'node2', targetPortID: 'port2', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector23',
                        targetID: 'node2', targetPortID: 'port2', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port4'
                    },

                    {
                        id: 'Connector3',
                        targetID: 'node2', targetPortID: 'port3', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector31',
                        targetID: 'node2', targetPortID: 'port3', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector32',
                        targetID: 'node2', targetPortID: 'port3', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector33',
                        targetID: 'node2', targetPortID: 'port3', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port4'
                    },

                    {
                        id: 'Connector4',
                        targetID: 'node2', targetPortID: 'port4', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector41',
                        targetID: 'node2', targetPortID: 'port4', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector42',
                        targetID: 'node2', targetPortID: 'port4', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector43',
                        targetID: 'node2', targetPortID: 'port4', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port4'
                    },


                    {
                        id: 'Connector5',
                        targetID: 'node3', targetPortID: 'port1', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector51',
                        targetID: 'node3', targetPortID: 'port1', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector52',
                        targetID: 'node3', targetPortID: 'port1', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector53',
                        targetID: 'node3', targetPortID: 'port1', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port4'
                    },

                    {
                        id: 'Connector6',
                        targetID: 'node3', targetPortID: 'port2', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector61',
                        targetID: 'node3', targetPortID: 'port2', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector62',
                        targetID: 'node3', targetPortID: 'port2', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector63',
                        targetID: 'node3', targetPortID: 'port2', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port4'
                    },

                    {
                        id: 'Connector7',
                        targetID: 'node3', targetPortID: 'port3', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector71',
                        targetID: 'node3', targetPortID: 'port3', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector72',
                        targetID: 'node3', targetPortID: 'port3', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector73',
                        targetID: 'node3', targetPortID: 'port3', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port4'
                    },

                    {
                        id: 'Connector8',
                        targetID: 'node3', targetPortID: 'port4', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector81',
                        targetID: 'node3', targetPortID: 'port4', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector82',
                        targetID: 'node3', targetPortID: 'port4', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector83',
                        targetID: 'node3', targetPortID: 'port4', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port4'
                    },

                    {
                        id: 'Connector2',
                        targetID: 'node3', targetPortID: 'port1', type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port1'
                    }
                ]


                diagram = new Diagram({
                    width: 1000, height: 600,
                    connectors: connectors, nodes: nodes,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                });
                diagram.appendTo('#diagramLineRouting63');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Line routing ', (done: Function) => {
                console.log('Test case 1206');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[4].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == 250 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[4] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[4] as Connector).intermediatePoints[4].y == 75).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 75).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 75).toBe(true);
                expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 170 && (diagram.connectors[7] as Connector).intermediatePoints[4].x == 230 && (diagram.connectors[7] as Connector).intermediatePoints[4].y == 170 && (diagram.connectors[7] as Connector).intermediatePoints[5].x == 230 && (diagram.connectors[7] as Connector).intermediatePoints[5].y == 50 && (diagram.connectors[7] as Connector).intermediatePoints[6].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[6].y == 50 && (diagram.connectors[7] as Connector).intermediatePoints[7].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[7].y == 75).toBe(true);
                expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[8] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[8] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[8] as Connector).intermediatePoints[5].y == 100).toBe(true);
                expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[9] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[9] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[9] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[9] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[9] as Connector).intermediatePoints[4].x == 350 && (diagram.connectors[9] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[10] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[10] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[10] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[10] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[10] as Connector).intermediatePoints[5].y == 100).toBe(true);
                expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[11] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[11] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[11] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[11] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[11] as Connector).intermediatePoints[4].x == 350 && (diagram.connectors[11] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[12] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[12] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[12] as Connector).intermediatePoints[4].y == 125).toBe(true);
                expect((diagram.connectors[13] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[13] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[13] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[13] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[13] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[13] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[13] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[13] as Connector).intermediatePoints[4].y == 150 && (diagram.connectors[13] as Connector).intermediatePoints[5].x == 300 && (diagram.connectors[13] as Connector).intermediatePoints[5].y == 125).toBe(true);
                expect((diagram.connectors[14] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[14] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[14] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[14] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[14] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[14] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[14] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[14] as Connector).intermediatePoints[4].y == 125).toBe(true);
                expect((diagram.connectors[15] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[15] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[15] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[15] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[15] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[15] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[15] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[15] as Connector).intermediatePoints[3].y == 125).toBe(true);
                expect((diagram.connectors[16] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[16] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[16] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[16] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[16] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[16] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[16] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[16] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[16] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[16] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[16] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[16] as Connector).intermediatePoints[5].y == 300).toBe(true);
                expect((diagram.connectors[17] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[17] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[17] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[17] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[17] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[17] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[17] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[17] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[17] as Connector).intermediatePoints[4].x == 50 && (diagram.connectors[17] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[18] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[18] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[18] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[18] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[18] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[18] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[18] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[18] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[18] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[18] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[18] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[18] as Connector).intermediatePoints[5].y == 300).toBe(true);
                expect((diagram.connectors[19] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[19] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[19] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[19] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[19] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[19] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[19] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[19] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[19] as Connector).intermediatePoints[4].x == 50 && (diagram.connectors[19] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[20] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[20] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[20] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[20] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[20] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[20] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[20] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[20] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[20] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[20] as Connector).intermediatePoints[4].y == 270).toBe(true);
                expect((diagram.connectors[21] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[21] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[21] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[21] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[21] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[21] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[21] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[21] as Connector).intermediatePoints[3].y == 270).toBe(true);
                expect((diagram.connectors[22] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[22] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[22] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[22] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[22] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[22] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[22] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[22] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[22] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[22] as Connector).intermediatePoints[4].y == 270).toBe(true);
                expect((diagram.connectors[23] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[23] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[23] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[23] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[23] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[23] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[23] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[23] as Connector).intermediatePoints[3].y == 370 && (diagram.connectors[23] as Connector).intermediatePoints[4].x == 170 && (diagram.connectors[23] as Connector).intermediatePoints[4].y == 370 && (diagram.connectors[23] as Connector).intermediatePoints[5].x == 170 && (diagram.connectors[23] as Connector).intermediatePoints[5].y == 250 && (diagram.connectors[23] as Connector).intermediatePoints[6].x == 100 && (diagram.connectors[23] as Connector).intermediatePoints[6].y == 250 && (diagram.connectors[23] as Connector).intermediatePoints[7].x == 100 && (diagram.connectors[23] as Connector).intermediatePoints[7].y == 270).toBe(true);
                expect((diagram.connectors[24] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[24] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[24] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[24] as Connector).intermediatePoints[1].y == 300).toBe(true);
                expect((diagram.connectors[25] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[25] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[25] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[25] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[25] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[25] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[25] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[25] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[25] as Connector).intermediatePoints[4].x == 150 && (diagram.connectors[25] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[26] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[26] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[26] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[26] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[26] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[26] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[26] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[26] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[26] as Connector).intermediatePoints[4].x == 230 && (diagram.connectors[26] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[26] as Connector).intermediatePoints[5].x == 150 && (diagram.connectors[26] as Connector).intermediatePoints[5].y == 300).toBe(true);
                expect((diagram.connectors[27] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[27] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[27] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[27] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[27] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[27] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[27] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[27] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[27] as Connector).intermediatePoints[4].x == 150 && (diagram.connectors[27] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[28] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[28] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[28] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[28] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[28] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[28] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[28] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[28] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[28] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[28] as Connector).intermediatePoints[4].y == 330).toBe(true);
                expect((diagram.connectors[29] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[29] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[29] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[29] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[29] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[29] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[29] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[29] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[29] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[29] as Connector).intermediatePoints[4].y == 350 && (diagram.connectors[29] as Connector).intermediatePoints[5].x == 100 && (diagram.connectors[29] as Connector).intermediatePoints[5].y == 330).toBe(true);
                expect((diagram.connectors[30] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[30] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[30] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[30] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[30] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[30] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[30] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[30] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[30] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[30] as Connector).intermediatePoints[4].y == 330).toBe(true);
                expect((diagram.connectors[31] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[31] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[31] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[31] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[31] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[31] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[31] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[31] as Connector).intermediatePoints[3].y == 330).toBe(true);
                expect((diagram.connectors[32] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[32] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[32] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[32] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[32] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[32] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[32] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[32] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[32] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[32] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[32] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[32] as Connector).intermediatePoints[5].y == 300).toBe(true);
                done();
            });
        });

        describe('Point to point', () => {

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramLineRouting64' });
                document.body.appendChild(ele);
                nodes = [
                    {
                        id: 'BigBLock', offsetX: 200, offsetY: 100, width: 50, height: 100
                    },

                    {
                        id: 'block1', width: 20, height: 20, offsetX: 30, offsetY: 300
                    },
                    {
                        id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                    },
                    {
                        id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                    },
                ];


                connectors = [{
                    id: 'Connector1',
                    sourcePoint: { x: 100, y: 100 },
                    targetPoint: { x: 100, y: 300 },
                },
                {
                    id: 'Connector2',
                    targetPoint: { x: 100, y: 100 },
                    sourcePoint: { x: 100, y: 300 },
                },
                {
                    id: 'Connector3',
                    sourcePoint: { x: 100, y: 100 },
                    targetPoint: { x: 300, y: 100 },
                },
                {
                    id: 'Connector4',
                    targetPoint: { x: 100, y: 100 },
                    sourcePoint: { x: 300, y: 100 },
                }];

                diagram = new Diagram({
                    width: 1000, height: 600,
                    connectors: connectors, nodes: nodes,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                });
                diagram.appendTo('#diagramLineRouting64');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Line routing ', (done: Function) => {
                console.log('Test case 1207');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 70 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 70 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 70 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 70 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 100).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 30 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 250 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 30 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 30 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 150 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 30 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 150 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 100).toBe(true);
                done();
            });


        });

        describe('Node to point', () => {
            describe('All causes', () => {

                beforeAll((): void => {
                    ele = createElement('div', { id: 'diagramLineRouting65' });
                    document.body.appendChild(ele);
                    nodes = [
                        {
                            id: 'node2', width: 100, offsetX: 300, offsetY: 100,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'block1', width: 20, height: 20, offsetX: 250, offsetY: 100
                        },
                        {
                            id: 'node3', width: 100, height: 60, offsetX: 100, offsetY: 300,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'block2', width: 20, height: 20, offsetX: 170, offsetY: 300
                        },
                        {
                            id: 'node5', width: 100, height: 60, offsetX: 500, offsetY: 100,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'block3', width: 20, height: 20, offsetX: 500, offsetY: 130
                        },
                        {
                            id: 'node8', width: 100, offsetX: 700, offsetY: 300,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'block4', width: 20, height: 20, offsetX: 700, offsetY: 270
                        },
                    ]

                    connectors = [
                        // Right to Left
                        {
                            id: 'Connector1',
                            sourceID: 'node2', type: 'Orthogonal',
                            targetPoint: { x: 100, y: 100 }
                        },

                        // Left to Right

                        {
                            id: 'Connector8',
                            sourceID: 'node3', type: 'Orthogonal',
                            targetPoint: { x: 300, y: 300 }
                        },

                        // Top to bootom
                        {
                            id: 'Connector3',
                            sourceID: 'node5', type: 'Orthogonal',
                            targetPoint: { x: 500, y: 300 }
                        },

                        // Bottom to top

                        {
                            id: 'Connector4',
                            sourceID: 'node8', type: 'Orthogonal',
                            targetPoint: { x: 700, y: 100 }
                        },
                    ]
                    diagram = new Diagram({
                        width: 1000, height: 600,
                        connectors: connectors, nodes: nodes,
                        constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                    });
                    diagram.appendTo('#diagramLineRouting65');
                });

                afterAll((): void => {
                    diagram.destroy();
                    ele.remove();
                });

                it('Line routing ', (done: Function) => {
                    console.log('Test case 1208');
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100).toBe(true);
                    expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 270 && (diagram.connectors[1] as Connector).intermediatePoints[4].x == 190 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 270 && (diagram.connectors[1] as Connector).intermediatePoints[5].x == 190 && (diagram.connectors[1] as Connector).intermediatePoints[5].y == 300 && (diagram.connectors[1] as Connector).intermediatePoints[6].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[6].y == 300).toBe(true);
                    expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 430 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 500 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 300).toBe(true);
                    expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 650 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 630 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 100).toBe(true);
                    done();
                });
            });
            describe('Bottom to Top', () => {

                beforeAll((): void => {
                    ele = createElement('div', { id: 'diagramLineRouting66' });
                    document.body.appendChild(ele);
                    nodes = [

                        {
                            id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'newNode', width: 100, offsetX: 300, offsetY: 100,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'BigBLock', offsetX: 200, offsetY: 100, width: 50, height: 100
                        },

                        {
                            id: 'block1', width: 20, height: 20, offsetX: 30, offsetY: 300
                        },
                        {
                            id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                        },
                        {
                            id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                        },
                    ];


                    connectors = [{
                        id: 'Connector1',
                        sourceID: 'node1',
                        targetPoint: { x: 100, y: 100 },
                    }];

                    diagram = new Diagram({
                        width: 1000, height: 600,
                        connectors: connectors, nodes: nodes,
                        constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                    });
                    diagram.appendTo('#diagramLineRouting66');
                });

                afterAll((): void => {
                    diagram.destroy();
                    ele.remove();
                });

                it('Line routing ', (done: Function) => {
                    console.log('Test case 1209');
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 10 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 10 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 100).toBe(true);
                    done();

                });
            });
            describe('Right to left', () => {
                beforeAll((): void => {
                    ele = createElement('div', { id: 'diagramLineRouting67' });
                    document.body.appendChild(ele);
                    nodes = [

                        {
                            id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'newNode', width: 100, offsetX: 300, offsetY: 100,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'BigBLock', offsetX: 200, offsetY: 100, width: 50, height: 100
                        },

                        {
                            id: 'block1', width: 20, height: 20, offsetX: 30, offsetY: 300
                        },
                        {
                            id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                        },
                        {
                            id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                        },
                    ];


                    connectors = [{
                        id: 'Connector1',
                        sourceID: 'newNode',
                        targetPoint: { x: 100, y: 100 },
                    }];

                    diagram = new Diagram({
                        width: 1000, height: 600,
                        connectors: connectors, nodes: nodes,
                        constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                    });
                    diagram.appendTo('#diagramLineRouting67');
                });

                afterAll((): void => {
                    diagram.destroy();
                    ele.remove();
                });

                it('Line routing ', (done: Function) => {
                    console.log('Test case 1210');
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100).toBe(true);
                    done();
                });
            });
            describe('Top to Bottom', () => {

                beforeAll((): void => {
                    ele = createElement('div', { id: 'diagramLineRouting68' });
                    document.body.appendChild(ele);
                    nodes = [

                        {
                            id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'newNode', width: 100, offsetX: 300, offsetY: 100,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'BigBLock', offsetX: 200, offsetY: 100, width: 50, height: 100
                        },
                        {
                            id: 'BigBLock2', offsetX: 300, offsetY: 200, width: 50, height: 100
                        },

                        {
                            id: 'block1', width: 20, height: 20, offsetX: 30, offsetY: 300
                        },
                        {
                            id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                        },
                        {
                            id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                        },
                    ];


                    connectors = [{
                        id: 'Connector1',
                        sourceID: 'newNode',
                        targetPoint: { x: 300, y: 300 },
                    }];

                    diagram = new Diagram({
                        width: 1000, height: 600,
                        connectors: connectors, nodes: nodes,
                        constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                    });
                    diagram.appendTo('#diagramLineRouting68');
                });

                afterAll((): void => {
                    diagram.destroy();
                    ele.remove();
                });

                it('Line routing ', (done: Function) => {
                    console.log('Test case 1211');
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);
                    done();

                });
            });
            describe('Left to Right', () => {

                beforeAll((): void => {
                    ele = createElement('div', { id: 'diagramLineRouting69' });
                    document.body.appendChild(ele);
                    nodes = [

                        {
                            id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'newNode', width: 100, offsetX: 300, offsetY: 100,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'BigBLock', offsetX: 200, offsetY: 100, width: 50, height: 100
                        },
                        {
                            id: 'BigBLock2', offsetX: 300, offsetY: 200, width: 50, height: 100
                        },

                        {
                            id: 'block1', width: 20, height: 20, offsetX: 30, offsetY: 300
                        },
                        {
                            id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                        },
                        {
                            id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                        },
                    ];


                    connectors = [{
                        id: 'Connector1',
                        sourceID: 'node1',
                        targetPoint: { x: 300, y: 300 },
                    }];

                    diagram = new Diagram({
                        width: 1000, height: 600,
                        connectors: connectors, nodes: nodes,
                        constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                    });
                    diagram.appendTo('#diagramLineRouting69');
                });

                afterAll((): void => {
                    diagram.destroy();
                    ele.remove();
                });

                it('Line routing ', (done: Function) => {
                    console.log('Test case 1212');
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 300).toBe(true);
                    done();
                });
            });
        });

        describe('Point to node', () => {
            describe('All causes', () => {

                beforeAll((): void => {
                    ele = createElement('div', { id: 'diagramLineRouting70' });
                    document.body.appendChild(ele);
                    nodes = [
                        {
                            id: 'node2', width: 100, offsetX: 300, offsetY: 100,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'block1', width: 20, height: 20, offsetX: 250, offsetY: 100
                        },
                        {
                            id: 'node3', width: 100, height: 60, offsetX: 100, offsetY: 300,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'block2', width: 20, height: 20, offsetX: 170, offsetY: 300
                        },
                        {
                            id: 'node5', width: 100, height: 60, offsetX: 500, offsetY: 100,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'block3', width: 20, height: 20, offsetX: 500, offsetY: 130
                        },
                        {
                            id: 'node8', width: 100, offsetX: 700, offsetY: 300,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'block4', width: 20, height: 20, offsetX: 700, offsetY: 270
                        },
                    ]

                    connectors = [
                        // Right to Left
                        {
                            id: 'Connector1',
                            targetID: 'node2', type: 'Orthogonal',
                            sourcePoint: { x: 100, y: 100 }
                        },

                        // Left to Right

                        {
                            id: 'Connector8',
                            targetID: 'node3', type: 'Orthogonal',
                            sourcePoint: { x: 300, y: 300 }
                        },

                        // Top to bootom
                        {
                            id: 'Connector3',
                            targetID: 'node5', type: 'Orthogonal',
                            sourcePoint: { x: 500, y: 300 }
                        },

                        // Bottom to top

                        {
                            id: 'Connector4',
                            targetID: 'node8', type: 'Orthogonal',
                            sourcePoint: { x: 700, y: 100 }
                        },
                    ]
                    diagram = new Diagram({
                        width: 1000, height: 600,
                        connectors: connectors, nodes: nodes,
                        constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                    });
                    diagram.appendTo('#diagramLineRouting70');
                });

                afterAll((): void => {
                    diagram.destroy();
                    ele.remove();
                });

                it('Line routing ', (done: Function) => {
                    console.log('Test case 1213');
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 75).toBe(true);
                    expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 270).toBe(true);
                    expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 430 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[4].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[4].y == 100).toBe(true);
                    expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 630 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 300).toBe(true);
                    done();
                });
            });
            describe('Bottom to Top', () => {

                beforeAll((): void => {
                    ele = createElement('div', { id: 'diagramLineRouting71' });
                    document.body.appendChild(ele);
                    nodes = [

                        {
                            id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'newNode', width: 100, offsetX: 300, offsetY: 100,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'BigBLock', offsetX: 200, offsetY: 100, width: 50, height: 100
                        },

                        {
                            id: 'block1', width: 20, height: 20, offsetX: 30, offsetY: 300
                        },
                        {
                            id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                        },
                        {
                            id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                        },
                    ];


                    connectors = [{
                        id: 'Connector1',
                        targetID: 'node1',
                        sourcePoint: { x: 100, y: 100 },
                    }];

                    diagram = new Diagram({
                        width: 1000, height: 600,
                        connectors: connectors, nodes: nodes,
                        constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                    });
                    diagram.appendTo('#diagramLineRouting71');
                });

                afterAll((): void => {
                    diagram.destroy();
                    ele.remove();
                });

                it('Line routing ', (done: Function) => {
                    console.log('Test case 1214');
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 10 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 10 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 330).toBe(true);
                    done();
                });
            });
            describe('Right to left', () => {
                beforeAll((): void => {
                    ele = createElement('div', { id: 'diagramLineRouting72' });
                    document.body.appendChild(ele);
                    nodes = [

                        {
                            id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'newNode', width: 100, offsetX: 300, offsetY: 100,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'BigBLock', offsetX: 200, offsetY: 100, width: 50, height: 100
                        },

                        {
                            id: 'block1', width: 20, height: 20, offsetX: 30, offsetY: 300
                        },
                        {
                            id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                        },
                        {
                            id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                        },
                    ];


                    connectors = [{
                        id: 'Connector1',
                        targetID: 'newNode',
                        sourcePoint: { x: 100, y: 100 },
                    }];

                    diagram = new Diagram({
                        width: 1000, height: 600,
                        connectors: connectors, nodes: nodes,
                        constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                    });
                    diagram.appendTo('#diagramLineRouting72');
                });

                afterAll((): void => {
                    diagram.destroy();
                    ele.remove();
                });

                it('Line routing ', (done: Function) => {
                    console.log('Test case 1215');
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 75).toBe(true);
                    done();
                });
            });
            describe('Top to Bottom', () => {

                beforeAll((): void => {
                    ele = createElement('div', { id: 'diagramLineRouting73' });
                    document.body.appendChild(ele);
                    nodes = [

                        {
                            id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'newNode', width: 100, offsetX: 300, offsetY: 100,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'BigBLock', offsetX: 200, offsetY: 100, width: 50, height: 100
                        },
                        {
                            id: 'BigBLock2', offsetX: 300, offsetY: 200, width: 50, height: 100
                        },

                        {
                            id: 'block1', width: 20, height: 20, offsetX: 30, offsetY: 300
                        },
                        {
                            id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                        },
                        {
                            id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                        },
                    ];


                    connectors = [{
                        id: 'Connector1',
                        targetID: 'newNode',
                        sourcePoint: { x: 300, y: 300 },
                    }];

                    diagram = new Diagram({
                        width: 1000, height: 600,
                        connectors: connectors, nodes: nodes,
                        constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                    });
                    diagram.appendTo('#diagramLineRouting73');
                });

                afterAll((): void => {
                    diagram.destroy();
                    ele.remove();
                });

                it('Line routing ', (done: Function) => {
                    console.log('Test case 1216');
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 100).toBe(true);
                    done();
                });
            });
            describe('Left to Right', () => {

                beforeAll((): void => {
                    ele = createElement('div', { id: 'diagramLineRouting74' });
                    document.body.appendChild(ele);
                    nodes = [

                        {
                            id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 300,

                            ports: [
                                { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                                { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                                { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                            ]
                        },
                        {
                            id: 'newNode', width: 100, offsetX: 300, offsetY: 100,

                            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                            ]
                        },
                        {
                            id: 'BigBLock', offsetX: 200, offsetY: 100, width: 50, height: 100
                        },
                        {
                            id: 'BigBLock2', offsetX: 300, offsetY: 200, width: 50, height: 100
                        },

                        {
                            id: 'block1', width: 20, height: 20, offsetX: 30, offsetY: 300
                        },
                        {
                            id: 'block2', width: 20, height: 20, offsetX: 100, offsetY: 270
                        },
                        {
                            id: 'block4', width: 20, height: 20, offsetX: 170, offsetY: 300
                        },
                    ];


                    connectors = [{
                        id: 'Connector1',
                        targetID: 'node1',
                        sourcePoint: { x: 300, y: 300 },
                    }];

                    diagram = new Diagram({
                        width: 1000, height: 600,
                        connectors: connectors, nodes: nodes,
                        constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                    });
                    diagram.appendTo('#diagramLineRouting74');
                });

                afterAll((): void => {
                    diagram.destroy();
                    ele.remove();
                });

                it('Line routing ', (done: Function) => {
                    console.log('Test case 1217');
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 290 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 290 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 190 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 330 && (diagram.connectors[0] as Connector).intermediatePoints[7].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[7].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[8].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[8].y == 350 && (diagram.connectors[0] as Connector).intermediatePoints[9].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[9].y == 330).toBe(true);
                    done();
                });
            });
        });

        describe('Point to Port', () => {

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramLineRouting75' });
                document.body.appendChild(ele);
                nodes = [
                    {
                        id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 100,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node4', width: 100, offsetX: 300, offsetY: 300,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node6', width: 100, offsetX: 700, offsetY: 100,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node7', width: 100, height: 60, offsetX: 500, offsetY: 300,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                ]

                connectors = [
                    // Left to Right
                    {
                        id: 'Connector1',
                        sourcePoint: { x: 300, y: 100 }, type: 'Orthogonal',
                        targetID: 'node1', targetPortID: 'port1'
                    },
                    {
                        id: 'Connector11',
                        sourcePoint: { x: 300, y: 100 }, type: 'Orthogonal',
                        targetID: 'node1', targetPortID: 'port2'
                    },
                    {
                        id: 'Connector12',
                        sourcePoint: { x: 300, y: 100 }, type: 'Orthogonal',
                        targetID: 'node1', targetPortID: 'port3'
                    },
                    {
                        id: 'Connector13',
                        sourcePoint: { x: 300, y: 100 }, type: 'Orthogonal',
                        targetID: 'node1', targetPortID: 'port4'
                    },


                    // Right to Left
                    {
                        id: 'Connector2',
                        sourcePoint: { x: 100, y: 300 }, targetPortID: 'port1', type: 'Orthogonal',
                        targetID: 'node4',
                    },
                    {
                        id: 'Connector21',
                        sourcePoint: { x: 100, y: 300 }, targetPortID: 'port2', type: 'Orthogonal',
                        targetID: 'node4',
                    },
                    {
                        id: 'Connector22',
                        sourcePoint: { x: 100, y: 300 }, targetPortID: 'port3', type: 'Orthogonal',
                        targetID: 'node4',
                    },
                    {
                        id: 'Connector23',
                        sourcePoint: { x: 100, y: 300 }, targetPortID: 'port4', type: 'Orthogonal',
                        targetID: 'node4',
                    },

                    // Bootom to top
                    {
                        id: 'Connector3',
                        sourcePoint: { x: 500, y: 100 }, type: 'Orthogonal',
                        targetID: 'node7', targetPortID: 'port1'
                    },
                    {
                        id: 'Connector31',
                        sourcePoint: { x: 500, y: 100 }, type: 'Orthogonal',
                        targetID: 'node7', targetPortID: 'port2'
                    },
                    {
                        id: 'Connector32',
                        sourcePoint: { x: 500, y: 100 }, type: 'Orthogonal',
                        targetID: 'node7', targetPortID: 'port3'
                    },
                    {
                        id: 'Connector33',
                        sourcePoint: { x: 500, y: 100 }, type: 'Orthogonal',
                        targetID: 'node7', targetPortID: 'port4'
                    },

                    // Top to Bottom
                    {
                        id: 'Connector4',
                        sourcePoint: { x: 700, y: 300 }, type: 'Orthogonal',
                        targetID: 'node6', targetPortID: 'port1'
                    },
                    {
                        id: 'Connector41',
                        sourcePoint: { x: 700, y: 300 }, type: 'Orthogonal',
                        targetID: 'node6', targetPortID: 'port2'
                    },
                    {
                        id: 'Connector42',
                        sourcePoint: { x: 700, y: 300 }, type: 'Orthogonal',
                        targetID: 'node6', targetPortID: 'port3'
                    },
                    {
                        id: 'Connector43',
                        sourcePoint: { x: 700, y: 300 }, type: 'Orthogonal',
                        targetID: 'node6', targetPortID: 'port4'
                    }
                ]
                diagram = new Diagram({
                    width: 1000, height: 600,
                    connectors: connectors, nodes: nodes,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                });
                diagram.appendTo('#diagramLineRouting75');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Left port ', (done: Function) => {
                console.log('Test case 1218');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 70).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 130).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 300).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 275).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 350 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 325).toBe(true);
                expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[4].x == 450 && (diagram.connectors[8] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 270).toBe(true);
                expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[10] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[4].x == 550 && (diagram.connectors[10] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[11] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[11] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[11] as Connector).intermediatePoints[3].x == 430 && (diagram.connectors[11] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[4].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[4].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[5].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[5].y == 330).toBe(true);
                expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[12] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[12] as Connector).intermediatePoints[3].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[12] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[13] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[13] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[13] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[13] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[13] as Connector).intermediatePoints[3].x == 630 && (diagram.connectors[13] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[4].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[4].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[5].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[5].y == 75).toBe(true);
                expect((diagram.connectors[14] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[14] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[14] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[14] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[14] as Connector).intermediatePoints[2].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[14] as Connector).intermediatePoints[3].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[4].x == 750 && (diagram.connectors[14] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[15] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[15] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[15] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[15] as Connector).intermediatePoints[1].y == 125).toBe(true);
                done();
            });
        });

        describe('Port to Point', () => {

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramLineRouting76' });
                document.body.appendChild(ele);
                nodes = [
                    {
                        id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 100,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node4', width: 100, offsetX: 300, offsetY: 300,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node6', width: 100, offsetX: 700, offsetY: 100,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node7', width: 100, height: 60, offsetX: 500, offsetY: 300,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                ]

                connectors = [
                    // Left to Right
                    {
                        id: 'Connector1',
                        targetPoint: { x: 300, y: 100 }, type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector11',
                        targetPoint: { x: 300, y: 100 }, type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector12',
                        targetPoint: { x: 300, y: 100 }, type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector13',
                        targetPoint: { x: 300, y: 100 }, type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port4'
                    },


                    // Right to Left
                    {
                        id: 'Connector2',
                        targetPoint: { x: 100, y: 300 }, sourcePortID: 'port1', type: 'Orthogonal',
                        sourceID: 'node4',
                    },
                    {
                        id: 'Connector21',
                        targetPoint: { x: 100, y: 300 }, sourcePortID: 'port2', type: 'Orthogonal',
                        sourceID: 'node4',
                    },
                    {
                        id: 'Connector22',
                        targetPoint: { x: 100, y: 300 }, sourcePortID: 'port3', type: 'Orthogonal',
                        sourceID: 'node4',
                    },
                    {
                        id: 'Connector23',
                        targetPoint: { x: 100, y: 300 }, sourcePortID: 'port4', type: 'Orthogonal',
                        sourceID: 'node4',
                    },

                    // Bootom to top
                    {
                        id: 'Connector3',
                        targetPoint: { x: 500, y: 100 }, type: 'Orthogonal',
                        sourceID: 'node7', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector31',
                        targetPoint: { x: 500, y: 100 }, type: 'Orthogonal',
                        sourceID: 'node7', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector32',
                        targetPoint: { x: 500, y: 100 }, type: 'Orthogonal',
                        sourceID: 'node7', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector33',
                        targetPoint: { x: 500, y: 100 }, type: 'Orthogonal',
                        sourceID: 'node7', sourcePortID: 'port4'
                    },

                    // Top to Bottom
                    {
                        id: 'Connector4',
                        targetPoint: { x: 700, y: 300 }, type: 'Orthogonal',
                        sourceID: 'node6', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector41',
                        targetPoint: { x: 700, y: 300 }, type: 'Orthogonal',
                        sourceID: 'node6', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector42',
                        targetPoint: { x: 700, y: 300 }, type: 'Orthogonal',
                        sourceID: 'node6', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector43',
                        targetPoint: { x: 700, y: 300 }, type: 'Orthogonal',
                        sourceID: 'node6', sourcePortID: 'port4'
                    }
                ]

                diagram = new Diagram({
                    width: 1000, height: 600,
                    connectors: connectors, nodes: nodes,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                });
                diagram.appendTo('#diagramLineRouting76');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Check - Rendering', (done: Function) => {
                console.log('Test case 1219');
                debugger
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 300).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[5] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 230 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[5].x == 100 && (diagram.connectors[6] as Connector).intermediatePoints[5].y == 300).toBe(true);
                expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 450 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 500 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 100).toBe(true);
                expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 550 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[3].x == 500 && (diagram.connectors[10] as Connector).intermediatePoints[3].y == 100).toBe(true);
                expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 330 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[11] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[3].x == 430 && (diagram.connectors[11] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[11] as Connector).intermediatePoints[4].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 650 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[12] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 300).toBe(true);
                expect((diagram.connectors[13] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[13] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[13] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[3].x == 630 && (diagram.connectors[13] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[13] as Connector).intermediatePoints[4].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[14] as Connector).intermediatePoints[0].x == 750 && (diagram.connectors[14] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[1].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[2].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[14] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[14] as Connector).intermediatePoints[3].y == 300).toBe(true);
                expect((diagram.connectors[15] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[15] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[15] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[15] as Connector).intermediatePoints[1].y == 300).toBe(true);
                done();
            });
        });

        describe('Port to Node', () => {

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramLineRouting77' });
                document.body.appendChild(ele);
                nodes = [
                    {
                        id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 100,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node2', width: 100, offsetX: 300, offsetY: 100,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node3', width: 100, height: 60, offsetX: 100, offsetY: 300,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node4', width: 100, offsetX: 300, offsetY: 300,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node5', width: 100, height: 60, offsetX: 500, offsetY: 100,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node6', width: 100, offsetX: 700, offsetY: 100,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node7', width: 100, height: 60, offsetX: 500, offsetY: 300,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node8', width: 100, offsetX: 700, offsetY: 300,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                ];


                connectors = [
                    // Left to Right
                    {
                        id: 'Connector1',
                        targetID: 'node2', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector11',
                        targetID: 'node2', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector12',
                        targetID: 'node2', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector13',
                        targetID: 'node2', type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port4'
                    },


                    // Right to Left
                    {
                        id: 'Connector2',
                        targetID: 'node3', sourcePortID: 'port1', type: 'Orthogonal',
                        sourceID: 'node4',
                    },
                    {
                        id: 'Connector21',
                        targetID: 'node3', sourcePortID: 'port2', type: 'Orthogonal',
                        sourceID: 'node4',
                    },
                    {
                        id: 'Connector22',
                        targetID: 'node3', sourcePortID: 'port3', type: 'Orthogonal',
                        sourceID: 'node4',
                    },
                    {
                        id: 'Connector23',
                        targetID: 'node3', sourcePortID: 'port4', type: 'Orthogonal',
                        sourceID: 'node4',
                    },

                    // Bootom to top
                    {
                        id: 'Connector3',
                        targetID: 'node5', type: 'Orthogonal',
                        sourceID: 'node7', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector31',
                        targetID: 'node5', type: 'Orthogonal',
                        sourceID: 'node7', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector32',
                        targetID: 'node5', type: 'Orthogonal',
                        sourceID: 'node7', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector33',
                        targetID: 'node5', type: 'Orthogonal',
                        sourceID: 'node7', sourcePortID: 'port4'
                    },

                    // Top to Bottom
                    {
                        id: 'Connector4',
                        targetID: 'node8', type: 'Orthogonal',
                        sourceID: 'node6', sourcePortID: 'port1'
                    },
                    {
                        id: 'Connector41',
                        targetID: 'node8', type: 'Orthogonal',
                        sourceID: 'node6', sourcePortID: 'port2'
                    },
                    {
                        id: 'Connector42',
                        targetID: 'node8', type: 'Orthogonal',
                        sourceID: 'node6', sourcePortID: 'port3'
                    },
                    {
                        id: 'Connector43',
                        targetID: 'node8', type: 'Orthogonal',
                        sourceID: 'node6', sourcePortID: 'port4'
                    }];

                diagram = new Diagram({
                    width: 1000, height: 600,
                    connectors: connectors, nodes: nodes,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                });
                diagram.appendTo('#diagramLineRouting77');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Left port ', (done: Function) => {
                console.log('Test case 1220');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 75).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 75).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 125).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 300).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 270).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 270).toBe(true);
                expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 330).toBe(true);
                expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 450 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 450 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 100).toBe(true);
                expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 130).toBe(true);
                expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 550 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[3].x == 550 && (diagram.connectors[10] as Connector).intermediatePoints[3].y == 100).toBe(true);
                expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 330 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[11] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[3].x == 430 && (diagram.connectors[11] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[11] as Connector).intermediatePoints[4].x == 450 && (diagram.connectors[11] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 650 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[12] as Connector).intermediatePoints[3].x == 650 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 300).toBe(true);
                expect((diagram.connectors[13] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[13] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[13] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[3].x == 630 && (diagram.connectors[13] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[13] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[13] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[14] as Connector).intermediatePoints[0].x == 750 && (diagram.connectors[14] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[1].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[2].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[14] as Connector).intermediatePoints[3].x == 750 && (diagram.connectors[14] as Connector).intermediatePoints[3].y == 300).toBe(true);
                expect((diagram.connectors[15] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[15] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[15] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[15] as Connector).intermediatePoints[1].y == 275).toBe(true);

                done();
            });
        });

        describe('Node to Port', () => {

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramLineRouting78' });
                document.body.appendChild(ele);
                nodes = [
                    {
                        id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 100,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node2', width: 100, offsetX: 300, offsetY: 100,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node3', width: 100, height: 60, offsetX: 100, offsetY: 300,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node4', width: 100, offsetX: 300, offsetY: 300,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node5', width: 100, height: 60, offsetX: 500, offsetY: 100,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node6', width: 100, offsetX: 700, offsetY: 100,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node7', width: 100, height: 60, offsetX: 500, offsetY: 300,

                        ports: [
                            { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                            { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                            { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },

                        ]
                    },
                    {
                        id: 'node8', width: 100, offsetX: 700, offsetY: 300,

                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                ];


                connectors = [
                    // Right to Left
                    {
                        id: 'Connector1',
                        sourceID: 'node2', type: 'Orthogonal',
                        targetID: 'node1', targetPortID: 'port1'
                    },
                    {
                        id: 'Connector11',
                        sourceID: 'node2', type: 'Orthogonal',
                        targetID: 'node1', targetPortID: 'port2'
                    },
                    {
                        id: 'Connector12',
                        sourceID: 'node2', type: 'Orthogonal',
                        targetID: 'node1', targetPortID: 'port3'
                    },
                    {
                        id: 'Connector13',
                        sourceID: 'node2', type: 'Orthogonal',
                        targetID: 'node1', targetPortID: 'port4'
                    },

                    // Left to Right

                    {
                        id: 'Connector8',
                        sourceID: 'node3', targetPortID: 'port1', type: 'Orthogonal',
                        targetID: 'node4',
                    },
                    {
                        id: 'Connector81',
                        sourceID: 'node3', targetPortID: 'port2', type: 'Orthogonal',
                        targetID: 'node4',
                    },
                    {
                        id: 'Connector82',
                        sourceID: 'node3', targetPortID: 'port3', type: 'Orthogonal',
                        targetID: 'node4',
                    },
                    {
                        id: 'Connector83',
                        sourceID: 'node3', targetPortID: 'port4', type: 'Orthogonal',
                        targetID: 'node4',
                    },

                    // Top to bootom
                    {
                        id: 'Connector3',
                        sourceID: 'node5', type: 'Orthogonal',
                        targetID: 'node7', targetPortID: 'port1'
                    },
                    {
                        id: 'Connector31',
                        sourceID: 'node5', type: 'Orthogonal',
                        targetID: 'node7', targetPortID: 'port2'
                    },
                    {
                        id: 'Connector32',
                        sourceID: 'node5', type: 'Orthogonal',
                        targetID: 'node7', targetPortID: 'port3'
                    },
                    {
                        id: 'Connector33',
                        sourceID: 'node5', type: 'Orthogonal',
                        targetID: 'node7', targetPortID: 'port4'
                    },

                    // Bottom to top

                    {
                        id: 'Connector4',
                        sourceID: 'node8', type: 'Orthogonal',
                        targetID: 'node6', targetPortID: 'port1'
                    },
                    {
                        id: 'Connector41',
                        sourceID: 'node8', type: 'Orthogonal',
                        targetID: 'node6', targetPortID: 'port2'
                    },
                    {
                        id: 'Connector42',
                        sourceID: 'node8', type: 'Orthogonal',
                        targetID: 'node6', targetPortID: 'port3'
                    },
                    {
                        id: 'Connector43',
                        sourceID: 'node8', type: 'Orthogonal',
                        targetID: 'node6', targetPortID: 'port4'
                    },
                ];

                diagram = new Diagram({
                    width: 1000, height: 600,
                    connectors: connectors, nodes: nodes,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                    getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                });
                diagram.appendTo('#diagramLineRouting78');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Left port ', (done: Function) => {
                console.log('Test case 1221');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 70).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 130).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 300).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[5] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[4].y == 275).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[6] as Connector).intermediatePoints[5].y == 300).toBe(true);
                expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[7] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[4].y == 325).toBe(true);
                expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[4].x == 450 && (diagram.connectors[8] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 270).toBe(true);
                expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[10] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[4].x == 550 && (diagram.connectors[10] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[11] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[11] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[11] as Connector).intermediatePoints[3].x == 430 && (diagram.connectors[11] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[4].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[4].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[5].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[5].y == 330).toBe(true);
                expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[12] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[12] as Connector).intermediatePoints[3].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[12] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[13] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[13] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[13] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[13] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[13] as Connector).intermediatePoints[3].x == 630 && (diagram.connectors[13] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[4].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[4].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[5].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[5].y == 75).toBe(true);
                expect((diagram.connectors[14] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[14] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[14] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[14] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[14] as Connector).intermediatePoints[2].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[14] as Connector).intermediatePoints[3].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[4].x == 750 && (diagram.connectors[14] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[15] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[15] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[15] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[15] as Connector).intermediatePoints[1].y == 125).toBe(true);
                done();
            });
        });
        describe("Surrounding by full of obstackles ", () => {
            describe('Node to Node', () => {

                beforeAll((): void => {
                    ele = createElement('div', { id: 'diagramLineRouting1' });
                    document.body.appendChild(ele);

                    let nodes: NodeModel[] = [
                        {
                            id: 'node1',
                            offsetX: 155,
                            offsetY: 117,
                            width: 90,
                            height: 60,
                            annotations: [
                                {
                                    width: 72,
                                    height: 48,
                                    content: 'Activity1',
                                    style: {
                                        textOverflow: 'Clip',
                                        textWrapping: 'Wrap',
                                        whiteSpace: 'PreserveAll'
                                    }
                                }
                            ],
                            borderWidth: 4,
                            shape: {
                                type: 'Bpmn',
                                shape: 'Activity',
                                activity: {
                                    activity: 'Task',
                                    task: {
                                        type: 'Service'
                                    }
                                }
                            },
                            style: {
                                fill: '#d8ecdc',
                                strokeColor: '#78BE83',
                                strokeWidth: 3,
                                gradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 1,
                                    y2: 1,
                                    stops: [
                                        {
                                            color: 'white',
                                            offset: 30,
                                            opacity: 0.1
                                        },
                                        {
                                            color: '#d8ecdc',
                                            offset: 100,
                                            opacity: 0.1
                                        }
                                    ],
                                    type: 'Linear'
                                }
                            }
                        },
                        {
                            id: 'blk1',
                            offsetX: 56,
                            offsetY: 119,
                            width: 90,
                            height: 60,
                            annotations: [
                                {
                                    width: 72,
                                    height: 48,
                                    content: 'Activity3',
                                    style: {
                                        textOverflow: 'Clip',
                                        textWrapping: 'Wrap',
                                        whiteSpace: 'PreserveAll'
                                    }
                                }
                            ],
                            borderWidth: 4,
                            shape: {
                                type: 'Bpmn',
                                shape: 'Activity',
                                activity: {
                                    activity: 'Task',
                                    task: {
                                        type: 'Service'
                                    }
                                }
                            },
                            style: {
                                fill: '#d8ecdc',
                                strokeColor: '#78BE83',
                                strokeWidth: 3,
                                gradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 1,
                                    y2: 1,
                                    stops: [
                                        {
                                            color: 'white',
                                            offset: 30,
                                            opacity: 0.1
                                        },
                                        {
                                            color: '#d8ecdc',
                                            offset: 100,
                                            opacity: 0.1
                                        }
                                    ],
                                    type: 'Linear'
                                }
                            }
                        },
                        {
                            id: 'blk2',
                            offsetX: 144.5,
                            offsetY: 38,
                            width: 90,
                            height: 60,
                            annotations: [
                                {
                                    width: 72,
                                    height: 48,
                                    content: 'Activity4',
                                    style: {
                                        textOverflow: 'Clip',
                                        textWrapping: 'Wrap',
                                        whiteSpace: 'PreserveAll'
                                    }
                                }
                            ],
                            borderWidth: 4,
                            shape: {
                                type: 'Bpmn',
                                shape: 'Activity',
                                activity: {
                                    activity: 'Task',
                                    task: {
                                        type: 'Service'
                                    }
                                }
                            },
                            style: {
                                fill: '#d8ecdc',
                                strokeColor: '#78BE83',
                                strokeWidth: 3,
                                gradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 1,
                                    y2: 1,
                                    stops: [
                                        {
                                            color: 'white',
                                            offset: 30,
                                            opacity: 0.1
                                        },
                                        {
                                            color: '#d8ecdc',
                                            offset: 100,
                                            opacity: 0.1
                                        }
                                    ],
                                    type: 'Linear'
                                }
                            }
                        },
                        {
                            id: 'blk3',
                            offsetX: 157,
                            offsetY: 195,
                            width: 90,
                            height: 60,
                            annotations: [
                                {
                                    width: 72,
                                    height: 48,
                                    content: 'Activity4',
                                    style: {
                                        textOverflow: 'Clip',
                                        textWrapping: 'Wrap',
                                        whiteSpace: 'PreserveAll'
                                    }
                                }
                            ],
                            borderWidth: 4,
                            shape: {
                                type: 'Bpmn',
                                shape: 'Activity',
                                activity: {
                                    activity: 'Task',
                                    task: {
                                        type: 'Service'
                                    }
                                }
                            },
                            style: {
                                fill: '#d8ecdc',
                                strokeColor: '#78BE83',
                                strokeWidth: 3,
                                gradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 1,
                                    y2: 1,
                                    stops: [
                                        {
                                            color: 'white',
                                            offset: 30,
                                            opacity: 0.1
                                        },
                                        {
                                            color: '#d8ecdc',
                                            offset: 100,
                                            opacity: 0.1
                                        }
                                    ],
                                    type: 'Linear'
                                }
                            }
                        },
                        {
                            id: 'blk4',
                            offsetX: 261,
                            offsetY: 136,
                            width: 90,
                            height: 60,
                            annotations: [
                                {
                                    width: 72,
                                    height: 48,
                                    content: 'Activity3',
                                    style: {
                                        textOverflow: 'Clip',
                                        textWrapping: 'Wrap',
                                        whiteSpace: 'PreserveAll'
                                    }
                                }
                            ],
                            borderWidth: 4,
                            shape: {
                                type: 'Bpmn',
                                shape: 'Activity',
                                activity: {
                                    activity: 'Task',
                                    task: {
                                        type: 'Service'
                                    }
                                }
                            },
                            style: {
                                fill: '#d8ecdc',
                                strokeColor: '#78BE83',
                                strokeWidth: 3,
                                gradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 1,
                                    y2: 1,
                                    stops: [
                                        {
                                            color: 'white',
                                            offset: 30,
                                            opacity: 0.1
                                        },
                                        {
                                            color: '#d8ecdc',
                                            offset: 100,
                                            opacity: 0.1
                                        }
                                    ],
                                    type: 'Linear'
                                }
                            }
                        },
                        {
                            id: 'node3',
                            offsetX: 480,
                            offsetY: 218,
                            width: 90,
                            height: 60,
                            annotations: [
                                {
                                    width: 72,
                                    height: 48,
                                    content: 'Activity3',
                                    style: {
                                        textOverflow: 'Clip',
                                        textWrapping: 'Wrap',
                                        whiteSpace: 'PreserveAll'
                                    }
                                }
                            ],
                            borderWidth: 4,
                            shape: {
                                type: 'Bpmn',
                                shape: 'Activity',
                                activity: {
                                    activity: 'Task',
                                    task: {
                                        type: 'Service'
                                    }
                                }
                            },
                            style: {
                                fill: '#d8ecdc',
                                strokeColor: '#78BE83',
                                strokeWidth: 3,
                                gradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 1,
                                    y2: 1,
                                    stops: [
                                        {
                                            color: 'white',
                                            offset: 30,
                                            opacity: 0.1
                                        },
                                        {
                                            color: '#d8ecdc',
                                            offset: 100,
                                            opacity: 0.1
                                        }
                                    ],
                                    type: 'Linear'
                                }
                            }
                        },
                    ];
                    let connectors: ConnectorModel[] = [

                        {
                            id: 'Connector3',
                            sourceID: 'node1',
                            targetID: 'node3',
                            style: {
                                strokeColor: '#888888',
                                fill: '#555555',
                                strokeWidth: 1
                            },
                            targetDecorator: {
                                style: {
                                    fill: '#555555',
                                    strokeColor: '#888888'
                                }
                            },
                            type: 'Orthogonal',
                            cornerRadius: 10
                        },
                    ];

                    diagram = new Diagram({
                        width: 1000, height: 600,
                        connectors: connectors, nodes: nodes,
                        constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                        getConnectorDefaults: function (connector: ConnectorModel) {
                            connector.type = 'Orthogonal';
                        }
                    });
                    diagram.appendTo('#diagramLineRouting1');
                });

                afterAll((): void => {
                    diagram.destroy();
                    ele.remove();
                });

                it('Source node - surrounded by full of obstacles ', (done: Function) => {
                    console.log('Test case 11451111111');
                    console.log("line routing test case ssss");
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 117 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 321 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 117 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 321 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 218 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 435 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 218).toBe(true);
                    done();
                });
                it('Target node - surrounded by full of obstacles ', (done: Function) => {
                    diagram.connectors[0].sourceID = 'node3';
                    diagram.connectors[0].targetID = 'node1';
                    diagram.dataBind();
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 435 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 218 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 421 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 218 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 421 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 117 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 117).toBe(true);
                    done();
                });
            });
        });
    });
    describe('Property change', () => {
        describe('Node property change', () => {

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramLineRouting79' });
                document.body.appendChild(ele);
                nodes = [
                    {
                        id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 100,
                    },
                    {
                        id: 'node2', width: 100, offsetX: 300, offsetY: 100,
                    },
                    {
                        id: 'node3', width: 100, offsetX: 500, offsetY: 250,
                    },
                    {
                        id: 'node8', width: 100, offsetX: 700, offsetY: 300,
                    },
                ]


                connectors = [
                    // Right to Left
                    {
                        id: 'Connector1',
                        sourceID: 'node2', type: 'Orthogonal',
                        targetID: 'node8',
                    }
                ];

                diagram = new Diagram({
                    width: 1000, height: 600,
                    connectors: connectors, nodes: nodes,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                    getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                });
                diagram.appendTo('#diagramLineRouting79');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Node Position change', (done: Function) => {
                console.log('Test case 1222');
                debugger
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 300).toBe(true);
                diagram.nodes[1].offsetX = 500;
                diagram.nodes[1].offsetY = 150;
                diagram.dataBind();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 175 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 210 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 210 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);

                diagram.undo();
                done();
            });
            it('Add New node, it overlap to connector', (done: Function) => {
                console.log('Test case 1223');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 300).toBe(true);
                let newnode: NodeModel = {
                    offsetX: 300, offsetY: 250, width: 100, height: 100,
                    shape: { type: "Basic", shape: "Triangle" }
                } as NodeModel;
                diagram.add(newnode);
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
                done();
            });
        });
        describe('Connector property change', () => {
            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramLineRouting80' });
                document.body.appendChild(ele);
                nodes = [
                    {
                        id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 100,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node2', width: 100, offsetX: 300, offsetY: 100, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node3', width: 100, offsetX: 500, offsetY: 250, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                    {
                        id: 'node8', width: 100, offsetX: 700, offsetY: 300, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                        ]
                    },
                ]


                connectors = [
                    // Right to Left
                    {
                        id: 'Connector1',
                        sourceID: 'node2', type: 'Orthogonal',
                        targetID: 'node8',
                    }
                ];

                diagram = new Diagram({
                    width: 1000, height: 600,
                    connectors: connectors, nodes: nodes,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                    getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                });
                diagram.appendTo('#diagramLineRouting80');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Connection change from source node to another source node', (done: Function) => {
                console.log('Test case 1224');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
                diagram.connectors[0].sourceID = 'node1';
                diagram.dataBind();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
                done();
            });
            it('Connection change from source node to another source node with port', (done: Function) => {
                console.log('Test case 1225');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
                diagram.connectors[0].sourceID = 'node2';
                diagram.connectors[0].sourcePortID = 'port1';
                diagram.dataBind();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300).toBe(true);
                done();
            });
            // same port id have old source Node and also new source node
            it('Connection change from source node to another source node connect with another port', (done: Function) => {
                console.log('Test case 1226');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300).toBe(true);
                diagram.connectors[0].sourceID = 'node3';
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 450 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 430 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 310 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 310 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300).toBe(true);
                done();
            });

            it('Connection change from source port to another source node', (done: Function) => {
                console.log('Test case 1227');
                diagram.connectors[0].sourcePortID = '';
                diagram.dataBind();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 550 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 275).toBe(true);
                done();
            });
            // Check the target point
            it('Connection change from source node to point', (done: Function) => {
                console.log('Test case 1228');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 550 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 275).toBe(true);
                diagram.connectors[0].sourceID = '';
                diagram.connectors[0].sourcePoint = { x: 200, y: 150 };
                diagram.dataBind();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
                done();
            });
            it('Connection change from source point to port', (done: Function) => {
                console.log('Test case 1229');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
                diagram.connectors[0].sourceID = 'node1';
                diagram.connectors[0].sourcePortID = 'port2';
                diagram.dataBind();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 300).toBe(true);
                done();
            });
            it('Connection change from source port to point', (done: Function) => {
                console.log('Test case 1230');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 300).toBe(true);
                diagram.connectors[0].sourceID = '';
                diagram.connectors[0].sourcePortID = '';
                diagram.connectors[0].sourcePoint = { x: 200, y: 150 };
                diagram.dataBind();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
                done();
            });
            it('Connection change from target node to point', (done: Function) => {
                console.log('Test case 1231');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
                diagram.connectors[0].targetID = '';
                diagram.connectors[0].targetPoint = { x: 600, y: 250 };
                diagram.dataBind();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 600 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 250).toBe(true);
                done();
            });
            // check the case - connection
            it('Connection change from target point to port', (done: Function) => {
                console.log('Test case 1232');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 600 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 250).toBe(true);
                diagram.connectors[0].targetID = 'node3';
                diagram.connectors[0].targetPortID = 'port4';
                diagram.dataBind();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 430 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 310 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 500 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 310 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 500 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 275).toBe(true);
                done();
            });
            it('Connection change from target port to point', (done: Function) => {
                console.log('Test case 1233');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 430 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 310 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 500 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 310 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 500 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 275).toBe(true);
                diagram.connectors[0].targetID = '';
                diagram.connectors[0].targetPortID = '';
                diagram.connectors[0].targetPoint = { x: 600, y: 250 };
                diagram.dataBind();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 600 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 250).toBe(true);
                done();
            });
            it('Connection change from target point to node', (done: Function) => {
                console.log('Test case 1234');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 600 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 250).toBe(true);
                diagram.connectors[0].targetID = 'node8';
                diagram.dataBind();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
                done();
                console.log("line routing test case end");
            });

        });
        describe('Enable and Disable Line Routing Constraints', () => {

            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramLineRouting79' });
                document.body.appendChild(ele);
                nodes = [
                    {
                        id: 'node0',
                        offsetX: 100,
                        offsetY: 100,
                        width: 30,
                        height: 30,
                        annotations: [{
                            content: 'Start',
                            margin: { bottom: -30 }
                        }],
                        shape: {
                            type: 'Bpmn',
                            shape: 'Event',
                            event: {
                                event: 'Start',
                                trigger: 'None'
                            }
                        },
                        style: {
                            strokeColor: '#62A716',
                            strokeWidth: 1
                        }
                    },
                    {
                        id: 'node1',
                        offsetX: 250,
                        offsetY: 250,
                        width: 90,
                        height: 60,
                        annotations: [
                            {
                                width: 72,
                                height: 48,
                                content: 'Activity1',
                                style: {
                                    textOverflow: 'Clip',
                                    textWrapping: 'Wrap',
                                    whiteSpace: 'PreserveAll'
                                }
                            }
                        ],
                        borderWidth: 4,
                        shape: {
                            type: 'Bpmn',
                            shape: 'Activity',
                            activity: {
                                activity: 'Task',
                                task: {
                                    type: 'Service'
                                }
                            }
                        },
                        style: {
                            fill: '#d8ecdc',
                            strokeColor: '#78BE83',
                            strokeWidth: 3,
                            gradient: {
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 1,
                                stops: [
                                    {
                                        color: 'white',
                                        offset: 30,
                                        opacity: 0.1
                                    },
                                    {
                                        color: '#d8ecdc',
                                        offset: 100,
                                        opacity: 0.1
                                    }
                                ],
                                type: 'Linear'
                            }
                        }
                    },
                    {
                        id: 'node2',
                        offsetX: 250,
                        offsetY: 500,
                        width: 90,
                        height: 60,
                        borderWidth: 4,
                        shape: {
                            type: 'Flow',
                            shape: 'Annotation',
                        },
                        annotations: [
                            {
                                content: "Sample Text",
                                style: {
                                    textOverflow: 'Ellipsis',
                                    textWrapping: 'NoWrap',
                                    whiteSpace: 'CollapseAll'
                                },
                                height: 50,
                                width: 80,
                                margin: { left: 0, top: 0, right: 0, bottom: 0 }
                            }
                        ],
                        style: {
                            strokeColor: '#778899',
                            strokeWidth: 3
                        }
                    },
                    {
                        id: 'node3',
                        offsetX: 480,
                        offsetY: 218,
                        width: 90,
                        height: 60,
                        annotations: [
                            {
                                width: 72,
                                height: 48,
                                content: 'Activity3',
                                style: {
                                    textOverflow: 'Clip',
                                    textWrapping: 'Wrap',
                                    whiteSpace: 'PreserveAll'
                                }
                            }
                        ],
                        borderWidth: 4,
                        shape: {
                            type: 'Bpmn',
                            shape: 'Activity',
                            activity: {
                                activity: 'Task',
                                task: {
                                    type: 'Service'
                                }
                            }
                        },
                        style: {
                            fill: '#d8ecdc',
                            strokeColor: '#78BE83',
                            strokeWidth: 3,
                            gradient: {
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 1,
                                stops: [
                                    {
                                        color: 'white',
                                        offset: 30,
                                        opacity: 0.1
                                    },
                                    {
                                        color: '#d8ecdc',
                                        offset: 100,
                                        opacity: 0.1
                                    }
                                ],
                                type: 'Linear'
                            }
                        }
                    },
                    {
                        id: 'node4',
                        offsetX: 700,
                        offsetY: 195,
                        width: 90,
                        height: 60,
                        annotations: [
                            {
                                width: 72,
                                height: 48,
                                content: 'Activity4',
                                style: {
                                    textOverflow: 'Clip',
                                    textWrapping: 'Wrap',
                                    whiteSpace: 'PreserveAll'
                                }
                            }
                        ],
                        borderWidth: 4,
                        shape: {
                            type: 'Bpmn',
                            shape: 'Activity',
                            activity: {
                                activity: 'Task',
                                task: {
                                    type: 'Service'
                                }
                            }
                        },
                        style: {
                            fill: '#d8ecdc',
                            strokeColor: '#78BE83',
                            strokeWidth: 3,
                            gradient: {
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 1,
                                stops: [
                                    {
                                        color: 'white',
                                        offset: 30,
                                        opacity: 0.1
                                    },
                                    {
                                        color: '#d8ecdc',
                                        offset: 100,
                                        opacity: 0.1
                                    }
                                ],
                                type: 'Linear'
                            }
                        }
                    },
                    {
                        id: 'node5',
                        offsetX: 678,
                        offsetY: 502,
                        width: 90,
                        height: 60,
                        annotations: [
                            {
                                width: 72,
                                height: 48,
                                content: 'Activity4',
                                style: {
                                    textOverflow: 'Clip',
                                    textWrapping: 'Wrap',
                                    whiteSpace: 'PreserveAll'
                                }
                            }
                        ],
                        borderWidth: 4,
                        shape: {
                            type: 'Bpmn',
                            shape: 'Activity',
                            activity: {
                                activity: 'Task',
                                task: {
                                    type: 'Service'
                                }
                            }
                        },
                        style: {
                            fill: '#d8ecdc',
                            strokeColor: '#78BE83',
                            strokeWidth: 3,
                            gradient: {
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 1,
                                stops: [
                                    {
                                        color: 'white',
                                        offset: 30,
                                        opacity: 0.1
                                    },
                                    {
                                        color: '#d8ecdc',
                                        offset: 100,
                                        opacity: 0.1
                                    }
                                ],
                                type: 'Linear'
                            }
                        }
                    },
                    {
                        id: 'node6',
                        offsetX: 480,
                        offsetY: 62,
                        width: 90,
                        height: 60,
                        annotations: [
                            {
                                width: 72,
                                height: 48,
                                content: 'Activity3',
                                style: {
                                    textOverflow: 'Clip',
                                    textWrapping: 'Wrap',
                                    whiteSpace: 'PreserveAll'
                                }
                            }
                        ],
                        borderWidth: 4,
                        shape: {
                            type: 'Bpmn',
                            shape: 'Activity',
                            activity: {
                                activity: 'Task',
                                task: {
                                    type: 'Service'
                                }
                            }
                        },
                        style: {
                            fill: '#d8ecdc',
                            strokeColor: '#78BE83',
                            strokeWidth: 3,
                            gradient: {
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 1,
                                stops: [
                                    {
                                        color: 'white',
                                        offset: 30,
                                        opacity: 0.1
                                    },
                                    {
                                        color: '#d8ecdc',
                                        offset: 100,
                                        opacity: 0.1
                                    }
                                ],
                                type: 'Linear'
                            }
                        }
                    },
                ];

                connectors = [
                    {
                        id: 'Connector1',
                        sourceID: 'node0',
                        targetID: 'node1',
                        style: {
                            strokeColor: '#888888',
                            fill: '#555555',
                            strokeWidth: 1
                        },
                        targetDecorator: {
                            style: {
                                fill: '#555555',
                                strokeColor: '#888888'
                            }
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                    {
                        id: 'Connector2',
                        sourceID: 'node1',
                        targetID: 'node2',
                        style: {
                            strokeDashArray: '2,2'
                        },
                        targetDecorator: {
                            shape: 'None'
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                    {
                        id: 'Connector3',
                        sourceID: 'node1',
                        targetID: 'node3',
                        style: {
                            strokeColor: '#888888',
                            fill: '#555555',
                            strokeWidth: 1
                        },
                        targetDecorator: {
                            style: {
                                fill: '#555555',
                                strokeColor: '#888888'
                            }
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                    {
                        id: 'Connector4',
                        sourceID: 'node3',
                        targetID: 'node4',
                        style: {
                            strokeColor: '#888888',
                            fill: '#555555',
                            strokeWidth: 1
                        },
                        targetDecorator: {
                            style: {
                                fill: '#555555',
                                strokeColor: '#888888'
                            }
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                    {
                        id: 'Connector5',
                        sourceID: 'node4',
                        targetID: 'node5',
                        style: {
                            strokeColor: '#888888',
                            fill: '#555555',
                            strokeWidth: 1
                        },
                        targetDecorator: {
                            style: {
                                fill: '#555555',
                                strokeColor: '#888888'
                            }
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                    {
                        id: 'Connector6',
                        sourceID: 'node5',
                        targetID: 'node6',
                        style: {
                            strokeColor: '#888888',
                            fill: '#555555',
                            strokeWidth: 1
                        },
                        targetDecorator: {
                            style: {
                                fill: '#555555',
                                strokeColor: '#888888'
                            }
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                ];

                diagram = new Diagram({
                    width: 1000, height: 600,
                    connectors: connectors, nodes: nodes,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                    getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                });
                diagram.appendTo('#diagramLineRouting79');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Disable Line Routing Constraints', (done: Function) => {
                diagram.constraints = DiagramConstraints.Default & ~DiagramConstraints.LineRouting;
                diagram.dataBind();
                diagram.resetSegments();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 115 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 135 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 135 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 220).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 280 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 470).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 295 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 250 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 315 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 315 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 218 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 435 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 218).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 525 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 218 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 545 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 218 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 545 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 195 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 655 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 195).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 225 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 245 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 678 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 245 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 678 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 472).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 678 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 472 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 678 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 452 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 480 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 452 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 480 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 92).toBe(true);
                done();
            });
            it('Enable Line Routing Constraints', (done: Function) => {
                diagram.constraints = DiagramConstraints.Default | DiagramConstraints.LineRouting;
                diagram.dataBind();
                diagram.resetSegments();
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 115 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 280 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 470).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 295 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 250 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 310 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 310 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 218 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 435 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 218).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 525 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 218 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 550 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 218 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 550 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 195 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 655 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 195).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 225 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 450 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 678 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 450 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 678 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 472).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 633 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 502 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 610 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 502 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 610 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 62 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 525 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 62).toBe(true);
                done();
            });
        });
    });
    describe('Interaction', () => {
        describe('Drag and drop', () => {
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramLineRouting79' });
                document.body.appendChild(ele);
                nodes = [
                    {
                        id: 'node0',
                        offsetX: 100,
                        offsetY: 100,
                        width: 30,
                        height: 30,
                        annotations: [{
                            content: 'Start',
                            margin: { bottom: -30 }
                        }],
                        shape: {
                            type: 'Bpmn',
                            shape: 'Event',
                            event: {
                                event: 'Start',
                                trigger: 'None'
                            }
                        },
                        style: {
                            strokeColor: '#62A716',
                            strokeWidth: 1
                        }
                    },
                    {
                        id: 'node1',
                        offsetX: 250,
                        offsetY: 250,
                        width: 90,
                        height: 60,
                        annotations: [
                            {
                                width: 72,
                                height: 48,
                                content: 'Activity1',
                                style: {
                                    textOverflow: 'Clip',
                                    textWrapping: 'Wrap',
                                    whiteSpace: 'PreserveAll'
                                }
                            }
                        ],
                        borderWidth: 4,
                        shape: {
                            type: 'Bpmn',
                            shape: 'Activity',
                            activity: {
                                activity: 'Task',
                                task: {
                                    type: 'Service'
                                }
                            }
                        },
                        style: {
                            fill: '#d8ecdc',
                            strokeColor: '#78BE83',
                            strokeWidth: 3,
                            gradient: {
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 1,
                                stops: [
                                    {
                                        color: 'white',
                                        offset: 30,
                                        opacity: 0.1
                                    },
                                    {
                                        color: '#d8ecdc',
                                        offset: 100,
                                        opacity: 0.1
                                    }
                                ],
                                type: 'Linear'
                            }
                        }
                    },
                    {
                        id: 'node2',
                        offsetX: 250,
                        offsetY: 500,
                        width: 90,
                        height: 60,
                        borderWidth: 4,
                        shape: {
                            type: 'Flow',
                            shape: 'Annotation',
                        },
                        annotations: [
                            {
                                content: "Sample Text",
                                style: {
                                    textOverflow: 'Ellipsis',
                                    textWrapping: 'NoWrap',
                                    whiteSpace: 'CollapseAll'
                                },
                                height: 50,
                                width: 80,
                                margin: { left: 0, top: 0, right: 0, bottom: 0 }
                            }
                        ],
                        style: {
                            strokeColor: '#778899',
                            strokeWidth: 3
                        }
                    },
                    {
                        id: 'node3',
                        offsetX: 480,
                        offsetY: 218,
                        width: 90,
                        height: 60,
                        annotations: [
                            {
                                width: 72,
                                height: 48,
                                content: 'Activity3',
                                style: {
                                    textOverflow: 'Clip',
                                    textWrapping: 'Wrap',
                                    whiteSpace: 'PreserveAll'
                                }
                            }
                        ],
                        borderWidth: 4,
                        shape: {
                            type: 'Bpmn',
                            shape: 'Activity',
                            activity: {
                                activity: 'Task',
                                task: {
                                    type: 'Service'
                                }
                            }
                        },
                        style: {
                            fill: '#d8ecdc',
                            strokeColor: '#78BE83',
                            strokeWidth: 3,
                            gradient: {
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 1,
                                stops: [
                                    {
                                        color: 'white',
                                        offset: 30,
                                        opacity: 0.1
                                    },
                                    {
                                        color: '#d8ecdc',
                                        offset: 100,
                                        opacity: 0.1
                                    }
                                ],
                                type: 'Linear'
                            }
                        }
                    },
                    {
                        id: 'node4',
                        offsetX: 700,
                        offsetY: 195,
                        width: 90,
                        height: 60,
                        annotations: [
                            {
                                width: 72,
                                height: 48,
                                content: 'Activity4',
                                style: {
                                    textOverflow: 'Clip',
                                    textWrapping: 'Wrap',
                                    whiteSpace: 'PreserveAll'
                                }
                            }
                        ],
                        borderWidth: 4,
                        shape: {
                            type: 'Bpmn',
                            shape: 'Activity',
                            activity: {
                                activity: 'Task',
                                task: {
                                    type: 'Service'
                                }
                            }
                        },
                        style: {
                            fill: '#d8ecdc',
                            strokeColor: '#78BE83',
                            strokeWidth: 3,
                            gradient: {
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 1,
                                stops: [
                                    {
                                        color: 'white',
                                        offset: 30,
                                        opacity: 0.1
                                    },
                                    {
                                        color: '#d8ecdc',
                                        offset: 100,
                                        opacity: 0.1
                                    }
                                ],
                                type: 'Linear'
                            }
                        }
                    },
                    {
                        id: 'node5',
                        offsetX: 678,
                        offsetY: 502,
                        width: 90,
                        height: 60,
                        annotations: [
                            {
                                width: 72,
                                height: 48,
                                content: 'Activity4',
                                style: {
                                    textOverflow: 'Clip',
                                    textWrapping: 'Wrap',
                                    whiteSpace: 'PreserveAll'
                                }
                            }
                        ],
                        borderWidth: 4,
                        shape: {
                            type: 'Bpmn',
                            shape: 'Activity',
                            activity: {
                                activity: 'Task',
                                task: {
                                    type: 'Service'
                                }
                            }
                        },
                        style: {
                            fill: '#d8ecdc',
                            strokeColor: '#78BE83',
                            strokeWidth: 3,
                            gradient: {
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 1,
                                stops: [
                                    {
                                        color: 'white',
                                        offset: 30,
                                        opacity: 0.1
                                    },
                                    {
                                        color: '#d8ecdc',
                                        offset: 100,
                                        opacity: 0.1
                                    }
                                ],
                                type: 'Linear'
                            }
                        }
                    },
                    {
                        id: 'node6',
                        offsetX: 480,
                        offsetY: 62,
                        width: 90,
                        height: 60,
                        annotations: [
                            {
                                width: 72,
                                height: 48,
                                content: 'Activity3',
                                style: {
                                    textOverflow: 'Clip',
                                    textWrapping: 'Wrap',
                                    whiteSpace: 'PreserveAll'
                                }
                            }
                        ],
                        borderWidth: 4,
                        shape: {
                            type: 'Bpmn',
                            shape: 'Activity',
                            activity: {
                                activity: 'Task',
                                task: {
                                    type: 'Service'
                                }
                            }
                        },
                        style: {
                            fill: '#d8ecdc',
                            strokeColor: '#78BE83',
                            strokeWidth: 3,
                            gradient: {
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 1,
                                stops: [
                                    {
                                        color: 'white',
                                        offset: 30,
                                        opacity: 0.1
                                    },
                                    {
                                        color: '#d8ecdc',
                                        offset: 100,
                                        opacity: 0.1
                                    }
                                ],
                                type: 'Linear'
                            }
                        }
                    },
                ];


                connectors = [
                    {
                        id: 'Connector1',
                        sourceID: 'node0',
                        targetID: 'node1',
                        style: {
                            strokeColor: '#888888',
                            fill: '#555555',
                            strokeWidth: 1
                        },
                        targetDecorator: {
                            style: {
                                fill: '#555555',
                                strokeColor: '#888888'
                            }
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                    {
                        id: 'Connector2',
                        sourceID: 'node1',
                        targetID: 'node2',
                        style: {
                            strokeDashArray: '2,2'
                        },
                        targetDecorator: {
                            shape: 'None'
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                    {
                        id: 'Connector3',
                        sourceID: 'node1',
                        targetID: 'node3',
                        style: {
                            strokeColor: '#888888',
                            fill: '#555555',
                            strokeWidth: 1
                        },
                        targetDecorator: {
                            style: {
                                fill: '#555555',
                                strokeColor: '#888888'
                            }
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                    {
                        id: 'Connector4',
                        sourceID: 'node3',
                        targetID: 'node4',
                        style: {
                            strokeColor: '#888888',
                            fill: '#555555',
                            strokeWidth: 1
                        },
                        targetDecorator: {
                            style: {
                                fill: '#555555',
                                strokeColor: '#888888'
                            }
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                    {
                        id: 'Connector5',
                        sourceID: 'node4',
                        targetID: 'node5',
                        style: {
                            strokeColor: '#888888',
                            fill: '#555555',
                            strokeWidth: 1
                        },
                        targetDecorator: {
                            style: {
                                fill: '#555555',
                                strokeColor: '#888888'
                            }
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                    {
                        id: 'Connector6',
                        sourceID: 'node5',
                        targetID: 'node6',
                        style: {
                            strokeColor: '#888888',
                            fill: '#555555',
                            strokeWidth: 1
                        },
                        targetDecorator: {
                            style: {
                                fill: '#555555',
                                strokeColor: '#888888'
                            }
                        },
                        type: 'Orthogonal',
                        cornerRadius: 10
                    },
                ];

                diagram = new Diagram({
                    width: 1000, height: 600,
                    connectors: connectors, nodes: nodes,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                    getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
                });
                diagram.appendTo('#diagramLineRouting79');
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Single Selection', (done: Function) => {
                console.log('Test case 1235');
                debugger
                let node = diagram.nodes[6];
                mouseEvents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, 90 + diagram.element.offsetLeft, 190 + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 115 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 250).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 633 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 502 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 610 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 502 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 610 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 270 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 410 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 270 && (diagram.connectors[5] as Connector).intermediatePoints[4].x == 410 && (diagram.connectors[5] as Connector).intermediatePoints[4].y == 198 && (diagram.connectors[5] as Connector).intermediatePoints[5].x == 140 && (diagram.connectors[5] as Connector).intermediatePoints[5].y == 198).toBe(true);
                done();
            });
            it('Multiple selection', (done: Function) => {
                console.log('Test case 1236');
                let node = diagram.nodes[1]; let node2 = diagram.nodes[3];
                mouseEvents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY + diagram.element.offsetTop);
                mouseEvents.clickEvent(diagramCanvas, node2.offsetX + diagram.element.offsetLeft, node2.offsetY + diagram.element.offsetTop, true);
                mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, 540 + diagram.element.offsetLeft, 340 + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 350 + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 350 + diagram.element.offsetTop);
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 115 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 342 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 500 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 342).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 342 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 490 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 342 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 490 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 500 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 295 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 500).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 590 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 342 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 775 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 342 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 775 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 340).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 730 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 310 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 710 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 310 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 710 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == 700 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 225).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 225 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 450 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 678 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 450 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 678 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 472).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 633 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 502 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 610 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 502 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 610 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 198 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 140 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 198).toBe(true);
                done();
            });
            it('Connector Source point dragging', (done: Function) => {
                console.log('Test case 1237');
                let connector = diagram.connectors[1];
                mouseEvents.clickEvent(diagramCanvas, connector.targetPoint.x + diagram.element.offsetLeft, connector.targetPoint.y + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, connector.targetPoint.x + diagram.element.offsetLeft, connector.targetPoint.y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, 60 + diagram.element.offsetLeft, 80 + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, 50 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, 50 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 342 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 490 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 342 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 490 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 80 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 60 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 80 && (diagram.connectors[1] as Connector).intermediatePoints[4].x == 60 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 100).toBe(true);
                done();
            });

            it('Connector dragging', (done: Function) => {
                console.log('Test case 1238');
                let connector = diagram.connectors[1];
                let points = (connector as Connector).intermediatePoints;
                let centerX = (points[2].x + points[3].x) / 2; let centerY = points[2].y;
                mouseEvents.clickEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft, 80 + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft, 100 + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, centerX + diagram.element.offsetLeft, 100 + diagram.element.offsetTop);
                done();
            });
        });
    });
    describe('Routing Issue', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramLineRoutingIssue80' });
            document.body.appendChild(ele);
            let portCollection = [
                { id: "left", offset: { x: 0, y: 0.5 } },
                { id: 'top', offset: { x: 0.5, y: 0 } },
                { id: 'right', offset: { x: 1, y: 0.5 } },
                { id: "bottom", offset: { x: 0.5, y: 1 } }];

            let nodes: NodeModel[] = [{
                id: 'node0', width: 30, height: 30, offsetX: 40, offsetY: 174.408, ports: portCollection,
                shape: { type: "Bpmn", shape: "Event" },
                annotations: [{
                    id: 'label1', content: 'Start', offset: { x: 0.5, y: 1 }, margin: { top: 2 }, verticalAlignment: "Top"
                }],
                style: { fill: "#FFFFFF", strokeColor: "#62A716", strokeWidth: 2 }
            },
            {
                id: 'node1', width: 90, height: 60, offsetX: 40.5, offsetY: 89, ports: portCollection,
                shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
                annotations: [{
                    id: 'label2', content: 'Document Review', margin: { top: 10, right: 2, bottom: 3, left: 2 }
                }],
                style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
            },
            {
                id: 'node2', width: 90, height: 60, offsetX: 472, offsetY: 317.5, ports: portCollection,
                shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'Service' } } },
                annotations: [{
                    id: 'label3', content: 'Extraction', margin: { top: 10, right: 2, bottom: 3, left: 2 }
                }],
                style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
            },
            {
                id: 'node3', width: 90, height: 60, offsetX: 39, offsetY: 363.944444444444, ports: portCollection,
                shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'Service' } } },
                annotations: [{
                    id: 'label3', content: 'Classification', margin: { top: 10, right: 2, bottom: 3, left: 2 }
                }],
                style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
            },
            {
                id: 'node4', width: 90, height: 60, offsetX: 715, offsetY: 42.5, ports: portCollection,
                shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
                annotations: [{
                    id: 'label2', content: 'Validation Round 1', margin: { top: 10, right: 2, bottom: 3, left: 2 }
                }],
                style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
            },
            {
                id: 'node5', width: 90, height: 60, offsetX: 694.5, offsetY: 247, ports: portCollection,
                shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
                annotations: [{
                    id: 'label2', content: 'Validation Round 2', margin: { top: 10, right: 2, bottom: 3, left: 2 }
                }],
                style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
            },
            {
                id: 'node6', width: 90, height: 60, offsetX: 829.5, offsetY: 247, ports: portCollection,
                shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
                annotations: [{
                    id: 'label2', content: 'Validation Round 3', margin: { top: 10, right: 2, bottom: 3, left: 2 }
                }],
                style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
            },
            {
                id: 'node7', width: 90, height: 60, offsetX: 964.5, offsetY: 247, ports: portCollection,
                shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
                annotations: [{
                    id: 'label2', content: 'Verification', margin: { top: 10, right: 2, bottom: 3, left: 2 }
                }],
                style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
            },
            {
                id: 'node8', width: 60, height: 60, offsetX: 63, offsetY: 421, ports: portCollection,
                shape: { type: "Bpmn", shape: "Gateway", },
                annotations: [{
                    id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
                }],
                style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
            },
            {
                id: 'node9', width: 90, height: 60, offsetX: 720, offsetY: 776, ports: portCollection,
                shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'User' } } },
                annotations: [{
                    id: 'label2', content: 'Rescan', margin: { top: 10, right: 2, bottom: 3, left: 2 }
                }],
                style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
            },
            {
                id: 'node11', width: 60, height: 60, offsetX: 306, offsetY: 436.5, ports: portCollection,
                shape: { type: "Bpmn", shape: "Gateway", },
                annotations: [{
                    id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
                }],
                style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
            },
            {
                id: 'node12', width: 60, height: 60, offsetX: 590, offsetY: 175.5, ports: portCollection,
                shape: { type: "Bpmn", shape: "Gateway", },
                annotations: [{
                    id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
                }],
                style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
            },
            {
                id: 'node13', width: 60, height: 60, offsetX: 837, offsetY: 52.7066858410835, ports: portCollection,
                shape: { type: "Bpmn", shape: "Gateway", },
                annotations: [{
                    id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
                }],
                style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
            },
            {
                id: 'node17', width: 60, height: 60, offsetX: 1121, offsetY: 273.706685841084, ports: portCollection,
                shape: { type: "Bpmn", shape: "Gateway", },
                annotations: [{
                    id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
                }],
                style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
            },
            {
                id: 'node19', width: 60, height: 60, offsetX: 1242, offsetY: 198.706685841084, ports: portCollection,
                shape: { type: "Bpmn", shape: "Gateway", },
                annotations: [{
                    id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
                }],
                style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
            },
            {
                id: 'node21', width: 60, height: 60, offsetX: 1280, offsetY: 417.706685841084, ports: portCollection,
                shape: { type: "Bpmn", shape: "Gateway", },
                annotations: [{
                    id: 'label2', content: 'Has Rejections?', offset: { x: 0, y: 1 }, margin: { left: 0, top: 1, right: 0, bottom: 0 }
                }],
                style: { fill: "#FFFFFF", strokeColor: "#d5dc43", strokeWidth: 2 }
            },
            {
                id: 'node23', width: 90, height: 60, offsetX: 1519.5, offsetY: 479.166666666667, ports: portCollection,
                shape: { type: "Bpmn", shape: "Activity", activity: { activity: 'Task', task: { type: 'Service' } } },
                annotations: [{
                    id: 'label3', content: 'Export', margin: { top: 10, right: 2, bottom: 3, left: 2 }
                }],
                style: { fill: "#E3EDF3", strokeWidth: 2, strokeColor: "#7fadc8" }
            },
            {
                id: 'node24', width: 30, height: 30, offsetX: 1684.5, offsetY: 479.166666666667, ports: portCollection,
                shape: { type: "Bpmn", shape: "Event", event: { event: "End" } },
                annotations: [{
                    id: 'label1', content: 'End', offset: { x: 0.5, y: 1 }, margin: { top: 2 }, verticalAlignment: "Top"
                }],
                style: { fill: "#FFFFFF", strokeColor: "#9b0000", strokeWidth: 4 }
            },
            ];
            let connectors: ConnectorModel[] = [
                {
                    id: 'node8-node1', type: 'Orthogonal', sourceID: 'node8', targetID: 'node1', sourcePortID: "top", targetPortID: "left",
                    annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
                },
                {
                    id: 'node11-node2', type: 'Orthogonal', sourceID: 'node11', targetID: 'node2', sourcePortID: "top", targetPortID: "left",
                    annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
                },
                {
                    id: 'node9-node3', type: 'Orthogonal', sourceID: 'node9', targetID: 'node3', sourcePortID: "right", targetPortID: "left",
                },
                {
                    id: 'node0-node3', type: 'Orthogonal', sourceID: 'node0', targetID: 'node3', sourcePortID: "right", targetPortID: "left",
                },
                {
                    id: 'node12-node4', type: 'Orthogonal', sourceID: 'node12', targetID: 'node4', sourcePortID: "top", targetPortID: "left",
                    annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
                },
                {
                    id: 'node13-node5', type: 'Orthogonal', sourceID: 'node13', targetID: 'node5', sourcePortID: "top", targetPortID: "left",
                    annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
                },
                {
                    id: 'node17-node6', type: 'Orthogonal', sourceID: 'node17', targetID: 'node6', sourcePortID: "top", targetPortID: "left",
                    annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
                },
                {
                    id: 'node19-node7', type: 'Orthogonal', sourceID: 'node19', targetID: 'node7', sourcePortID: "top", targetPortID: "left",
                    annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
                },
                {
                    id: 'node3-node8', type: 'Orthogonal', sourceID: 'node3', targetID: 'node8', sourcePortID: "right", targetPortID: "left",
                },
                {
                    id: 'node8-node9', type: 'Orthogonal', sourceID: 'node8', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
                    annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
                },
                {
                    id: 'node11-node9', type: 'Orthogonal', sourceID: 'node11', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
                    annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
                },
                {
                    id: 'node12-node9', type: 'Orthogonal', sourceID: 'node12', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
                    annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
                },
                {
                    id: 'node13-node9', type: 'Orthogonal', sourceID: 'node13', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
                    annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
                },
                {
                    id: 'node17-node9', type: 'Orthogonal', sourceID: 'node17', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
                    annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
                },
                {
                    id: 'node19-node9', type: 'Orthogonal', sourceID: 'node19', targetID: 'node9', sourcePortID: "bottom", targetPortID: "left",
                    annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
                },
                {
                    id: 'node21-node9', type: 'Orthogonal', sourceID: 'node21', targetID: 'node9', sourcePortID: "top", targetPortID: "left",
                    annotations: [{ content: 'True' }], style: { strokeColor: "#007f00" }, targetDecorator: { style: { fill: "#007f00" } }
                },
                {
                    id: 'node1-node11', type: 'Orthogonal', sourceID: 'node1', targetID: 'node11', sourcePortID: "right", targetPortID: "left",
                },
                {
                    id: 'node2-node12', type: 'Orthogonal', sourceID: 'node2', targetID: 'node12', sourcePortID: "right", targetPortID: "left",
                },
                {
                    id: 'node4-node13', type: 'Orthogonal', sourceID: 'node4', targetID: 'node13', sourcePortID: "right", targetPortID: "left",
                },
                {
                    id: 'node5-node17', type: 'Orthogonal', sourceID: 'node5', targetID: 'node17', sourcePortID: "right", targetPortID: "left",
                },
                {
                    id: 'node6-node19', type: 'Orthogonal', sourceID: 'node6', targetID: 'node19', sourcePortID: "right", targetPortID: "left",
                },
                {
                    id: 'node7-node21', type: 'Orthogonal', sourceID: 'node7', targetID: 'node21', sourcePortID: "right", targetPortID: "left",
                },
                {
                    id: 'node21-node23', type: 'Orthogonal', sourceID: 'node21', targetID: 'node23', sourcePortID: "bottom", targetPortID: "left",
                    annotations: [{ content: 'False' }], style: { strokeColor: "#0000FE" }, targetDecorator: { style: { fill: "#0000FE" } }
                },
                {
                    id: 'node23-node24', type: 'Orthogonal', sourceID: 'node23', targetID: 'node24', sourcePortID: "right", targetPortID: "left",
                },
            ]
            diagram = new Diagram({
                width: 1000, height: 600,
                nodes: nodes, connectors: connectors,
                snapSettings: {
                    constraints: SnapConstraints.None
                },
                constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                getConnectorDefaults: function (connectorModel: ConnectorModel) {
                    connectorModel.cornerRadius = 10;
                    connectorModel.targetDecorator.style.strokeColor = "#778899";
                }
            });
            diagram.appendTo('#diagramLineRoutingIssue80');
            diagram.fitToPage();
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Exception raised - complex diagram', (done: Function) => {
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 63 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 391 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 63 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 371 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == -24.5 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 371 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == -24.5 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 89 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == -4.5 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 89).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 306 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 406.5 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 306 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 317.5 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 427 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 317.5).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 765 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 776 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 799.16 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 776 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 799.16 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 506.5 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 219.16 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 506.5 && (diagram.connectors[2] as Connector).intermediatePoints[4].x == 219.16 && (diagram.connectors[2] as Connector).intermediatePoints[4].y == 486.5 && (diagram.connectors[2] as Connector).intermediatePoints[5].x == -20.84 && (diagram.connectors[2] as Connector).intermediatePoints[5].y == 486.5 && (diagram.connectors[2] as Connector).intermediatePoints[6].x == -20.84 && (diagram.connectors[2] as Connector).intermediatePoints[6].y == 426.5 && (diagram.connectors[2] as Connector).intermediatePoints[7].x == -40.84 && (diagram.connectors[2] as Connector).intermediatePoints[7].y == 426.5 && (diagram.connectors[2] as Connector).intermediatePoints[8].x == -40.84 && (diagram.connectors[2] as Connector).intermediatePoints[8].y == 363.94 && (diagram.connectors[2] as Connector).intermediatePoints[9].x == -12 && (diagram.connectors[2] as Connector).intermediatePoints[9].y == 363.94 && (diagram.connectors[2] as Connector).intermediatePoints[10].x == -12 && (diagram.connectors[2] as Connector).intermediatePoints[10].y == 363.944444444444 && (diagram.connectors[2] as Connector).intermediatePoints[11].x == -6 && (diagram.connectors[2] as Connector).intermediatePoints[11].y == 363.94).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 55 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 174.41 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 79.16 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 174.41 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 79.16 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 306.5 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == -40.84 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 306.5 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == -40.84 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 363.94 && (diagram.connectors[3] as Connector).intermediatePoints[5].x == -12 && (diagram.connectors[3] as Connector).intermediatePoints[5].y == 363.94 && (diagram.connectors[3] as Connector).intermediatePoints[6].x == -12 && (diagram.connectors[3] as Connector).intermediatePoints[6].y == 363.944444444444 && (diagram.connectors[3] as Connector).intermediatePoints[7].x == -6 && (diagram.connectors[3] as Connector).intermediatePoints[7].y == 363.94).toBe(true);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 590 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 145.5 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 590 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 42.5 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 670 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 42.5).toBe(true);
            expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 837 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 22.71 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 837 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 6.5 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 899.16 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 6.5 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 899.16 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 186.5 && (diagram.connectors[5] as Connector).intermediatePoints[4].x == 759.16 && (diagram.connectors[5] as Connector).intermediatePoints[4].y == 186.5 && (diagram.connectors[5] as Connector).intermediatePoints[5].x == 759.16 && (diagram.connectors[5] as Connector).intermediatePoints[5].y == 306.5 && (diagram.connectors[5] as Connector).intermediatePoints[6].x == 619.16 && (diagram.connectors[5] as Connector).intermediatePoints[6].y == 306.5 && (diagram.connectors[5] as Connector).intermediatePoints[7].x == 619.16 && (diagram.connectors[5] as Connector).intermediatePoints[7].y == 247 && (diagram.connectors[5] as Connector).intermediatePoints[8].x == 649.5 && (diagram.connectors[5] as Connector).intermediatePoints[8].y == 247).toBe(true);
            expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 1121 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 243.71 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 1121 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 226.5 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 1039.16 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 226.5 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 1039.16 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 186.5 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 759.16 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 186.5 && (diagram.connectors[6] as Connector).intermediatePoints[5].x == 759.16 && (diagram.connectors[6] as Connector).intermediatePoints[5].y == 247 && (diagram.connectors[6] as Connector).intermediatePoints[6].x == 784.5 && (diagram.connectors[6] as Connector).intermediatePoints[6].y == 247).toBe(true);
            expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 1242 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 168.71 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 1242 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 146.5 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 1159.16 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 146.5 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 1159.16 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 186.5 && (diagram.connectors[7] as Connector).intermediatePoints[4].x == 899.16 && (diagram.connectors[7] as Connector).intermediatePoints[4].y == 186.5 && (diagram.connectors[7] as Connector).intermediatePoints[5].x == 899.16 && (diagram.connectors[7] as Connector).intermediatePoints[5].y == 247 && (diagram.connectors[7] as Connector).intermediatePoints[6].x == 919.5 && (diagram.connectors[7] as Connector).intermediatePoints[6].y == 247).toBe(true);
            expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 84 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 363.94 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 119.16 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 363.94 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 119.16 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 486.5 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == -20.84 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 486.5 && (diagram.connectors[8] as Connector).intermediatePoints[4].x == -20.84 && (diagram.connectors[8] as Connector).intermediatePoints[4].y == 421 && (diagram.connectors[8] as Connector).intermediatePoints[5].x == 33 && (diagram.connectors[8] as Connector).intermediatePoints[5].y == 421).toBe(true);
            expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 63 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 451 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 63 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 776 && (diagram.connectors[9] as Connector).intermediatePoints[2].x == 675 && (diagram.connectors[9] as Connector).intermediatePoints[2].y == 776).toBe(true);
            expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 306 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 466.5 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 306 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 776 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 675 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 776).toBe(true);
            expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 590 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 205.5 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 590 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 776 && (diagram.connectors[11] as Connector).intermediatePoints[2].x == 675 && (diagram.connectors[11] as Connector).intermediatePoints[2].y == 776).toBe(true);
            expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 837 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 82.71 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 837 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 186.5 && (diagram.connectors[12] as Connector).intermediatePoints[2].x == 759.16 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 186.5 && (diagram.connectors[12] as Connector).intermediatePoints[3].x == 759.16 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 726.5 && (diagram.connectors[12] as Connector).intermediatePoints[4].x == 639.16 && (diagram.connectors[12] as Connector).intermediatePoints[4].y == 726.5 && (diagram.connectors[12] as Connector).intermediatePoints[5].x == 639.16 && (diagram.connectors[12] as Connector).intermediatePoints[5].y == 776 && (diagram.connectors[12] as Connector).intermediatePoints[6].x == 675 && (diagram.connectors[12] as Connector).intermediatePoints[6].y == 776).toBe(true);
            expect((diagram.connectors[13] as Connector).intermediatePoints[0].x == 1121 && (diagram.connectors[13] as Connector).intermediatePoints[0].y == 303.71 && (diagram.connectors[13] as Connector).intermediatePoints[1].x == 1121 && (diagram.connectors[13] as Connector).intermediatePoints[1].y == 726.5 && (diagram.connectors[13] as Connector).intermediatePoints[2].x == 639.16 && (diagram.connectors[13] as Connector).intermediatePoints[2].y == 726.5 && (diagram.connectors[13] as Connector).intermediatePoints[3].x == 639.16 && (diagram.connectors[13] as Connector).intermediatePoints[3].y == 776 && (diagram.connectors[13] as Connector).intermediatePoints[4].x == 675 && (diagram.connectors[13] as Connector).intermediatePoints[4].y == 776).toBe(true);
            expect((diagram.connectors[14] as Connector).intermediatePoints[0].x == 1242 && (diagram.connectors[14] as Connector).intermediatePoints[0].y == 228.71 && (diagram.connectors[14] as Connector).intermediatePoints[1].x == 1242 && (diagram.connectors[14] as Connector).intermediatePoints[1].y == 366.5 && (diagram.connectors[14] as Connector).intermediatePoints[2].x == 1199.16 && (diagram.connectors[14] as Connector).intermediatePoints[2].y == 366.5 && (diagram.connectors[14] as Connector).intermediatePoints[3].x == 1199.16 && (diagram.connectors[14] as Connector).intermediatePoints[3].y == 726.5 && (diagram.connectors[14] as Connector).intermediatePoints[4].x == 639.16 && (diagram.connectors[14] as Connector).intermediatePoints[4].y == 726.5 && (diagram.connectors[14] as Connector).intermediatePoints[5].x == 639.16 && (diagram.connectors[14] as Connector).intermediatePoints[5].y == 776 && (diagram.connectors[14] as Connector).intermediatePoints[6].x == 675 && (diagram.connectors[14] as Connector).intermediatePoints[6].y == 776).toBe(true);
            expect((diagram.connectors[15] as Connector).intermediatePoints[0].x == 1280 && (diagram.connectors[15] as Connector).intermediatePoints[0].y == 387.71 && (diagram.connectors[15] as Connector).intermediatePoints[1].x == 1280 && (diagram.connectors[15] as Connector).intermediatePoints[1].y == 366.5 && (diagram.connectors[15] as Connector).intermediatePoints[2].x == 1199.16 && (diagram.connectors[15] as Connector).intermediatePoints[2].y == 366.5 && (diagram.connectors[15] as Connector).intermediatePoints[3].x == 1199.16 && (diagram.connectors[15] as Connector).intermediatePoints[3].y == 726.5 && (diagram.connectors[15] as Connector).intermediatePoints[4].x == 639.16 && (diagram.connectors[15] as Connector).intermediatePoints[4].y == 726.5 && (diagram.connectors[15] as Connector).intermediatePoints[5].x == 639.16 && (diagram.connectors[15] as Connector).intermediatePoints[5].y == 776 && (diagram.connectors[15] as Connector).intermediatePoints[6].x == 675 && (diagram.connectors[15] as Connector).intermediatePoints[6].y == 776).toBe(true);
            expect((diagram.connectors[16] as Connector).intermediatePoints[0].x == 85.5 && (diagram.connectors[16] as Connector).intermediatePoints[0].y == 89 && (diagram.connectors[16] as Connector).intermediatePoints[1].x == 119.16 && (diagram.connectors[16] as Connector).intermediatePoints[1].y == 89 && (diagram.connectors[16] as Connector).intermediatePoints[2].x == 119.16 && (diagram.connectors[16] as Connector).intermediatePoints[2].y == 436.5 && (diagram.connectors[16] as Connector).intermediatePoints[3].x == 276 && (diagram.connectors[16] as Connector).intermediatePoints[3].y == 436.5).toBe(true);
            expect((diagram.connectors[17] as Connector).intermediatePoints[0].x == 517 && (diagram.connectors[17] as Connector).intermediatePoints[0].y == 317.5 && (diagram.connectors[17] as Connector).intermediatePoints[1].x == 539.16 && (diagram.connectors[17] as Connector).intermediatePoints[1].y == 317.5 && (diagram.connectors[17] as Connector).intermediatePoints[2].x == 539.16 && (diagram.connectors[17] as Connector).intermediatePoints[2].y == 246.5 && (diagram.connectors[17] as Connector).intermediatePoints[3].x == 499.16 && (diagram.connectors[17] as Connector).intermediatePoints[3].y == 246.5 && (diagram.connectors[17] as Connector).intermediatePoints[4].x == 499.16 && (diagram.connectors[17] as Connector).intermediatePoints[4].y == 175.5 && (diagram.connectors[17] as Connector).intermediatePoints[5].x == 560 && (diagram.connectors[17] as Connector).intermediatePoints[5].y == 175.5).toBe(true);
            expect((diagram.connectors[18] as Connector).intermediatePoints[0].x == 760 && (diagram.connectors[18] as Connector).intermediatePoints[0].y == 42.5 && (diagram.connectors[18] as Connector).intermediatePoints[1].x == 781 && (diagram.connectors[18] as Connector).intermediatePoints[1].y == 42.5 && (diagram.connectors[18] as Connector).intermediatePoints[2].x == 781 && (diagram.connectors[18] as Connector).intermediatePoints[2].y == 52.7066858410835 && (diagram.connectors[18] as Connector).intermediatePoints[3].x == 807 && (diagram.connectors[18] as Connector).intermediatePoints[3].y == 52.71).toBe(true);
            expect((diagram.connectors[19] as Connector).intermediatePoints[0].x == 739.5 && (diagram.connectors[19] as Connector).intermediatePoints[0].y == 247 && (diagram.connectors[19] as Connector).intermediatePoints[1].x == 759.16 && (diagram.connectors[19] as Connector).intermediatePoints[1].y == 247 && (diagram.connectors[19] as Connector).intermediatePoints[2].x == 759.16 && (diagram.connectors[19] as Connector).intermediatePoints[2].y == 306.5 && (diagram.connectors[19] as Connector).intermediatePoints[3].x == 1039.16 && (diagram.connectors[19] as Connector).intermediatePoints[3].y == 306.5 && (diagram.connectors[19] as Connector).intermediatePoints[4].x == 1039.16 && (diagram.connectors[19] as Connector).intermediatePoints[4].y == 273.71 && (diagram.connectors[19] as Connector).intermediatePoints[5].x == 1085 && (diagram.connectors[19] as Connector).intermediatePoints[5].y == 273.71 && (diagram.connectors[19] as Connector).intermediatePoints[6].x == 1085 && (diagram.connectors[19] as Connector).intermediatePoints[6].y == 273.706685841084 && (diagram.connectors[19] as Connector).intermediatePoints[7].x == 1091 && (diagram.connectors[19] as Connector).intermediatePoints[7].y == 273.71).toBe(true);
            expect((diagram.connectors[20] as Connector).intermediatePoints[0].x == 874.5 && (diagram.connectors[20] as Connector).intermediatePoints[0].y == 247 && (diagram.connectors[20] as Connector).intermediatePoints[1].x == 899.16 && (diagram.connectors[20] as Connector).intermediatePoints[1].y == 247 && (diagram.connectors[20] as Connector).intermediatePoints[2].x == 899.16 && (diagram.connectors[20] as Connector).intermediatePoints[2].y == 186.5 && (diagram.connectors[20] as Connector).intermediatePoints[3].x == 1039.16 && (diagram.connectors[20] as Connector).intermediatePoints[3].y == 186.5 && (diagram.connectors[20] as Connector).intermediatePoints[4].x == 1039.16 && (diagram.connectors[20] as Connector).intermediatePoints[4].y == 198.71 && (diagram.connectors[20] as Connector).intermediatePoints[5].x == 1206 && (diagram.connectors[20] as Connector).intermediatePoints[5].y == 198.71 && (diagram.connectors[20] as Connector).intermediatePoints[6].x == 1206 && (diagram.connectors[20] as Connector).intermediatePoints[6].y == 198.706685841084 && (diagram.connectors[20] as Connector).intermediatePoints[7].x == 1212 && (diagram.connectors[20] as Connector).intermediatePoints[7].y == 198.71).toBe(true);
            expect((diagram.connectors[21] as Connector).intermediatePoints[0].x == 1009.5 && (diagram.connectors[21] as Connector).intermediatePoints[0].y == 247 && (diagram.connectors[21] as Connector).intermediatePoints[1].x == 1039.16 && (diagram.connectors[21] as Connector).intermediatePoints[1].y == 247 && (diagram.connectors[21] as Connector).intermediatePoints[2].x == 1039.16 && (diagram.connectors[21] as Connector).intermediatePoints[2].y == 417.71 && (diagram.connectors[21] as Connector).intermediatePoints[3].x == 1244 && (diagram.connectors[21] as Connector).intermediatePoints[3].y == 417.71 && (diagram.connectors[21] as Connector).intermediatePoints[4].x == 1244 && (diagram.connectors[21] as Connector).intermediatePoints[4].y == 417.706685841084 && (diagram.connectors[21] as Connector).intermediatePoints[5].x == 1250 && (diagram.connectors[21] as Connector).intermediatePoints[5].y == 417.71).toBe(true);
            expect((diagram.connectors[22] as Connector).intermediatePoints[0].x == 1280 && (diagram.connectors[22] as Connector).intermediatePoints[0].y == 447.71 && (diagram.connectors[22] as Connector).intermediatePoints[1].x == 1280 && (diagram.connectors[22] as Connector).intermediatePoints[1].y == 479.17 && (diagram.connectors[22] as Connector).intermediatePoints[2].x == 1468.5 && (diagram.connectors[22] as Connector).intermediatePoints[2].y == 479.17 && (diagram.connectors[22] as Connector).intermediatePoints[3].x == 1468.5 && (diagram.connectors[22] as Connector).intermediatePoints[3].y == 479.166666666667 && (diagram.connectors[22] as Connector).intermediatePoints[4].x == 1474.5 && (diagram.connectors[22] as Connector).intermediatePoints[4].y == 479.17).toBe(true);
            expect((diagram.connectors[23] as Connector).intermediatePoints[0].x == 1564.5 && (diagram.connectors[23] as Connector).intermediatePoints[0].y == 479.17 && (diagram.connectors[23] as Connector).intermediatePoints[1].x == 1643.5 && (diagram.connectors[23] as Connector).intermediatePoints[1].y == 479.17 && (diagram.connectors[23] as Connector).intermediatePoints[2].x == 1643.5 && (diagram.connectors[23] as Connector).intermediatePoints[2].y == 479.166666666667 && (diagram.connectors[23] as Connector).intermediatePoints[3].x == 1669.5 && (diagram.connectors[23] as Connector).intermediatePoints[3].y == 479.17).toBe(true);
            done();
        });
    });
});