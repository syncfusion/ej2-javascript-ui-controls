import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Segments } from '../../../src/diagram/enum/enum';
import { Point } from '../../../src/diagram/primitives/point';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { Connector } from '../../../src/diagram/index';
/**
 * Port to port docking
 */
describe('Diagram Control', () => {
    describe('Port to port', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'PortToPortIssue' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [{ id: 'node1', offsetX: 100, offsetY: 100, width: 50, height: 50, ports: [{ id: 'port1', offset: { x: 0.5, y: 1 } }] },
                { id: 'node2', offsetX: 200, offsetY: 200, width: 50, height: 50, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } }] }],
                connectors: [{
                    id: 'Connector1', type: 'Orthogonal',
                    sourceID: 'node2', sourcePortID: 'port1',
                    targetPortID: 'port1',
                    targetID: 'node1',
                }],
            });
            diagram.appendTo('#PortToPortIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking left to bottom direction', (done: Function) => {
            expect((diagram.connectors[0] as Connector).intermediatePoints.length == 3).toBe(true);
            done();
        });
    });

    describe('Port to port - source and target as same', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'PortToPortSourceAndTargetAsSameIssue' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: 700, height: 700,
                nodes: [
                    {
                        id: 'node1', offsetX: 100, offsetY: 100, width: 100, height: 100, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node2', offsetX: 300, offsetY: 100, width: 100, height: 100, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node3', offsetX: 100, offsetY: 300, width: 100, height: 100, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node4', offsetX: 300, offsetY: 300, width: 100, height: 100, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    }],
                connectors: [
                    { id: 'Connector1', type: 'Orthogonal', sourceID: 'node1', targetID: 'node1', sourcePortID: 'port1', targetPortID: 'port2' },
                    { id: 'Connector2', type: 'Orthogonal', sourceID: 'node1', targetID: 'node1', sourcePortID: 'port1', targetPortID: 'port3' },
                    { id: 'Connector3', type: 'Orthogonal', sourceID: 'node1', targetID: 'node1', sourcePortID: 'port1', targetPortID: 'port4' },

                    { id: 'Connector4', type: 'Orthogonal', sourceID: 'node2', targetID: 'node2', sourcePortID: 'port2', targetPortID: 'port1' },
                    { id: 'Connector5', type: 'Orthogonal', sourceID: 'node2', targetID: 'node2', sourcePortID: 'port2', targetPortID: 'port3' },
                    { id: 'Connector6', type: 'Orthogonal', sourceID: 'node2', targetID: 'node2', sourcePortID: 'port2', targetPortID: 'port4' },

                    { id: 'Connector7', type: 'Orthogonal', sourceID: 'node3', targetID: 'node3', sourcePortID: 'port3', targetPortID: 'port1' },
                    { id: 'Connector8', type: 'Orthogonal', sourceID: 'node3', targetID: 'node3', sourcePortID: 'port3', targetPortID: 'port2' },
                    { id: 'Connector9', type: 'Orthogonal', sourceID: 'node3', targetID: 'node3', sourcePortID: 'port3', targetPortID: 'port4' },

                    { id: 'Connector10', type: 'Orthogonal', sourceID: 'node4', targetID: 'node4', sourcePortID: 'port4', targetPortID: 'port1' },
                    { id: 'Connector11', type: 'Orthogonal', sourceID: 'node4', targetID: 'node4', sourcePortID: 'port4', targetPortID: 'port2' },
                    { id: 'Connector12', type: 'Orthogonal', sourceID: 'node4', targetID: 'node4', sourcePortID: 'port4', targetPortID: 'port3' },
                ],
            });
            diagram.appendTo('#PortToPortSourceAndTargetAsSameIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking port to port connection- same source and target node', (done: Function) => {
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 30 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 30 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 50).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 170 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 170 && (diagram.connectors[1] as Connector).intermediatePoints[4].x == 170 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[5].x == 150 && (diagram.connectors[1] as Connector).intermediatePoints[5].y == 100).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 50 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 30 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 30 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 170 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 170 && (diagram.connectors[2] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[2] as Connector).intermediatePoints[4].y == 150).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 50 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 30 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 30 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == 250 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 100).toBe(true);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 50 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 30 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 30 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[4] as Connector).intermediatePoints[4].x == 350 && (diagram.connectors[4] as Connector).intermediatePoints[4].y == 100).toBe(true);
            expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 50 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 30 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 30 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 170 && (diagram.connectors[5] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[4].y == 170 && (diagram.connectors[5] as Connector).intermediatePoints[5].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[5].y == 150).toBe(true);
            expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 370 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 30 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 370 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 30 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[5].x == 50 && (diagram.connectors[6] as Connector).intermediatePoints[5].y == 300).toBe(true);
            expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 230 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 230 && (diagram.connectors[7] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[7] as Connector).intermediatePoints[4].y == 250).toBe(true);
            expect((diagram.connectors[8] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[8] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[8] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[8] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[8] as Connector).intermediatePoints[2].y == 370 && (diagram.connectors[8] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[8] as Connector).intermediatePoints[3].y == 370 && (diagram.connectors[8] as Connector).intermediatePoints[4].x == 100 && (diagram.connectors[8] as Connector).intermediatePoints[4].y == 350).toBe(true);
            expect((diagram.connectors[9] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[9] as Connector).intermediatePoints[0].y == 350 && (diagram.connectors[9] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[9] as Connector).intermediatePoints[1].y == 370 && (diagram.connectors[9] as Connector).intermediatePoints[2].x == 230 && (diagram.connectors[9] as Connector).intermediatePoints[2].y == 370 && (diagram.connectors[9] as Connector).intermediatePoints[3].x == 230 && (diagram.connectors[9] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[9] as Connector).intermediatePoints[4].x == 250 && (diagram.connectors[9] as Connector).intermediatePoints[4].y == 300).toBe(true);
            expect((diagram.connectors[10] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[10] as Connector).intermediatePoints[0].y == 350 && (diagram.connectors[10] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[10] as Connector).intermediatePoints[1].y == 370 && (diagram.connectors[10] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[10] as Connector).intermediatePoints[2].y == 370 && (diagram.connectors[10] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[10] as Connector).intermediatePoints[3].y == 230 && (diagram.connectors[10] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[10] as Connector).intermediatePoints[4].y == 230 && (diagram.connectors[10] as Connector).intermediatePoints[5].x == 300 && (diagram.connectors[10] as Connector).intermediatePoints[5].y == 250).toBe(true);
            expect((diagram.connectors[11] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[11] as Connector).intermediatePoints[0].y == 350 && (diagram.connectors[11] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[11] as Connector).intermediatePoints[1].y == 370 && (diagram.connectors[11] as Connector).intermediatePoints[2].x == 370 && (diagram.connectors[11] as Connector).intermediatePoints[2].y == 370 && (diagram.connectors[11] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[11] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[11] as Connector).intermediatePoints[4].x == 350 && (diagram.connectors[11] as Connector).intermediatePoints[4].y == 300).toBe(true);
            done();
        });
    });

    describe('Port to port docking issue (Right to Right) min distance b/w source and target node ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'PortToPortDockingIssue' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [
                    {
                        id: 'node1', offsetX: 80, offsetY: 150, width: 100, height: 100, ports: [{ id: 'port3', offset: { x: 1, y: 0.5 } }]
                    },
                    {
                        id: 'node2', offsetX: 200, offsetY: 100, width: 100, height: 100, ports: [{ id: 'port3', offset: { x: 1, y: 0.5 } }]
                    },
                    {
                        id: 'node3', offsetX: 100, offsetY: 300, width: 100, height: 100, ports: [{ id: 'port3', offset: { x: 1, y: 0.5 } }]
                    },
                    {
                        id: 'node4', offsetX: 210, offsetY: 380, width: 100, height: 100, ports: [{ id: 'port3', offset: { x: 1, y: 0.5 } }]
                    }
                ],
                connectors: [
                    { id: 'conn1', type: 'Orthogonal', sourceID: 'node1', sourcePortID: 'port3', targetID: 'node2', targetPortID: 'port3' },
                    { id: 'conn2', type: 'Orthogonal', sourceID: 'node4', sourcePortID: 'port3', targetID: 'node3', targetPortID: 'port3' }
                ],
            });
            diagram.appendTo('#PortToPortDockingIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking port to port source node offsetX less than target node offsetX(Overlapping)', (done: Function) => {
            let point = (diagram.connectors[0] as Connector).intermediatePoints;
            expect(point.length == 4 && point[0].x == 130 && point[0].y == 150 &&
                point[1].x == 270 && point[1].y == 150 &&
                point[2].x == 270 && point[2].y == 100 &&
                point[3].x == 250 && point[3].y == 100).toBe(true);
            done();
        });

        it('Checking port to port source node offsetX greater than target node offsetX(Overlapping)', (done: Function) => {
            let point = (diagram.connectors[1] as Connector).intermediatePoints;
            expect(point.length == 4 && point[0].x == 260 && point[0].y == 380 &&
                point[1].x == 280 && point[1].y == 380 &&
                point[2].x == 280 && point[2].y == 300 &&
                point[3].x == 150 && point[3].y == 300).toBe(true);
            done();
        });
    });

    describe('Port to port docking issue(Right to Right) maximum distance b/w source and target node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'PortToPortDockingRightToRightIssue' });
            document.body.appendChild(ele);
            let portCollection = [{ id: 'port1', offset: { x: 0, y: 0.5 } },
            { id: 'port2', offset: { x: 0.5, y: 0 } },
            { id: 'port3', offset: { x: 1, y: 0.5 } },
            { id: 'port4', offset: { x: 0.5, y: 1 } }];
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [{ id: 'node1', offsetX: 100, offsetY: 104, width: 100, height: 100, ports: portCollection },
                { id: 'node2', offsetX: 300, offsetY: 100, width: 100, height: 100, ports: portCollection }],
                connectors: [{ id: 'connector1', type: 'Orthogonal', sourceID: 'node1', sourcePortID: 'port3', targetID: 'node2', targetPortID: 'port3' }],
            });
            diagram.appendTo('#PortToPortDockingRightToRightIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking port to port(right to right)', (done: Function) => {
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 104 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 104 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 38 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 38 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 370 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 350 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
            done();
        });
    });

    describe('Port to port docking issue(Bottom to Right and Top to Left)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'PortToPortDockingBottomToRightAndTopToLeftIssue' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [
                    {
                        id: 'node1', offsetX: 100, offsetY: 200, width: 100, height: 100, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }],
                    }, {
                        id: 'node2', offsetX: 300, offsetY: 100, width: 100, height: 100, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }],
                    },
                    {
                        id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 200, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }],
                    }, {
                        id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    }],
                connectors:
                    [
                        {
                            id: 'conn1', type: 'Orthogonal',
                            sourceID: 'node2', sourcePortID: 'port4', targetID: 'node1', targetPortID: 'port3'
                        },
                        {
                            id: 'conn2', type: 'Orthogonal',
                            sourceID: 'node3', sourcePortID: 'port2', targetID: 'node4', targetPortID: 'port1'
                        },
                    ],

            });
            diagram.appendTo('#PortToPortDockingBottomToRightAndTopToLeftIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking port to port (Bottom to Right connection)', (done: Function) => {
            expect((diagram.connectors[0] as Connector).intermediatePoints.length == 3).toBe(true);
            done();
        });

        it('Checking port to node (Top to Right connection)', (done: Function) => {
            expect((diagram.connectors[1] as Connector).intermediatePoints.length == 3).toBe(true);
            done();
        });
    });

    describe('Port to node docking issue(Port position center of the node) ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'PortToNodeIssue1' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [
                    {
                        id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port5', offset: { x: 0.51, y: 0.51 } },
                        {
                            id: 'port4', offset: { x: 0.5, y: 1 }
                        }],
                    }, {
                        id: 'node2', width: 100, height: 100, offsetX: 550, offsetY: 250, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    }],
                connectors:
                    [
                        {
                            id: 'Connector1', type: 'Orthogonal',
                            sourceID: 'node1', sourcePortID: 'port5', targetID: 'node2',
                        },
                    ],

            });
            diagram.appendTo('#PortToNodeIssue1');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking port to node (Bottom to Top connection) - Port position(0.51, 0.51)', (done: Function) => {
            let point = (diagram.connectors[0] as Connector).intermediatePoints;
            expect(point.length == 4 && point[0].x == 101 && point[0].y == 101 &&
                point[1].x == 101 && point[1].y == 170 &&
                point[2].x == 550 && point[2].y == 170 &&
                point[3].x == 550 && point[3].y == 200).toBe(true);
            done();
        });
    });
});