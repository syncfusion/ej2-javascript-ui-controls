import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Connector } from '../../../src/diagram/objects/connector';
import { ChildArrangement, ConnectionPointOrigin, DiagramConstraints, PortVisibility, SnapConstraints } from '../../../src/diagram/enum/enum';
import { LineRouting } from '../../../src/diagram/interaction/line-routing';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { SymbolPalette } from '../../../src/symbol-palette/index';
import {
    Node, DataBinding, HierarchicalTree, TreeInfo, PathElement, LineDistribution, BpmnDiagrams, ConnectorBridging, IElement
} from '../../../src/diagram/index';
import { DataManager, Query } from '@syncfusion/ej2-data';
Diagram.Inject(DataBinding, HierarchicalTree);
Diagram.Inject(LineRouting, UndoRedo, LineDistribution, BpmnDiagrams, ConnectorBridging);

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

                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100).toBe(true);
                        expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 275).toBe(true);
                        expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 300).toBe(true);
                        expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 130).toBe(true);
                        expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 275).toBe(true);
                        expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 500 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 500 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 270).toBe(true);
                        expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 255 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 500 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 255 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 500 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 130).toBe(true);
                        expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270 ).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 270).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
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
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[4].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == 250 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[4] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[4] as Connector).intermediatePoints[4].y == 75).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 75).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 55 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 55 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 75).toBe(true);
                expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 55 && (diagram.connectors[7] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[4].y == 55 && (diagram.connectors[7] as Connector).intermediatePoints[5].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[5].y == 75).toBe(true);
                expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[8] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[8] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[8] as Connector).intermediatePoints[5].y == 100).toBe(true);
                expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[9] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[9] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[9] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[9] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[9] as Connector).intermediatePoints[4].x == 350 && (diagram.connectors[9] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[10] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[10] as Connector).intermediatePoints[3].y == 145 && (diagram.connectors[10] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[10] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[10] as Connector).intermediatePoints[5].y == 100).toBe(true);
                expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[11] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[11] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[11] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[11] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[11] as Connector).intermediatePoints[4].x == 350 && (diagram.connectors[11] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[12] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[12] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[12] as Connector).intermediatePoints[4].y == 125).toBe(true);
                expect((diagram.connectors[13] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[13] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[13] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[13] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[13] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[13] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[13] as Connector).intermediatePoints[3].y == 145 && (diagram.connectors[13] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[13] as Connector).intermediatePoints[4].y == 145 && (diagram.connectors[13] as Connector).intermediatePoints[5].x == 300 && (diagram.connectors[13] as Connector).intermediatePoints[5].y == 125).toBe(true);
                expect((diagram.connectors[14] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[14] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[14] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[14] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[14] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[14] as Connector).intermediatePoints[3].y == 145 && (diagram.connectors[14] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[14] as Connector).intermediatePoints[4].y == 125).toBe(true);
                expect((diagram.connectors[15] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[15] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[15] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[15] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[15] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[15] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[15] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[15] as Connector).intermediatePoints[3].y == 125).toBe(true);
                expect((diagram.connectors[16] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[16] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[16] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[16] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[16] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[16] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[16] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[16] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[16] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[16] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[16] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[16] as Connector).intermediatePoints[5].y == 300).toBe(true);
                expect((diagram.connectors[17] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[17] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[17] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[17] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[17] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[17] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[17] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[17] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[17] as Connector).intermediatePoints[4].x == 50 && (diagram.connectors[17] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[18] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[18] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[18] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[18] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[18] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[18] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[18] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[18] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[18] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[18] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[18] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[18] as Connector).intermediatePoints[5].y == 300).toBe(true);
                expect((diagram.connectors[19] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[19] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[19] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[19] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[19] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[19] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[19] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[19] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[19] as Connector).intermediatePoints[4].x == 50 && (diagram.connectors[19] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[20] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[20] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[20] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[20] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[20] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[20] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[20] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[20] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[20] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[20] as Connector).intermediatePoints[4].y == 270).toBe(true);
                expect((diagram.connectors[21] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[21] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[21] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[21] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[21] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[21] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[21] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[21] as Connector).intermediatePoints[3].y == 270).toBe(true);
                expect((diagram.connectors[22] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[22] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[22] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[22] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[22] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[22] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[22] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[22] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[22] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[22] as Connector).intermediatePoints[4].y == 270).toBe(true);
                expect((diagram.connectors[23] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[23] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[23] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[23] as Connector).intermediatePoints[1].y == 345 && (diagram.connectors[23] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[23] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[23] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[23] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[23] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[23] as Connector).intermediatePoints[4].y == 250 && (diagram.connectors[23] as Connector).intermediatePoints[5].x == 100 && (diagram.connectors[23] as Connector).intermediatePoints[5].y == 270 ).toBe(true);
                expect((diagram.connectors[24] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[24] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[24] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[24] as Connector).intermediatePoints[1].y == 300).toBe(true);
                expect((diagram.connectors[25] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[25] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[25] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[25] as Connector).intermediatePoints[1].y == 255 && (diagram.connectors[25] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[25] as Connector).intermediatePoints[2].y == 255 && (diagram.connectors[25] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[25] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[25] as Connector).intermediatePoints[4].x == 150 && (diagram.connectors[25] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[26] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[26] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[26] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[26] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[26] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[26] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[26] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[26] as Connector).intermediatePoints[3].y == 345 && (diagram.connectors[26] as Connector).intermediatePoints[4].x == 230 && (diagram.connectors[26] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[26] as Connector).intermediatePoints[5].x == 150 && (diagram.connectors[26] as Connector).intermediatePoints[5].y == 300).toBe(true);
                expect((diagram.connectors[27] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[27] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[27] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[27] as Connector).intermediatePoints[1].y == 345 && (diagram.connectors[27] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[27] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[27] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[27] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[27] as Connector).intermediatePoints[4].x == 150 && (diagram.connectors[27] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[28] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[28] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[28] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[28] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[28] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[28] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[28] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[28] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[28] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[28] as Connector).intermediatePoints[4].y == 330).toBe(true);
                expect((diagram.connectors[29] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[29] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[29] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[29] as Connector).intermediatePoints[1].y == 255 && (diagram.connectors[29] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[29] as Connector).intermediatePoints[2].y == 255 && (diagram.connectors[29] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[29] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[29] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[29] as Connector).intermediatePoints[4].y == 350 && (diagram.connectors[29] as Connector).intermediatePoints[5].x == 100 && (diagram.connectors[29] as Connector).intermediatePoints[5].y == 330).toBe(true);
                expect((diagram.connectors[30] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[30] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[30] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[30] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[30] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[30] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[30] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[30] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[30] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[30] as Connector).intermediatePoints[4].y == 330).toBe(true);
                expect((diagram.connectors[31] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[31] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[31] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[31] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[31] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[31] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[31] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[31] as Connector).intermediatePoints[3].y == 330).toBe(true);
                expect((diagram.connectors[32] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[32] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[32] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[32] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[32] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[32] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[32] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[32] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[32] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[32] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[32] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[32] as Connector).intermediatePoints[5].y == 300).toBe(true);
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
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 ).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 100 ).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 100 ).toBe(true);
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
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 ).toBe(true);
                    expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 300 ).toBe(true);
                    expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 300 ).toBe(true);
                    expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 100 ).toBe(true);
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
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 ).toBe(true);
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
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100).toBe(true);
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
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 ).toBe(true);
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
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300).toBe(true);
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
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100).toBe(true);
                    expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 300).toBe(true);
                    expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 130 ).toBe(true);
                    expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 275 ).toBe(true);
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
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 270 ).toBe(true);
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
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100).toBe(true);
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
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 125).toBe(true);
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
                    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 ).toBe(true);
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
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 ).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 70).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 130).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 300).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 255 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 255 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 275).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 350 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 300 ).toBe(true);
                expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 345 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 325).toBe(true);
                expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 450 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 300 ).toBe(true);
                expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 270).toBe(true);
                expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[3].x == 550 && (diagram.connectors[10] as Connector).intermediatePoints[3].y == 300).toBe(true);
                expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 330 ).toBe(true);
                expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[12] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[3].x == 650 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 100 ).toBe(true);
                expect((diagram.connectors[13] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[13] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[1].y == 75 ).toBe(true);
                expect((diagram.connectors[14] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[14] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[14] as Connector).intermediatePoints[1].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[14] as Connector).intermediatePoints[2].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[3].x == 750).toBe(true);
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
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 100).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 100).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 300).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 255 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 255 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 300).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 100 ).toBe(true);
                expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 345 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 300).toBe(true);
                expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 450 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 500 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 100).toBe(true);
                expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 550 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 100 && (diagram.connectors[10] as Connector).intermediatePoints[3].x == 500 && (diagram.connectors[10] as Connector).intermediatePoints[3].y == 100).toBe(true);
                expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 330 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 650 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[12] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 300).toBe(true);
                expect((diagram.connectors[13] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[13] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[1].y == 300).toBe(true);
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
                for (var i = 0; i < diagram.connectors.length; i++) {
                    console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)'));
                }
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 70 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 100).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 100).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 300).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 255 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 255 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 300).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 350 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 345 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 230 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 345 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 300).toBe(true);
                expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 450 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 500 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 250).toBe(true);
                expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 130).toBe(true);
                expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 550 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[10] as Connector).intermediatePoints[3].x == 500 && (diagram.connectors[10] as Connector).intermediatePoints[3].y == 250).toBe(true);
                expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 330 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[11] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[11] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[11] as Connector).intermediatePoints[4].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[4].y == 250).toBe(true);
                expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 650 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[12] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 145).toBe(true);
                expect((diagram.connectors[13] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[0].y == 75 && (diagram.connectors[13] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[1].y == 55 && (diagram.connectors[13] as Connector).intermediatePoints[2].x == 770 && (diagram.connectors[13] as Connector).intermediatePoints[2].y == 55 && (diagram.connectors[13] as Connector).intermediatePoints[3].x == 770 && (diagram.connectors[13] as Connector).intermediatePoints[3].y == 145 && (diagram.connectors[13] as Connector).intermediatePoints[4].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[4].y == 145).toBe(true);
                expect((diagram.connectors[14] as Connector).intermediatePoints[0].x == 750 && (diagram.connectors[14] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[1].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[2].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[14] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[14] as Connector).intermediatePoints[3].y == 145).toBe(true);
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
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 50 && (diagram.connectors[1] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 70).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 130).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 300).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 255 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 255 && (diagram.connectors[5] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[4].y == 275).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 345 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[6] as Connector).intermediatePoints[5].y == 300).toBe(true);
                expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 345 && (diagram.connectors[7] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[7] as Connector).intermediatePoints[4].y == 325).toBe(true);
                expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 430 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[4].x == 450 && (diagram.connectors[8] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 270).toBe(true);
                expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[10] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[10] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[10] as Connector).intermediatePoints[4].x == 550 && (diagram.connectors[10] as Connector).intermediatePoints[4].y == 300).toBe(true);
                expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[11] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[11] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[11] as Connector).intermediatePoints[3].x == 570 && (diagram.connectors[11] as Connector).intermediatePoints[3].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[4].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[4].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[5].x == 500 && (diagram.connectors[11] as Connector).intermediatePoints[5].y == 330).toBe(true);
                expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 255 && (diagram.connectors[12] as Connector).intermediatePoints[2].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 255 && (diagram.connectors[12] as Connector).intermediatePoints[3].x == 630 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[12] as Connector).intermediatePoints[4].x == 650 && (diagram.connectors[12] as Connector).intermediatePoints[4].y == 100).toBe(true);
                expect((diagram.connectors[13] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[13] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[1].y == 255 && (diagram.connectors[13] as Connector).intermediatePoints[2].x == 770 && (diagram.connectors[13] as Connector).intermediatePoints[2].y == 255 && (diagram.connectors[13] as Connector).intermediatePoints[3].x == 770 && (diagram.connectors[13] as Connector).intermediatePoints[3].y == 55 && (diagram.connectors[13] as Connector).intermediatePoints[4].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[4].y == 55 && (diagram.connectors[13] as Connector).intermediatePoints[5].x == 700 && (diagram.connectors[13] as Connector).intermediatePoints[5].y == 75).toBe(true);
                expect((diagram.connectors[14] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[14] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[14] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[14] as Connector).intermediatePoints[1].y == 255 && (diagram.connectors[14] as Connector).intermediatePoints[2].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[2].y == 255 && (diagram.connectors[14] as Connector).intermediatePoints[3].x == 770 && (diagram.connectors[14] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[14] as Connector).intermediatePoints[4].x == 750 && (diagram.connectors[14] as Connector).intermediatePoints[4].y == 100).toBe(true);
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
                    console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                    expect( diagram.connectors[0].sourceID == 'node3' && diagram.connectors[0].targetID == 'node1').toBe(true);
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

                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145).toBe(true);
                diagram.nodes[1].offsetX = 500;
                diagram.nodes[1].offsetY = 150;
                diagram.dataBind();
                expect( diagram.connectors[0].sourceID == 'node2' && diagram.connectors[0].targetID == 'node8').toBe(true);
                diagram.undo();
                done();
            });
            it('Add New node, it overlap to connector', (done: Function) => {
                console.log('Test case 1223');
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145).toBe(true);
                let newnode: NodeModel = {
                    offsetX: 300, offsetY: 250, width: 100, height: 100,
                    shape: { type: "Basic", shape: "Triangle" }
                } as NodeModel;
                diagram.add(newnode);
                expect( diagram.connectors[0].sourceID == 'node2' && diagram.connectors[0].targetID == 'node8').toBe(true);
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
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145).toBe(true);
                diagram.connectors[0].sourceID = 'node1';
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150).toBe(true);
                done();
            });
            it('Connection change from source node to another source node with port', (done: Function) => {

                console.log('Test case 1225');
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 130 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150).toBe(true);
                diagram.connectors[0].sourceID = 'node2';
                diagram.connectors[0].sourcePortID = 'port1';
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 145).toBe(true);
                done();
            });
            // same port id have old source Node and also new source node
            it('Connection change from source node to another source node connect with another port', (done: Function) => {

                console.log('Test case 1226');
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 145).toBe(true);
                diagram.connectors[0].sourceID = 'node3';
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect( diagram.connectors[0].sourceID == 'node3' && diagram.connectors[0].targetID == 'node8').toBe(true);
                done();
            });

            it('Connection change from source port to another source node', (done: Function) => {

                console.log('Test case 1227');
                diagram.connectors[0].sourcePortID = '';
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 550 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 300).toBe(true);
                done();
            });
            // Check the target point
            it('Connection change from source node to point', (done: Function) => {

                console.log('Test case 1228');
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 550 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 570 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 300).toBe(true);
                diagram.connectors[0].sourceID = '';
                diagram.connectors[0].sourcePoint = { x: 200, y: 150 };
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 170).toBe(true);
                done();
            });
            it('Connection change from source point to port', (done: Function) => {

                console.log('Test case 1229');
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 170).toBe(true);
                diagram.connectors[0].sourceID = 'node1';
                diagram.connectors[0].sourcePortID = 'port2';
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect( diagram.connectors[0].sourceID == 'node1' && diagram.connectors[0].targetID == 'node8').toBe(true);
                done();
            });
            it('Connection change from source port to point', (done: Function) => {

                console.log('Test case 1230');
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect( diagram.connectors[0].sourceID == 'node1' && diagram.connectors[0].targetID == 'node8').toBe(true);
                diagram.connectors[0].sourceID = '';
                diagram.connectors[0].sourcePortID = '';
                diagram.connectors[0].sourcePoint = { x: 200, y: 150 };
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 170).toBe(true);
                done();
            });
            it('Connection change from target node to point', (done: Function) => {

                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 170).toBe(true);
                diagram.connectors[0].targetID = '';
                diagram.connectors[0].targetPoint = { x: 600, y: 250 };
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect(diagram.connectors[0].sourceID == '' && diagram.connectors[0].targetID == '').toBe(true);
                done();
            });
            // check the case - connection
            it('Connection change from target point to port', (done: Function) => {

                console.log('Test case 1232');
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect(diagram.connectors[0].sourceID == '' && diagram.connectors[0].targetID == '').toBe(true);
                diagram.connectors[0].targetID = 'node3';
                diagram.connectors[0].targetPortID = 'port4';
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect(diagram.connectors[0].sourceID == '' && diagram.connectors[0].targetID == 'node3').toBe(true);
                done();
            });
            it('Connection change from target port to point', (done: Function) => {

                console.log('Test case 1233');
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect(diagram.connectors[0].sourceID == '' && diagram.connectors[0].targetID == 'node3').toBe(true);
                diagram.connectors[0].targetID = '';
                diagram.connectors[0].targetPortID = '';
                diagram.connectors[0].targetPoint = { x: 600, y: 250 };
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect(diagram.connectors[0].sourceID == '' && diagram.connectors[0].targetID == '').toBe(true);
                done();
            });
            it('Connection change from target point to node', (done: Function) => {

                console.log('Test case 1234');
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect(diagram.connectors[0].sourceID == '' && diagram.connectors[0].targetID == '').toBe(true);
                diagram.connectors[0].targetID = 'node8';
                diagram.dataBind();
                console.log(getIntermediatePoints((diagram.connectors[0] as Connector).intermediatePoints, '(diagram.connectors[' + 0 + '] as Connector)'));
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 170).toBe(true);
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
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 115 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 135 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 135).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 280 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 470).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 295 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 250 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 315 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 315 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 218).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 525 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 218 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 545 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 218 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 545 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 195).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 225 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 245 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 678 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 245).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 678 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 472 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 678 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 452 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 480 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 452).toBe(true);
                done();
            });
            it('Enable Line Routing Constraints', (done: Function) => {
                console.log("11111");
                diagram.constraints = DiagramConstraints.Default | DiagramConstraints.LineRouting;
                diagram.dataBind();
                diagram.resetSegments();
                for (var i = 0; i < diagram.connectors.length; i++) {
                    console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)'));
                }
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 115 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 135 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 135 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 220).toBe(true);
                
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 280 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 250 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 470).toBe(true);
                
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x ==295 && (diagram.connectors[2] as Connector).intermediatePoints[0].y ==250 && (diagram.connectors[2] as Connector).intermediatePoints[1].x ==315 && (diagram.connectors[2] as Connector).intermediatePoints[1].y ==250 && (diagram.connectors[2] as Connector).intermediatePoints[2].x ==315 && (diagram.connectors[2] as Connector).intermediatePoints[2].y ==218 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 435 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 218).toBe(true);
                
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 525 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 218 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 545 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 218 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 545 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 195 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 655 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 195).toBe(true);
                
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 225 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 245 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 678 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 245 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 678 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 472).toBe(true);
                
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
                let node = diagram.nodes[6];
                mouseEvents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, 90 + diagram.element.offsetLeft, 190 + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
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
                for (var i = 0; i < diagram.connectors.length; i++) {
                    console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)'));
                }
                console.log((diagram.connectors[0] as Connector).intermediatePoints[0].x);
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x ==100 || (diagram.connectors[0] as Connector).intermediatePoints[0].x ==114.78).toBe(true);
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
                console.log(getIntermediatePoints((diagram.connectors[1] as Connector).intermediatePoints, '(diagram.connectors[' + 1 + '] as Connector)'));
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
            console.log("test case for pathdata");
            for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x ==63 && (diagram.connectors[0] as Connector).intermediatePoints[0].y ==391 && (diagram.connectors[0] as Connector).intermediatePoints[1].x ==63 &&(diagram.connectors[0] as Connector).intermediatePoints[1].y ==371 && (diagram.connectors[0] as Connector).intermediatePoints[2].x ==-24.5&&(diagram.connectors[0] as Connector).intermediatePoints[2].y ==371&&(diagram.connectors[0] as Connector).intermediatePoints[3].x ==-24.5&&(diagram.connectors[0] as Connector).intermediatePoints[3].y ==89&&(diagram.connectors[0] as Connector).intermediatePoints[4].x ==-4.5&&(diagram.connectors[0] as Connector).intermediatePoints[4].y ==89).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x ==306 &&(diagram.connectors[1] as Connector).intermediatePoints[0].y ==406.5 && (diagram.connectors[1] as Connector).intermediatePoints[1].x ==306&&(diagram.connectors[1] as Connector).intermediatePoints[1].y ==317.5&&(diagram.connectors[1] as Connector).intermediatePoints[2].x ==427&&(diagram.connectors[1] as Connector).intermediatePoints[2].y ==317.5).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x ==765&&(diagram.connectors[2] as Connector).intermediatePoints[0].y ==776&&(diagram.connectors[2] as Connector).intermediatePoints[1].x ==785&&(diagram.connectors[2] as Connector).intermediatePoints[1].y ==776&&(diagram.connectors[2] as Connector).intermediatePoints[2].x ==785&&(diagram.connectors[2] as Connector).intermediatePoints[2].y ==726&&(diagram.connectors[2] as Connector).intermediatePoints[3].x ==-26&&(diagram.connectors[2] as Connector).intermediatePoints[3].y ==726&&(diagram.connectors[2] as Connector).intermediatePoints[4].x ==-26&&(diagram.connectors[2] as Connector).intermediatePoints[4].y ==363.94&&(diagram.connectors[2] as Connector).intermediatePoints[5].x ==-6&&(diagram.connectors[2] as Connector).intermediatePoints[5].y ==363.94).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x ==55&&(diagram.connectors[3] as Connector).intermediatePoints[0].y ==174.41&&(diagram.connectors[3] as Connector).intermediatePoints[1].x ==75&&(diagram.connectors[3] as Connector).intermediatePoints[1].y ==174.41&&(diagram.connectors[3] as Connector).intermediatePoints[2].x ==75&&(diagram.connectors[3] as Connector).intermediatePoints[2].y ==209.41&&(diagram.connectors[3] as Connector).intermediatePoints[3].x ==-26&&(diagram.connectors[3] as Connector).intermediatePoints[3].y ==209.41&&(diagram.connectors[3] as Connector).intermediatePoints[4].x ==-26&&(diagram.connectors[3] as Connector).intermediatePoints[4].y ==363.94&&(diagram.connectors[3] as Connector).intermediatePoints[5].x ==-6&&(diagram.connectors[3] as Connector).intermediatePoints[5].y ==363.94).toBe(true);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x ==590&&(diagram.connectors[4] as Connector).intermediatePoints[0].y ==145.5&&(diagram.connectors[4] as Connector).intermediatePoints[1].x ==590&&(diagram.connectors[4] as Connector).intermediatePoints[1].y ==42.5&&(diagram.connectors[4] as Connector).intermediatePoints[2].x ==670&&(diagram.connectors[4] as Connector).intermediatePoints[2].y ==42.5).toBe(true);
            expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 837 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 22.71 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 837 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 2.71 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 629.5 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 2.71 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 629.5 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 247 && (diagram.connectors[5] as Connector).intermediatePoints[4].x == 649.5 && (diagram.connectors[5] as Connector).intermediatePoints[4].y == 247).toBe(true);
            expect((diagram.connectors[6] as Connector).intermediatePoints[0].x ==1121&&(diagram.connectors[6] as Connector).intermediatePoints[0].y ==243.71&&(diagram.connectors[6] as Connector).intermediatePoints[1].x ==1121&&(diagram.connectors[6] as Connector).intermediatePoints[1].y ==197&&(diagram.connectors[6] as Connector).intermediatePoints[2].x ==764.5&&(diagram.connectors[6] as Connector).intermediatePoints[2].y ==197&&(diagram.connectors[6] as Connector).intermediatePoints[3].x ==764.5&&(diagram.connectors[6] as Connector).intermediatePoints[3].y ==247&&(diagram.connectors[6] as Connector).intermediatePoints[4].x ==784.5&&(diagram.connectors[6] as Connector).intermediatePoints[4].y ==247).toBe(true);
            expect((diagram.connectors[7] as Connector).intermediatePoints[0].x ==1242&&(diagram.connectors[7] as Connector).intermediatePoints[0].y ==168.71&&(diagram.connectors[7] as Connector).intermediatePoints[1].x ==1242&&(diagram.connectors[7] as Connector).intermediatePoints[1].y ==148.71&&(diagram.connectors[7] as Connector).intermediatePoints[2].x ==899.5&&(diagram.connectors[7] as Connector).intermediatePoints[2].y ==148.71&&(diagram.connectors[7] as Connector).intermediatePoints[3].x ==899.5&&(diagram.connectors[7] as Connector).intermediatePoints[3].y ==247&&(diagram.connectors[7] as Connector).intermediatePoints[4].x ==919.5&&(diagram.connectors[7] as Connector).intermediatePoints[4].y ==247).toBe(true);
            expect((diagram.connectors[8] as Connector).intermediatePoints[0].x ==84&&(diagram.connectors[8] as Connector).intermediatePoints[0].y ==363.94&&(diagram.connectors[8] as Connector).intermediatePoints[1].x ==113&&(diagram.connectors[8] as Connector).intermediatePoints[1].y ==363.94&&(diagram.connectors[8] as Connector).intermediatePoints[2].x ==113&&(diagram.connectors[8] as Connector).intermediatePoints[2].y ==471&&(diagram.connectors[8] as Connector).intermediatePoints[3].x ==13&&(diagram.connectors[8] as Connector).intermediatePoints[3].y ==471&&(diagram.connectors[8] as Connector).intermediatePoints[4].x ==13&&(diagram.connectors[8] as Connector).intermediatePoints[4].y ==421&&(diagram.connectors[8] as Connector).intermediatePoints[5].x ==33&&(diagram.connectors[8] as Connector).intermediatePoints[5].y ==421).toBe(true);
            expect((diagram.connectors[9] as Connector).intermediatePoints[0].x ==63&&(diagram.connectors[9] as Connector).intermediatePoints[0].y ==451&&(diagram.connectors[9] as Connector).intermediatePoints[1].x ==63&&(diagram.connectors[9] as Connector).intermediatePoints[1].y ==776&&(diagram.connectors[9] as Connector).intermediatePoints[2].x ==675&&(diagram.connectors[9] as Connector).intermediatePoints[2].y ==776).toBe(true);
            expect((diagram.connectors[10] as Connector).intermediatePoints[0].x ==306&&(diagram.connectors[10] as Connector).intermediatePoints[0].y ==466.5&&(diagram.connectors[10] as Connector).intermediatePoints[1].x ==306&&(diagram.connectors[10] as Connector).intermediatePoints[1].y ==776&&(diagram.connectors[10] as Connector).intermediatePoints[2].x ==675&&(diagram.connectors[10] as Connector).intermediatePoints[2].y ==776).toBe(true);
            expect((diagram.connectors[11] as Connector).intermediatePoints[0].x ==590&&(diagram.connectors[11] as Connector).intermediatePoints[0].y ==205.5&&(diagram.connectors[11] as Connector).intermediatePoints[1].x ==590&&(diagram.connectors[11] as Connector).intermediatePoints[1].y ==776&&(diagram.connectors[11] as Connector).intermediatePoints[2].x ==675&&(diagram.connectors[11] as Connector).intermediatePoints[2].y ==776).toBe(true);
            expect((diagram.connectors[12] as Connector).intermediatePoints[0].x == 837 && (diagram.connectors[12] as Connector).intermediatePoints[0].y == 82.71 && (diagram.connectors[12] as Connector).intermediatePoints[1].x == 837 && (diagram.connectors[12] as Connector).intermediatePoints[1].y == 202.71 && Math.floor((diagram.connectors[12] as Connector).intermediatePoints[2].x) == 760 && (diagram.connectors[12] as Connector).intermediatePoints[2].y == 202.71 && Math.floor((diagram.connectors[12] as Connector).intermediatePoints[3].x) == 760 && (diagram.connectors[12] as Connector).intermediatePoints[3].y == 722.71 && Math.floor((diagram.connectors[12] as Connector).intermediatePoints[4].x) == 650 && (diagram.connectors[12] as Connector).intermediatePoints[4].y == 722.71 && Math.floor((diagram.connectors[12] as Connector).intermediatePoints[5].x) == 650 && (diagram.connectors[12] as Connector).intermediatePoints[5].y == 776 && (diagram.connectors[12] as Connector).intermediatePoints[6].x == 675 && (diagram.connectors[12] as Connector).intermediatePoints[6].y == 776).toBe(true);
            expect((diagram.connectors[13] as Connector).intermediatePoints[0].x ==1121&&(diagram.connectors[13] as Connector).intermediatePoints[0].y ==303.71&&(diagram.connectors[13] as Connector).intermediatePoints[1].x ==1121&&(diagram.connectors[13] as Connector).intermediatePoints[1].y ==323.71&&(diagram.connectors[13] as Connector).intermediatePoints[2].x ==655&&(diagram.connectors[13] as Connector).intermediatePoints[2].y ==323.71&&(diagram.connectors[13] as Connector).intermediatePoints[3].x ==655&&(diagram.connectors[13] as Connector).intermediatePoints[3].y ==776&&(diagram.connectors[13] as Connector).intermediatePoints[4].x ==675&&(diagram.connectors[13] as Connector).intermediatePoints[4].y ==776).toBe(true);
            expect((diagram.connectors[14] as Connector).intermediatePoints[0].x == 1242 && (diagram.connectors[14] as Connector).intermediatePoints[0].y == 228.71 && (diagram.connectors[14] as Connector).intermediatePoints[1].x == 1242 && (diagram.connectors[14] as Connector).intermediatePoints[1].y == 242.71 && Math.floor((diagram.connectors[14] as Connector).intermediatePoints[2].x) == 1200 && (diagram.connectors[14] as Connector).intermediatePoints[2].y == 242.71 && Math.floor((diagram.connectors[14] as Connector).intermediatePoints[3].x) == 1200 && (diagram.connectors[14] as Connector).intermediatePoints[3].y == 722.71 && Math.floor((diagram.connectors[14] as Connector).intermediatePoints[4].x) == 650 && (diagram.connectors[14] as Connector).intermediatePoints[4].y == 722.71 && Math.floor((diagram.connectors[14] as Connector).intermediatePoints[5].x) == 650 && (diagram.connectors[14] as Connector).intermediatePoints[5].y == 776 && (diagram.connectors[14] as Connector).intermediatePoints[6].x == 675 && (diagram.connectors[14] as Connector).intermediatePoints[6].y == 776).toBe(true);
            expect((diagram.connectors[15] as Connector).intermediatePoints[0].x ==1280&&(diagram.connectors[15] as Connector).intermediatePoints[0].y ==387.71&&(diagram.connectors[15] as Connector).intermediatePoints[1].x ==1280&&(diagram.connectors[15] as Connector).intermediatePoints[1].y ==367.71&&(diagram.connectors[15] as Connector).intermediatePoints[2].x ==655&&(diagram.connectors[15] as Connector).intermediatePoints[2].y ==367.71&&(diagram.connectors[15] as Connector).intermediatePoints[3].x ==655&&(diagram.connectors[15] as Connector).intermediatePoints[3].y ==776&&(diagram.connectors[15] as Connector).intermediatePoints[4].x ==675&&(diagram.connectors[15] as Connector).intermediatePoints[4].y ==776).toBe(true);
            expect((diagram.connectors[16] as Connector).intermediatePoints[0].x == 85.5 && (diagram.connectors[16] as Connector).intermediatePoints[0].y == 89 && Math.floor((diagram.connectors[16] as Connector).intermediatePoints[1].x) == 240 && (diagram.connectors[16] as Connector).intermediatePoints[1].y == 89 && Math.floor((diagram.connectors[16] as Connector).intermediatePoints[2].x) == 240 && (diagram.connectors[16] as Connector).intermediatePoints[2].y == 436.5 && (diagram.connectors[16] as Connector).intermediatePoints[3].x == 276 && (diagram.connectors[16] as Connector).intermediatePoints[3].y == 436.5).toBe(true);
            expect((diagram.connectors[17] as Connector).intermediatePoints[0].x ==517&&(diagram.connectors[17] as Connector).intermediatePoints[0].y ==317.5&&(diagram.connectors[17] as Connector).intermediatePoints[1].x ==537&&(diagram.connectors[17] as Connector).intermediatePoints[1].y ==317.5&&(diagram.connectors[17] as Connector).intermediatePoints[2].x ==537&&(diagram.connectors[17] as Connector).intermediatePoints[2].y ==175.5&&(diagram.connectors[17] as Connector).intermediatePoints[3].x ==560&&(diagram.connectors[17] as Connector).intermediatePoints[3].y ==175.5).toBe(true);
            expect((diagram.connectors[18] as Connector).intermediatePoints[0].x ==760&&(diagram.connectors[18] as Connector).intermediatePoints[0].y ==42.5&&(diagram.connectors[18] as Connector).intermediatePoints[1].x ==780&&(diagram.connectors[18] as Connector).intermediatePoints[1].y ==42.5&&(diagram.connectors[18] as Connector).intermediatePoints[2].x ==780&&(diagram.connectors[18] as Connector).intermediatePoints[2].y ==52.71&&(diagram.connectors[18] as Connector).intermediatePoints[3].x ==807&&(diagram.connectors[18] as Connector).intermediatePoints[3].y ==52.71).toBe(true);
            expect((diagram.connectors[19] as Connector).intermediatePoints[0].x == 739.5 && (diagram.connectors[19] as Connector).intermediatePoints[0].y == 247 && (diagram.connectors[19] as Connector).intermediatePoints[1].x == 760.83 && (diagram.connectors[19] as Connector).intermediatePoints[1].y == 247 && (diagram.connectors[19] as Connector).intermediatePoints[2].x == 760.83 && (diagram.connectors[19] as Connector).intermediatePoints[2].y == 302.71 && (diagram.connectors[19] as Connector).intermediatePoints[3].x == 1020.83 && (diagram.connectors[19] as Connector).intermediatePoints[3].y == 302.71 && (diagram.connectors[19] as Connector).intermediatePoints[4].x == 1020.83 && (diagram.connectors[19] as Connector).intermediatePoints[4].y == 273.71 && (diagram.connectors[19] as Connector).intermediatePoints[5].x == 1085 && (diagram.connectors[19] as Connector).intermediatePoints[5].y == 273.71 && (diagram.connectors[19] as Connector).intermediatePoints[6].x == 1085 && (diagram.connectors[19] as Connector).intermediatePoints[6].y == 273.706685841084 && (diagram.connectors[19] as Connector).intermediatePoints[7].x == 1091 && (diagram.connectors[19] as Connector).intermediatePoints[7].y == 273.71).toBe(true);
            expect((diagram.connectors[20] as Connector).intermediatePoints[0].x ==874.5&&(diagram.connectors[20] as Connector).intermediatePoints[0].y ==247&&(diagram.connectors[20] as Connector).intermediatePoints[1].x ==894.5&&(diagram.connectors[20] as Connector).intermediatePoints[1].y ==247&&(diagram.connectors[20] as Connector).intermediatePoints[2].x ==894.5&&(diagram.connectors[20] as Connector).intermediatePoints[2].y ==198.71&&(diagram.connectors[20] as Connector).intermediatePoints[3].x ==1212&&(diagram.connectors[20] as Connector).intermediatePoints[3].y ==198.71).toBe(true);
            expect((diagram.connectors[21] as Connector).intermediatePoints[0].x ==1009.5&&(diagram.connectors[21] as Connector).intermediatePoints[0].y ==247&&(diagram.connectors[21] as Connector).intermediatePoints[1].x ==1029.5&&(diagram.connectors[21] as Connector).intermediatePoints[1].y ==247&&(diagram.connectors[21] as Connector).intermediatePoints[2].x ==1029.5&&(diagram.connectors[21] as Connector).intermediatePoints[2].y ==417.71&&(diagram.connectors[21] as Connector).intermediatePoints[3].x ==1250&&(diagram.connectors[21] as Connector).intermediatePoints[3].y ==417.71).toBe(true);
            expect((diagram.connectors[22] as Connector).intermediatePoints[0].x ==1280&&(diagram.connectors[22] as Connector).intermediatePoints[0].y ==447.71&&(diagram.connectors[22] as Connector).intermediatePoints[1].x ==1280&&(diagram.connectors[22] as Connector).intermediatePoints[1].y ==479.166666666667&&(diagram.connectors[22] as Connector).intermediatePoints[2].x ==1474.5&&(diagram.connectors[22] as Connector).intermediatePoints[2].y ==479.17).toBe(true);
            expect((diagram.connectors[23] as Connector).intermediatePoints[0].x ==1564.5&&(diagram.connectors[23] as Connector).intermediatePoints[0].y ==479.17&&(diagram.connectors[23] as Connector).intermediatePoints[1].x ==1669.5&&(diagram.connectors[23] as Connector).intermediatePoints[1].y ==479.17).toBe(true);
            done();
        });
    });

    // Sample Browser
    describe('Sample Browser - Test Case', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSampleBrowserLineRouting' });
            document.body.appendChild(ele);
            let portCollection = [
                { id: "left", offset: { x: 0, y: 0.5 } },
                { id: 'top', offset: { x: 0.5, y: 0 } },
                { id: 'right', offset: { x: 1, y: 0.5 } },
                { id: "bottom", offset: { x: 0.5, y: 1 } }];

            let nodes: NodeModel[] = [{
                id: 'start', offsetX: 115, offsetY: 110, shape: { type: 'Flow', shape: 'Terminator' },
                ports: [{ id: 'port1', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hidden }],
                style: { fill: '#D5535D' }, annotations: [{ content: 'Start', style: { color: 'white' } }]
            },
            {
                id: 'process', offsetX: 115, offsetY: 255, shape: { type: 'Flow', shape: 'Process' },
                style: { fill: '#65B091' }, annotations: [{ content: 'Process', style: { color: 'white' } }]
            },
            {
                id: 'document', offsetX: 115, offsetY: 400, shape: { type: 'Flow', shape: 'Document' },
                ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hidden }],
                annotations: [{ content: 'Document', style: { color: 'white' } }], style: { fill: '#5BA5F0' }
            },
            {
                id: 'decision', offsetX: 390, offsetY: 110, shape: { type: 'Flow', shape: 'Decision' },
                style: { fill: '#9A8AF7' }, annotations: [{ content: 'Decision', style: { color: 'white' } }]
            },
            {
                id: 'document2', offsetX: 390, offsetY: 255, shape: { type: 'Flow', shape: 'Document' },
                style: { fill: '#5BA5F0' }, annotations: [{ content: 'Document', style: { color: 'white' } }]
            },
            {
                id: 'end', offsetX: 390, offsetY: 400, shape: { type: 'Flow', shape: 'Terminator' },
                style: { fill: '#D5535D' }, annotations: [{ content: 'End', style: { color: 'white' } }]
            },
            {
                id: 'process2', offsetX: 640, offsetY: 110, shape: { type: 'Flow', shape: 'Process' },
                style: { fill: '#65B091' }, annotations: [{ content: 'Process', style: { color: 'white' } }]
            },
            {
                id: 'card', offsetX: 640, offsetY: 255,
                shape: { type: 'Flow', shape: 'Card' },
                style: { fill: '#76C3F0' },
                annotations: [{ content: 'Card', style: { color: 'white' } }],
                ports: [
                    { id: 'port1', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hidden },
                    { id: 'port2', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Hidden }
                ],
            }
            ];
            let connectors: ConnectorModel[] = [
                { id: 'Connector1', sourceID: 'start', targetID: 'process', },
                { id: 'Connector2', sourceID: 'process', targetID: 'document' },
                { id: 'Connector3', sourceID: 'document', targetID: 'end' },
                { id: 'Connector4', sourceID: 'start', targetID: 'decision' },
                { id: 'Connector5', sourceID: 'decision', targetID: 'process2' },
                { id: 'Connector6', sourceID: 'process2', targetID: 'card' },
                { id: 'Connector7', sourceID: 'process', targetID: 'document2' },
                { id: 'Connector8', sourceID: 'document2', targetID: 'card' },
                { id: 'Connector9', sourceID: 'start', sourcePortID: 'port1', targetID: 'card', targetPortID: 'port1' },
                { id: 'Connector10', sourceID: 'card', sourcePortID: 'port2', targetID: 'document', targetPortID: 'port1' }
            ];
            diagram = new Diagram({
                width: 1000, height: 600,
                nodes: nodes, connectors: connectors,
                snapSettings: {
                    constraints: SnapConstraints.None
                },
                constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                getNodeDefaults: function (node: NodeModel) {
                    node.height = 50;
                    if (node.id === 'decision') {
                        node.height = 70;
                    }
                    node.width = 120;
                    node.style = { strokeColor: 'transparent' };
                    return node;
                },
                getConnectorDefaults: function (connector: ConnectorModel) {
                    connector.type = 'Orthogonal';
                    connector.style = { strokeColor: '#707070 ', strokeWidth: 1.25 };
                    connector.targetDecorator = { style: { fill: '#707070 ', strokeColor: '#707070 ' } };
                    return connector;
                }
            });
            diagram.appendTo('#diagramSampleBrowserLineRouting');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Exception raised - complex diagram', (done: Function) => {

            for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
            debugger
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 115 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 135 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 115 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 230).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 115 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 280 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 115 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 375).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 175 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 400 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 330.11 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 400).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 175 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 110 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 331.66 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 110).toBe(true);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 110 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 580 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 110).toBe(true);
            expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 640 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 135 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 640 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 230).toBe(true);
            expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 175 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 255 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 330 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 255).toBe(true);
            expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 450 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 255 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 580 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 255).toBe(true);
            expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 115 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 85 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 115 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 65 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 720 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 65 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 720 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 255 && (diagram.connectors[8] as Connector).intermediatePoints[4].x == 700 && (diagram.connectors[8] as Connector).intermediatePoints[4].y == 255).toBe(true);
            expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 640 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 280 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 640 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[9] as Connector).intermediatePoints[2].x == 35 && (diagram.connectors[9] as Connector).intermediatePoints[2].y == 300 && (diagram.connectors[9] as Connector).intermediatePoints[3].x == 35 && (diagram.connectors[9] as Connector).intermediatePoints[3].y == 400 && (diagram.connectors[9] as Connector).intermediatePoints[4].x == 55 && (diagram.connectors[9] as Connector).intermediatePoints[4].y == 400).toBe(true);
            done();
        });
    });

    //describe('Sample Browser - Test Case1', () => {
    //    let mouseEvents = new MouseEvents();
    //    let diagramCanvas: HTMLElement;
    //    beforeAll((): void => {
    //        ele = createElement('div', { id: 'SampleBrowserLineRouting' });
    //        document.body.appendChild(ele);
    //        let portCollection = [
    //            { id: "left", offset: { x: 0, y: 0.5 } },
    //            { id: 'top', offset: { x: 0.5, y: 0 } },
    //            { id: 'right', offset: { x: 1, y: 0.5 } },
    //            { id: "bottom", offset: { x: 0.5, y: 1 } }];

    //        let nodes: NodeModel[] = [{
    //            id: 'start', offsetX: 115, offsetY: 110, shape: { type: 'Flow', shape: 'Terminator' },
    //            ports: [{ id: 'port1', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hidden }],
    //            style: { fill: '#D5535D' }, annotations: [{ content: 'Start', style: { color: 'white' } }]
    //        },
    //        {
    //            id: 'process', offsetX: 115, offsetY: 255, shape: { type: 'Flow', shape: 'Process' },
    //            style: { fill: '#65B091' }, annotations: [{ content: 'Process', style: { color: 'white' } }]
    //        },
    //        {
    //            id: 'document', offsetX: 115, offsetY: 400, shape: { type: 'Flow', shape: 'Document' },
    //            ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hidden }],
    //            annotations: [{ content: 'Document', style: { color: 'white' } }], style: { fill: '#5BA5F0' }
    //        },
    //        {
    //            id: 'decision', offsetX: 390, offsetY: 110, shape: { type: 'Flow', shape: 'Decision' },
    //            style: { fill: '#9A8AF7' }, annotations: [{ content: 'Decision', style: { color: 'white' } }]
    //        },
    //        {
    //            id: 'document2', offsetX: 390, offsetY: 255, shape: { type: 'Flow', shape: 'Document' },
    //            style: { fill: '#5BA5F0' }, annotations: [{ content: 'Document', style: { color: 'white' } }]
    //        },
    //        {
    //            id: 'end', offsetX: 390, offsetY: 400, shape: { type: 'Flow', shape: 'Terminator' },
    //            style: { fill: '#D5535D' }, annotations: [{ content: 'End', style: { color: 'white' } }]
    //        },
    //        {
    //            id: 'process2', offsetX: 640, offsetY: 110, shape: { type: 'Flow', shape: 'Process' },
    //            style: { fill: '#65B091' }, annotations: [{ content: 'Process', style: { color: 'white' } }]
    //        },
    //        {
    //            id: 'card', offsetX: 640, offsetY: 255,
    //            shape: { type: 'Flow', shape: 'Card' },
    //            style: { fill: '#76C3F0' },
    //            annotations: [{ content: 'Card', style: { color: 'white' } }],
    //            ports: [
    //                { id: 'port1', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hidden },
    //                { id: 'port2', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Hidden }
    //            ],
    //        }
    //        ];
    //        let connectors: ConnectorModel[] = [
    //            { id: 'Connector1', sourceID: 'start', targetID: 'process', },
    //            { id: 'Connector2', sourceID: 'process', targetID: 'document' },
    //            { id: 'Connector3', sourceID: 'document', targetID: 'end' },
    //            { id: 'Connector4', sourceID: 'start', targetID: 'decision' },
    //            { id: 'Connector5', sourceID: 'decision', targetID: 'process2' },
    //            { id: 'Connector6', sourceID: 'process2', targetID: 'card' },
    //            { id: 'Connector7', sourceID: 'process', targetID: 'document2' },
    //            { id: 'Connector8', sourceID: 'document2', targetID: 'card' },
    //            { id: 'Connector9', sourceID: 'start', sourcePortID: 'port1', targetID: 'card', targetPortID: 'port1' },
    //            { id: 'Connector10', sourceID: 'card', sourcePortID: 'port2', targetID: 'document', targetPortID: 'port1' }
    //        ];
    //        diagram = new Diagram({
    //            width: 1000, height: 600,
    //            nodes: nodes, connectors: connectors,
    //            snapSettings: {
    //                constraints: SnapConstraints.None
    //            },
    //            constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
    //            getNodeDefaults: function (node: NodeModel) {
    //                node.height = 50;
    //                if (node.id === 'decision') {
    //                    node.height = 70;
    //                }
    //                node.width = 120;
    //                node.style = { strokeColor: 'transparent' };
    //                return node;
    //            },
    //            getConnectorDefaults: function (connector: ConnectorModel) {
    //                connector.type = 'Orthogonal';
    //                connector.style = { strokeColor: '#707070 ', strokeWidth: 1.25 };
    //                connector.targetDecorator = { style: { fill: '#707070 ', strokeColor: '#707070 ' } };
    //                return connector;
    //            }
    //        });
    //        diagram.appendTo('#SampleBrowserLineRouting');
    //        diagramCanvas = document.getElementById(diagram.element.id + 'content');
    //    });

    //    afterAll((): void => {
    //        diagram.destroy();
    //        ele.remove();
    //    });

    //    it('Exception raised - Line routing issue', (done: Function) => {
    //        console.log("test case for 6349")
    //        for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
    //        mouseEvents.clickEvent(diagramCanvas, 350, 250);
    //        mouseEvents.mouseDownEvent(diagramCanvas, 350, 250);
    //        mouseEvents.mouseMoveEvent(diagramCanvas, 230, 110);
    //        mouseEvents.mouseUpEvent(diagramCanvas, 230, 110);
    //        expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 115 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 135 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 115 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 230).toBe(true);
    //        expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 115 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 280 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 115 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 375).toBe(true);
    //        expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 175 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 400 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 330.11 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 400).toBe(true);
    //        expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 175 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 110 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 331.66 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 110).toBe(true);
    //        expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 110 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 580 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 110).toBe(true);
    //        expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 640 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 135 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 640 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 230).toBe(true);
    //        expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 175 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 255 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 330 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 255).toBe(true);
    //        expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 450 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 255 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 580 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 255).toBe(true);
    //        expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 640 && (diagram.connectors[9] as Connector).intermediatePoints[0].y ==280 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 640 && (diagram.connectors[9] as Connector).intermediatePoints[1].y ==300 &&(diagram.connectors[9] as Connector).intermediatePoints[2].x ==35 && (diagram.connectors[9] as Connector).intermediatePoints[2].y ==300 && (diagram.connectors[9] as Connector).intermediatePoints[3].x ==35 && (diagram.connectors[9] as Connector).intermediatePoints[3].y ==400 &&(diagram.connectors[9] as Connector).intermediatePoints[4].x ==55 && (diagram.connectors[9] as Connector).intermediatePoints[4].y ==400).toBe(true);
    //        done();
    //    });
    //});

    describe('EJ2-37668 -  Connector did not render properly for the port to port connection', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramLineRouting2' });
            document.body.appendChild(ele);
            
            diagram = new Diagram({
                width: "700px",
                height: "800px",
                nodes: [
                    {
                        id: "NewIdea", width: 100, height: 160,
                        offsetX: 300, offsetY: 280,
                        ports: [{ id: 'port1', offset: { x: 1, y: 0.7 } }]
                    },
                    {
                        id: "Meeting", width: 100, height: 60, offsetX: 500, offsetY: 480,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.7 } }]
                    }
                ],
                connectors: [
                    {
                        id: 'connector', sourceID: 'NewIdea', targetID: 'Meeting', sourcePortID: 'port1', targetPortID: 'port1', type: 'Orthogonal'
                    }
                ],
                constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
            });
            diagram.appendTo('#diagramLineRouting2');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('CR issue', (done: Function) => {
            for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x ==350&&(diagram.connectors[0] as Connector).intermediatePoints[0].y ==312&&(diagram.connectors[0] as Connector).intermediatePoints[1].x ==370&&(diagram.connectors[0] as Connector).intermediatePoints[1].y ==312&&(diagram.connectors[0] as Connector).intermediatePoints[2].x ==370&&(diagram.connectors[0] as Connector).intermediatePoints[2].y ==492&&(diagram.connectors[0] as Connector).intermediatePoints[3].x ==450&&(diagram.connectors[0] as Connector).intermediatePoints[3].y ==492).toBe(true);
            done();
        });
    });
    describe('Line Routing - Straight segment', () => {

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramRoutingStraight' });
            document.body.appendChild(ele);

            nodes = [
                {
                    id: 'node1', width: 100, height: 60, offsetX: 100, offsetY: 100
                },
                {
                    id: 'node2', width: 100, offsetX: 300, offsetY: 100
                }
            ]

            connectors = [{
                id: 'Connector1', sourceID: 'node1', targetID: 'node2'
            }]

            diagram = new Diagram({
                width: 600, height: 600,
                connectors: connectors, nodes: nodes,
                constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting                
            });
            diagram.appendTo('#diagramRoutingStraight');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Line routing - Straight Segment Connector', (done: Function) => {
            expect(diagram.connectors[0].targetPoint.x == 250).toBe(true);
            diagram.nodes[1].offsetX += 10;
            diagram.dataBind();
            expect(diagram.connectors[0].targetPoint.x == 260).toBe(true);
            done();
        });
    });
    describe('EJ2-38721 - Line Routing for group', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramLineRoutingGroup' });
            document.body.appendChild(ele);
            
            diagram = new Diagram({
                width: "700px",
                height: "800px",
                nodes: [
                    {
                        id: "node1", height: 100, width: 100, offsetX: 300, offsetY: 100,
                        annotations: [{ content: "Node1" }]
                    },
                    {
                        id: "node2", height: 100, width: 100, offsetX: 500, offsetY: 250,
                        annotations: [{ content: "Node2" }]
                    },
                    {
                        id: "node3", height: 100, width: 100, offsetX: 100, offsetY: 250,
                        annotations: [{ content: "Node3" }]
                    },
                    {
                        id: "node4", height: 100, width: 100, offsetX: 300, offsetY: 400,
                        annotations: [{ content: "Node4" }]
                    },
                    {
                        id: 'group', children: ['node1', 'node2', 'node3']
                    }
                ],
                connectors: [
                    { id: 'connector1', sourceID: 'node1', targetID: 'node2', },
                    { id: 'connector2', sourceID: 'node2', targetID: 'node3', },
                    { id: 'connector3', sourceID: 'node3', targetID: 'node1', },
                    { id: 'connector4', sourceID: 'node3', targetID: 'node4' }
                ],
                constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
            });
            diagram.appendTo('#diagramLineRoutingGroup');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('CR issue', (done: Function) => {
            for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 320 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 500 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 320 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 500 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 450 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 250 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 150 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 250).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 250 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 150).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 320 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 320).toBe(true);
            done();
        });
    });
    let expandRoutingData: object[] =    [
        { 'Id': 'parent', 'Role': 'Board', 'color': '#71AF17' },
        { 'Id': '1', 'Role': 'General Manager', 'Manager': 'parent', 'ChartType': 'right', 'color': '#71AF17' },
        { 'Id': '11', 'Role': 'Assistant Manager', 'Manager': '1', 'color': '#71AF17' },
        { 'Id': '2', 'Role': 'Human Resource Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
        { 'Id': '3', 'Role': 'Trainers', 'Manager': '2', 'color': '#2E95D8' },
        { 'Id': '4', 'Role': 'Recruiting Team', 'Manager': '2', 'color': '#2E95D8' },
        { 'Id': '5', 'Role': 'Finance Asst. Manager', 'Manager': '2', 'color': '#2E95D8' },
        { 'Id': '6', 'Role': 'Design Manager', 'Manager': '1', 'ChartType': 'right', 'color': '#1859B7' },
        { 'Id': '7', 'Role': 'Design Supervisor', 'Manager': '6', 'color': '#2E95D8' },
        { 'Id': '8', 'Role': 'Development Supervisor', 'Manager': '6', 'color': '#2E95D8' },
        { 'Id': '9', 'Role': 'Drafting Supervisor', 'Manager': '6', 'color': '#2E95D8' },
    ]
    describe('Org Chart', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'expandRoutingLayout' });
            document.body.appendChild(ele);
            let items = new DataManager(expandRoutingData, new Query().take(7));
            diagram = new Diagram({
                width: '1300px', height: '900px',
                snapSettings: { constraints: 0 },
                constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                layout: {
                    type: 'OrganizationalChart',
                    // enableAnimation: true,
                    getLayoutInfo: (node: Node, options: TreeInfo) => {
                        if (node.data['Role'] === 'General Manager') {
                            options.assistants.push(options.children[0]);
                            options.children.splice(0, 1);
                        }
                        if (!options.hasSubTree) {
                            options.type = 'Balanced';
                            options.orientation = 'Horizontal';
                        }
                    }
                },
                dataSourceSettings: {
                    id: 'Id', parentId: 'Manager', dataSource: items
                },

                getNodeDefaults: (obj: Node, diagram: Diagram) => {
                    obj.width = 150;
                    obj.height = 50;
                    obj.style.fill = obj.data['color'];
                    obj.annotations = [{ content: obj.data['Role'], style: { color: 'white' } }];
                    obj.expandIcon = { height: 15, width: 15, shape: "Plus", fill: 'lightgray', offset: { x: .5, y: .85 } };
                    obj.collapseIcon.offset = { x: .5, y: .85 };
                    obj.collapseIcon.height = 15;
                    obj.collapseIcon.width = 15;
                    obj.collapseIcon.shape = "Minus";
                    obj.collapseIcon.fill = 'lightgray';        
                    return obj;
                }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.targetDecorator.shape = 'None';
                    connector.type = 'Orthogonal';
                    return connector;
                }
            });
            diagram.appendTo('#expandRoutingLayout');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Routing - expand and collapse', (done: Function) => {
            debugger
            diagram.nodes[3].isExpanded = false;
            diagram.dataBind();
            diagram.nodes[3].isExpanded = true;
            diagram.dataBind();
            setTimeout(function () {
                // let connector = diagram.nameTable[(diagram.nodes[3] as Node).inEdges[0]];
                // expect((connector as Connector).intermediatePoints.length === 3).toBe(true);
                done();
            }, 500);
        });
        it('Routing - expand and collapse - test', (done: Function) => {
            setTimeout(function () {
                console.log("settImout");
                let connector = diagram.nameTable[(diagram.nodes[3] as Node).inEdges[0]];
                console.log("connector.intermediatePoints.length:"+connector.intermediatePoints.length);
                done();
            }, 500);
        });
        it('Routing - expand and collapse - test', (done: Function) => {
            setTimeout(function () {
                done();
            }, 500);
        });
    });
    describe('(EJ2-40972): Exception occurs when try to load the diagram with line routing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        var save = {"width":"100%","height":540,"snapSettings":{"horizontalGridlines":{"lineColor":"#ffffff","lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20],"lineDashArray":""},"verticalGridlines":{"lineColor":"#ffffff","lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20],"lineDashArray":""},"constraints":31,"gridType":"Lines","snapObjectDistance":5},"getConnectorDefaults":{},"doubleClick":{},"dragEnter":{},"constraints":500,"enableRtl":false,"locale":"en-US","enablePersistence":false,"scrollSettings":{"viewPortWidth":980,"viewPortHeight":540,"currentZoom":1.3412052117263844,"horizontalOffset":1883.0521172638437,"verticalOffset":-66.28501628664492,"padding":{"left":0,"right":0,"top":0,"bottom":0},"minZoom":0.2,"maxZoom":30,"scrollLimit":"Diagram","canAutoScroll":false},"rulerSettings":{"showRulers":false,"horizontalRuler":{"orientation":"Horizontal"},"verticalRuler":{"orientation":"Vertical"}},"backgroundColor":"transparent","dataSourceSettings":{"crudAction":{"read":""},"connectionDataSource":{"crudAction":{"read":""}}},"mode":"SVG","layers":[{"objects":["Ellipseygf6p","ProcessLv8hw","DecisionTxR1N","ProcessH8c8B","ProcessKn3UF","ProcessuJU1A","ProcesspI5AA","DecisionxmX8W","ProcessspHoW","DecisionHWGB5","ProcessCFmJe","DecisionfGmss","EllipseryggE","ProcessuBBgf","EllipsesH9ku","Link21CeAQs","Link21Rh8GL","Link21lvgW8","Link21Wc0sM","Link21cw0b2","Link21bET1t","Link21o1WvO","Link1y1mek","Link21vphdn","Link21JFTgI","Link21rcSXc","Link21p9KTs","Link1kRx4l","Link21lKIeh","Link21n41RP","Link21rDflN","LabelXcJJU","LabelI1t11","LabeloIDfJ","Link21fDR49","LabelqKW4P","Labelg9O8D","LabelDqFkA","LabelSkOBS","LabeleSfqp","title","description"],"id":"default_layer","visible":true,"lock":false,"zIndex":0}],"nodes":[{"shape":{"type":"Basic","shape":"Ellipse"},"id":"Ellipseygf6p","constraints":5240430,"ports":[{"inEdges":[],"outEdges":[],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[""],"outEdges":["Link21CeAQs"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"gfs0M","content":"New inquiry","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"width":198.11580503328196,"height":119.99421583059254,"offsetX":-1200.942097483359,"offsetY":-660.0028920847037,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.11580503328196,"height":119.99421583059254},"offsetX":-1200.942097483359,"offsetY":-660.0028920847037},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":0,"addInfo":{"aprsId":"b421a854-9a2f-4765-85c6-54c80d6ab477"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":[""],"outEdges":["Link21CeAQs"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessLv8hw","constraints":5240430,"annotations":[{"id":"Psp2V","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.1 : Create Opportunity On Spot","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"FfkCe","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"CbSnV","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"inEdges":[""],"outEdges":[""],"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21CeAQs"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21Rh8GL"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":60,"offsetX":-1200.942097483359,"offsetY":-510,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":140,"height":60},"offsetX":-1200.942097483359,"offsetY":-510},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":1,"addInfo":{"aprsId":"24ef5d4f-1344-4256-8019-ae36fb9c552b","processId":"55"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21CeAQs"],"outEdges":["Link21Rh8GL"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Decision"},"id":"DecisionTxR1N","constraints":5240430,"ports":[{"inEdges":["Link21Rh8GL"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21Wc0sM"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"JqwNr","content":"Is this Project or New Destination?","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"offsetX":-1200.9427498998646,"offsetY":-379.99080610158853,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.11450020027087,"height":119.98161220317711},"offsetX":-1200.9427498998646,"offsetY":-379.99080610158853},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":2,"addInfo":{"aprsId":"afd11e5a-982f-4803-bd99-df0ff079bf88"},"isExpanded":true,"expandIcon":{"shape":"None"},"width":198.11450020027087,"height":119.98161220317711,"tooltip":{"openOn":"Auto"},"inEdges":["Link21Rh8GL"],"outEdges":["Link21Wc0sM"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessH8c8B","constraints":5240430,"annotations":[{"id":"rEcO9","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.2 : Record in Development Stage","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"W9iBb","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"KThav","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"inEdges":[],"outEdges":[],"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21rDflN"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":59.996752746999256,"offsetX":-890,"offsetY":-379.99080610158853,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":140,"height":59.996752746999256},"offsetX":-890,"offsetY":-379.99080610158853},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":3,"addInfo":{"aprsId":"5e0e6504-78f3-4f84-abb0-0719ccaec4ba","processId":"56"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":[],"outEdges":["Link21rDflN"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessKn3UF","constraints":5240430,"annotations":[{"id":"di8Nn","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.3 : Edit Opportunity With All Obligatory Info.","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"yULwf","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"e4hXl","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"inEdges":[""],"outEdges":[""],"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21Wc0sM"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21cw0b2"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":139.99817389462135,"height":60.00000000000001,"offsetX":-1200.94,"offsetY":-249.98000000000002,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":139.99817389462135,"height":60.00000000000001},"offsetX":-1200.94,"offsetY":-249.98000000000002},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":4,"addInfo":{"aprsId":"e46b9d9a-ec4f-464b-8a39-428dec69c037","processId":"58"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21Wc0sM"],"outEdges":["Link21cw0b2"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessuJU1A","constraints":5240430,"annotations":[{"id":"hNSnS","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.4 : Create New Account ","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"ZoCGb","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"xlTQM","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"inEdges":[],"outEdges":[],"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21bET1t"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link1y1mek"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":60.00000000000001,"offsetX":-670,"offsetY":-249.98000000000002,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":140,"height":60.00000000000001},"offsetX":-670,"offsetY":-249.98000000000002},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":5,"addInfo":{"aprsId":"6563ee1d-0404-41ab-b787-cbc990c810e4","processId":"57"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21bET1t"],"outEdges":["Link1y1mek"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcesspI5AA","constraints":5240430,"annotations":[{"id":"tWI5b","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.5 : Choose The Correct Account","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"V05Ga","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"I6Brb","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21o1WvO"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21fDR49"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link1y1mek"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":60.00000000000001,"offsetX":-890,"offsetY":-130,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":140,"height":60.00000000000001},"offsetX":-890,"offsetY":-130},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":6,"addInfo":{"aprsId":"40b6e564-cee5-4bd2-885f-6cb016076a29","processId":"61"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link1y1mek","Link21fDR49"],"outEdges":["Link21o1WvO"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Decision"},"id":"DecisionxmX8W","constraints":5240430,"ports":[{"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21cw0b2"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21bET1t"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21fDR49"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"MhpIn","content":"Is This Existing Account ?","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"offsetX":-890,"offsetY":-249.98000000000002,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.1138982302283,"height":119.99134065866471},"offsetX":-890,"offsetY":-249.98000000000002},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":7,"addInfo":{"aprsId":"0cfdcff6-2480-4eda-a5e8-97578b7ac7a7"},"isExpanded":true,"expandIcon":{"shape":"None"},"width":198.1138982302283,"height":119.99134065866471,"tooltip":{"openOn":"Auto"},"inEdges":["Link21cw0b2"],"outEdges":["Link21bET1t","Link21fDR49"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessspHoW","constraints":5240430,"annotations":[{"id":"rv2Wr","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.6 : Choose The Right Company","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"LQyUm","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"bbrxc","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"inEdges":[],"outEdges":[],"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21o1WvO"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21vphdn"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":60.00000000000001,"offsetX":-1200.94,"offsetY":-130,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":140,"height":60.00000000000001},"offsetX":-1200.94,"offsetY":-130},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":10,"addInfo":{"aprsId":"39c407dc-157f-4e0b-bcee-7b2f0915ff0a","processId":"59"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21o1WvO"],"outEdges":["Link21vphdn"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Decision"},"id":"DecisionHWGB5","constraints":5240430,"ports":[{"inEdges":["Link21vphdn"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link1kRx4l"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21JFTgI"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"ariaV","content":"Is Additional Info Available ?","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"offsetX":-1200.94,"offsetY":19.971612203177102,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.11751064604857,"height":119.98322440635422},"offsetX":-1200.94,"offsetY":19.971612203177102},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":25,"addInfo":{"aprsId":"55b1122b-0454-4ee7-8943-f92fb090cc93"},"isExpanded":true,"expandIcon":{"shape":"None"},"width":198.11751064604857,"height":119.98322440635422,"tooltip":{"openOn":"Auto"},"inEdges":["Link21vphdn"],"outEdges":["Link21JFTgI","Link1kRx4l"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessCFmJe","constraints":5240430,"annotations":[{"id":"RtS8F","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.7 : Update Opportunity With Additional Info.","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"T4FKx","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"i29U0","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21JFTgI"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21rcSXc"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":139.99999999999997,"height":59.99798474602867,"offsetX":-1200.94,"offsetY":169.94221677936844,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":139.99999999999997,"height":59.99798474602867},"offsetX":-1200.94,"offsetY":169.94221677936844},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":28,"addInfo":{"aprsId":"f856a01a-28cb-4240-a2d3-bb3aa8f9607c"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21JFTgI"],"outEdges":["Link21rcSXc"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Decision"},"id":"DecisionfGmss","constraints":5240430,"ports":[{"inEdges":["Link21rcSXc"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link1kRx4l"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21p9KTs"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21lKIeh"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"Hn66x","content":"Is this Project ?","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"offsetX":-1200.94,"offsetY":319.9161058002012,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.1230078603563,"height":119.98979329563674},"offsetX":-1200.94,"offsetY":319.9161058002012},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":33,"addInfo":{"aprsId":"5dd31104-b5a8-4016-a030-9d8ea11f15fd"},"isExpanded":true,"expandIcon":{"shape":"None"},"width":198.1230078603563,"height":119.98979329563674,"tooltip":{"openOn":"Auto"},"inEdges":["Link21rcSXc","Link1kRx4l"],"outEdges":["Link21p9KTs","Link21lKIeh"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Basic","shape":"Ellipse"},"id":"EllipseryggE","constraints":5240430,"ports":[{"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21p9KTs"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"pVHn9","content":"Save & Move under Project In Development Stage","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"width":200.00000000000003,"height":75.38000000000002,"offsetX":-760,"offsetY":319.9161058002012,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":200.00000000000003,"height":75.38000000000002},"offsetX":-760,"offsetY":319.9161058002012},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":36,"addInfo":{"aprsId":"a8000f6e-eebc-4431-8150-001600e07e35"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21p9KTs"],"outEdges":[],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessuBBgf","constraints":5240430,"annotations":[{"id":"PX7PK","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.8 : Save and Schedule Activity For Pricing ","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"qn8nv","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"fttuv","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21lKIeh"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21n41RP"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":59.997944812572406,"offsetX":-1200.94,"offsetY":450.0010275937138,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":140,"height":59.997944812572406},"offsetX":-1200.94,"offsetY":450.0010275937138},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":37,"addInfo":{"aprsId":"b62721b7-1341-430c-8b30-a52bde7012db","processId":"60"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21lKIeh"],"outEdges":["Link21n41RP"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Basic","shape":"Ellipse"},"id":"EllipsesH9ku","constraints":5240430,"ports":[{"inEdges":[],"outEdges":[],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"f6DZ8","content":"Move to Awaiting Price Stage","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"width":198.11599571358744,"height":75.38000000000018,"offsetX":-760,"offsetY":450.00102759371384,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.11599571358744,"height":75.38000000000018},"offsetX":-760,"offsetY":450.00102759371384},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":38,"addInfo":{"aprsId":"a47b4ff3-b6be-4a2f-bb56-e663ee75adb8"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":[],"outEdges":[],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Yes","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelXcJJU","width":100,"height":40,"offsetX":-1039.056949115114,"offsetY":-400,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-1039.056949115114,"offsetY":-400},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":8,"addInfo":{"aprsId":"4bfe7a90-0126-4ae8-a65c-f6c69702e0b5"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"No","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelI1t11","width":61.88549979972915,"height":39.980000000000025,"offsetX":-1170.95,"offsetY":-299.99,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":61.88549979972915,"height":39.980000000000025},"offsetX":-1170.95,"offsetY":-299.99},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":9,"addInfo":{"aprsId":"2fc01bf4-05b7-44d2-9b90-b3507e8fdf3e"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"No","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabeloIDfJ","width":60,"height":20.000000000000004,"offsetX":-770,"offsetY":-270,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":60,"height":20.000000000000004},"offsetX":-770,"offsetY":-270},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":11,"addInfo":{"aprsId":"f6e278c2-248f-4e3d-acdb-2799b2014f73"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Yes","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelqKW4P","width":39.999999999999986,"height":39.99999999999999,"offsetX":-860,"offsetY":-180,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":39.999999999999986,"height":39.99999999999999},"offsetX":-860,"offsetY":-180},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":13,"addInfo":{"aprsId":"fa0779f2-2cff-4c82-bd36-1762e94b6b9e"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Yes","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"Labelg9O8D","width":100,"height":40,"offsetX":-1150,"offsetY":99.96322440635421,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-1150,"offsetY":99.96322440635421},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":14,"addInfo":{"aprsId":"444e8eef-d50a-482b-9cde-3305af4515c1"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"No","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelDqFkA","width":100,"height":40,"offsetX":-1370,"offsetY":159.9432244063541,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-1370,"offsetY":159.9432244063541},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":15,"addInfo":{"aprsId":"db2421ee-bda1-45f0-ba80-7394c0611dcd"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Label","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelDqFkA","width":100,"height":40,"offsetX":-1354.3424408014573,"offsetY":267.3093446249333,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-1354.3424408014573,"offsetY":267.3093446249333},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":15,"addInfo":{"aprsId":"db2421ee-bda1-45f0-ba80-7394c0611dcd"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Yes","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelSkOBS","width":100,"height":40,"offsetX":-990,"offsetY":302.2261058002012,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-990,"offsetY":302.2261058002012},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":16,"addInfo":{"aprsId":"5eaf0fa7-aeb0-4295-af1b-60f83093ec80"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"No","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabeleSfqp","width":100,"height":40,"offsetX":-1250,"offsetY":392.31102759371373,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-1250,"offsetY":392.31102759371373},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":17,"addInfo":{"aprsId":"8bab9e07-6bff-499e-a378-85d6d41f8367"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"(P.160) Recording In CRM (Macro Process)","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"title","width":600,"height":20,"style":{"fill":"white","fontSize":18,"color":"black","textAlign":"Left","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","italic":false,"bold":false},"offsetX":150,"offsetY":-680.0028920847037,"zIndex":18,"addInfo":{"aprsId":"5810baba-f715-4b6d-8fd1-30462940f131"},"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":600,"height":20},"offsetX":150,"offsetY":-680.0028920847037},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Version: 1.0 (Work In Progress)","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"description","width":600,"height":20,"style":{"fill":"white","fontSize":15,"color":"grey","textAlign":"Left","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","italic":false,"bold":false},"offsetX":150,"offsetY":610.0010275937138,"zIndex":19,"addInfo":{"aprsId":"72df02a9-92d3-49ef-85f4-e76f203e9d70"},"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":600,"height":20},"offsetX":150,"offsetY":610.0010275937138},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"(P.160) Recording In CRM (Macro Process)","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"title","width":600,"height":20,"style":{"fill":"white","fontSize":18,"color":"black","textAlign":"Left","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","italic":false,"bold":false},"offsetX":150,"offsetY":-700.0028920847037,"zIndex":20,"addInfo":{"aprsId":"e2a7ed6c-3553-45e3-8bf4-1e2e1a0cad44"},"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":600,"height":20},"offsetX":150,"offsetY":-700.0028920847037},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Version: 1.0 (Work In Progress)","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"description","width":600,"height":20,"style":{"fill":"white","fontSize":15,"color":"grey","textAlign":"Left","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","italic":false,"bold":false},"offsetX":150,"offsetY":770.0010275937138,"zIndex":21,"addInfo":{"aprsId":"6972a3a4-8e36-4512-b3ff-a52666ad98d4"},"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":600,"height":20},"offsetX":150,"offsetY":770.0010275937138},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false}],"connectors":[{"shape":{"type":"None"},"id":"Link21CeAQs","type":"Straight","sourcePoint":{"x":-1200.94,"y":-600.01},"targetPoint":{"x":-1200.94,"y":-540},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"Ellipseygf6p","targetID":"ProcessLv8hw","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":60.00999999999999},"offsetX":-1200.94,"offsetY":-570.005},"previewSize":{},"zIndex":39,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21Rh8GL","type":"Straight","sourcePoint":{"x":-1200.94,"y":-480},"targetPoint":{"x":-1200.94,"y":-439.98},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessLv8hw","targetID":"DecisionTxR1N","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":40.01999999999998},"offsetX":-1200.94,"offsetY":-459.99},"previewSize":{},"zIndex":40,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21lvgW8","type":"Straight","sourcePoint":{"x":-1101.89,"y":-379.99},"targetPoint":{"x":-960,"y":-379.99},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"","targetID":"","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":141.8900000000001,"height":0},"offsetX":-1030.9450000000002,"offsetY":-379.99},"previewSize":{},"zIndex":41,"sourcePortID":"","targetPortID":"","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21Wc0sM","type":"Straight","sourcePoint":{"x":-1200.94,"y":-320},"targetPoint":{"x":-1200.94,"y":-279.98},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionTxR1N","targetID":"ProcessKn3UF","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":40.01999999999998},"offsetX":-1200.94,"offsetY":-299.99},"previewSize":{},"zIndex":43,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21cw0b2","type":"Straight","sourcePoint":{"x":-1130.94,"y":-249.98},"targetPoint":{"x":-989.06,"y":-249.98},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessKn3UF","targetID":"DecisionxmX8W","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":141.8800000000001,"height":0},"offsetX":-1060,"offsetY":-249.98},"previewSize":{},"zIndex":44,"sourcePortID":"portrightmiddle","targetPortID":"portleftmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21bET1t","type":"Straight","sourcePoint":{"x":-790.94,"y":-249.98},"targetPoint":{"x":-740,"y":-249.98},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionxmX8W","targetID":"ProcessuJU1A","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":50.940000000000055,"height":0},"offsetX":-765.47,"offsetY":-249.98},"previewSize":{},"zIndex":46,"sourcePortID":"portrightmiddle","targetPortID":"portleftmiddle","visible":true,"hitPadding":10,"sourcePadding":0,"targetPadding":0,"tooltip":{"openOn":"Auto"},"parentId":""},{"shape":{"type":"None"},"id":"Link21o1WvO","type":"Straight","sourcePoint":{"x":-960,"y":-130},"targetPoint":{"x":-1130.94,"y":-130},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcesspI5AA","targetID":"ProcessspHoW","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":170.94000000000005,"height":0},"offsetX":-1045.47,"offsetY":-130},"previewSize":{},"zIndex":48,"sourcePortID":"portleftmiddle","targetPortID":"portrightmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link1y1mek","type":"Orthogonal","sourcePoint":{"x":-670,"y":-219.98},"targetPoint":{"x":-820,"y":-130},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessuJU1A","targetID":"ProcesspI5AA","flip":"None","segments":[{"type":"Orthogonal"}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":150,"height":89.97999999999999},"offsetX":-745,"offsetY":-174.99},"previewSize":{},"zIndex":49,"sourcePortID":"portbottommiddle","targetPortID":"portrightmiddle","visible":true,"constraints":77374,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21vphdn","type":"Straight","sourcePoint":{"x":-1200.94,"y":-100},"targetPoint":{"x":-1200.94,"y":-40.02},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessspHoW","targetID":"DecisionHWGB5","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":59.98},"offsetX":-1200.94,"offsetY":-70.01},"previewSize":{},"zIndex":50,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21JFTgI","type":"Straight","sourcePoint":{"x":-1200.94,"y":79.96},"targetPoint":{"x":-1200.94,"y":139.94},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionHWGB5","targetID":"ProcessCFmJe","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":59.980000000000004},"offsetX":-1200.94,"offsetY":109.94999999999999},"previewSize":{},"zIndex":51,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21rcSXc","type":"Straight","sourcePoint":{"x":-1200.94,"y":199.94},"targetPoint":{"x":-1200.94,"y":259.92},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessCFmJe","targetID":"DecisionfGmss","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":59.98000000000002},"offsetX":-1200.94,"offsetY":229.93},"previewSize":{},"zIndex":52,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21p9KTs","type":"Straight","sourcePoint":{"x":-1101.88,"y":319.92},"targetPoint":{"x":-860,"y":319.92},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionfGmss","targetID":"EllipseryggE","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":241.8800000000001,"height":0},"offsetX":-980.94,"offsetY":319.92},"previewSize":{},"zIndex":54,"sourcePortID":"portrightmiddle","targetPortID":"portleftmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link1kRx4l","type":"Orthogonal","sourcePoint":{"x":-1300,"y":19.97},"targetPoint":{"x":-1300,"y":319.92},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionHWGB5","targetID":"DecisionfGmss","flip":"None","segments":[{"type":"Orthogonal"}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":20,"height":299.95000000000005},"offsetX":-1310,"offsetY":169.94500000000002},"previewSize":{},"zIndex":57,"sourcePortID":"portleftmiddle","targetPortID":"portleftmiddle","visible":true,"constraints":77374,"hitPadding":10,"sourcePadding":0,"targetPadding":0,"tooltip":{"openOn":"Auto"},"parentId":""},{"shape":{"type":"None"},"id":"Link21lKIeh","type":"Straight","sourcePoint":{"x":-1200.94,"y":379.91},"targetPoint":{"x":-1200.94,"y":420},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionfGmss","targetID":"ProcessuBBgf","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":40.089999999999975},"offsetX":-1200.94,"offsetY":399.95500000000004},"previewSize":{},"zIndex":59,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21n41RP","type":"Straight","sourcePoint":{"x":-1130.94,"y":450},"targetPoint":{"x":-859.06,"y":450},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessuBBgf","targetID":"","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":271.8800000000001,"height":0},"offsetX":-995,"offsetY":450},"previewSize":{},"zIndex":60,"sourcePortID":"portrightmiddle","targetPortID":"","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21rDflN","type":"Straight","sourcePoint":{"x":-890,"y":-349.99},"targetPoint":{"x":-890,"y":-309.98},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessH8c8B","targetID":"","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":40.00999999999999},"offsetX":-890,"offsetY":-329.985},"previewSize":{},"zIndex":61,"sourcePortID":"portbottommiddle","targetPortID":"","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21fDR49","type":"Straight","sourcePoint":{"x":-890,"y":-189.98},"targetPoint":{"x":-890,"y":-160},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionxmX8W","targetID":"ProcesspI5AA","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":29.97999999999999},"offsetX":-890,"offsetY":-174.99},"previewSize":{},"zIndex":12,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""}],"layout":{"type":"None","enableAnimation":true},"pageSettings":{"orientation":"Landscape","background":{"source":"","color":"transparent"},"showPageBreaks":false,"fitOptions":{"canFit":false},"boundaryConstraints":"Infinity"},"selectedItems":{"constraints":16382,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"width":140,"height":59.99794481257243,"offsetX":-1200.94,"offsetY":450.0010275937138},"tooltip":{"content":"","relativeMode":"Object"},"commandManager":{"commands":[{"name":"paste","canExecute":{},"gesture":{},"parameter":""}]},"tool":3,"contextMenuSettings":{},"bridgeDirection":"Top","version":17.1};
              
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            function getNodeDefaults(obj: NodeModel): NodeModel {
                obj.width = 100;
                obj.height = 100;
                obj.shape = { type: 'Basic', shape: 'Ellipse' };
                obj.style = { fill: '#37909A', strokeColor: '#024249' };
                // obj.annotations[0].margin = { left: 10, right: 10 };
                // obj.annotations[0].style = { color: 'white', fill: 'none', strokeColor: 'none' };
                return obj;
            }
            
            //Sets the default values of a Connector
            function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                connector.targetDecorator.style = { fill: '#024249', strokeColor: '#024249' };
                return { style: { strokeColor: '#024249', strokeWidth: 2 } };
            }            
                       
                let nodes: NodeModel[] = [
                    { id: 'sdlc', offsetX: 300, offsetY: 288, annotations: [{ content: 'SDLC' }] },
                    { id: 'support', offsetX: 150, offsetY: 250, annotations: [{ content: 'Support' }] },
                    { id: 'analysis', offsetX: 300, offsetY: 150, annotations: [{ content: 'Analysis' }] },
                    { id: 'design', offsetX: 450, offsetY: 250, annotations: [{ content: 'Design' }] },
                    { id: 'implement', offsetX: 400, offsetY: 400, annotations: [{ content: 'implement' }] },
                    { id: 'deploy', offsetX: 200, offsetY: 400, annotations: [{ content: 'Deploy' }] }
                ];
            
                let connections: ConnectorModel[] = [
                    { id: 'connector1', sourceID: 'analysis', targetID: 'design'},
                    { id: 'connector2', sourceID: 'design', targetID: 'implement' },
                    { id: 'connector3', sourceID: 'implement', targetID: 'deploy' },
                    { id: 'connector4', sourceID: 'deploy', targetID: 'support' },
                    { id: 'connector5', sourceID: 'support', targetID: 'analysis' }
                ];
            
                //Initializes diagram control
                diagram = new Diagram({
                    width: '100%', height: '645px', nodes: nodes, connectors: connections,
                    //Sets the default values of a node
                    getNodeDefaults: getNodeDefaults,
                    //Sets the default values of a Connector
                    getConnectorDefaults: getConnectorDefaults,
                    snapSettings: { constraints: SnapConstraints.None },
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting
                });
                diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Condition check on diagram node', (done: Function) => {
            debugger
            var data = JSON.stringify(save);
            diagram.loadDiagram(data); 
            expect(diagram.nodes.length == 28).toBe(true);
            done();
        });
    });


    describe('(EJ2-47194): Line routing is not working if the connection end point of the connector has two or more nodes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        var save = {"width":"100%","height":540,"snapSettings":{"horizontalGridlines":{"lineColor":"#ffffff","lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20],"lineDashArray":""},"verticalGridlines":{"lineColor":"#ffffff","lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20],"lineDashArray":""},"constraints":31,"gridType":"Lines","snapObjectDistance":5},"getConnectorDefaults":{},"doubleClick":{},"dragEnter":{},"constraints":500,"enableRtl":false,"locale":"en-US","enablePersistence":false,"scrollSettings":{"viewPortWidth":980,"viewPortHeight":540,"currentZoom":1.3412052117263844,"horizontalOffset":1883.0521172638437,"verticalOffset":-66.28501628664492,"padding":{"left":0,"right":0,"top":0,"bottom":0},"minZoom":0.2,"maxZoom":30,"scrollLimit":"Diagram","canAutoScroll":false},"rulerSettings":{"showRulers":false,"horizontalRuler":{"orientation":"Horizontal"},"verticalRuler":{"orientation":"Vertical"}},"backgroundColor":"transparent","dataSourceSettings":{"crudAction":{"read":""},"connectionDataSource":{"crudAction":{"read":""}}},"mode":"SVG","layers":[{"objects":["Ellipseygf6p","ProcessLv8hw","DecisionTxR1N","ProcessH8c8B","ProcessKn3UF","ProcessuJU1A","ProcesspI5AA","DecisionxmX8W","ProcessspHoW","DecisionHWGB5","ProcessCFmJe","DecisionfGmss","EllipseryggE","ProcessuBBgf","EllipsesH9ku","Link21CeAQs","Link21Rh8GL","Link21lvgW8","Link21Wc0sM","Link21cw0b2","Link21bET1t","Link21o1WvO","Link1y1mek","Link21vphdn","Link21JFTgI","Link21rcSXc","Link21p9KTs","Link1kRx4l","Link21lKIeh","Link21n41RP","Link21rDflN","LabelXcJJU","LabelI1t11","LabeloIDfJ","Link21fDR49","LabelqKW4P","Labelg9O8D","LabelDqFkA","LabelSkOBS","LabeleSfqp","title","description"],"id":"default_layer","visible":true,"lock":false,"zIndex":0}],"nodes":[{"shape":{"type":"Basic","shape":"Ellipse"},"id":"Ellipseygf6p","constraints":5240430,"ports":[{"inEdges":[],"outEdges":[],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[""],"outEdges":["Link21CeAQs"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"gfs0M","content":"New inquiry","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"width":198.11580503328196,"height":119.99421583059254,"offsetX":-1200.942097483359,"offsetY":-660.0028920847037,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.11580503328196,"height":119.99421583059254},"offsetX":-1200.942097483359,"offsetY":-660.0028920847037},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":0,"addInfo":{"aprsId":"b421a854-9a2f-4765-85c6-54c80d6ab477"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":[""],"outEdges":["Link21CeAQs"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessLv8hw","constraints":5240430,"annotations":[{"id":"Psp2V","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.1 : Create Opportunity On Spot","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"FfkCe","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"CbSnV","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"inEdges":[""],"outEdges":[""],"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21CeAQs"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21Rh8GL"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":60,"offsetX":-1200.942097483359,"offsetY":-510,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":140,"height":60},"offsetX":-1200.942097483359,"offsetY":-510},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":1,"addInfo":{"aprsId":"24ef5d4f-1344-4256-8019-ae36fb9c552b","processId":"55"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21CeAQs"],"outEdges":["Link21Rh8GL"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Decision"},"id":"DecisionTxR1N","constraints":5240430,"ports":[{"inEdges":["Link21Rh8GL"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21Wc0sM"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"JqwNr","content":"Is this Project or New Destination?","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"offsetX":-1200.9427498998646,"offsetY":-379.99080610158853,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.11450020027087,"height":119.98161220317711},"offsetX":-1200.9427498998646,"offsetY":-379.99080610158853},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":2,"addInfo":{"aprsId":"afd11e5a-982f-4803-bd99-df0ff079bf88"},"isExpanded":true,"expandIcon":{"shape":"None"},"width":198.11450020027087,"height":119.98161220317711,"tooltip":{"openOn":"Auto"},"inEdges":["Link21Rh8GL"],"outEdges":["Link21Wc0sM"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessH8c8B","constraints":5240430,"annotations":[{"id":"rEcO9","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.2 : Record in Development Stage","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"W9iBb","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"KThav","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"inEdges":[],"outEdges":[],"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21rDflN"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":59.996752746999256,"offsetX":-890,"offsetY":-379.99080610158853,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":140,"height":59.996752746999256},"offsetX":-890,"offsetY":-379.99080610158853},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":3,"addInfo":{"aprsId":"5e0e6504-78f3-4f84-abb0-0719ccaec4ba","processId":"56"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":[],"outEdges":["Link21rDflN"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessKn3UF","constraints":5240430,"annotations":[{"id":"di8Nn","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.3 : Edit Opportunity With All Obligatory Info.","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"yULwf","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"e4hXl","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"inEdges":[""],"outEdges":[""],"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21Wc0sM"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21cw0b2"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":139.99817389462135,"height":60.00000000000001,"offsetX":-1200.94,"offsetY":-249.98000000000002,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":139.99817389462135,"height":60.00000000000001},"offsetX":-1200.94,"offsetY":-249.98000000000002},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":4,"addInfo":{"aprsId":"e46b9d9a-ec4f-464b-8a39-428dec69c037","processId":"58"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21Wc0sM"],"outEdges":["Link21cw0b2"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessuJU1A","constraints":5240430,"annotations":[{"id":"hNSnS","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.4 : Create New Account ","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"ZoCGb","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"xlTQM","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"inEdges":[],"outEdges":[],"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21bET1t"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link1y1mek"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":60.00000000000001,"offsetX":-670,"offsetY":-249.98000000000002,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":140,"height":60.00000000000001},"offsetX":-670,"offsetY":-249.98000000000002},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":5,"addInfo":{"aprsId":"6563ee1d-0404-41ab-b787-cbc990c810e4","processId":"57"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21bET1t"],"outEdges":["Link1y1mek"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcesspI5AA","constraints":5240430,"annotations":[{"id":"tWI5b","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.5 : Choose The Correct Account","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"V05Ga","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"I6Brb","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21o1WvO"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21fDR49"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link1y1mek"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":60.00000000000001,"offsetX":-890,"offsetY":-130,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":140,"height":60.00000000000001},"offsetX":-890,"offsetY":-130},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":6,"addInfo":{"aprsId":"40b6e564-cee5-4bd2-885f-6cb016076a29","processId":"61"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link1y1mek","Link21fDR49"],"outEdges":["Link21o1WvO"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Decision"},"id":"DecisionxmX8W","constraints":5240430,"ports":[{"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21cw0b2"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21bET1t"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21fDR49"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"MhpIn","content":"Is This Existing Account ?","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"offsetX":-890,"offsetY":-249.98000000000002,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.1138982302283,"height":119.99134065866471},"offsetX":-890,"offsetY":-249.98000000000002},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":7,"addInfo":{"aprsId":"0cfdcff6-2480-4eda-a5e8-97578b7ac7a7"},"isExpanded":true,"expandIcon":{"shape":"None"},"width":198.1138982302283,"height":119.99134065866471,"tooltip":{"openOn":"Auto"},"inEdges":["Link21cw0b2"],"outEdges":["Link21bET1t","Link21fDR49"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessspHoW","constraints":5240430,"annotations":[{"id":"rv2Wr","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.6 : Choose The Right Company","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"LQyUm","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"bbrxc","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"inEdges":[],"outEdges":[],"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21o1WvO"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21vphdn"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":60.00000000000001,"offsetX":-1200.94,"offsetY":-130,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":140,"height":60.00000000000001},"offsetX":-1200.94,"offsetY":-130},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":10,"addInfo":{"aprsId":"39c407dc-157f-4e0b-bcee-7b2f0915ff0a","processId":"59"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21o1WvO"],"outEdges":["Link21vphdn"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Decision"},"id":"DecisionHWGB5","constraints":5240430,"ports":[{"inEdges":["Link21vphdn"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link1kRx4l"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21JFTgI"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"ariaV","content":"Is Additional Info Available ?","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"offsetX":-1200.94,"offsetY":19.971612203177102,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.11751064604857,"height":119.98322440635422},"offsetX":-1200.94,"offsetY":19.971612203177102},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":25,"addInfo":{"aprsId":"55b1122b-0454-4ee7-8943-f92fb090cc93"},"isExpanded":true,"expandIcon":{"shape":"None"},"width":198.11751064604857,"height":119.98322440635422,"tooltip":{"openOn":"Auto"},"inEdges":["Link21vphdn"],"outEdges":["Link21JFTgI","Link1kRx4l"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessCFmJe","constraints":5240430,"annotations":[{"id":"RtS8F","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.7 : Update Opportunity With Additional Info.","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"T4FKx","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"i29U0","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21JFTgI"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21rcSXc"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":139.99999999999997,"height":59.99798474602867,"offsetX":-1200.94,"offsetY":169.94221677936844,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":139.99999999999997,"height":59.99798474602867},"offsetX":-1200.94,"offsetY":169.94221677936844},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":28,"addInfo":{"aprsId":"f856a01a-28cb-4240-a2d3-bb3aa8f9607c"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21JFTgI"],"outEdges":["Link21rcSXc"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Decision"},"id":"DecisionfGmss","constraints":5240430,"ports":[{"inEdges":["Link21rcSXc"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link1kRx4l"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21p9KTs"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21lKIeh"],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"Hn66x","content":"Is this Project ?","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"offsetX":-1200.94,"offsetY":319.9161058002012,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.1230078603563,"height":119.98979329563674},"offsetX":-1200.94,"offsetY":319.9161058002012},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":33,"addInfo":{"aprsId":"5dd31104-b5a8-4016-a030-9d8ea11f15fd"},"isExpanded":true,"expandIcon":{"shape":"None"},"width":198.1230078603563,"height":119.98979329563674,"tooltip":{"openOn":"Auto"},"inEdges":["Link21rcSXc","Link1kRx4l"],"outEdges":["Link21p9KTs","Link21lKIeh"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Basic","shape":"Ellipse"},"id":"EllipseryggE","constraints":5240430,"ports":[{"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21p9KTs"],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"pVHn9","content":"Save & Move under Project In Development Stage","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"width":200.00000000000003,"height":75.38000000000002,"offsetX":-760,"offsetY":319.9161058002012,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":200.00000000000003,"height":75.38000000000002},"offsetX":-760,"offsetY":319.9161058002012},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":36,"addInfo":{"aprsId":"a8000f6e-eebc-4431-8150-001600e07e35"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21p9KTs"],"outEdges":[],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Process"},"id":"ProcessuBBgf","constraints":5240430,"annotations":[{"id":"PX7PK","constraints":2,"style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":13,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"content":"P.160.8 : Save and Schedule Activity For Pricing ","annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}},{"id":"qn8nv","constraints":2,"offset":{"x":0,"y":0},"verticalAlignment":"Bottom","horizontalAlignment":"Left","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"bottom":5,"right":0,"left":0,"top":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0},{"id":"fttuv","constraints":2,"offset":{"x":1,"y":1},"verticalAlignment":"Top","horizontalAlignment":"Right","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontSize":14,"bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"margin":{"top":5,"right":0,"bottom":0,"left":0},"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None"},"content":"","visibility":true,"rotateAngle":0}],"ports":[{"id":"portlefttop","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portleftbottom","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":["Link21lKIeh"],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"porttopright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrighttop","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.25},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"outEdges":["Link21n41RP"],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portrightbottom","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.75},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomleft","visibility":2,"shape":"Circle","offset":{"x":0.25,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"id":"portbottomright","visibility":2,"shape":"Circle","offset":{"x":0.75,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"width":140,"height":59.997944812572406,"offsetX":-1200.94,"offsetY":450.0010275937138,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":140,"height":59.997944812572406},"offsetX":-1200.94,"offsetY":450.0010275937138},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":37,"addInfo":{"aprsId":"b62721b7-1341-430c-8b30-a52bde7012db","processId":"60"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":["Link21lKIeh"],"outEdges":["Link21n41RP"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Basic","shape":"Ellipse"},"id":"EllipsesH9ku","constraints":5240430,"ports":[{"inEdges":[],"outEdges":[],"id":"porttopmiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":0},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portleftmiddle","visibility":2,"shape":"Circle","offset":{"x":0,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portrightmiddle","visibility":2,"shape":"Circle","offset":{"x":1,"y":0.5},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24},{"inEdges":[],"outEdges":[],"id":"portbottommiddle","visibility":2,"shape":"Circle","offset":{"x":0.5,"y":1},"height":12,"width":12,"margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","constraints":24}],"annotations":[{"id":"f6DZ8","content":"Move to Awaiting Price Stage","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"width":198.11599571358744,"height":75.38000000000018,"offsetX":-760,"offsetY":450.00102759371384,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":198.11599571358744,"height":75.38000000000018},"offsetX":-760,"offsetY":450.00102759371384},"style":{"fill":"white","strokeWidth":1,"strokeColor":"black","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"previewSize":{},"dragSize":{},"zIndex":38,"addInfo":{"aprsId":"a47b4ff3-b6be-4a2f-bb56-e663ee75adb8"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"inEdges":[],"outEdges":[],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Yes","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelXcJJU","width":100,"height":40,"offsetX":-1039.056949115114,"offsetY":-400,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-1039.056949115114,"offsetY":-400},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":8,"addInfo":{"aprsId":"4bfe7a90-0126-4ae8-a65c-f6c69702e0b5"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"No","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelI1t11","width":61.88549979972915,"height":39.980000000000025,"offsetX":-1170.95,"offsetY":-299.99,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":61.88549979972915,"height":39.980000000000025},"offsetX":-1170.95,"offsetY":-299.99},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":9,"addInfo":{"aprsId":"2fc01bf4-05b7-44d2-9b90-b3507e8fdf3e"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"No","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabeloIDfJ","width":60,"height":20.000000000000004,"offsetX":-770,"offsetY":-270,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":60,"height":20.000000000000004},"offsetX":-770,"offsetY":-270},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":11,"addInfo":{"aprsId":"f6e278c2-248f-4e3d-acdb-2799b2014f73"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Yes","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelqKW4P","width":39.999999999999986,"height":39.99999999999999,"offsetX":-860,"offsetY":-180,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":39.999999999999986,"height":39.99999999999999},"offsetX":-860,"offsetY":-180},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":13,"addInfo":{"aprsId":"fa0779f2-2cff-4c82-bd36-1762e94b6b9e"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Yes","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"Labelg9O8D","width":100,"height":40,"offsetX":-1150,"offsetY":99.96322440635421,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-1150,"offsetY":99.96322440635421},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":14,"addInfo":{"aprsId":"444e8eef-d50a-482b-9cde-3305af4515c1"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"No","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelDqFkA","width":100,"height":40,"offsetX":-1370,"offsetY":159.9432244063541,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-1370,"offsetY":159.9432244063541},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":15,"addInfo":{"aprsId":"db2421ee-bda1-45f0-ba80-7394c0611dcd"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Label","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelDqFkA","width":100,"height":40,"offsetX":-1354.3424408014573,"offsetY":267.3093446249333,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-1354.3424408014573,"offsetY":267.3093446249333},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":15,"addInfo":{"aprsId":"db2421ee-bda1-45f0-ba80-7394c0611dcd"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Yes","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabelSkOBS","width":100,"height":40,"offsetX":-990,"offsetY":302.2261058002012,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-990,"offsetY":302.2261058002012},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":16,"addInfo":{"aprsId":"5eaf0fa7-aeb0-4295-af1b-60f83093ec80"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"No","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"LabeleSfqp","width":100,"height":40,"offsetX":-1250,"offsetY":392.31102759371373,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":100,"height":40},"offsetX":-1250,"offsetY":392.31102759371373},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontSize":12,"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","textAlign":"Center","color":"black","italic":false,"bold":false},"constraints":5240814,"previewSize":{},"dragSize":{},"zIndex":17,"addInfo":{"aprsId":"8bab9e07-6bff-499e-a378-85d6d41f8367"},"isExpanded":true,"expandIcon":{"shape":"None"},"tooltip":{"openOn":"Auto"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"(P.160) Recording In CRM (Macro Process)","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"title","width":600,"height":20,"style":{"fill":"white","fontSize":18,"color":"black","textAlign":"Left","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","italic":false,"bold":false},"offsetX":150,"offsetY":-680.0028920847037,"zIndex":18,"addInfo":{"aprsId":"5810baba-f715-4b6d-8fd1-30462940f131"},"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":600,"height":20},"offsetX":150,"offsetY":-680.0028920847037},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Version: 1.0 (Work In Progress)","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"description","width":600,"height":20,"style":{"fill":"white","fontSize":15,"color":"grey","textAlign":"Left","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","italic":false,"bold":false},"offsetX":150,"offsetY":610.0010275937138,"zIndex":19,"addInfo":{"aprsId":"72df02a9-92d3-49ef-85f4-e76f203e9d70"},"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":600,"height":20},"offsetX":150,"offsetY":610.0010275937138},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"(P.160) Recording In CRM (Macro Process)","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"title","width":600,"height":20,"style":{"fill":"white","fontSize":18,"color":"black","textAlign":"Left","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","italic":false,"bold":false},"offsetX":150,"offsetY":-700.0028920847037,"zIndex":20,"addInfo":{"aprsId":"e2a7ed6c-3553-45e3-8bf4-1e2e1a0cad44"},"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":600,"height":20},"offsetX":150,"offsetY":-700.0028920847037},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Text","content":"Version: 1.0 (Work In Progress)","margin":{"right":0,"bottom":0,"left":0,"top":0}},"id":"description","width":600,"height":20,"style":{"fill":"white","fontSize":15,"color":"grey","textAlign":"Left","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"},"fontFamily":"Arial","textOverflow":"Wrap","textDecoration":"None","whiteSpace":"CollapseSpace","textWrapping":"WrapWithOverflow","italic":false,"bold":false},"offsetX":150,"offsetY":770.0010275937138,"zIndex":21,"addInfo":{"aprsId":"6972a3a4-8e36-4512-b3ff-a52666ad98d4"},"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":600,"height":20},"offsetX":150,"offsetY":770.0010275937138},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false}],"connectors":[{"shape":{"type":"None"},"id":"Link21CeAQs","type":"Straight","sourcePoint":{"x":-1200.94,"y":-600.01},"targetPoint":{"x":-1200.94,"y":-540},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"Ellipseygf6p","targetID":"ProcessLv8hw","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":60.00999999999999},"offsetX":-1200.94,"offsetY":-570.005},"previewSize":{},"zIndex":39,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21Rh8GL","type":"Straight","sourcePoint":{"x":-1200.94,"y":-480},"targetPoint":{"x":-1200.94,"y":-439.98},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessLv8hw","targetID":"DecisionTxR1N","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":40.01999999999998},"offsetX":-1200.94,"offsetY":-459.99},"previewSize":{},"zIndex":40,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21lvgW8","type":"Straight","sourcePoint":{"x":-1101.89,"y":-379.99},"targetPoint":{"x":-960,"y":-379.99},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"","targetID":"","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":141.8900000000001,"height":0},"offsetX":-1030.9450000000002,"offsetY":-379.99},"previewSize":{},"zIndex":41,"sourcePortID":"","targetPortID":"","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21Wc0sM","type":"Straight","sourcePoint":{"x":-1200.94,"y":-320},"targetPoint":{"x":-1200.94,"y":-279.98},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionTxR1N","targetID":"ProcessKn3UF","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":40.01999999999998},"offsetX":-1200.94,"offsetY":-299.99},"previewSize":{},"zIndex":43,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21cw0b2","type":"Straight","sourcePoint":{"x":-1130.94,"y":-249.98},"targetPoint":{"x":-989.06,"y":-249.98},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessKn3UF","targetID":"DecisionxmX8W","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":141.8800000000001,"height":0},"offsetX":-1060,"offsetY":-249.98},"previewSize":{},"zIndex":44,"sourcePortID":"portrightmiddle","targetPortID":"portleftmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21bET1t","type":"Straight","sourcePoint":{"x":-790.94,"y":-249.98},"targetPoint":{"x":-740,"y":-249.98},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionxmX8W","targetID":"ProcessuJU1A","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":50.940000000000055,"height":0},"offsetX":-765.47,"offsetY":-249.98},"previewSize":{},"zIndex":46,"sourcePortID":"portrightmiddle","targetPortID":"portleftmiddle","visible":true,"hitPadding":10,"sourcePadding":0,"targetPadding":0,"tooltip":{"openOn":"Auto"},"parentId":""},{"shape":{"type":"None"},"id":"Link21o1WvO","type":"Straight","sourcePoint":{"x":-960,"y":-130},"targetPoint":{"x":-1130.94,"y":-130},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcesspI5AA","targetID":"ProcessspHoW","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":170.94000000000005,"height":0},"offsetX":-1045.47,"offsetY":-130},"previewSize":{},"zIndex":48,"sourcePortID":"portleftmiddle","targetPortID":"portrightmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link1y1mek","type":"Orthogonal","sourcePoint":{"x":-670,"y":-219.98},"targetPoint":{"x":-820,"y":-130},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessuJU1A","targetID":"ProcesspI5AA","flip":"None","segments":[{"type":"Orthogonal"}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":150,"height":89.97999999999999},"offsetX":-745,"offsetY":-174.99},"previewSize":{},"zIndex":49,"sourcePortID":"portbottommiddle","targetPortID":"portrightmiddle","visible":true,"constraints":77374,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21vphdn","type":"Straight","sourcePoint":{"x":-1200.94,"y":-100},"targetPoint":{"x":-1200.94,"y":-40.02},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessspHoW","targetID":"DecisionHWGB5","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":59.98},"offsetX":-1200.94,"offsetY":-70.01},"previewSize":{},"zIndex":50,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21JFTgI","type":"Straight","sourcePoint":{"x":-1200.94,"y":79.96},"targetPoint":{"x":-1200.94,"y":139.94},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionHWGB5","targetID":"ProcessCFmJe","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":59.980000000000004},"offsetX":-1200.94,"offsetY":109.94999999999999},"previewSize":{},"zIndex":51,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21rcSXc","type":"Straight","sourcePoint":{"x":-1200.94,"y":199.94},"targetPoint":{"x":-1200.94,"y":259.92},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessCFmJe","targetID":"DecisionfGmss","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":59.98000000000002},"offsetX":-1200.94,"offsetY":229.93},"previewSize":{},"zIndex":52,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21p9KTs","type":"Straight","sourcePoint":{"x":-1101.88,"y":319.92},"targetPoint":{"x":-860,"y":319.92},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionfGmss","targetID":"EllipseryggE","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":241.8800000000001,"height":0},"offsetX":-980.94,"offsetY":319.92},"previewSize":{},"zIndex":54,"sourcePortID":"portrightmiddle","targetPortID":"portleftmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link1kRx4l","type":"Orthogonal","sourcePoint":{"x":-1300,"y":19.97},"targetPoint":{"x":-1300,"y":319.92},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionHWGB5","targetID":"DecisionfGmss","flip":"None","segments":[{"type":"Orthogonal"}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":20,"height":299.95000000000005},"offsetX":-1310,"offsetY":169.94500000000002},"previewSize":{},"zIndex":57,"sourcePortID":"portleftmiddle","targetPortID":"portleftmiddle","visible":true,"constraints":77374,"hitPadding":10,"sourcePadding":0,"targetPadding":0,"tooltip":{"openOn":"Auto"},"parentId":""},{"shape":{"type":"None"},"id":"Link21lKIeh","type":"Straight","sourcePoint":{"x":-1200.94,"y":379.91},"targetPoint":{"x":-1200.94,"y":420},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionfGmss","targetID":"ProcessuBBgf","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":40.089999999999975},"offsetX":-1200.94,"offsetY":399.95500000000004},"previewSize":{},"zIndex":59,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21n41RP","type":"Straight","sourcePoint":{"x":-1130.94,"y":450},"targetPoint":{"x":-859.06,"y":450},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessuBBgf","targetID":"","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":271.8800000000001,"height":0},"offsetX":-995,"offsetY":450},"previewSize":{},"zIndex":60,"sourcePortID":"portrightmiddle","targetPortID":"","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21rDflN","type":"Straight","sourcePoint":{"x":-890,"y":-349.99},"targetPoint":{"x":-890,"y":-309.98},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"ProcessH8c8B","targetID":"","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":40.00999999999999},"offsetX":-890,"offsetY":-329.985},"previewSize":{},"zIndex":61,"sourcePortID":"portbottommiddle","targetPortID":"","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"sourcePadding":0,"targetPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Link21fDR49","type":"Straight","sourcePoint":{"x":-890,"y":-189.98},"targetPoint":{"x":-890,"y":-160},"targetDecorator":{"shape":"Arrow","width":5,"height":5,"pivot":{"x":0,"y":0.5},"style":{"fill":"#797979","strokeColor":"#797979","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"constraints":11838,"style":{"strokeWidth":1,"strokeColor":"#797979","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"sourceID":"DecisionxmX8W","targetID":"ProcesspI5AA","flip":"None","segments":[{"type":"Straight","point":{"x":0,"y":0}}],"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":0,"height":29.97999999999999},"offsetX":-890,"offsetY":-174.99},"previewSize":{},"zIndex":12,"sourcePortID":"portbottommiddle","targetPortID":"porttopmiddle","visible":true,"hitPadding":10,"tooltip":{"openOn":"Auto"},"targetPadding":0,"sourcePadding":0,"parentId":""}],"layout":{"type":"None","enableAnimation":true},"pageSettings":{"orientation":"Landscape","background":{"source":"","color":"transparent"},"showPageBreaks":false,"fitOptions":{"canFit":false},"boundaryConstraints":"Infinity"},"selectedItems":{"constraints":16382,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"width":140,"height":59.99794481257243,"offsetX":-1200.94,"offsetY":450.0010275937138},"tooltip":{"content":"","relativeMode":"Object"},"commandManager":{"commands":[{"name":"paste","canExecute":{},"gesture":{},"parameter":""}]},"tool":3,"contextMenuSettings":{},"bridgeDirection":"Top","version":17.1};
              
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            let nodes:any = [];
            var connectors:any = [];
            var   flow:any= [
                {
                  id: 863,
                  created_at: '2021-02-04T14:02:06.126518Z',
                  updated_at: '2021-02-04T14:02:06.126546Z',
                  position: 1000,
                  validity_begin_datetime: '2021-02-04T14:02:05.779421Z',
                  validity_end_datetime: null,
                  in_out: {
                    '920019054': [],
                  },
                  created_by: 260,
                  updated_by: 260,
                  line: 819,
                  production_order: 161343,
                  machine: 219578,
                  tools: [219596],
                },
                {
                  id: 864,
                  created_at: '2021-02-04T14:02:06.246538Z',
                  updated_at: '2021-02-04T14:02:06.246568Z',
                  position: 2000,
                  validity_begin_datetime: '2021-02-04T14:02:05.779421Z',
                  validity_end_datetime: null,
                  in_out: {
                    '920019990': [],
                  },
                  created_by: 260,
                  updated_by: 260,
                  line: 819,
                  production_order: 161343,
                  machine: 221398,
                  tools: [222628],
                },
                {
                  id: 865,
                  created_at: '2021-02-04T14:02:06.264082Z',
                  updated_at: '2021-02-04T14:02:06.264111Z',
                  position: 3000,
                  validity_begin_datetime: '2021-02-04T14:02:05.779421Z',
                  validity_end_datetime: null,
                  in_out: {
                    '920018997': ['920019054', '920019990'],
                  },
                  created_by: 260,
                  updated_by: 260,
                  line: 819,
                  production_order: 161343,
                  machine: 1336,
                  tools: [219580],
                },
                {
                  id: 866,
                  created_at: '2021-02-04T14:02:06.278712Z',
                  updated_at: '2021-02-04T14:02:06.278741Z',
                  position: 5000,
                  validity_begin_datetime: '2021-02-04T14:02:05.779421Z',
                  validity_end_datetime: null,
                  in_out: {
                    '920019119': ['920018997'],
                  },
                  created_by: 260,
                  updated_by: 260,
                  line: 819,
                  production_order: 161343,
                  machine: 219581,
                  tools: [219597],
                },
                {
                  id: 867,
                  created_at: '2021-02-04T14:02:06.297414Z',
                  updated_at: '2021-02-04T14:02:06.297441Z',
                  position: 9000,
                  validity_begin_datetime: '2021-02-04T14:02:05.779421Z',
                  validity_end_datetime: null,
                  in_out: {
                    '920019431': ['920019119'],
                  },
                  created_by: 260,
                  updated_by: 260,
                  line: 819,
                  production_order: 161343,
                  machine: 219613,
                  tools: [219599],
                },
                {
                  id: 868,
                  created_at: '2021-02-04T14:02:06.311785Z',
                  updated_at: '2021-02-04T14:02:06.311812Z',
                  position: 12000,
                  validity_begin_datetime: '2021-02-04T14:02:05.779421Z',
                  validity_end_datetime: null,
                  in_out: {
                    '920019378': ['920019431'],
                  },
                  created_by: 260,
                  updated_by: 260,
                  line: 819,
                  production_order: 161343,
                  machine: 219588,
                  tools: [219600],
                },
                {
                  id: 869,
                  created_at: '2021-02-04T14:02:06.324991Z',
                  updated_at: '2021-02-04T14:02:06.325019Z',
                  position: 14000,
                  validity_begin_datetime: '2021-02-04T14:02:05.779421Z',
                  validity_end_datetime: null,
                  in_out: {
                    '920019192': ['920019378'],
                  },
                  created_by: 260,
                  updated_by: 260,
                  line: 819,
                  production_order: 161343,
                  machine: 219590,
                  tools: [219591],
                },
                {
                  id: 870,
                  created_at: '2021-02-04T14:02:06.338320Z',
                  updated_at: '2021-02-04T14:02:06.338349Z',
                  position: 15000,
                  validity_begin_datetime: '2021-02-04T14:02:05.779421Z',
                  validity_end_datetime: null,
                  in_out: {
                    '920019237': ['920019192'],
                  },
                  created_by: 260,
                  updated_by: 260,
                  line: 819,
                  production_order: 161343,
                  machine: 219592,
                  tools: [219592],
                },
                {
                  id: 871,
                  created_at: '2021-02-04T14:02:06.350578Z',
                  updated_at: '2021-02-04T14:02:06.350606Z',
                  position: 17000,
                  validity_begin_datetime: '2021-02-04T14:02:05.779421Z',
                  validity_end_datetime: null,
                  in_out: {
                    '920019493': ['920019237'],
                  },
                  created_by: 260,
                  updated_by: 260,
                  line: 819,
                  production_order: 161343,
                  machine: 219594,
                  tools: [219601],
                },
              ]
        function getnode(){
            var node
                let toolOffsetY = 20
                let toolOffsetX = 20
                let operationCounter = 1
                const toolWidth = 100
                const toolHeight = 50
                const operationWidth = toolWidth * 2.5
            
                const backgroundLayer:any = {
                  id: 'backgroundLayer',
                  visible: true,
                  objects: [],
                  lock: true,
                }
            
                const backNodes = []
            
                flow.forEach((operation:any) => {
                  const group = {
                    id: 'group' + operationCounter,
                    height: toolHeight * 3 * Object.keys(operation.in_out).length,
                    width: operationWidth,
                    offsetX: toolOffsetX,
                    offsetY: toolOffsetY,
                  //  constraints: NodeConstraints.Default & ~NodeConstraints.Connect,
                    shape: {
                      type: 'Flow',
                      shape: 'Process',
                    },
                    style: {
                      fill: '#eef2fe',
                      strokeColor: '#b8c4d1',
                    },
                    annotations: [
                      {
                        margin: {
                          top: 15,
                        },
                        content: '' + operation.position,
                        horizontalAlignment: 'Center',
                        verticalAlignment: 'Top',
                        offset: { x: 0.5, y: 0 },
                        style: {
                          color: '#2577ce',
                          fontSize: '14',
                          bold: true,
                        },
                      },
                    ],
                  }
                  backgroundLayer.objects.push(group.id)
                  console.log(group)
                  backNodes.push(group)
                  nodes.push(group)
                  operationCounter++
            
                  toolOffsetY = 20
                  toolOffsetX += operationWidth * 1.25
                })
                //diagram.sendLayerBackward(backgroundLayer.id)
            
                toolOffsetY = 20
            
                toolOffsetX = 20
            
                const foregroundLayer:any = {
                  id: 'foregroundLayer',
                  visible: true,
                  objects: [],
                  lock: false,
                }
            
                flow.forEach((operation:any) => {
                  Object.keys(operation.in_out).forEach((tool) => {
                    foregroundLayer.objects.push(tool)
                    nodes.push({
                      id: tool,
                      height: toolHeight,
                      width: toolWidth,
                      offsetX: toolOffsetX,
                      offsetY: toolOffsetY,
                      shape: {
                        type: 'Basic',
                        shape: 'Rectangle',
            
                        cornerRadius: 10,
                      },
                      style: {
                        fill: '#ffe7cd',
                        strokeColor: '#eecf9b',
                      },
                      annotations: [
                        {
                          content: tool,
                          style: {
                            color: '#cc8514',
                            fontSize: '14',
                            bold: true,
                          },
                        },
                      ],
                    })
                    toolOffsetY += toolHeight * 1.5
                  })
            
                  // eslint-disable-next-line no-unused-vars
                  toolOffsetY = 20
                  toolOffsetX += operationWidth * 1.25
                })
            
            
                flow.forEach((operation:any) => {
                  Object.keys(operation.in_out).forEach((tool) => {
                    operation.in_out[tool].forEach((connection:any) => {
                      const connectorId = tool + '_' + connection
                      foregroundLayer.objects.push(connectorId)
                      connectors.push({
                        id: tool + '_' + connection,
                        // Source and Target node's name to which connector needs to be connected.
                        sourceID: connection,
                        targetID: tool,
                        type: 'Orthogonal',
                        // sourcePortID: connection + '_port2',
                        // targetPortID: tool + '_port1',
                        style: {
                          strokeColor: '#444',
                          fill: '#444',
                          strokeWidth: 2,
                        },
                        // constraints: ConnectorConstraints.Default | ConnectorConstraints.Bridging
                      })
                    })
                  })
                })
            
                connectors = connectors;
                return nodes;
                }
            
                //Initializes diagram control
                diagram = new Diagram({
                    rulerSettings: {
                        showRulers: true,
                      
                    },
                    width: '100%', height: 900, nodes: getnode(), connectors: connectors,
                    constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting,
                    getConnectorDefaults: function (connector:any) {
                        connector.type = 'Orthogonal';
                        return connector;
                    }
                    ,layers:[
                    ]
                });
                diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

         it('(EJ2-47194): Line routing is not working if the connection end point of the connector has two or more nodes', (done: Function) => {
            for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x ==70&&(diagram.connectors[0] as Connector).intermediatePoints[0].y ==20&&(diagram.connectors[0] as Connector).intermediatePoints[1].x ==155&&(diagram.connectors[0] as Connector).intermediatePoints[1].y ==20&&(diagram.connectors[0] as Connector).intermediatePoints[2].x ==155&&(diagram.connectors[0] as Connector).intermediatePoints[2].y ==105&&(diagram.connectors[0] as Connector).intermediatePoints[3].x ==645&&(diagram.connectors[0] as Connector).intermediatePoints[3].y ==105&&(diagram.connectors[0] as Connector).intermediatePoints[4].x ==645&&(diagram.connectors[0] as Connector).intermediatePoints[4].y ==45).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 382.5 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 20 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 595 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 20).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 695 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 20 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 907.5 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 20).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 1007.5 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 20 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 1220 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 20).toBe(true);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 1320 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 20 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 1532.5 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 20).toBe(true);
            expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 1632.5 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 20 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 1845 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 20).toBe(true);
            expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 1945 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 20 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 2157.5 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 20).toBe(true);
            expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 2257.5 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 20 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 2470 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 20).toBe(true); done();
        });
    });
    describe('Line routing', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            nodes = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 300,
                    ports: [
                        { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                    ]
                },
                {
                    id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                    ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                    { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                    { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                    { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                    ]
                },
            ];
            connectors = [{
                id: 'Connector1',
                sourceID: 'node1',
                targetID:'node1',
                targetPortID: 'port1', sourcePortID: 'port1',
            }];
            diagram = new Diagram({
                width: 1000, height: 600,
                connectors: connectors, nodes: nodes,
                constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
            });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Connector with same source and target id', (done: Function) => {
            console.log('connector');
            expect((diagram.connectors[0] as Connector).sourceID == (diagram.connectors[0] as Connector).targetID).toBe(true);
            done();
        });
    });
    describe('Line routing', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            nodes = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 300,
                    ports: [
                        { id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                        { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                        { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                    ]
                },
                {
                    id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                    ports: [{ id: 'port1', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                    { id: 'port2', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                    { id: 'port3', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                    { id: 'port4', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                    ]
                },
            ];
            connectors = [{
                id: 'Connector1',
                targetID:'node2',
                targetPortID: 'port1', sourcePortID: 'port2',
            }];
            diagram = new Diagram({
                width: 1000, height: 600,
                connectors: connectors, nodes: nodes,
                constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting, getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
            });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Connector without sourceid', (done: Function) => {
            console.log('connector');
            expect((diagram.connectors[0] as Connector).sourceID == "").toBe(true);
            done();
        });
    });

    describe('Enable routing not working properly', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramRouting' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: 1200, height: 1200,
                layout:{  type:'ComplexHierarchicalTree',
                connectionPointOrigin:ConnectionPointOrigin.DifferentPoint,
                orientation:"LeftToRight",
                verticalSpacing:80,
                horizontalSpacing:80,
                enableRouting:true,
                arrangement:ChildArrangement.Linear},
                constraints: DiagramConstraints.Default,
                 getConnectorDefaults: function (connector: ConnectorModel) { connector.type = 'Orthogonal'; }
            });
            diagram.appendTo('#diagramRouting');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Load customer JSON and call doLayout to check overlapping', (done: Function) => {
            let data: string = '{"width":1200,"height":1200,"nodes":[{"shape":{"type":"Bpmn","shape":"Event","event":{"event":"Start","trigger":"None"},"activity":{"subProcess":{}},"annotations":[]},"ports":[],"id":"start","width":40,"height":40,"offsetX":100,"offsetY":180,"annotations":[],"zIndex":0,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":40,"height":40},"offsetX":100,"offsetY":180},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"collapseIcon":{"shape":"None"},"flipMode":"All","tooltip":{"openOn":"Auto","isSticky":false,"content":""},"inEdges":[],"outEdges":["mTpxR"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"id":"v7N8V","width":70,"height":70,"offsetX":250,"offsetY":180,"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","task":{"type":"Service","call":false,"compensation":false,"loop":"None"},"subProcess":{"collapsed":true,"type":"None"}},"annotations":[]},"ports":[],"zIndex":1,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":70,"height":70},"offsetX":250,"offsetY":180},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5240814,"annotations":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","tooltip":{"openOn":"Auto","isSticky":false,"content":""},"inEdges":["mTpxR","connectorMRdnl"],"outEdges":["eXSp7"],"parentId":"","processId":"","isPhase":false,"isLane":false},{"id":"tG5hP","width":70,"height":70,"offsetX":400,"offsetY":180,"shape":{"type":"Bpmn","shape":"Gateway","gateway":{"type":"None"},"annotations":[],"activity":{"subProcess":{}}},"ports":[],"zIndex":3,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":70,"height":70},"offsetX":400,"offsetY":180},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5240814,"annotations":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","tooltip":{"openOn":"Auto","isSticky":false,"content":""},"inEdges":["eXSp7"],"outEdges":["QtTFU","Xuwda"],"parentId":"","processId":"","isPhase":false,"isLane":false},{"id":"BGgtC","width":70,"height":70,"offsetX":550,"offsetY":130,"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","task":{"type":"Service","call":false,"compensation":false,"loop":"None"},"subProcess":{"collapsed":true,"type":"None"}},"annotations":[]},"ports":[],"zIndex":5,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":70,"height":70},"offsetX":550,"offsetY":130},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5240814,"annotations":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","tooltip":{"openOn":"Auto","isSticky":false,"content":""},"inEdges":["QtTFU"],"outEdges":["connectorMRdnl"],"parentId":"","processId":"","isPhase":false,"isLane":false},{"id":"W0Gqv","width":50,"height":50,"offsetX":550,"offsetY":230,"shape":{"type":"Bpmn","shape":"Event","event":{"event":"End","trigger":"None"},"activity":{"subProcess":{}},"annotations":[]},"ports":[],"zIndex":7,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":50,"height":50},"offsetX":550,"offsetY":230},"style":{"fill":"white","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":5240814,"annotations":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","inEdges":["Xuwda"],"outEdges":[],"parentId":"","processId":"","isPhase":false,"isLane":false}],"constraints":500,"layout":{"type":"ComplexHierarchicalTree","connectionPointOrigin":"DifferentPoint","orientation":"LeftToRight","verticalSpacing":80,"horizontalSpacing":80,"enableRouting":true,"arrangement":"Linear","enableAnimation":true},"connectors":[{"id":"mTpxR","sourceID":"start","targetID":"v7N8V","type":"Orthogonal","shape":{"type":"None"},"zIndex":2,"sourcePortID":"","targetPortID":"","targetPoint":{"x":215,"y":180},"connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"segments":[{"type":"Orthogonal","direction":null}],"sourcePoint":{"x":119.39,"y":180},"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":95.61,"height":0},"offsetX":167.195,"offsetY":180},"style":{"strokeWidth":1,"strokeColor":"black","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"hitPadding":10,"parentId":""},{"id":"eXSp7","sourceID":"v7N8V","targetID":"tG5hP","type":"Orthogonal","shape":{"type":"None"},"zIndex":4,"sourcePortID":"","targetPortID":"","targetPoint":{"x":366.28,"y":180},"connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"segments":[{"type":"Orthogonal","direction":null}],"sourcePoint":{"x":285,"y":180},"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":81.27999999999997,"height":0},"offsetX":325.64,"offsetY":180},"style":{"strokeWidth":1,"strokeColor":"black","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"hitPadding":10,"parentId":""},{"id":"QtTFU","sourceID":"tG5hP","targetID":"BGgtC","type":"Orthogonal","shape":{"type":"None"},"zIndex":6,"sourcePortID":"","targetPortID":"","targetPoint":{"x":515,"y":130},"connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"segments":[{"type":"Orthogonal","direction":null}],"sourcePoint":{"x":435,"y":180},"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":80,"height":50},"offsetX":475,"offsetY":155},"style":{"strokeWidth":1,"strokeColor":"black","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"hitPadding":10,"parentId":""},{"id":"Xuwda","sourceID":"tG5hP","targetID":"W0Gqv","type":"Orthogonal","shape":{"type":"None"},"zIndex":8,"sourcePortID":"","targetPortID":"","targetPoint":{"x":525.14,"y":230},"connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"segments":[{"type":"Orthogonal","direction":null}],"sourcePoint":{"x":435,"y":180},"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":90.13999999999999,"height":50},"offsetX":480.07,"offsetY":205},"style":{"strokeWidth":1,"strokeColor":"black","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"hitPadding":10,"parentId":""},{"sourceID":"BGgtC","type":"Orthogonal","sourcePoint":{"x":585,"y":130},"targetPoint":{"x":215,"y":180},"shape":{"type":"None"},"id":"connectorMRdnl","targetID":"v7N8V","zIndex":9,"sourcePortID":"","targetPortID":"","connectorSpacing":13,"segments":[{"type":"Orthogonal","direction":null,"length":null}],"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":410,"height":105},"offsetX":400,"offsetY":182.5},"style":{"strokeWidth":1,"strokeColor":"black","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"tooltip":{"openOn":"Auto"},"connectionPadding":0,"hitPadding":10,"parentId":""}],"selectedItems":{"constraints":12286,"userHandles":[],"nodes":[],"connectors":[],"wrapper":null,"selectedObjects":[{"sourceID":"BGgtC","type":"Orthogonal","sourcePoint":{"x":585,"y":130},"targetPoint":{"x":215,"y":180},"shape":{"type":"None"},"id":"connectorMRdnl","targetID":"v7N8V","zIndex":9,"sourcePortID":"","targetPortID":"","connectorSpacing":13,"segments":[{"type":"Orthogonal","direction":null,"length":null}],"sourcePadding":0,"targetPadding":0,"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"targetDecorator":{"shape":"Arrow","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"cornerRadius":0,"wrapper":{"actualSize":{"width":410,"height":105},"offsetX":400,"offsetY":182.5},"style":{"strokeWidth":1,"strokeColor":"black","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"annotations":[],"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"tooltip":{"openOn":"Auto"},"connectionPadding":0,"hitPadding":10,"parentId":""}],"rotateAngle":0,"canToggleSelection":false,"pivot":{"x":0.5,"y":0.5},"width":410,"height":105,"offsetX":400,"offsetY":182.5,"handleSize":14,"rubberBandSelectionMode":"CompleteIntersect"},"snapSettings":{"constraints":0,"gridType":"Lines","verticalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20]},"horizontalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20]}},"selectionChange":{},"onUserHandleMouseDown":{},"enableRtl":false,"locale":"en-US","enablePersistence":false,"scrollSettings":{"viewPortWidth":1200,"viewPortHeight":1200,"currentZoom":1,"horizontalOffset":0,"verticalOffset":0,"padding":{"left":0,"right":0,"top":0,"bottom":0},"scrollLimit":"Diagram","canAutoScroll":false},"rulerSettings":{"showRulers":false},"backgroundColor":"transparent","contextMenuSettings":{},"dataSourceSettings":{"dataManager":null,"dataSource":null,"crudAction":{"read":""},"connectionDataSource":{"crudAction":{"read":""}}},"mode":"SVG","layers":[{"id":"default_layer","visible":true,"lock":false,"objects":["start","v7N8V","mTpxR","tG5hP","eXSp7","BGgtC","QtTFU","W0Gqv","Xuwda","connectorMRdnl"],"zIndex":0,"objectZIndex":9}],"diagramSettings":{"inversedAlignment":true},"pageSettings":{"boundaryConstraints":"Infinity","width":null,"orientation":"Landscape","height":null,"background":{"source":"","color":"transparent"},"showPageBreaks":false,"fitOptions":{"canFit":false}},"basicElements":[],"tooltip":{"content":""},"commandManager":{"commands":[]},"tool":3,"customCursor":[],"drawingObject":{"sourceID":"BGgtC","type":"Orthogonal"},"version":17.1}';
            diagram.loadDiagram(data);
            diagram.doLayout();
            let routedConnector = diagram.connectors[4];
            let pathData = (routedConnector.wrapper.children[0] as any).data;
            console.log(pathData);
            expect(pathData === "M540 535 L550 535 L550 590 L450 590 L450 550 L150 550 L150 628.83 L164 628.83 L164 628.8333333333334 L169.5 628.99" || pathData === "M540 535 L550 535 L550 490 L450 490 L450 530 L170 530 L170 590 L150 590 L150 628.83 L164 628.83 L164 628.8333333333334 L169.5 628.99" || pathData === "M540 535 L550 535 L550 590 L450 590 L450 550 L150 550 L150 628.83 L164 628.83 L164 628.83 L167 628.83 L167 628.8333333333334 L169.5 628.97").toBe(true);
            diagram.loadDiagram(data);
            diagram.constraints = DiagramConstraints.Default | DiagramConstraints.LineRouting;
            diagram.dataBind();
            diagram.doLayout();
            let pathData2 = (routedConnector.wrapper.children[0] as any).data;
            console.log(pathData2);
            expect(pathData2 === "M540 535 L550 535 L550 590 L450 590 L450 550 L150 550 L150 628.83 L164 628.83 L164 628.8333333333334 L169.5 628.99" || pathData2 === "M540 535 L550 535 L550 490 L450 490 L450 530 L170 530 L170 590 L150 590 L150 628.83 L164 628.83 L164 628.8333333333334 L169.5 628.99" || pathData === "M540 535 L550 535 L550 590 L450 590 L450 550 L150 550 L150 628.83 L164 628.83 L164 628.83 L167 628.83 L167 628.8333333333334 L169.5 628.97").toBe(true);
            done();
        });
        it('Code coverage - line routing while dropping node inside another node', (done: Function) => {
            let data: string = '{"width":"100%","height":400,"nodes":[{"shape":{"type":"Bpmn","shape":"Event","event":{"event":"Start","trigger":"None"},"activity":{"subProcess":{}},"annotations":[]},"ports":[],"id":"node0","offsetX":100,"offsetY":100,"width":30,"height":30,"annotations":[{"id":"WXJoT","content":"Start","margin":{"bottom":-30,"right":0,"left":0,"top":0},"annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"rotationReference":"Parent","horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"style":{"fill":"white","strokeColor":"#62A716","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"zIndex":0,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":30,"height":30},"offsetX":100,"offsetY":100},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","inEdges":[],"outEdges":["Connector1"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","task":{"type":"Service","call":false,"compensation":false,"loop":"None"},"subProcess":{"type":"None"}},"annotations":[]},"ports":[],"id":"node1","offsetX":250,"offsetY":200,"width":90,"height":60,"annotations":[{"id":"cEZOa","width":72,"height":48,"content":"Activity1","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","textOverflow":"Clip","textWrapping":"Wrap","whiteSpace":"PreserveAll","bold":false,"color":"black","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textDecoration":"None"},"annotationType":"String","hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"rotationReference":"Parent","margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"borderWidth":4,"style":{"fill":"#d8ecdc","strokeColor":"#78BE83","strokeWidth":3,"gradient":{"x1":0,"y1":0,"x2":1,"y2":1,"stops":[{"color":"white","offset":30,"opacity":0.1},{"color":"#d8ecdc","offset":100,"opacity":0.1}],"type":"Linear","id":"node1_0_task_linear"},"strokeDashArray":"","opacity":1},"zIndex":1,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":90,"height":60},"offsetX":250,"offsetY":200},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","inEdges":["Connector1"],"outEdges":["Connector2","Connector3"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Flow","shape":"Annotation"},"ports":[],"id":"node2","offsetX":250,"offsetY":200,"width":90,"height":60,"borderWidth":4,"annotations":[{"id":"LIWtU","content":"Sample Text","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","textOverflow":"Ellipsis","textWrapping":"NoWrap","whiteSpace":"CollapseAll","bold":false,"color":"black","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textDecoration":"None"},"height":50,"width":80,"margin":{"left":0,"top":0,"right":0,"bottom":0},"annotationType":"String","hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"rotationReference":"Parent","horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"style":{"fill":"white","strokeColor":"#778899","strokeWidth":3,"gradient":{"type":"None"},"strokeDashArray":"","opacity":1},"zIndex":2,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":90,"height":60},"offsetX":250,"offsetY":200},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","inEdges":["Connector2"],"outEdges":[],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","task":{"type":"Service","call":false,"compensation":false,"loop":"None"},"subProcess":{"type":"None"}},"annotations":[]},"ports":[],"id":"node3","offsetX":480,"offsetY":218,"width":90,"height":60,"annotations":[{"id":"T8NOt","width":72,"height":48,"content":"Activity3","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","textOverflow":"Clip","textWrapping":"Wrap","whiteSpace":"PreserveAll","bold":false,"color":"black","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textDecoration":"None"},"annotationType":"String","hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"rotationReference":"Parent","margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"borderWidth":4,"style":{"fill":"#d8ecdc","strokeColor":"#78BE83","strokeWidth":3,"gradient":{"x1":0,"y1":0,"x2":1,"y2":1,"stops":[{"color":"white","offset":30,"opacity":0.1},{"color":"#d8ecdc","offset":100,"opacity":0.1}],"type":"Linear","id":"node3_0_task_linear"},"strokeDashArray":"","opacity":1},"zIndex":3,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":90,"height":60},"offsetX":480,"offsetY":218},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","tooltip":{"openOn":"Auto","content":"","isSticky":false},"inEdges":["Connector3"],"outEdges":["Connector4"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","task":{"type":"Service","call":false,"compensation":false,"loop":"None"},"subProcess":{"type":"None","collapsed":true}},"annotations":[]},"ports":[],"id":"node4","offsetX":485,"offsetY":224,"width":48,"height":30,"annotations":[{"id":"Ji8qt","width":72,"height":48,"content":"Activity4","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","textOverflow":"Clip","textWrapping":"Wrap","whiteSpace":"PreserveAll","bold":false,"color":"black","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textDecoration":"None"},"annotationType":"String","hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"rotationReference":"Parent","margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"borderWidth":4,"style":{"fill":"#d8ecdc","strokeColor":"#78BE83","strokeWidth":3,"gradient":{"x1":0,"y1":0,"x2":1,"y2":1,"stops":[{"color":"white","offset":30,"opacity":0.1},{"color":"#d8ecdc","offset":100,"opacity":0.1}],"type":"Linear","id":"node4_0_task_linear"},"strokeDashArray":"","opacity":1},"zIndex":4,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":48,"height":30},"offsetX":485,"offsetY":224},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","tooltip":{"openOn":"Auto","content":"","isSticky":false},"inEdges":["Connector4"],"outEdges":[],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","task":{"type":"Service","call":false,"compensation":false,"loop":"None"},"subProcess":{"type":"None","collapsed":true}},"annotations":[]},"ports":[],"id":"node5","offsetX":454.5,"offsetY":140.5,"width":33,"height":37,"annotations":[{"id":"i4uN9","width":72,"height":48,"content":"Activity4","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","textOverflow":"Clip","textWrapping":"Wrap","whiteSpace":"PreserveAll","bold":false,"color":"black","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textDecoration":"None"},"annotationType":"String","hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"rotationReference":"Parent","margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"borderWidth":4,"style":{"fill":"#d8ecdc","strokeColor":"#78BE83","strokeWidth":3,"gradient":{"x1":0,"y1":0,"x2":1,"y2":1,"stops":[{"color":"white","offset":30,"opacity":0.1},{"color":"#d8ecdc","offset":100,"opacity":0.1}],"type":"Linear","id":"node5_0_task_linear"},"strokeDashArray":"","opacity":1},"zIndex":5,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":33,"height":37},"offsetX":454.5,"offsetY":140.5},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","tooltip":{"openOn":"Auto","content":"","isSticky":false},"inEdges":[],"outEdges":["Connector6"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","task":{"type":"Service","call":false,"compensation":false,"loop":"None"},"subProcess":{"type":"None","collapsed":true}},"annotations":[]},"ports":[],"id":"node6","offsetX":441,"offsetY":146,"width":90,"height":60,"annotations":[{"id":"BIpFp","width":72,"height":48,"content":"Activity3","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","textOverflow":"Clip","textWrapping":"Wrap","whiteSpace":"PreserveAll","bold":false,"color":"black","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textDecoration":"None"},"annotationType":"String","hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"rotationReference":"Parent","margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"borderWidth":4,"style":{"fill":"#d8ecdc","strokeColor":"#78BE83","strokeWidth":3,"gradient":{"x1":0,"y1":0,"x2":1,"y2":1,"stops":[{"color":"white","offset":30,"opacity":0.1},{"color":"#d8ecdc","offset":100,"opacity":0.1}],"type":"Linear","id":"node6_0_task_linear"},"strokeDashArray":"","opacity":1},"zIndex":6,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":90,"height":60},"offsetX":441,"offsetY":146},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","tooltip":{"openOn":"Auto","content":"","isSticky":false},"inEdges":["Connector6","Connector6iUhJ0"],"outEdges":["Connector6iUhJ0"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false}],"connectors":[{"shape":{"type":"None"},"id":"Connector1","sourceID":"node0","targetID":"node1","style":{"strokeWidth":1,"strokeColor":"#888888","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"targetDecorator":{"shape":"Arrow","style":{"fill":"#555555","strokeColor":"#888888","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"width":10,"height":10,"pivot":{"x":0,"y":0.5}},"type":"Orthogonal","cornerRadius":10,"annotations":[],"zIndex":7,"segments":[{"type":"Orthogonal","direction":null}],"sourcePortID":"","targetPortID":"","targetPoint":{"x":250,"y":170},"connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourcePoint":{"x":100,"y":115},"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"wrapper":{"actualSize":{"width":150,"height":55},"offsetX":175,"offsetY":142.5},"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"hitPadding":10,"tooltip":{"openOn":"Auto","content":"","isSticky":false},"parentId":""},{"shape":{"type":"None"},"id":"Connector2","sourceID":"node1","targetID":"node2","style":{"strokeWidth":1,"strokeColor":"black","strokeDashArray":"2,2","fill":"transparent","opacity":1,"gradient":{"type":"None"}},"targetDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"type":"Orthogonal","cornerRadius":10,"annotations":[],"zIndex":8,"segments":[{"type":"Orthogonal","direction":null}],"sourcePortID":"","targetPortID":"","targetPoint":{"x":250,"y":230},"connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourcePoint":{"x":250,"y":170},"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"wrapper":{"actualSize":{"width":65,"height":100},"offsetX":282.5,"offsetY":200},"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"hitPadding":10,"tooltip":{"openOn":"Auto","content":"","isSticky":false},"parentId":""},{"shape":{"type":"None"},"id":"Connector3","sourceID":"node1","targetID":"node3","style":{"strokeWidth":1,"strokeColor":"#888888","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"targetDecorator":{"shape":"Arrow","style":{"fill":"#555555","strokeColor":"#888888","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"width":10,"height":10,"pivot":{"x":0,"y":0.5}},"type":"Orthogonal","cornerRadius":10,"annotations":[],"zIndex":9,"segments":[{"type":"Orthogonal","direction":null}],"sourcePortID":"","targetPortID":"","targetPoint":{"x":435,"y":218},"connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourcePoint":{"x":295,"y":200},"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"wrapper":{"actualSize":{"width":140,"height":18},"offsetX":365,"offsetY":209},"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"hitPadding":10,"parentId":""},{"shape":{"type":"None"},"id":"Connector4","sourceID":"node3","targetID":"node4","style":{"strokeWidth":1,"strokeColor":"#888888","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"targetDecorator":{"shape":"Arrow","style":{"fill":"#555555","strokeColor":"#888888","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"width":10,"height":10,"pivot":{"x":0,"y":0.5}},"type":"Orthogonal","cornerRadius":10,"annotations":[],"zIndex":10,"segments":[{"type":"Orthogonal","length":25,"direction":"Right"},{"type":"Orthogonal","length":6,"direction":"Bottom"},{"type":"Orthogonal","length":21,"direction":"Left"},{"type":"Orthogonal","direction":null}],"sourcePortID":"","targetPortID":"","targetPoint":{"x":509,"y":224},"connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourcePoint":{"x":525,"y":218},"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"wrapper":{"actualSize":{"width":41,"height":56},"offsetX":529.5,"offsetY":196},"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"hitPadding":10,"tooltip":{"openOn":"Auto","content":"","isSticky":false},"parentId":""},{"shape":{"type":"None"},"id":"Connector6","sourceID":"node5","targetID":"node6","style":{"strokeWidth":1,"strokeColor":"#888888","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"targetDecorator":{"shape":"Arrow","style":{"fill":"#555555","strokeColor":"#888888","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"width":10,"height":10,"pivot":{"x":0,"y":0.5}},"type":"Orthogonal","cornerRadius":10,"annotations":[],"zIndex":12,"segments":[{"type":"Orthogonal","direction":null}],"sourcePortID":"","targetPortID":"","targetPoint":{"x":396,"y":146},"connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourcePoint":{"x":471,"y":140.5},"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"wrapper":{"actualSize":{"width":75,"height":5.5},"offsetX":433.5,"offsetY":143.25},"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"hitPadding":10,"tooltip":{"openOn":"Auto","content":"","isSticky":false},"connectionPadding":0,"parentId":""},{"shape":{"type":"None"},"id":"Connector6iUhJ0","sourceID":"node6","targetID":"node6","style":{"strokeWidth":1,"strokeColor":"#888888","fill":"transparent","strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"targetDecorator":{"shape":"Arrow","style":{"fill":"#555555","strokeColor":"#888888","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"width":10,"height":10,"pivot":{"x":0,"y":0.5}},"type":"Orthogonal","cornerRadius":10,"annotations":[],"zIndex":23,"segments":[{"type":"Orthogonal","direction":null,"length":null}],"sourcePortID":"","targetPortID":"","targetPoint":{"x":441,"y":176},"connectorSpacing":13,"sourcePadding":0,"targetPadding":0,"sourcePoint":{"x":441,"y":116},"sourceDecorator":{"shape":"None","width":10,"height":10,"pivot":{"x":0,"y":0.5},"style":{"fill":"black","strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}}},"wrapper":{"actualSize":{"width":65,"height":100},"offsetX":473.5,"offsetY":146},"fixedUserHandles":[],"ports":[],"visible":true,"flipMode":"All","constraints":994878,"hitPadding":10,"tooltip":{"openOn":"Auto","content":"","isSticky":false},"connectionPadding":0,"flip":"None","parentId":""}],"rulerSettings":{"showRulers":true,"horizontalRuler":{"orientation":"Horizontal","thickness":25,"segmentWidth":100,"interval":5,"tickAlignment":"RightOrBottom","arrangeTick":null,"markerColor":"red"},"verticalRuler":{"orientation":"Vertical","thickness":25,"segmentWidth":100,"interval":5,"tickAlignment":"RightOrBottom","arrangeTick":null,"markerColor":"red"},"dynamicGrid":true},"constraints":2548,"getConnectorDefaults":{},"enableRtl":false,"locale":"en-US","enablePersistence":false,"scrollSettings":{"viewPortWidth":1509.59375,"viewPortHeight":400,"currentZoom":1,"horizontalOffset":0,"verticalOffset":0,"padding":{"left":0,"right":0,"top":0,"bottom":0},"scrollLimit":"Diagram","canAutoScroll":false},"backgroundColor":"transparent","layout":{"type":"None","enableAnimation":true,"arrangement":"Nonlinear","enableRouting":false},"snapSettings":{"constraints":31,"gridType":"Lines","verticalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"lineDashArray":"","lineColor":"lightgray"},"horizontalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"lineDashArray":"","lineColor":"lightgray"}},"contextMenuSettings":{},"dataSourceSettings":{"dataManager":null,"dataSource":null,"crudAction":{"read":""},"connectionDataSource":{"crudAction":{"read":""}}},"mode":"SVG","layers":[{"id":"default_layer","visible":true,"lock":false,"objects":["node0","node1","node2","node3","node4","node5","node6","Connector1","Connector2","Connector3","Connector4","Connector6","Connector6iUhJ0"],"zIndex":0,"objectZIndex":37}],"diagramSettings":{"inversedAlignment":true},"pageSettings":{"boundaryConstraints":"Infinity","orientation":"Landscape","height":null,"width":null,"background":{"source":"","color":"transparent"},"showPageBreaks":false,"fitOptions":{"canFit":false}},"selectedItems":{"nodes":[],"connectors":[],"wrapper":null,"constraints":16382,"selectedObjects":[{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"Task","task":{"type":"Service","call":false,"compensation":false,"loop":"None"},"subProcess":{"type":"None","collapsed":true}},"annotations":[]},"ports":[],"id":"node4","offsetX":485,"offsetY":224,"width":48,"height":30,"annotations":[{"id":"Ji8qt","width":72,"height":48,"content":"Activity4","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","textOverflow":"Clip","textWrapping":"Wrap","whiteSpace":"PreserveAll","bold":false,"color":"black","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textDecoration":"None"},"annotationType":"String","hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"rotationReference":"Parent","margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"borderWidth":4,"style":{"fill":"#d8ecdc","strokeColor":"#78BE83","strokeWidth":3,"gradient":{"x1":0,"y1":0,"x2":1,"y2":1,"stops":[{"color":"white","offset":30,"opacity":0.1},{"color":"#d8ecdc","offset":100,"opacity":0.1}],"type":"Linear","id":"node4_0_task_linear"},"strokeDashArray":"","opacity":1},"zIndex":4,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":48,"height":30},"offsetX":485,"offsetY":224},"constraints":5240814,"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"flipMode":"All","tooltip":{"openOn":"Auto","content":"","isSticky":false},"inEdges":["Connector4"],"outEdges":[],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false}],"userHandles":[],"rotateAngle":0,"canToggleSelection":false,"pivot":{"x":0.5,"y":0.5},"width":48,"height":30,"offsetX":485,"offsetY":224,"handleSize":14},"basicElements":[],"tooltip":{"content":""},"commandManager":{"commands":[]},"tool":3,"customCursor":[],"version":17.1}';
            diagram.loadDiagram(data);
            let node:NodeModel = diagram.nameTable['node4'];
            diagram.select([node]);
            diagram.drag(diagram.selectedItems.nodes[0],1,0);
            expect(diagram.selectedItems.nodes[0].offsetX === 486).toBe(true);
            done();
        });
    });

    describe('909180 - Line routing not working when node is dropped from palette', () => {

        let palette: SymbolPalette;
        let flowshapes: NodeModel[] = [
            { id: 'start', dragSize: { width: 100, height: 100 }, previewSize: { width: 100, height: 100 }, shape: { type: 'Flow', shape: 'Terminator' } },
            { id: 'process', dragSize: { width: 100, height: 100 }, previewSize: { width: 100, height: 100 }, shape: { type: 'Flow', shape: 'Process' } },
            { id: 'decision', dragSize: { width: 100, height: 100 }, previewSize: { width: 100, height: 100 }, shape: { type: 'Flow', shape: 'Decision' } },
            { id: 'data', dragSize: { width: 100, height: 100 }, previewSize: { width: 100, height: 100 }, shape: { type: 'Flow', shape: 'Data' } },
            { id: 'end', dragSize: { width: 100, height: 100 }, previewSize: { width: 100, height: 100 }, shape: { type: 'Flow', shape: 'Terminator' } }
        ];
        beforeAll((): void => {

            ele = createElement('div', { styles: 'width:100%;height:700px;' });
            ele.appendChild(createElement('div', { id: 'symbolpalette909180', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram909180', styles: 'width:74%;height:700px;float:left;' }));
            document.body.appendChild(ele);

            // Initializes the nodes for the diagram
            nodes = [
                {
                    id: 'start', offsetX: 350, offsetY: 300, shape: { type: 'Flow', shape: 'Terminator' },
                    ports: [{ id: 'port1', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hidden }],
                    style: { fill: '#D5535D' }, annotations: [{ content: 'Start', style: { color: 'white' } }]
                },
                {
                    id: 'decision', offsetX: 650, offsetY: 300, shape: { type: 'Flow', shape: 'Decision' },
                    style: { fill: '#9A8AF7' }, annotations: [{ content: 'Decision', style: { color: 'white' } }]
                }

            ];

            // Initializes the connectors for the diagram
            connectors = [
                { id: 'Connector2', sourceID: 'start', targetID: 'decision', type: "Orthogonal" },
            ];

            diagram = new Diagram({
                width: 1000, height: 600,
                connectors: connectors, nodes: nodes,
                constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting
            });
            diagram.appendTo('#diagram909180');

            palette = new SymbolPalette({
                width: '25%', height: '500px',
                palettes: [
                    { id: 'flow', expanded: true, symbols: flowshapes, iconCss: '', title: 'Flow Shapes' }
                ], enableAnimation: false, enableSearch: true,
                expandMode: 'Multiple',
                symbolHeight: 50, symbolWidth: 50,
                symbolPreview: { height: 100, width: 100 },
                symbolMargin: { top: 5, bottom: 5, left: 5, right: 5 }
            });
            palette.appendTo('#symbolpalette909180');

        });
        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });

        it('Drop node on connector', (done: Function) => {
            setTimeout(() => {
                console.log('timeOut8');
                palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                    let clonedElement: HTMLElement; let diagramElement: any;
                    let position: PointModel = palette['getMousePosition'](e.sender);
                    let symbols: IElement = palette.symbolTable['decision'];
                    palette['selectedSymbols'] = symbols;
                    if (symbols !== undefined) {
                        clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                        clonedElement.setAttribute('paletteId', palette.element.id);
                    }
                    return clonedElement;
                };
                diagram.drop = (arg) => {
                    arg.cancel = false;
                    done();
                }
                let events = new MouseEvents();
                events.mouseDownEvent(palette.element, 75, 100, false, false);
                events.mouseMoveEvent(palette.element, 100, 100, false, false);
                events.mouseMoveEvent(palette.element, 200, 200, false, false);
                events.mouseMoveEvent(diagram.element, 420, 250, false, false);
                events.mouseUpEvent(diagram.element, 420, 250, false, false);
                expect(diagram.connectors[0].segments.length).toBe(4);
                done();
            }, 100);
        });
    });
});
