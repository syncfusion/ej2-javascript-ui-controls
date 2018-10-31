import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Segments } from '../../../src/diagram/enum/enum';
import { Connector } from '../../../src/diagram/index';

/**
 * Node to point docking
 */
describe('Diagram Control', () => {

    let fromSourceNode: object = [{ source: { x: 300, y: 250 }, target: { x: 150, y: 240 } },
    { source: { x: 250, y: 300 }, target: { x: 150, y: 250 } },
    { source: { x: 300, y: 250 }, target: { x: 150, y: 230 } },
    { source: { x: 250, y: 300 }, target: { x: 150, y: 350 } },
    { source: { x: 300, y: 350 }, target: { x: 150, y: 360 } },
    { source: { x: 300, y: 250 }, target: { x: 450, y: 240 } },
    { source: { x: 350, y: 300 }, target: { x: 450, y: 250 } },
    { source: { x: 300, y: 250 }, target: { x: 450, y: 230 } },
    { source: { x: 350, y: 300 }, target: { x: 450, y: 350 } },
    { source: { x: 300, y: 350 }, target: { x: 450, y: 360 } },
    { source: { x: 300, y: 250 }, target: { x: 240, y: 150 } },
    { source: { x: 300, y: 250 }, target: { x: 250, y: 150 } },
    { source: { x: 300, y: 250 }, target: { x: 270, y: 150 } },
    { source: { x: 300, y: 250 }, target: { x: 350, y: 150 } },
    { source: { x: 300, y: 250 }, target: { x: 370, y: 150 } },
    { source: { x: 300, y: 350 }, target: { x: 240, y: 450 } },
    { source: { x: 300, y: 350 }, target: { x: 250, y: 450 } },
    { source: { x: 300, y: 350 }, target: { x: 270, y: 450 } },
    { source: { x: 300, y: 350 }, target: { x: 350, y: 450 } },
    { source: { x: 300, y: 350 }, target: { x: 370, y: 450 } },
    { source: { x: 250, y: 300 }, target: { x: 270, y: 290 } },
    { source: { x: 300, y: 250 }, target: { x: 330, y: 270 } },
    { source: { x: 350, y: 300 }, target: { x: 330, y: 330 } },
    { source: { x: 300, y: 350 }, target: { x: 270, y: 330 } }];
    let fromTargetNode: object = [
        { source: { x: 150, y: 240 }, target: { x: 300, y: 250 } },
        { source: { x: 150, y: 250 }, target: { x: 250, y: 300 } },
        { source: { x: 150, y: 230 }, target: { x: 300, y: 250 } },
        { source: { x: 150, y: 350 }, target: { x: 250, y: 300 } },
        { source: { x: 150, y: 360 }, target: { x: 300, y: 350 } },
        { source: { x: 450, y: 240 }, target: { x: 300, y: 250 } },
        { source: { x: 450, y: 250 }, target: { x: 350, y: 300 } },
        { source: { x: 450, y: 230 }, target: { x: 300, y: 250 } },
        { source: { x: 450, y: 350 }, target: { x: 350, y: 300 } },
        { source: { x: 450, y: 360 }, target: { x: 300, y: 350 } },
        { source: { x: 240, y: 150 }, target: { x: 300, y: 250 } },
        { source: { x: 250, y: 150 }, target: { x: 300, y: 250 } },
        { source: { x: 270, y: 150 }, target: { x: 300, y: 250 } },
        { source: { x: 350, y: 150 }, target: { x: 300, y: 250 } },
        { source: { x: 370, y: 150 }, target: { x: 300, y: 250 } },
        { source: { x: 240, y: 450 }, target: { x: 300, y: 350 } },
        { source: { x: 250, y: 450 }, target: { x: 300, y: 350 } },
        { source: { x: 270, y: 450 }, target: { x: 300, y: 350 } },
        { source: { x: 350, y: 450 }, target: { x: 300, y: 350 } },
        { source: { x: 370, y: 450 }, target: { x: 300, y: 350 } },
        { source: { x: 270, y: 290 }, target: { x: 250, y: 300 } },
        { source: { x: 330, y: 270 }, target: { x: 300, y: 250 } },
        { source: { x: 330, y: 330 }, target: { x: 350, y: 300 } },
        { source: { x: 270, y: 330 }, target: { x: 300, y: 350 } }];
    let fromSourcePort: object = [
        { source: { x: 0, y: 0 }, target: { x: 250, y: 275 } },
        { source: { x: 0, y: 0 }, target: { x: 250, y: 300 } },
        { source: { x: 0, y: 0 }, target: { x: 250, y: 325 } },
        { source: { x: 0, y: 0 }, target: { x: 275, y: 350 } },
        { source: { x: 0, y: 0 }, target: { x: 300, y: 350 } },
        { source: { x: 0, y: 0 }, target: { x: 350, y: 325 } }];
    let fromTargetPort: object = [
        { source: { x: 400, y: 270 }, target: { x: 250, y: 275 } },
        { source: { x: 200, y: 270 }, target: { x: 250, y: 300 } },
        { source: { x: 270, y: 370 }, target: { x: 250, y: 325 } },
        { source: { x: 230, y: 230 }, target: { x: 275, y: 350 } },
        { source: { x: 270, y: 270 }, target: { x: 300, y: 350 } },
        { source: { x: 100, y: 270 }, target: { x: 350, y: 325 } }];
    let x: string = 'x';
    let y: string = 'y';
    let source: string = 'source';
    let target: string = 'target';
    describe('Docking source node to target point', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram62' });
            document.body.appendChild(ele);

            let node: NodeModel = { id: 'node1', offsetX: 300, offsetY: 300, width: 100, height: 100 };

            //left side connections

            //above the top of source
            let connector1: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 150, y: 240 } };

            //target point's y is equal to the top of source
            let connector2: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 150, y: 250 } };

            //below the top of source
            let connector3: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 150, y: 230 } };

            //target point's y is equal to the bottom of the source
            let connector4: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 150, y: 350 } };

            let connector5: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 150, y: 360 } };

            //right side connections

            //above the top of source
            let connector6: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 450, y: 240 } };

            //target point's y is equal to the top of source
            let connector7: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 450, y: 250 } };

            //below the top of source
            let connector8: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 450, y: 230 } };

            //target point's y is equal to the bottom of the source
            let connector9: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 450, y: 350 } };

            let connector10: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 450, y: 360 } };

            //connections at top
            //left from source
            let connector11: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 240, y: 150 } };

            //at left of sourcec
            let connector12: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 250, y: 150 } };

            //between left and right
            let connector13: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 270, y: 150 } };

            //at the right of source
            let connector14: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 350, y: 150 } };

            //after the right 
            let connector15: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 370, y: 150 } };

            //connections at bottom
            //left from source
            let connector16: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 240, y: 450 } };

            //at left of sourcec
            let connector17: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 250, y: 450 } };

            //between left and right
            let connector18: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 270, y: 450 } };

            //at the right of source
            let connector19: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 350, y: 450 } };

            //after the right 
            let connector20: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 370, y: 450 } };

            //connections inside node
            let connector21: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 270, y: 290 } };

            let connector22: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 330, y: 270 } };

            let connector23: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 330, y: 330 } };

            let connector24: ConnectorModel = { sourceID: 'node1', type: 'Orthogonal', targetPoint: { x: 270, y: 330 } };

            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [node], connectors: [connector1, connector2, connector3, connector4, connector5,
                    connector6, connector7, connector8, connector9, connector10,
                    connector11, connector12, connector13, connector14, connector15,
                    connector16, connector17, connector18, connector19, connector20, connector21, connector22,
                    connector23, connector24]
            });
            diagram.appendTo('#diagram62');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking source node to point', (done: Function) => {

            let i: number = 0;
            for (let conn of diagram.connectors) {
                expect(conn.sourcePoint.x === fromSourceNode[i][source][x] &&
                    conn.sourcePoint.y === fromSourceNode[i][source][y] &&
                    conn.targetPoint.x === fromSourceNode[i][target][x] &&
                    conn.targetPoint.y === fromSourceNode[i][target][y]).toBe(true);
                i++;
            }
            done();
        });
    });

    describe('Target node to point docking', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram63' });
            document.body.appendChild(ele);

            let node: NodeModel = { id: 'node1', offsetX: 300, offsetY: 300, width: 100, height: 100 };

            //left side connections

            //above the top of source
            let connector1: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 150, y: 240 } };

            //target point's y is equal to the top of source
            let connector2: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 150, y: 250 } };

            //below the top of source
            let connector3: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 150, y: 230 } };

            //target point's y is equal to the bottom of the source
            let connector4: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 150, y: 350 } };

            let connector5: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 150, y: 360 } };

            //right side connections

            //above the top of source
            let connector6: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 450, y: 240 } };

            //target point's y is equal to the top of source
            let connector7: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 450, y: 250 } };

            //below the top of source
            let connector8: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 450, y: 230 } };

            //target point's y is equal to the bottom of the source
            let connector9: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 450, y: 350 } };

            let connector10: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 450, y: 360 } };

            //connections at top
            //left from source
            let connector11: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 240, y: 150 } };

            //at left of sourcec
            let connector12: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 250, y: 150 } };

            //between left and right
            let connector13: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 270, y: 150 } };

            //at the right of source
            let connector14: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 350, y: 150 } };

            //after the right 
            let connector15: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 370, y: 150 } };

            //connections at bottom
            //left from source
            let connector16: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 240, y: 450 } };

            //at left of sourcec
            let connector17: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 250, y: 450 } };

            //between left and right
            let connector18: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 270, y: 450 } };

            //at the right of source
            let connector19: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 350, y: 450 } };

            //after the right 
            let connector20: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 370, y: 450 } };

            //connections inside node
            let connector21: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 270, y: 290 } };

            let connector22: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 330, y: 270 } };

            let connector23: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 330, y: 330 } };

            let connector24: ConnectorModel = { targetID: 'node1', type: 'Orthogonal', sourcePoint: { x: 270, y: 330 } };

            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [node], connectors: [connector1, connector2, connector3, connector4, connector5,
                    connector6, connector7, connector8, connector9, connector10,
                    connector11, connector12, connector13, connector14, connector15,
                    connector16, connector17, connector18, connector19, connector20, connector21, connector22,
                    connector23, connector24]
            });
            diagram.appendTo('#diagram63');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking target node to point docking', (done: Function) => {
            let i: number = 0;
            for (let conn of diagram.connectors) {
                expect(conn.sourcePoint.x === fromTargetNode[i][source][x] &&
                    conn.sourcePoint.y === fromTargetNode[i][source][y] &&
                    conn.targetPoint.x === fromTargetNode[i][target][x] &&
                    conn.targetPoint.y === fromTargetNode[i][target][y]).toBe(true);
                i++;
            }
            done();

        });
    });

    describe('Source port to point docking', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram63' });
            document.body.appendChild(ele);

            let node: NodeModel = {
                id: 'node1', offsetX: 300, offsetY: 300, width: 100, height: 100,
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
            };

            //left side connections

            //above the top of source
            let connector1: ConnectorModel = {
                sourceID: 'node1', sourcePortID: 'left1',
                targetPoint: { x: 400, y: 270 }, type: 'Orthogonal'
            };

            let connector2: ConnectorModel = {
                sourceID: 'node1', sourcePortID: 'left2',
                targetPoint: { x: 200, y: 270 }, type: 'Orthogonal'
            };

            let connector3: ConnectorModel = {
                sourceID: 'node1', sourcePortID: 'left3',
                targetPoint: { x: 270, y: 370 }, type: 'Orthogonal'
            };

            let connector4: ConnectorModel = {
                sourceID: 'node1', sourcePortID: 'bottom1',
                targetPoint: { x: 230, y: 230 }, type: 'Orthogonal'
            };

            let connector5: ConnectorModel = {
                sourceID: 'node1', sourcePortID: 'bottom2',
                targetPoint: { x: 270, y: 270 }, type: 'Orthogonal'
            };

            let connector6: ConnectorModel = {
                sourceID: 'node1', sourcePortID: 'right3',
                targetPoint: { x: 100, y: 270 }, type: 'Orthogonal'
            };

            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [node], connectors: [connector1, connector2, connector3, connector4, connector5,
                    connector6]
            });
            diagram.appendTo('#diagram63');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking source port to point connections', (done: Function) => {

            let i: number = 0;
            for (let conn of diagram.connectors) {
                //workaround
                // expect(conn.sourcePoint.x === fromSourcePort[i][source][x] &&
                //     conn.sourcePoint.y === fromSourcePort[i][source][y] &&
                //     conn.targetPoint.x === fromSourcePort[i][target][x] &&
                //     conn.targetPoint.y === fromSourcePort[i][target][y]).toBe(true);
                // i++;
            }
            done();
        });
    });

    describe('Target port to point docking', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram63' });
            document.body.appendChild(ele);

            let node: NodeModel = {
                id: 'node1', offsetX: 300, offsetY: 300, width: 100, height: 100,
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
            };

            //left side connections

            //above the top of source
            let connector1: ConnectorModel = {
                targetID: 'node1', targetPortID: 'left1',
                sourcePoint: { x: 400, y: 270 }, type: 'Orthogonal'
            };

            let connector2: ConnectorModel = {
                targetID: 'node1', targetPortID: 'left2',
                sourcePoint: { x: 200, y: 270 }, type: 'Orthogonal'
            };

            let connector3: ConnectorModel = {
                targetID: 'node1', targetPortID: 'left3',
                sourcePoint: { x: 270, y: 370 }, type: 'Orthogonal'
            };

            let connector4: ConnectorModel = {
                targetID: 'node1', targetPortID: 'bottom1',
                sourcePoint: { x: 230, y: 230 }, type: 'Orthogonal'
            };

            let connector5: ConnectorModel = {
                targetID: 'node1', targetPortID: 'bottom2',
                sourcePoint: { x: 270, y: 270 }, type: 'Orthogonal'
            };

            let connector6: ConnectorModel = {
                targetID: 'node1', targetPortID: 'right3',
                sourcePoint: { x: 100, y: 270 }, type: 'Orthogonal'
            };

            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [node], connectors: [connector1, connector2, connector3, connector4, connector5,
                    connector6]
            });
            diagram.appendTo('#diagram63');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking target port to point connections', (done: Function) => {

            let i: number = 0;
            for (let conn of diagram.connectors) {
                expect(conn.sourcePoint.x === fromTargetPort[i][source][x] &&
                    conn.sourcePoint.y === fromTargetPort[i][source][y] &&
                    conn.targetPoint.x === fromTargetPort[i][target][x] &&
                    conn.targetPoint.y === fromTargetPort[i][target][y]).toBe(true);
                i++;
            }
            done();
        });
    });

    describe('Point to point docking', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'PointToPointDefaultIssue' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: 700, height: 700,
                connectors: [
                    {
                        id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 120, y: 120 }, type: 'Orthogonal'
                    },
                    {
                        id: 'connector2', type: 'Orthogonal', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 310, y: 115 },
                    },
                    {
                        id: 'connector3', type: 'Orthogonal', sourcePoint: { x: 500, y: 100 }, targetPoint: { x: 529, y: 120 },
                    },
                    {
                        id: 'connector4', type: 'Orthogonal', sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 105, y: 305 },
                    },
                ]
            });
            diagram.appendTo('#PointToPointDefaultIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking point to point connection and difference of x and y value is less than 30', (done: Function) => {
            expect((diagram.connectors[0] as Connector).intermediatePoints.length == 3 && (diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 120 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 120 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 120).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints.length == 3 && (diagram.connectors[1] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 310 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 310 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 115).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints.length == 3 && (diagram.connectors[2] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 529 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 529 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 120).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints.length == 4 && (diagram.connectors[3] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 125 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 125 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 305 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 105 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 305).toBe(true);
            done();
        });
    });

});