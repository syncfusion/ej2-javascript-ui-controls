import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Segments } from '../../../src/diagram/enum/enum';
import { Point } from '../../../src/diagram/primitives/point';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { Connector } from '../../../src/diagram/index';
/**
 * Node to port docking
 */
//missing port to node
describe('Diagram Control', () => {

    let inToOut: object[] = [
        { source: { x: 450, y: 475 }, target: { x: 716.51, y: 575 } },
        { source: { x: 450, y: 500 }, target: { x: 625, y: 666.51 } },
        { source: { x: 450, y: 525 }, target: { x: 500, y: 700 } },
        { source: { x: 550, y: 475 }, target: { x: 375, y: 666.51 } },
        { source: { x: 550, y: 500 }, target: { x: 283.49, y: 575 } },
        { source: { x: 550, y: 525 }, target: { x: 300, y: 500 } },
        { source: { x: 475, y: 450 }, target: { x: 283.49, y: 425 } },
        { source: { x: 500, y: 450 }, target: { x: 375, y: 333.49 } },
        { source: { x: 525, y: 450 }, target: { x: 500, y: 300 } },
        { source: { x: 475, y: 550 }, target: { x: 625, y: 333.49 } },
        { source: { x: 500, y: 550 }, target: { x: 716.51, y: 425 } },
        { source: { x: 525, y: 550 }, target: { x: 700, y: 500 } }];
    let outToIn: object[] = [
        { source: { x: 666.51, y: 600 }, target: { x: 500, y: 550 } },
        { source: { x: 575, y: 716.51 }, target: { x: 500, y: 550 } },
        { source: { x: 450, y: 775 }, target: { x: 500, y: 550 } },
        { source: { x: 425, y: 691.51 }, target: { x: 500, y: 550 } },
        { source: { x: 333.49, y: 625 }, target: { x: 500, y: 550 } },
        { source: { x: 300, y: 525 }, target: { x: 450, y: 500 } },
        { source: { x: 258.49, y: 325 }, target: { x: 500, y: 450 } },
        { source: { x: 375, y: 233.49 }, target: { x: 500, y: 450 } },
        { source: { x: 525, y: 200 }, target: { x: 500, y: 450 } },
        { source: { x: 600, y: 333.49 }, target: { x: 500, y: 450 } },
        { source: { x: 716.51, y: 425 }, target: { x: 500, y: 450 } },
        { source: { x: 775, y: 550 }, target: { x: 550, y: 500 } }];

    let x: string = 'x';
    let y: string = 'y';
    let source: string = 'source';
    let target: string = 'target';
    describe('Port to node docking', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram63' });
            document.body.appendChild(ele);

            let nodes: NodeModel[] = [{
                id: 'node1', offsetX: 500, offsetY: 500, width: 100, height: 100,
                ports: [
                    { id: 'left1', offset: { x: 0, y: 0.25 } },
                    { id: 'left2', offset: { x: 0, y: 0.5 } },
                    { id: 'left3', offset: { x: 0, y: 0.75 } },

                    { id: 'right1', offset: { x: 1, y: 0.25 } },
                    { id: 'right2', offset: { x: 1, y: 0.5 } },
                    { id: 'right3', offset: { x: 1, y: 0.75 } },

                    { id: 'top1', offset: { x: 0.25, y: 0 } },
                    { id: 'top2', offset: { x: 0.5, y: 0 } },
                    { id: 'top3', offset: { x: 0.75, y: 0 } },

                    { id: 'bottom1', offset: { x: 0.25, y: 1 } },
                    { id: 'bottom2', offset: { x: 0.5, y: 1 } },
                    { id: 'bottom3', offset: { x: 0.75, y: 1 } },
                ]
            }];


            let connectors: ConnectorModel[] = [];
            let angle: number = 30;

            let distance: number = 250;

            let sourcePt: PointModel = { x: 500, y: 500 };

            for (let i: number = 0; i < 12; i++) {
                let newPoint: PointModel = Point.transform(sourcePt, angle, distance);
                nodes.push({ id: 'target ' + i, width: 100, height: 100, offsetX: newPoint.x, offsetY: newPoint.y });
                connectors.push({
                    sourceID: 'node1',
                    sourcePortID: nodes[0].ports[i].id,
                    targetID: 'target ' + i, type: 'Orthogonal'
                });
                angle += 30;
            }


            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: nodes, connectors: connectors
            });
            diagram.appendTo('#diagram63');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking in to out connections', (done: Function) => {
            let i: number = 0;
            for (let conn of diagram.connectors) {
                expect(conn.sourcePoint.x === inToOut[i][source][x] &&
                    conn.sourcePoint.y === inToOut[i][source][y] &&
                    conn.targetPoint.x === inToOut[i][target][x] &&
                    conn.targetPoint.y === inToOut[i][target][y]).toBe(true);
                i++;
            }
            done();
        });
    });


    describe('Node to port docking', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram63' });
            document.body.appendChild(ele);

            let ports = [
                { id: 'left1', offset: { x: 0, y: 0.25 } },
                { id: 'left2', offset: { x: 0, y: 0.5 } },
                { id: 'left3', offset: { x: 0, y: 0.75 } },

                { id: 'right1', offset: { x: 1, y: 0.25 } },
                { id: 'right2', offset: { x: 1, y: 0.5 } },
                { id: 'right3', offset: { x: 1, y: 0.75 } },

                { id: 'top1', offset: { x: 0.25, y: 0 } },
                { id: 'top2', offset: { x: 0.5, y: 0 } },
                { id: 'top3', offset: { x: 0.75, y: 0 } },

                { id: 'bottom1', offset: { x: 0.25, y: 1 } },
                { id: 'bottom2', offset: { x: 0.5, y: 1 } },
                { id: 'bottom3', offset: { x: 0.75, y: 1 } },
            ];

            let nodes: NodeModel[] = [{
                id: 'node1', offsetX: 500, offsetY: 500, width: 100, height: 100
            }];


            let connectors: ConnectorModel[] = [];
            let angle: number = 30;

            let distance: number = 250;

            let sourcePt: PointModel = { x: 500, y: 500 };

            for (let i: number = 0; i < 12; i++) {
                let newPoint: PointModel = Point.transform(sourcePt, angle, distance);
                let newNode: NodeModel = {
                    id: 'source ' + i, width: 100, height: 100, offsetX: newPoint.x, offsetY: newPoint.y,
                    ports: ports
                };
                nodes.push(newNode);
                connectors.push({
                    targetID: 'node1',
                    sourcePortID: newNode.ports[i].id,
                    sourceID: 'source ' + i, type: 'Orthogonal'
                });
                angle += 30;
            }


            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: nodes, connectors: connectors
            });
            diagram.appendTo('#diagram63');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking out to in a circle', (done: Function) => {
            let i: number = 0;
            for (let conn of diagram.connectors) {
                expect(conn.sourcePoint.x === outToIn[i][source][x] &&
                    conn.sourcePoint.y === outToIn[i][source][y] &&
                    conn.targetPoint.x === outToIn[i][target][x] &&
                    conn.targetPoint.y === outToIn[i][target][y]).toBe(true);
                i++;
            }
            done();
        });
    });

    describe('Node to port docking issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'NodeToPortDockingIssue' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [{
                    id: 'node1', offsetX: 80, offsetY: 150, width: 100, height: 100, ports: [{ id: 'port3', offset: { x: 1, y: 0.5 } }]
                }, {
                    id: 'node2', offsetX: 200, offsetY: 100, width: 100, height: 100, ports: [{ id: 'port3', offset: { x: 1, y: 0.5 } }]
                }], connectors: [{ id: 'conn1', type: 'Orthogonal', sourceID: 'node1', targetID: 'node2', targetPortID: 'port3' }],

            });
            diagram.appendTo('#NodeToPortDockingIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking node to port (Overlapping)', (done: Function) => {
            let point = (diagram.connectors[0] as Connector).intermediatePoints;
            expect(point.length == 4 && point[0].x == 130 && point[0].y == 150 &&
                point[1].x == 270 && point[1].y == 150 &&
                point[2].x == 270 && point[2].y == 100 &&
                point[3].x == 250 && point[3].y == 100).toBe(true);
            done();
        });
    });
    describe('Node to port docking issue(Left to Top)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'NodeToPortDockingLeftToTopIssue' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [
                    {
                        id: 'node1', offsetX: 300, offsetY: 100, width: 100, height: 100, ports: [{ id: 'port3', offset: { x: 1, y: 0.5 } }]
                    }, {
                        id: 'node2', offsetX: 100, offsetY: 200, width: 100, height: 100, ports: [{ id: 'port3', offset: { x: 1, y: 0.5 } }]
                    },
                    {
                        id: 'node3', width: 100, height: 100, offsetX: 509, offsetY: 109, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }],
                    }, {
                        id: 'node4', width: 100, height: 100, offsetX: 673, offsetY: 219, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 450, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }],
                    },
                    {
                        id: 'node6', width: 100, height: 100, offsetX: 350, offsetY: 250, ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    }],
                connectors:
                    [
                        {
                            id: 'conn1', type: 'Orthogonal',
                            sourceID: 'node1', targetID: 'node2', targetPortID: 'port1'
                        },
                        {
                            id: 'conn2', type: 'Orthogonal',
                            sourceID: 'node4', sourcePortID: 'port2', targetID: 'node3',
                        },
                        {
                            id: 'conn3', type: 'Orthogonal',
                            sourceID: 'node5', sourcePortID: 'port4', targetID: 'node6',
                        },
                    ],


            });
            diagram.appendTo('#NodeToPortDockingLeftToTopIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking node to port (Left to Right connection)', (done: Function) => {
            let point = (diagram.connectors[0] as Connector).intermediatePoints;
            expect(point.length == 4 && point[0].x == 250 && point[0].y == 100 &&
                point[1].x == 230 && point[1].y == 100 && point[2].x == 230 && point[2].y == 200 &&
                point[3].x == 150 && point[3].y == 200).toBe(true);
            done();
        });

        it('Checking port to node (Top to Right connection)', (done: Function) => {
            let point = (diagram.connectors[1] as Connector).intermediatePoints;
            expect(point.length == 3 && point[0].x == 673 && point[0].y == 169 &&
                point[1].x == 673 && point[1].y == 109 &&
                point[2].x == 559 && point[2].y == 109).toBe(true);
            done();
        });

        it('Checking port to node (Bottom to Bottom connection)', (done: Function) => {
            let point = (diagram.connectors[2] as Connector).intermediatePoints;
            expect(point.length == 4 && point[0].x == 100 && point[0].y == 500 &&
                point[1].x == 100 && point[1].y == 520 && point[2].x == 350 && point[2].y == 520 &&
                point[3].x == 350 && point[3].y == 300).toBe(true);
            done();
        });
    });
});
