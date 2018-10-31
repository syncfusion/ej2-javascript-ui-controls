import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel ,BasicShapeModel} from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Point } from '../../../src/diagram/primitives/point';
import { PointModel } from '../../../src/diagram/primitives/point-model';
/**
 * Node to node docking
 */

describe('Diagram Control', () => {

    let higherDistance: object[] = [
        { source: { x: 300, y: 350 }, target: { x: 441.42, y: 391.42 } },
        { source: { x: 300, y: 350 }, target: { x: 300, y: 450 } },
        { source: { x: 300, y: 350 }, target: { x: 158.58, y: 391.42 } },
        { source: { x: 250, y: 300 }, target: { x: 150, y: 300 } },
        { source: { x: 300, y: 250 }, target: { x: 158.58, y: 208.58 } },
        { source: { x: 300, y: 250 }, target: { x: 300, y: 150 } },
        { source: { x: 300, y: 250 }, target: { x: 441.42, y: 208.58 } },
        { source: { x: 350, y: 300 }, target: { x: 450, y: 300 } }];

    let lowerDistance: object[] = [
        { source: { x: 250, y: 300 }, target: { x: 456.07, y: 406.07 } },
        { source: { x: 350, y: 300 }, target: { x: 143.93, y: 406.07 } },
        { source: { x: 350, y: 300 }, target: { x: 143.93, y: 193.93 } },
        { source: { x: 250, y: 300 }, target: { x: 456.07, y: 193.93 } }];

    let lowerDistance2: object[] = [
        { source: { x: 456.07, y: 406.07 }, target: { x: 250, y: 300 } },
        { source: { x: 143.93, y: 406.07 }, target: { x: 350, y: 300 } },
        { source: { x: 143.93, y: 193.93 }, target: { x: 350, y: 300 } },
        { source: { x: 456.07, y: 193.93 }, target: { x: 250, y: 300 } }];

    let overlapped: object[] = [
        { source: { x: 150, y: 200 }, target: { x: 350, y: 300 } },
        { source: { x: 450, y: 200 }, target: { x: 625, y: 275 } },
        { source: { x: 750, y: 200 }, target: { x: 900, y: 250 } },
        { source: { x: 150, y: 500 }, target: { x: 275, y: 525 } },
        { source: { x: 500, y: 450 }, target: { x: 500, y: 575 } },
        { source: { x: 850, y: 500 }, target: { x: 650, y: 600 } },
        { source: { x: 250, y: 900 }, target: { x: 75, y: 975 } },
        { source: { x: 550, y: 900 }, target: { x: 400, y: 950 } },
        { source: { x: 850, y: 900 }, target: { x: 725, y: 925 } }];


    let x: string = 'x';
    let y: string = 'y';
    let source: string = 'source';
    let target: string = 'target';
    describe('Node to node docking', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram63' });
            document.body.appendChild(ele);


            let nodes: NodeModel[] = [{
                id: 'node1', offsetX: 300, offsetY: 300, width: 100, height: 100,
                style: { opacity: 0.5 }
            }];


            let connectors: ConnectorModel[] = [];
            let angle: number = 45;

            let distance: number = 200;

            let sourcePt: PointModel = { x: 300, y: 300 };

            for (let i: number = 0; i < 8; i++) {
                let newPoint: PointModel = Point.transform(sourcePt, angle, distance);
                nodes.push({
                    id: 'target_' + i, width: 100, height: 100, offsetX: newPoint.x, offsetY: newPoint.y,
                    style: { opacity: 0.5 }
                });
                connectors.push({ sourceID: 'node1', targetID: 'target_' + i, type: 'Orthogonal' });
                angle += 45;
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

        it('Starting from center of the circle - Higher Distance', (done: Function) => {
            let i: number = 0;
            for (let conn of diagram.connectors) {
                expect(conn.sourcePoint.x === higherDistance[i][source][x] &&
                    conn.sourcePoint.y === higherDistance[i][source][y] &&
                    conn.targetPoint.x === higherDistance[i][target][x] &&
                    conn.targetPoint.y === higherDistance[i][target][y]).toBe(true);
                i++;
            }
            done();
        });

        it('Ending at center of the circle - Higher Distance', (done: Function) => {

            for (let conn of diagram.connectors) {
                let temp: string = conn.targetID;
                conn.targetID = conn.sourceID;
                conn.sourceID = temp;
            }

            diagram.dataBind();

            let i: number = 0;
            for (let conn of diagram.connectors) {
                expect(conn.sourcePoint.x === higherDistance[i][target][x] &&
                    conn.sourcePoint.y === higherDistance[i][target][y] &&
                    conn.targetPoint.x === higherDistance[i][source][x] &&
                    conn.targetPoint.y === higherDistance[i][source][y]).toBe(true);
                i++;
            }
            done();
        });
        it('Docking rotated nodes', (done: Function) => {
            diagram.nodes[0].rotateAngle = 45;
            diagram.dataBind();
            expect(diagram.connectors[0].targetPoint.x == 335.36
                && (diagram.connectors[0].targetPoint.y == 335.35 || diagram.connectors[0].targetPoint.y == 335.36)).toBe(true);
            done();
            diagram.nodes[0].rotateAngle = 0;
        });

        it('Starting from center of the circle - Lower Distance', (done: Function) => {
            diagram.remove(diagram.nodes[8]);
            diagram.remove(diagram.nodes[7]);
            diagram.remove(diagram.nodes[6]);
            diagram.remove(diagram.nodes[5]);

            diagram.remove(diagram.connectors[7]);
            diagram.remove(diagram.connectors[6]);
            diagram.remove(diagram.connectors[5]);
            diagram.remove(diagram.connectors[4]);

            let sourcePt: PointModel = { x: 300, y: 300 };
            diagram.nodes[0].offsetX = 300;
            diagram.nodes[0].offsetY = 300;

            let angle: number = 45;
            let distance: number = 150;

            for (let i: number = 0; i < 4; i++) {
                let newPoint: PointModel = Point.transform(sourcePt, angle, distance);
                diagram.nodes[i + 1].offsetX = newPoint.x;
                diagram.nodes[i + 1].offsetY = newPoint.y;
                angle += 90;
            }

            for (let conn of diagram.connectors) {
                let temp: string = conn.targetID;
                conn.targetID = conn.sourceID;
                conn.sourceID = temp;
            }

            diagram.dataBind();
            let i: number = 0;
            for (let conn of diagram.connectors) {
                expect(conn.sourcePoint.x === lowerDistance[i][source][x] &&
                    conn.sourcePoint.y === lowerDistance[i][source][y] &&
                    conn.targetPoint.x === lowerDistance[i][target][x] &&
                    conn.targetPoint.y === lowerDistance[i][target][y]).toBe(true);
                i++;
            }
            done();
        });

        it('Ending at center of the circle - Lower Distance', (done: Function) => {

            for (let conn of diagram.connectors) {
                let temp: string = conn.targetID;
                conn.targetID = conn.sourceID;
                conn.sourceID = temp;
            }

            diagram.dataBind();

            let i: number = 0;
            for (let conn of diagram.connectors) {
                expect(conn.sourcePoint.x === lowerDistance2[i][source][x] &&
                    conn.sourcePoint.y === lowerDistance2[i][source][y] &&
                    conn.targetPoint.x === lowerDistance2[i][target][x] &&
                    conn.targetPoint.y === lowerDistance2[i][target][y]).toBe(true);
                i++;
            }
            done();
        });
    });

    describe('Node to node docking', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram633' });
            document.body.appendChild(ele);

            let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
            let nodes: NodeModel[] = [{
                id: 'node1', offsetX: 300, offsetY: 300, width: 100, height: 100,shape:shape2,
                style: { opacity: 0.5 }
            }];


            let connectors: ConnectorModel[] = [];
            let angle: number = 45;

            let distance: number = 200;

            let sourcePt: PointModel = { x: 300, y: 300 };

            for (let i: number = 0; i < 8; i++) {
                let newPoint: PointModel = Point.transform(sourcePt, angle, distance);
                nodes.push({
                    id: 'target_' + i, width: 100, height: 100, offsetX: newPoint.x, offsetY: newPoint.y,shape:shape2,
                    style: { opacity: 0.5 }
                });
                connectors.push({ sourceID: 'node1', targetID: 'target_' + i, type: 'Orthogonal' });
                angle += 45;
            }


            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: nodes, connectors: connectors
            });
            diagram.appendTo('#diagram633');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Docking rotated nodes', (done: Function) => {
            diagram.nodes[0].rotateAngle = 45;
            diagram.dataBind();
            expect(diagram.connectors[0].targetPoint.x == 441.42
                && diagram.connectors[0].targetPoint.y == 391.66).toBe(true
                );
            done();
            diagram.nodes[0].rotateAngle = 0;
        });

    });


    describe('Node to node docking - overlapped', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram63' });
            document.body.appendChild(ele);
            let connectors: ConnectorModel[] = [];
            //0% overlapped
            let node1: NodeModel = { id: 'node1', offsetX: 200, offsetY: 200, width: 100, height: 100 };
            let node2: NodeModel = { id: 'node2', offsetX: 300, offsetY: 300, width: 100, height: 100 };
            connectors.push({ sourceID: 'node1', targetID: 'node2', type: 'Orthogonal' });
            //25% overlapped
            let node3: NodeModel = { id: 'node3', offsetX: 500, offsetY: 200, width: 100, height: 100 };
            let node4: NodeModel = { id: 'node4', offsetX: 575, offsetY: 275, width: 100, height: 100 };
            connectors.push({ sourceID: 'node3', targetID: 'node4', type: 'Orthogonal' });
            //50% overlapped
            let node5: NodeModel = { id: 'node5', offsetX: 800, offsetY: 200, width: 100, height: 100 };
            let node6: NodeModel = { id: 'node6', offsetX: 850, offsetY: 250, width: 100, height: 100 };
            connectors.push({ sourceID: 'node5', targetID: 'node6', type: 'Orthogonal' });
            //75% overlapped
            let node7: NodeModel = { id: 'node7', offsetX: 200, offsetY: 500, width: 100, height: 100 };

            let node8: NodeModel = { id: 'node8', offsetX: 225, offsetY: 525, width: 100, height: 100 };

            connectors.push({ sourceID: 'node7', targetID: 'node8', type: 'Orthogonal' });

            //100% overlapped

            let node9: NodeModel = { id: 'node9', offsetX: 500, offsetY: 500, width: 100, height: 100 };

            let node10: NodeModel = { id: 'node10', offsetX: 500, offsetY: 525, width: 100, height: 100 };
            connectors.push({ sourceID: 'node9', targetID: 'node10', type: 'Orthogonal' });

            //0% overlapped

            let node11: NodeModel = { id: 'node11', offsetX: 800, offsetY: 500, width: 100, height: 100 };
            let node12: NodeModel = { id: 'node12', offsetX: 700, offsetY: 600, width: 100, height: 100 };

            connectors.push({ sourceID: 'node11', targetID: 'node12', type: 'Orthogonal' });


            //25% overlapped

            let node13: NodeModel = {
                id: 'node13', offsetX: 200, offsetY: 900, width: 100, height: 100
            };


            let node14: NodeModel = {
                id: 'node14', offsetX: 125, offsetY: 975, width: 100, height: 100
            };

            connectors.push({ sourceID: 'node13', targetID: 'node14', type: 'Orthogonal' });

            //50% overlapped

            let node15: NodeModel = {
                id: 'node15', offsetX: 500, offsetY: 900, width: 100, height: 100
            };

            let node16: NodeModel = {
                id: 'node16', offsetX: 450, offsetY: 950, width: 100, height: 100
            };

            connectors.push({ sourceID: 'node15', targetID: 'node16', type: 'Orthogonal' });

            //75% overlapped

            let node17: NodeModel = {
                id: 'node17', offsetX: 800, offsetY: 900, width: 100, height: 100
            };

            let node18: NodeModel = {
                id: 'node18', offsetX: 775, offsetY: 925, width: 100, height: 100
            };

            connectors.push({ sourceID: 'node17', targetID: 'node18', type: 'Orthogonal' });

            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [node1, node2, node3, node4, node5, node6, node7, node8, node9, node10,
                    node11, node12, node13, node14, node15, node16, node17, node18],
                connectors: connectors
            });
            diagram.appendTo('#diagram63');


        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connections with overlapped nodes', (done: Function) => {
            let i: number = 0;
            for (let conn of diagram.connectors) {
                expect(conn.sourcePoint.x === overlapped[i][source][x] &&
                    conn.sourcePoint.y === overlapped[i][source][y] &&
                    conn.targetPoint.x === overlapped[i][target][x] &&
                    conn.targetPoint.y === overlapped[i][target][y]).toBe(true);
                i++;
            }
            done();
        });

    });
});
