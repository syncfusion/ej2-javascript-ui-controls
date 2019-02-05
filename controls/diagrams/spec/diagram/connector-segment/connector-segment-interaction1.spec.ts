import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { Segments, ConnectorConstraints } from '../../../src/diagram/enum/enum';
import { Connector } from '../../../src/diagram/objects/connector';
import { StraightSegmentModel } from '../../../src/diagram/objects/connector-model';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { SnapConstraints } from '../../../src/diagram/index';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { ConnectorEditing } from '../../../src/diagram/interaction/connector-editing';
Diagram.Inject(UndoRedo);
Diagram.Inject(ConnectorEditing);
/**
 * Editing test cases
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

describe('Diagram Control', () => {
    describe('Multiple Segments Copy and paste', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let diagramCanvas: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'SegmentsCopyAndPaste' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                segments: [{
                    type: 'Straight',
                    point: { x: 100, y: 200 },
                },
                {
                    type: 'Straight',
                    point: { x: 200, y: 200 },
                },],
                targetPoint: { x: 300, y: 300 },
            };

            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 400, y: 200 },
                segments: [{
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 10
                },
                {
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 10
                },
                {
                    type: 'Orthogonal',
                    direction: 'Right', length: 10
                },],
                targetPoint: { x: 600, y: 300 },
            };
            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Bezier',
                sourcePoint: { x: 700, y: 200 },
                segments: [{
                    type: 'Bezier',
                    point: { x: 800, y: 300 },
                }
                ],
                targetPoint: { x: 900, y: 400 },
            };

            diagram = new Diagram({
                width: 1000, height: 1000, connectors: [connector1, connector2, connector3],
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
            });

            diagram.appendTo('#SegmentsCopyAndPaste');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking copy, paste for straight segment', (done: Function) => {
            diagram.select([diagram.connectors[0]]);
            expect(diagram.connectors.length == 3).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'C', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);
            expect(diagram.connectors.length == 4).toBe(true);
            done();
        });
        it('Checking undo, redo for bezier segment', (done: Function) => {
            expect(diagram.connectors.length == 4).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Z', true);
            expect(diagram.connectors.length == 3).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Y', true);
            expect(diagram.connectors.length == 4).toBe(true);
            done();
        });
        it('Checking copy, paste for orthogonal segment', (done: Function) => {
            diagram.select([diagram.connectors[1]]);
            expect(diagram.connectors.length == 4).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'C', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);
            expect(diagram.connectors.length == 5).toBe(true);
            done();
        });
        it('Checking undo, redo for orthogonal segment', (done: Function) => {
            expect(diagram.connectors.length == 5).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Z', true);
            expect(diagram.connectors.length == 4).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Y', true);
            expect(diagram.connectors.length == 5).toBe(true);
            done();
        });
        it('Checking copy, paste for bezier segment', (done: Function) => {
            diagram.select([diagram.connectors[2]]);
            expect(diagram.connectors.length == 5).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'C', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);
            expect(diagram.connectors.length == 6).toBe(true);
            done();
        });
        it('Checking undo, redo for bezier segment', (done: Function) => {
            expect(diagram.connectors.length == 6).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Z', true);
            expect(diagram.connectors.length == 5).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Y', true);
            expect(diagram.connectors.length == 6).toBe(true);
            done();
        });
    });

    describe('Multiple Segments Undo, Redo and connect, disconnect source node ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let diagramCanvas: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'SegmentsUndoRedo' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Mouse Hover' }]
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                annotations: [{ content: 'Connect' }]
            }]
            let connector4: ConnectorModel = {
                id: 'connector4',
                type: 'Orthogonal',
                sourceID: 'node1', targetID: 'node2',
                segments: [{
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 10
                },
                {
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 10
                },
                {
                    type: 'Orthogonal',
                    direction: 'Right', length: 10
                },],

            }
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                segments: [{
                    type: 'Straight',
                    point: { x: 100, y: 200 },
                },
                {
                    type: 'Straight',
                    point: { x: 200, y: 200 },
                },],
                targetPoint: { x: 300, y: 300 },
            };

            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 400, y: 200 },
                segments: [{
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 10
                },
                {
                    type: 'Orthogonal',
                    direction: 'Right', length: 10
                },],
                targetPoint: { x: 600, y: 300 },
            };
            let connector5: ConnectorModel = {
                id: 'connector5',
                type: 'Orthogonal',
                sourcePoint: { x: 500, y: 100 },
                segments: [{
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 50
                },
                {
                    type: 'Orthogonal',
                    direction: 'Bottom', length: 50
                }],
                targetPoint: { x: 600, y: 300 },
            };
            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Bezier',
                sourcePoint: { x: 700, y: 200 },
                segments: [{
                    type: 'Bezier',
                    point: { x: 800, y: 300 },
                }
                ],
                targetPoint: { x: 900, y: 400 },
            };

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes, connectors: [connector1, connector2, connector3, connector4, connector5],
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
            });

            diagram.appendTo('#SegmentsUndoRedo');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking straight segment - (Add control point and check undo redo)', (done: Function) => {
            diagram.select([diagram.connectors[0]]);
            let conn: ConnectorModel = diagram.selectedItems.connectors[0];
            expect(diagram.selectedItems.connectors[0].segments.length == 3).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, conn.sourcePoint.x + diagram.element.offsetLeft, conn.sourcePoint.y + 20 + diagram.element.offsetTop, true, true);
            expect(diagram.selectedItems.connectors[0].segments.length == 4).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Z', true);
            expect(diagram.selectedItems.connectors[0].segments.length == 3).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Y', true);
            expect(diagram.selectedItems.connectors[0].segments.length == 4).toBe(true);
            done();
        });
        it('Checking undo, redo for Orthogonal segment', (done: Function) => {
            diagram.select([diagram.connectors[1]]);
            expect(diagram.connectors[1].segments.length == 3).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 500 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, 500 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            expect(diagram.connectors[1].segments.length == 5).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Z', true);
            expect(diagram.connectors[1].segments.length == 3).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Y', true);
            expect(diagram.connectors[1].segments.length == 5).toBe(true);
            done();
        });

        it('Checking drag and change source point to node', (done: Function) => {
            diagram.select([diagram.connectors[4]]);
            let conn: ConnectorModel = diagram.selectedItems.connectors[0];
            let srcNode: NodeModel = diagram.nodes[1];
            expect(diagram.selectedItems.connectors[0].sourceID == '').toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, conn.sourcePoint.x + diagram.element.offsetLeft, conn.sourcePoint.y + diagram.element.offsetTop, srcNode.offsetX + diagram.element.offsetLeft, srcNode.offsetY + diagram.element.offsetTop);
            expect(diagram.selectedItems.connectors[0].sourceID == srcNode.id).toBe(true);
            done();
        });
    });

    describe('Multiple Segments connect to source node ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let diagramCanvas: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'SegmentsConnect' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 50, height: 50, offsetX: 250, offsetY: 250,
                annotations: [{ content: 'Mouse Hover' }]
            },
            {
                id: 'node2', width: 50, height: 50, offsetX: 550, offsetY: 250,
                annotations: [{ content: 'Connect' }]
            },
            {
                id: 'node3', width: 150, height: 150, offsetX: 300, offsetY: 450
            },
            {
                id: 'node4', width: 150, height: 150, offsetX: 600, offsetY: 450
            },
            {
                id: 'node5', width: 150, height: 150, offsetX: 900, offsetY: 450
            }];

            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1',
                    type: 'Orthogonal',
                    sourcePoint: { x: 300, y: 250 },
                    segments: [{
                        type: 'Orthogonal',
                        direction: 'Left', length: 150
                    },],
                    targetPoint: { x: 100, y: 100 },
                }, {
                    id: 'connector2',
                    type: 'Orthogonal',
                    sourcePoint: { x: 430, y: 250 },
                    segments: [{
                        type: 'Orthogonal',
                        direction: 'Right', length: 150
                    },
                    ],
                    targetPoint: { x: 700, y: 100 },
                },
                {
                    id: 'connector3',
                    type: 'Orthogonal',
                    sourcePoint: { x: 400, y: 450 },
                    segments: [{
                        type: 'Orthogonal',
                        direction: 'Left', length: 40
                    },
                    {
                        type: 'Orthogonal',
                        direction: 'Top', length: 110
                    },
                    ],
                    targetPoint: { x: 100, y: 300 }
                },
                {
                    id: 'connector4',
                    type: 'Orthogonal',
                    sourcePoint: { x: 600, y: 300 },
                    segments: [{
                        type: 'Orthogonal',
                        direction: 'Bottom', length: 100
                    },
                    {
                        type: 'Orthogonal',
                        direction: 'Left', length: 110
                    },
                    ],
                    targetPoint: { x: 100, y: 900 }
                },
                {
                    id: 'connector5',
                    type: 'Orthogonal',
                    sourcePoint: { x: 900, y: 300 },
                    segments: [{
                        type: 'Orthogonal',
                        direction: 'Bottom', length: 250
                    },
                    {
                        type: 'Orthogonal',
                        direction: 'Left', length: 110
                    },
                    ],
                    targetPoint: { x: 600, y: 800 }
                }]
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes, connectors: connectors,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
            });

            diagram.appendTo('#SegmentsConnect');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking drag source point - first segment(Left) and length greater than node width', (done: Function) => {
            diagram.select([diagram.connectors[0]]);
            mouseEvents.clickEvent(diagramCanvas, diagram.connectors[0].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[0].sourcePoint.y - diagram.element.offsetTop);
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[0].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[0].sourcePoint.y - diagram.element.offsetTop, diagram.nodes[0].offsetX + diagram.element.offsetLeft, diagram.nodes[0].offsetY + diagram.element.offsetTop);
            expect(diagram.selectedItems.connectors[0].segments.length == 2).toBe(true);
            done();
        });
        it('Checking drag source point - first segment(Right) and length greater than node width', (done: Function) => {
            diagram.select([diagram.connectors[1]]);
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[1].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[1].sourcePoint.y - diagram.element.offsetTop, diagram.nodes[1].offsetX + diagram.element.offsetLeft, diagram.nodes[1].offsetY + diagram.element.offsetTop);
            expect(diagram.selectedItems.connectors[0].segments.length == 2).toBe(true);
            done();
        });

        it('Checking drag source point - first segment(Left) and length less than node width', (done: Function) => {
            diagram.select([diagram.connectors[2]]);
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[2].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[2].sourcePoint.y - diagram.element.offsetTop, diagram.nodes[2].offsetX + diagram.element.offsetLeft, diagram.nodes[2].offsetY + diagram.element.offsetTop);
            expect(diagram.selectedItems.connectors[0].segments.length == 4).toBe(true);
            done();
        });
        it('Checking drag source point - first segment(Bottom) and length less than node height', (done: Function) => {
            diagram.select([diagram.connectors[3]]);
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[3].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[3].sourcePoint.y - diagram.element.offsetTop, diagram.nodes[3].offsetX + diagram.element.offsetLeft, diagram.nodes[3].offsetY + diagram.element.offsetTop);
            expect(diagram.selectedItems.connectors[0].segments.length == 4).toBe(true);
            done();
        });
        it('Checking drag source point - first segment(Bottom) and length greater than node height', (done: Function) => {
            diagram.select([diagram.connectors[4]]);
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[4].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[4].sourcePoint.y - diagram.element.offsetTop, diagram.nodes[4].offsetX + diagram.element.offsetLeft, diagram.nodes[4].offsetY + diagram.element.offsetTop);
            expect(diagram.selectedItems.connectors[0].segments.length == 3).toBe(true);
            done();
        });
    });


    describe('Multiple Segments update segments when drag the source node (connect to node)', () => {
        let diagram: Diagram; let node: NodeModel;
        let ele: HTMLElement;
        let diagramCanvas: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'SegmentsChangeSourceNodeDrag1' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: 1200, height: 500,
                nodes: [

                    {
                        id: 'node9', width: 50, height: 50, offsetX: 100, offsetY: 200,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node10', width: 50, height: 50, offsetX: 500, offsetY: 200,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node11', width: 50, height: 50, offsetX: 800, offsetY: 200,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node12', width: 50, height: 50, offsetX: 1100, offsetY: 200,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    }
                ],
                connectors: [

                    {
                        id: 'connector9',
                        type: 'Orthogonal',
                        sourceID: 'node9',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Left', length: 10
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Right', length: 50
                        }],
                        targetPoint: { x: 300, y: 300 }
                    }, {
                        id: 'connector10',
                        type: 'Orthogonal',
                        sourceID: 'node10',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Right', length: 10
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Top', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Left', length: 50
                        }],
                        targetPoint: { x: 300, y: 100 }
                    },
                    {
                        id: 'connector11',
                        type: 'Orthogonal',
                        sourceID: 'node11',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Top', length: 10
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Right', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 50
                        },
                        ],
                        targetPoint: { x: 950, y: 150 }
                    },
                    {
                        id: 'connector12',
                        type: 'Orthogonal',
                        sourceID: 'node12',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 10
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Left', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Top', length: 50
                        },
                        ],
                        targetPoint: { x: 1000, y: 100 }
                    },
                    {
                        id: 'connector1',
                        type: 'Orthogonal',
                        sourcePoint: { x: 200, y: 500 },
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Top', length: 100
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Right', length: 50
                        },
                        ],
                        targetPoint: { x: 400, y: 500 }
                    }
                ],
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
            });

            diagram.appendTo('#SegmentsChangeSourceNodeDrag1');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking drag source node - (second segmnet direction - bottom and node direction-left)', (done: Function) => {

            node = diagram.nodes[0];
            diagram.select([node]);
            for (var i = 0; i < 12; i++) {
                mouseEvents.keyDownEvent(diagramCanvas, 'Left');
            }
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 88 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 225 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 88 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 115 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 115 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
            done();
        });

        it('Checking drag source node - (second segmnet direction - top and node direction-right)', (done: Function) => {
            node = diagram.nodes[1];
            diagram.select([node]);
            for (var i = 0; i < 12; i++) {
                mouseEvents.keyDownEvent(diagramCanvas, 'Right');
            }
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 512 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 175 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 512 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 150 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 485 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 485 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[4].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 100).toBe(true);
            done();
        });
        it('Checking drag source node - (second segmnet direction - right and node direction-top)', (done: Function) => {
            node = diagram.nodes[2];
            diagram.select([node]);
            for (var i = 0; i < 12; i++) {
                mouseEvents.keyDownEvent(diagramCanvas, 'Up');
            }
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 825 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 188 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 850 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 188 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 850 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 215 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 950 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 215 && (diagram.connectors[2] as Connector).intermediatePoints[4].x == 950 && (diagram.connectors[2] as Connector).intermediatePoints[4].y == 150).toBe(true);
            done();
        });
        it('Checking drag source node - (second segmnet direction - left and node direction-bottom)', (done: Function) => {
            node = diagram.nodes[3];
            diagram.select([node]);
            for (var i = 0; i < 12; i++) {
                mouseEvents.keyDownEvent(diagramCanvas, 'Down');
            }
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 1075 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 212 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 1050 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 212 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 1050 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 185 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 1000 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 185 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == 1000 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 100).toBe(true);
            done();
        });

        it('Checking merging the segments', (done: Function) => {
            let connector = diagram.connectors[4];
            mouseEvents.clickEvent(diagramCanvas, connector.sourcePoint.x + diagram.element.offsetLeft, connector.sourcePoint.y + diagram.element.offsetTop);
            mouseEvents.dragAndDropEvent(diagramCanvas, 323 + diagram.element.offsetLeft, connector.targetPoint.y + diagram.element.offsetTop, 323 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
            mouseEvents.dragAndDropEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 210 + diagram.element.offsetTop, 300 + diagram.element.offsetLeft, 395 + diagram.element.offsetTop);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 500 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 400 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 350 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 400 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 350 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 500 && (diagram.connectors[4] as Connector).intermediatePoints[4].x == 400 && (diagram.connectors[4] as Connector).intermediatePoints[4].y == 500).toBe(true);
            done();
        });

    });


    describe('Multiple Segments update segments when drag the source node (connect to port)', () => {
        let diagram: Diagram; let node: NodeModel;
        let ele: HTMLElement;
        let diagramCanvas: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'SegmentsChangeSourceNodeDrag' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: 1500, height: 2000,
                nodes: [
                    {
                        id: 'node1', width: 50, height: 50, offsetX: 100, offsetY: 100,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node2', width: 50, height: 50, offsetX: 500, offsetY: 100,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node3', width: 50, height: 50, offsetX: 800, offsetY: 100,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node4', width: 50, height: 50, offsetX: 1100, offsetY: 100,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node5', width: 50, height: 50, offsetX: 100, offsetY: 300,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node6', width: 50, height: 50, offsetX: 500, offsetY: 300,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node7', width: 50, height: 50, offsetX: 800, offsetY: 300,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node8', width: 50, height: 50, offsetX: 1100, offsetY: 300,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node9', width: 50, height: 50, offsetX: 100, offsetY: 600,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node10', width: 50, height: 50, offsetX: 500, offsetY: 600,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node11', width: 50, height: 50, offsetX: 800, offsetY: 600,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    },
                    {
                        id: 'node12', width: 50, height: 50, offsetX: 1100, offsetY: 600,
                        ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                        { id: 'port2', offset: { x: 0.5, y: 0 } },
                        { id: 'port3', offset: { x: 1, y: 0.5 } },
                        { id: 'port4', offset: { x: 0.5, y: 1 } }]
                    }
                ],
                connectors: [
                    {
                        id: 'connector1',
                        type: 'Orthogonal',
                        sourceID: 'node1', sourcePortID: 'port3',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Right', length: 10
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Left', length: 50
                        }],
                        targetPoint: { x: 10, y: 200 }
                    }, {
                        id: 'connector2',
                        type: 'Orthogonal',
                        sourceID: 'node2', sourcePortID: 'port1',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Left', length: 10
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Right', length: 50
                        }],
                        targetPoint: { x: 600, y: 200 }
                    },
                    {
                        id: 'connector3',
                        type: 'Orthogonal',
                        sourceID: 'node3', sourcePortID: 'port2',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Top', length: 40
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Right', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 50
                        },
                        ],
                        targetPoint: { x: 900, y: 200 }
                    },
                    {
                        id: 'connector4',
                        type: 'Orthogonal',
                        sourceID: 'node4', sourcePortID: 'port4',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 20
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Right', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Top', length: 50
                        },
                        ],
                        targetPoint: { x: 1200, y: 20 }
                    },
                    {
                        id: 'connector5',
                        type: 'Orthogonal',
                        sourceID: 'node5', sourcePortID: 'port2',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Top', length: 10
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Right', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Top', length: 50
                        }],
                        targetPoint: { x: 250, y: 200 }
                    }, {
                        id: 'connector6',
                        type: 'Orthogonal',
                        sourceID: 'node6', sourcePortID: 'port4',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 10
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Left', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 50
                        }],
                        targetPoint: { x: 300, y: 450 }
                    },
                    {
                        id: 'connector7',
                        type: 'Orthogonal',
                        sourceID: 'node7', sourcePortID: 'port3',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Right', length: 40
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Right', length: 50
                        },
                        ],
                        targetPoint: { x: 950, y: 400 }
                    },
                    {
                        id: 'connector8',
                        type: 'Orthogonal',
                        sourceID: 'node8', sourcePortID: 'port1',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Left', length: 20
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Top', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Left', length: 50
                        },
                        ],
                        targetPoint: { x: 950, y: 220 }
                    },
                    {
                        id: 'connector9',
                        type: 'Orthogonal',
                        sourceID: 'node9',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Left', length: 10
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Right', length: 50
                        }],
                        targetPoint: { x: 300, y: 700 }
                    }, {
                        id: 'connector10',
                        type: 'Orthogonal',
                        sourceID: 'node10',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Right', length: 10
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Top', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Left', length: 50
                        }],
                        targetPoint: { x: 300, y: 500 }
                    },
                    {
                        id: 'connector11',
                        type: 'Orthogonal',
                        sourceID: 'node11',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Top', length: 40
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Right', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 50
                        },
                        ],
                        targetPoint: { x: 950, y: 450 }
                    },
                    {
                        id: 'connector12',
                        type: 'Orthogonal',
                        sourceID: 'node12',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 20
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Left', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Top', length: 50
                        },
                        ],
                        targetPoint: { x: 1000, y: 400 }
                    },
                ],
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
            });

            diagram.appendTo('#SegmentsChangeSourceNodeDrag');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking drag source node - third segment is opposite to first segment(port direction - right)', (done: Function) => {

            node = diagram.nodes[0];
            mouseEvents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft + 5, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft + 10, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft + 20, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft + 20, node.offsetY - diagram.element.offsetTop);
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 150 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 85 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 85 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 200 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 10 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 200).toBe(true);
            done();
        });

        it('Checking drag source node - third segment direction opposite to first segment(port direction - left)', (done: Function) => {
            node = diagram.nodes[1];
            mouseEvents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft - 5, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft - 10, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft - 20, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft - 20, node.offsetY - diagram.element.offsetTop);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 460 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 150 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 515 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 150 && (diagram.connectors[1] as Connector).intermediatePoints[4].x == 515 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 200 && (diagram.connectors[1] as Connector).intermediatePoints[5].x == 600 && (diagram.connectors[1] as Connector).intermediatePoints[5].y == 200).toBe(true);
            done();
        });
        it('Checking drag source node - third segment direction opposite to first segment(port direction - top)', (done: Function) => {
            node = diagram.nodes[2];
            mouseEvents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop - 5);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop - 10);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop - 20);
            mouseEvents.mouseUpEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop - 20);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 800 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 60 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 800 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 35 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 850 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 35 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 850 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 85 && (diagram.connectors[2] as Connector).intermediatePoints[4].x == 900 && (diagram.connectors[2] as Connector).intermediatePoints[4].y == 85 && (diagram.connectors[2] as Connector).intermediatePoints[5].x == 900 && (diagram.connectors[2] as Connector).intermediatePoints[5].y == 200).toBe(true);
            done();
        });
        it('Checking drag source node - third segment direction opposite to first segment(port direction - bottom)', (done: Function) => {
            node = diagram.nodes[3];
            mouseEvents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop + 5);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop + 10);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop + 20);
            mouseEvents.mouseUpEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop + 20);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 1100 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 150 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 1100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 170 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 1150 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 170 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 1150 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 95 && (diagram.connectors[3] as Connector).intermediatePoints[4].x == 1200 && (diagram.connectors[3] as Connector).intermediatePoints[4].y == 95 && (diagram.connectors[3] as Connector).intermediatePoints[5].x == 1200 && (diagram.connectors[3] as Connector).intermediatePoints[5].y == 20).toBe(true);
            done();
        });
        it('Checking drag source node - third segment direction same to first segment direction(port direction - top)', (done: Function) => {
            node = diagram.nodes[4];
            mouseEvents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop - 5);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop - 10);
            mouseEvents.mouseUpEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop - 10);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 270 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 215 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 250 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 215 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 250 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 200).toBe(true);
            done();
        });
        it('Checking drag source node - third segment direction same to first segment direction(port direction - bottom)', (done: Function) => {
            node = diagram.nodes[5];
            mouseEvents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop + 5);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop + 10);
            mouseEvents.mouseUpEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop + 10);
            expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 500 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 330 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 500 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 385 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 385 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 300 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 450).toBe(true);
            done();
        });
        it('Checking drag source node - third segment direction same to first segment direction(port direction - right)', (done: Function) => {
            node = diagram.nodes[6];
            mouseEvents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft + 20, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft + 10, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft + 10, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft + 10, node.offsetY - diagram.element.offsetTop);
            expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 860 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 915 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 915 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 400 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 950 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 400).toBe(true);
            done();

        });
        it('Checking drag source node - third segment direction same to first segment direction(port direction - left)', (done: Function) => {
            node = diagram.nodes[7];
            mouseEvents.clickEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft - 10, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft - 10, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft - 10, node.offsetY - diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, node.offsetX + diagram.element.offsetLeft - 10, node.offsetY - diagram.element.offsetTop);
            expect((diagram.connectors[7] as Connector).intermediatePoints[0].x == 1070 && (diagram.connectors[7] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[1].x == 1055 && (diagram.connectors[7] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[7] as Connector).intermediatePoints[2].x == 1055 && (diagram.connectors[7] as Connector).intermediatePoints[2].y == 250 && (diagram.connectors[7] as Connector).intermediatePoints[3].x == 1005 && (diagram.connectors[7] as Connector).intermediatePoints[3].y == 250 && (diagram.connectors[7] as Connector).intermediatePoints[4].x == 1005 && (diagram.connectors[7] as Connector).intermediatePoints[4].y == 220 && (diagram.connectors[7] as Connector).intermediatePoints[5].x == 950 && (diagram.connectors[7] as Connector).intermediatePoints[5].y == 220).toBe(true);
            done();
        });
    });

    describe('Conectors with segments - Orthogonal Segment Interaction(Port To Node)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'PortToNodeIssue' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000, nodes:
                    [
                        {
                            id: 'Design', height: 50, offsetX: 200, offsetY: 135,
                            shape: { type: 'Flow', shape: 'Process' },
                            ports: [
                                {
                                    id: 'port2', shape: 'Circle', offset: { x: 0, y: 0.5 }, height: 8, width: 8,
                                }],

                            annotations: [{ content: 'Design' }]
                        }, {
                            id: 'DesignError', height: 60, offsetX: 200, offsetY: 235,
                            shape: { type: 'Flow', shape: 'Decision' },
                            ports: [{ id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 }, height: 8, width: 8 }],
                            annotations: [{ content: 'Design Error?' }]
                        }
                    ],
                connectors:
                    [
                        {
                            id: 'connector1', sourceID: 'DesignError', sourcePortID: 'port1', targetID: 'Design', type: 'Orthogonal',
                            segments: [{ type: 'Orthogonal', length: 50, direction: 'Left' }, { type: 'Orthogonal', length: 70, direction: 'Top' }],
                            annotations: [{ content: 'Yes' }]
                        }
                    ],
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#PortToNodeIssue');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Orthogonal segment - Port To Node (Two segments - Left, top)', (done: Function) => {
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 147.55 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 235 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 97.55 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 235 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 97.55 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 135 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 170 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 135).toBe(true);
            done();
        });
    });

    describe('Conectors with segments - Orthogonal Segment Interaction(Port To Node)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'MultipleSelectionDraggingNodeAndConnectorConnectToNode' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [{
                    id: 'node9', width: 50, height: 50, offsetX: 100, offsetY: 200,
                    ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                    { id: 'port2', offset: { x: 0.5, y: 0 } },
                    { id: 'port3', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', offset: { x: 0.5, y: 1 } }]
                }], connectors: [
                    {
                        id: 'connector9',
                        type: 'Orthogonal',
                        sourceID: 'node9',
                        segments: [{
                            type: 'Orthogonal',
                            direction: 'Left', length: 10
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Bottom', length: 50
                        },
                        {
                            type: 'Orthogonal',
                            direction: 'Right', length: 50
                        }],
                        targetPoint: { x: 300, y: 300 }
                    },
                ],
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#MultipleSelectionDraggingNodeAndConnectorConnectToNode');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Multiple selection dragging - node and connector connect to node', (done: Function) => {
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).data == 'M75 200 L65 200 L65 250 L115 250 L115 300 L299.5 300').toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'A', true);
            expect(diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.connectors.length == 1).toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Right');
            expect(diagram.nodes[0].offsetX == 101 && diagram.nodes[0].offsetY == 200).toBe(true);
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).data == 'M76 200 L66 200 L66 250 L116 250 L116 300 L300.5 300' ||
                (diagram.connectors[0].wrapper.children[0] as PathElement).data == 'M76 200 L66 200 L66 250 L116 250 L116 300 L299.5 300').toBe(true);
            done();
        });
    });

    describe('Conectors with segments - Terminal segment(Two points) - Drag target point', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'TerminalSegmentTwoPoints' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000, connectors: [
                    {
                        id: 'Conn1', sourcePoint: { x: 300, y: 200 },
                        targetPoint: { x: 400, y: 100 }, type: 'Orthogonal',
                        segments: [{type: 'Orthogonal', direction: 'Top', length: 100 }]
                    },
                    {
                        id: 'Conn2', sourcePoint: { x: 300, y: 300 },
                        targetPoint: { x: 400, y: 400 }, type: 'Orthogonal',
                        segments: [{ type: 'Orthogonal',direction: 'Right', length: 100 }]
                    },
                    {
                        id: 'Conn3', sourcePoint: { x: 200, y: 300 },
                        targetPoint: { x: 100, y: 400 }, type: 'Orthogonal',
                        segments: [{ type: 'Orthogonal',direction: 'Bottom', length: 100 }]
                    },
                    {
                        id: 'Conn4', sourcePoint: { x: 200, y: 200 },
                        targetPoint: { x: 100, y: 100 }, type: 'Orthogonal',
                        segments: [{ type: 'Orthogonal',direction: 'Left', length: 100 }]
                    }
                ],
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#TerminalSegmentTwoPoints');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Multiple segment target dragging - Terminal segment have two points', (done: Function) => {
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            diagram.select([diagram.connectors[0]]);
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[0].targetPoint.x + diagram.element.offsetLeft, diagram.connectors[0].targetPoint.y + diagram.element.offsetTop, 400 + diagram.element.offsetLeft, 90 + diagram.element.offsetTop);
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 98 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 400 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 98).toBe(true);
            diagram.select([diagram.connectors[1]]);
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[1].targetPoint.x + diagram.element.offsetLeft, diagram.connectors[1].targetPoint.y + diagram.element.offsetTop, 410 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 410 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 410 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 408).toBe(true);
            diagram.select([diagram.connectors[2]]);
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[2].targetPoint.x + diagram.element.offsetLeft, diagram.connectors[2].targetPoint.y + diagram.element.offsetTop, 100 + diagram.element.offsetLeft, 410 + diagram.element.offsetTop);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 200 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 418 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 418).toBe(true);
            diagram.select([diagram.connectors[3]]);
            mouseEvents.dragAndDropEvent(diagramCanvas, diagram.connectors[3].targetPoint.x + diagram.element.offsetLeft, diagram.connectors[3].targetPoint.y + diagram.element.offsetTop, 100 + diagram.element.offsetLeft, 110 + diagram.element.offsetTop);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 200 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 200 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 200 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 118).toBe(true);
            done();
        });
    });

    describe('Conectors with multiple segments - Source Node Rotion', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'SourceNodeRotion' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [{
                    id: 'NewIdea', width: 150, height: 60, offsetX: 300, offsetY: 60,
                    shape: { type: 'Flow', shape: 'Terminator' },
                    annotations: [{
                        id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
                    }],
                }, {
                    id: 'Meeting', width: 150, height: 60, offsetX: 500, offsetY: 300,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
                    }]
                }],
                connectors: [
                    {
                        id: 'connector1', type: 'Orthogonal', sourceID: 'NewIdea', targetID: 'Meeting',
                        segments: [{ type: 'Orthogonal', direction: 'Bottom', length: 60 },
                        { type: 'Orthogonal', direction: 'Right', length: 80 },
                        { type: 'Orthogonal', direction: 'Bottom', length: 50 }]
                    }
                ],
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#SourceNodeRotion');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Multiple segment target dragging - Terminal segment have two points', (done: Function) => {
            expect((diagram.connectors[0] as Connector).intermediatePoints[2].x == 380 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150);
            diagram.rotate(diagram.nodes[0], 65);
            expect((diagram.connectors[0] as Connector).intermediatePoints[2].x == 380 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150);
            diagram.rotate(diagram.nodes[0], 120);
            expect((diagram.connectors[0] as Connector).intermediatePoints[2].x == 380 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150);
            diagram.rotate(diagram.nodes[0], 210);
            expect((diagram.connectors[0] as Connector).intermediatePoints[2].x == 380 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150);
            diagram.rotate(diagram.nodes[0], 270);
            expect((diagram.connectors[0] as Connector).intermediatePoints[2].x == 380 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 150);
            done();
        });
    });

});