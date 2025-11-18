import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { Segments, ConnectorConstraints, PortVisibility} from '../../../src/diagram/enum/enum';
import { Connector, OrthogonalSegment } from '../../../src/diagram/objects/connector';
import { StraightSegmentModel } from '../../../src/diagram/objects/connector-model';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { SnapConstraints, Snapping, ConnectorBridging, IEditSegmentOptions } from '../../../src/diagram/index';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { ConnectorEditing } from '../../../src/diagram/interaction/connector-editing';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(UndoRedo);
Diagram.Inject(ConnectorEditing, Snapping, ConnectorBridging);


/**
 * Editing test cases
 */
function getIntermediatePoints(Points: PointModel[], value: string): string {
    let output: string = 'expect(';
    for (let i = 0; i < Points.length; i++) {
        output += value + 'as Connector).intermediatePoints[' + i + '].x ==' + Points[i].x +
            '&&' + value + 'as Connector).intermediatePoints[' + i + '].y ==' + Points[i].y + '&&';
    }
    output += ').toBe(true);';
    return output;
}
describe('Diagram Control', () => {
    describe('Hide segment thumb', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramsegment' });
            document.body.appendChild(ele);

            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Orthogonal';
            connector2.sourcePoint = { x: 250, y: 250 };
            connector2.targetPoint = { x: 350, y: 350 };
            connector2.segments = [{ type: 'Orthogonal', direction: "Right", length: 70 }, { type: 'Orthogonal', direction: "Bottom", length: 20 }];

            diagram = new Diagram({
                width: 500, height: 500,
                connectors: [connector2],
                snapSettings: { constraints: SnapConstraints.ShowLines },
                getConnectorDefaults: function (connector: ConnectorModel) {
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                }
            });
            diagram.appendTo('#diagramsegment');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            diagram.segmentCollectionChange = function (args) {
                if (args.type == 'Addition') {
                    args.cancel = true;
                }
            }
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Check the segment thumb visibility for hidden thumbs', function (done) {
            diagram.select([diagram.connectors[0]]);
            diagram.connectors[0].segments[0].allowDrag = false;
            diagram.connectors[0].segments[1].allowDrag = false;
            diagram.dataBind();
            expect(document.getElementById("orthoThumb_1_1").getAttribute("visibility") == 'hidden' &&
                document.getElementById("orthoThumb_2_1").getAttribute("visibility") == 'hidden').toBe(true);
            diagram.connectors[0].segments[0].allowDrag = true;
            diagram.connectors[0].segments[1].allowDrag = true;
            diagram.dataBind();
            done();
        });

        it('Add the segment when event is canceled', function (done) {
            diagram.select([diagram.connectors[0]]);

            mouseEvents.mouseDownEvent(diagramCanvas, 350 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 330 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 250 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 250 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);


            mouseEvents.mouseDownEvent(diagramCanvas, 270 + diagram.element.offsetLeft, 250 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 270 + diagram.element.offsetLeft, 230 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 350 + diagram.element.offsetLeft, 180 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 350 + diagram.element.offsetLeft, 180 + diagram.element.offsetTop);
            expect(diagram.connectors[0].segments.length == 3).toBe(true);
            done();
        });
    });
    describe('Hide segment thumb', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramsegment2' });
            document.body.appendChild(ele);

            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Orthogonal';
            connector2.sourcePoint = { x: 250, y: 250 };
            connector2.targetPoint = { x: 350, y: 350 };
            connector2.segments = [{ type: 'Orthogonal', direction: "Right", length: 70 }, { type: 'Orthogonal', direction: "Bottom", length: 20 }];

            diagram = new Diagram({
                width: 500, height: 500,
                connectors: [connector2],
                snapSettings: { constraints: SnapConstraints.ShowLines },
                getConnectorDefaults: function (connector: ConnectorModel) {
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                }
            });
            diagram.appendTo('#diagramsegment2');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            diagram.segmentCollectionChange = function (args) {
                if (args.type !== 'Addition') {
                    args.cancel = true;
                }
            }
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Remove the segment when event is canceled', function (done) {
            diagram.select([diagram.connectors[0]]);

            mouseEvents.mouseDownEvent(diagramCanvas, 275 + diagram.element.offsetLeft, 250 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 275 + diagram.element.offsetLeft, 255 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 275 + diagram.element.offsetLeft, 260 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 275 + diagram.element.offsetLeft, 260 + diagram.element.offsetTop);
            expect(diagram.connectors[0].segments.length == 5).toBe(true);
            done();
        });
    });
    describe('Conectors with segments - Orthogonal Segment Interaction(Point To Port)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthogonalSegmentPointToPortInteraction' });
            document.body.appendChild(ele);
            let nodesCollection: NodeModel[] = []; let count = 1; let offsetY = 100; let offsetX = 100
            for (let i = 0; i < 9; i++) {
                let node = {
                    id: 'node' + i, offsetX: ((count) * offsetX), offsetY: offsetY, width: 50, height: 50,
                    annotations: [{
                        content: ((count) * offsetX).toString(),
                    },
                    {
                        offset: { x: 0.5, y: 0 },
                        content: offsetY.toString(),
                    },
                    {
                        offset: { x: 0.5, y: 1 },
                        content: 'node' + i,
                    }],
                    ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                    { id: 'port2', offset: { x: 0.5, y: 0 } },
                    { id: 'port3', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', offset: { x: 0.5, y: 1 } }]
                };
                if (node.id !== 'node4') {
                    nodesCollection.push(node);
                }
                count += 3;
                if (count == 10) {
                    count = 1;
                    offsetX = 100;
                    offsetY = offsetY + 200;
                }
            }
            let portCollection = [{ id: 'port1', offset: { x: 0, y: 0.5 } },
            { id: 'port2', offset: { x: 0.5, y: 0 } },
            { id: 'port3', offset: { x: 1, y: 0.5 } },
            { id: 'port4', offset: { x: 0.5, y: 1 } }];
            nodesCollection.push({ id: 'node9', offsetX: 100, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node10', offsetX: 700, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node11', offsetX: 100, offsetY: 1000, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node12', offsetX: 700, offsetY: 900, width: 50, height: 50, ports: portCollection });
            let connectors: ConnectorModel[] = [];
            count = 0;
            let dir = ['Left', 'Right', 'Top', 'Bottom'];
            let ports = ['port1', 'port2', 'port3', 'port4'];
            let sourcePoints = [{ x: 300, y: 200 }, { x: 400, y: 200 }, { x: 300, y: 300 }, { x: 500, y: 300 },
            { x: 300, y: 700 }, { x: 450, y: 700 }, { x: 100, y: 850 }, { x: 700, y: 1150 }];
            let targetNodes = ['node0', 'node2', 'node6', 'node8',
                'node9', 'node10', 'node11', 'node12'];
            for (let i = 0; i < targetNodes.length; i++) {
                for (let k = 0; k < ports.length; k++) {
                    // for (let j = 0; j < dir.length; j++) {
                    let connector: ConnectorModel = {
                        id: 'connector' + count, type: 'Orthogonal', sourcePoint: sourcePoints[i], targetID: targetNodes[i], targetPortID: ports[k],
                        segments: [{ type: 'Orthogonal', direction: 'Left', length: 50 },],
                    }
                    connectors.push(connector);
                    count++;
                    // }
                }
            }
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodesCollection,
                connectors: connectors,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthogonalSegmentPointToPortInteraction');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Orthogonal segment - Point To Port interaction(Target port direction - Left)', (done: Function) => {
            diagram.select([diagram.connectors[0]]);
            var string = 'diagram.selectedItems.connectors[0]';
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 100).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 50 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop, 100 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 145 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 170 + diagram.element.offsetTop, 200 + diagram.element.offsetLeft, 170 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 200 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 200 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 208) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 200 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 200 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 208) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 145 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 145 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 100).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 125 + diagram.element.offsetLeft, 142 + diagram.element.offsetTop, 125 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop);
            mouseEvents.dragAndDropEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 130 + diagram.element.offsetTop, 58 + diagram.element.offsetLeft, 130 + diagram.element.offsetTop);
            done();
        });

        it('Checking Orthogonal segment - Point To Port interaction(Target port direction - Top)', (done: Function) => {
            diagram.select([diagram.connectors[5]]);
            var string = 'diagram.selectedItems.connectors[0]';
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 350 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 350 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 75).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 525 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop, 525 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 350 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 350 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 158 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 158 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 75).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 660 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop, 800 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 350 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 350 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 158 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 800 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 808) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 158 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 800 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 808) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 75).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 750 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop, 800 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 350 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 350 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 158 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 800 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 808) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 158 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 800 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 808) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 108 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 745 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 108 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 745 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[7].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[7].y == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[8].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[8].y == 75).toBe(true);
            done();
        });

        it('Checking Orthogonal segment - Point To Port interaction(Target port direction - Right)', (done: Function) => {

            diagram.select([diagram.connectors[14]]);
            var string = 'diagram.selectedItems.connectors[0]';
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 745 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 745 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 725 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 500).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 742 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop, 700 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 700 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 708) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 700 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 708) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 455 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 745 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 455 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 745 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 725 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 500).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 700 + diagram.element.offsetLeft, 375 + diagram.element.offsetTop, 600 + diagram.element.offsetLeft, 380 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 600 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 608) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 600 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 608) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 455 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 745 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 455 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 745 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 725 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 500).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 375 + diagram.element.offsetTop, 500 + diagram.element.offsetLeft, 375 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 500 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 508) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 500 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 508) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 455 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 745 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 455 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 745 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 725 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 500).toBe(true);
            done();
        });

        it('Checking Orthogonal segment - Point To Port interaction(Target port direction - Bottom)', (done: Function) => {
            diagram.select([diagram.connectors[11]]);
            var string = 'diagram.selectedItems.connectors[0]';
            var connector = (diagram.connectors[11] as Connector).intermediatePoints;
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 545 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 545 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 525).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 175 + diagram.element.offsetLeft, 540 + diagram.element.offsetTop, 175 + diagram.element.offsetLeft, 500 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 508 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 145 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 508 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 145 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 545 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 545 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 525).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 500 + diagram.element.offsetTop, 200 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 408 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 145 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 408 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 145 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 545 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 545 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 525).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 142 + diagram.element.offsetLeft, 475 + diagram.element.offsetTop, 30 + diagram.element.offsetLeft, 475 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 408 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 30 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 38) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 408 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 30 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 38) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 545 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 545 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 525).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 60 + diagram.element.offsetLeft, 540 + diagram.element.offsetTop, 60 + diagram.element.offsetLeft, 500 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 408 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 30 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 38) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 408 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 30 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 38) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 508 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 508 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 545 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[7].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[7].y == 545 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[8].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[8].y == 525).toBe(true);
            done();
        });
    });

    describe('Conectors with segments - Orthogonal Segment Interaction(Port To Point)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthogonalSegmentInteractionPortToPoint' });
            document.body.appendChild(ele);
            let nodesCollection: NodeModel[] = []; let count = 1; let offsetY = 100; let offsetX = 100
            for (let i = 0; i < 9; i++) {
                let node = {
                    id: 'node' + i, offsetX: ((count) * offsetX), offsetY: offsetY, width: 50, height: 50,
                    annotations: [{
                        content: ((count) * offsetX).toString(),
                    },
                    {
                        offset: { x: 0.5, y: 0 },
                        content: offsetY.toString(),
                    },
                    {
                        offset: { x: 0.5, y: 1 },
                        content: 'node' + i,
                    }],
                    ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                    { id: 'port2', offset: { x: 0.5, y: 0 } },
                    { id: 'port3', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', offset: { x: 0.5, y: 1 } }]
                };
                if (node.id !== 'node4') {
                    nodesCollection.push(node);
                }
                count += 3;
                if (count == 10) {
                    count = 1;
                    offsetX = 100;
                    offsetY = offsetY + 200;
                }
            }
            let portCollection = [{ id: 'port1', offset: { x: 0, y: 0.5 } },
            { id: 'port2', offset: { x: 0.5, y: 0 } },
            { id: 'port3', offset: { x: 1, y: 0.5 } },
            { id: 'port4', offset: { x: 0.5, y: 1 } }];
            nodesCollection.push({ id: 'node9', offsetX: 100, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node10', offsetX: 700, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node11', offsetX: 100, offsetY: 1000, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node12', offsetX: 700, offsetY: 900, width: 50, height: 50, ports: portCollection });

            let nodes: NodeModel[] = nodesCollection;
            let connectors: ConnectorModel[] = [];
            count = 0;
            let dir = ['Left', 'Right', 'Top', 'Bottom'];
            let ports = ['port1', 'port2', 'port3', 'port4'];
            let targetPoints = [{ x: 300, y: 200 }, { x: 400, y: 200 }, { x: 300, y: 300 }, { x: 500, y: 300 },
            { x: 300, y: 700 }, { x: 450, y: 700 }, { x: 100, y: 850 }, { x: 700, y: 1150 }];
            let sourceNodes = ['node0', 'node2', 'node6', 'node8',
                'node9', 'node10', 'node11', 'node12'];
            for (let i = 0; i < sourceNodes.length; i++) {
                for (let k = 0; k < ports.length; k++) {
                    // for (let j = 0; j < dir.length; j++) {
                    let connector: ConnectorModel = {
                        id: 'connector' + count, type: 'Orthogonal', targetPoint: targetPoints[i], sourceID: sourceNodes[i], sourcePortID: ports[k],
                        segments: [{ type: 'Orthogonal', direction: 'Right', length: 50 },],
                    }
                    connectors.push(connector);
                    count++;
                    // }
                }
            }

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes,
                connectors: connectors,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthogonalSegmentInteractionPortToPoint');

            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Orthogonal segment - Port To Point Interaction (Port direction- Left)', (done: Function) => {
            diagram.select([diagram.connectors[0]]);
            var string = 'diagram.selectedItems.connectors[0]';
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 25 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 25 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 200).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 20 + diagram.element.offsetLeft, 140 + diagram.element.offsetTop, 50 + diagram.element.offsetLeft, 140 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 100 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 50 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 58) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 100 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 50 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 58) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 200).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 50 + diagram.element.offsetLeft, 140 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 70 + diagram.element.offsetLeft, 140 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 140 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 140 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 140 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 145 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 150 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 158) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 145 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 150 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 158) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 200).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 140 + diagram.element.offsetTop, 100 + diagram.element.offsetLeft, 20 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 28 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 150 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 158) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 28 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 150 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 158) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 200).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 60 + diagram.element.offsetLeft, 60 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 70 + diagram.element.offsetLeft, 60 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 60 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 60 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 60 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 55 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 150 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 158) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 55 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 150 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 158) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 200).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Port To Point Interaction (Port direction- Top)', (done: Function) => {
            diagram.select([diagram.connectors[5]]);
            var string = 'diagram.selectedItems.connectors[0]';
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 750 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 750 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 200).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 750 + diagram.element.offsetLeft, 120 + diagram.element.offsetTop, 525 + diagram.element.offsetLeft, 120 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 62 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 525 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 533) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 62 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 525 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 533) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 200).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 610 + diagram.element.offsetLeft, 60 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 610 + diagram.element.offsetLeft, 70 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 610 + diagram.element.offsetLeft, 100 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 610 + diagram.element.offsetLeft, 208 - diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 610 + diagram.element.offsetLeft, 208 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 200).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Port To Point Interaction (Port direction- Right)', (done: Function) => {

            diagram.select([diagram.connectors[14]]);
            var string = 'diagram.selectedItems.connectors[0]';
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 725 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 775 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 775 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 778 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop, 730 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 725 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 500 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 730 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 738) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 500 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 730 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 738) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 730 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 710 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 690 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 500 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 500 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 725 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 738 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 738 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 455 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 500 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 508) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 455 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 500 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 508) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Port To Point Interaction (Port direction- Bottom)', (done: Function) => {
            diagram.select([diagram.connectors[11]]);

            var string = 'diagram.selectedItems.connectors[0]';
            var connector = (diagram.connectors[11] as Connector).intermediatePoints;
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 525 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 538 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 150 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 538 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 150 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 420 - diagram.element.offsetTop, 200 + diagram.element.offsetLeft, 420 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 525 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 538 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 200 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 208) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 538 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 200 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 208) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 540 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 530 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 510 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 458 - diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 150 + diagram.element.offsetLeft, 458 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 525 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 538 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 145 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 538 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 145 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 450 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 200 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 208) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 450 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 200 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 208) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 300).toBe(true);
            done();
        });
    });

    describe('Conectors with segments - Orthogonal Segment Interaction(Node To Point)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthogonalSegmentNodeToPointInteraction' });
            document.body.appendChild(ele);
            let nodesCollection: NodeModel[] = []; let count = 1; let offsetY = 100; let offsetX = 100
            for (let i = 0; i < 9; i++) {
                let node = {
                    id: 'node' + i, offsetX: ((count) * offsetX), offsetY: offsetY, width: 50, height: 50,
                    annotations: [{
                        content: ((count) * offsetX).toString(),
                    },
                    {
                        offset: { x: 0.5, y: 0 },
                        content: offsetY.toString(),
                    },
                    {
                        offset: { x: 0.5, y: 1 },
                        content: 'node' + i,
                    }],
                    ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                    { id: 'port2', offset: { x: 0.5, y: 0 } },
                    { id: 'port3', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', offset: { x: 0.5, y: 1 } }]
                };
                if (node.id !== 'node4') {
                    nodesCollection.push(node);
                }
                count += 3;
                if (count == 10) {
                    count = 1;
                    offsetX = 100;
                    offsetY = offsetY + 200;
                }
            }
            let portCollection = [{ id: 'port1', offset: { x: 0, y: 0.5 } },
            { id: 'port2', offset: { x: 0.5, y: 0 } },
            { id: 'port3', offset: { x: 1, y: 0.5 } },
            { id: 'port4', offset: { x: 0.5, y: 1 } }];
            nodesCollection.push({ id: 'node9', offsetX: 100, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node10', offsetX: 700, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node11', offsetX: 100, offsetY: 1000, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node12', offsetX: 700, offsetY: 900, width: 50, height: 50, ports: portCollection });

            let nodes: NodeModel[] = nodesCollection;
            let connectors: ConnectorModel[] = [];
            count = 0;
            let dir = ['Left', 'Right', 'Top', 'Bottom'];
            let ports = ['port1', 'port2', 'port3', 'port4'];
            let targetPoints = [{ x: 300, y: 200 }, { x: 400, y: 200 }, { x: 300, y: 300 }, { x: 500, y: 300 },
            { x: 300, y: 700 }, { x: 450, y: 700 }, { x: 100, y: 850 }, { x: 700, y: 1150 }];
            let sourceNodes = ['node0', 'node2', 'node6', 'node8',
                'node9', 'node10', 'node11', 'node12'];
            for (let i = 0; i < sourceNodes.length; i++) {
                for (let j = 0; j < dir.length; j++) {
                    let connector: ConnectorModel = {
                        id: 'connector' + count, type: 'Orthogonal', targetPoint: targetPoints[i], sourceID: sourceNodes[i],
                        segments: [{ type: 'Orthogonal', direction: dir[j], length: 50 },],
                    }
                    connectors.push(connector);
                    count++;
                }
            }

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes,
                connectors: connectors,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthogonalSegmentNodeToPointInteraction');

            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let string = 'diagram.selectedItems.connectors[0]';
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking Orthogonal segment - Node To Point Interaction (Node direction- Right)', (done: Function) => {
            mouseEvents.clickEvent(diagramCanvas, diagram.connectors[9].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[9].sourcePoint.y + diagram.element.offsetTop);
            if (diagram.selectedItems.connectors.length === 0) {
                mouseEvents.clickEvent(diagramCanvas, diagram.connectors[9].sourcePoint.x + diagram.element.offsetLeft, diagram.connectors[9].sourcePoint.y - diagram.element.offsetTop);
            }

            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 125 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 500 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 175 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 175 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);

            mouseEvents.mouseDownEvent(diagramCanvas, 178 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 135 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 130 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 120 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 120 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            expect(((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 125 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 100) &&
                ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 500 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 475) &&
                ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 128 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 100) &&
                ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 500 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 455) &&
                ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 128 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 130) &&
                ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 300 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 455) &&
                ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 300 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 130) &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Node To Point Interaction (Node direction- Top)', (done: Function) => {
            diagram.select([diagram.connectors[6]]);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 25 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 25 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 200).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 20 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 70 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 80 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 80 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 675 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 88 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 88 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 200).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Node To Point Interaction (Node direction- Bottom)', (done: Function) => {

            diagram.select([diagram.connectors[15]]);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 525 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 575 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 575 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 300).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 570 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 530 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 520 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 500 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 500 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 675 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 528 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 528 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 300).toBe(true);
            done();
        });
    });

    describe('Conectors with segments - Orthogonal Segment Interaction(Point To Node)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthogonalSegmentPointToNodeInteraction' });
            document.body.appendChild(ele);
            let nodesCollection: NodeModel[] = []; let count = 1; let offsetY = 100; let offsetX = 100
            for (let i = 0; i < 9; i++) {
                let node = {
                    id: 'node' + i, offsetX: ((count) * offsetX), offsetY: offsetY, width: 50, height: 50,
                    annotations: [{
                        content: ((count) * offsetX).toString(),
                    },
                    {
                        offset: { x: 0.5, y: 0 },
                        content: offsetY.toString(),
                    },
                    {
                        offset: { x: 0.5, y: 1 },
                        content: 'node' + i,
                    }],
                    ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                    { id: 'port2', offset: { x: 0.5, y: 0 } },
                    { id: 'port3', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', offset: { x: 0.5, y: 1 } }]
                };
                if (node.id !== 'node4') {
                    nodesCollection.push(node);
                }
                count += 3;
                if (count == 10) {
                    count = 1;
                    offsetX = 100;
                    offsetY = offsetY + 200;
                }
            }
            let portCollection = [{ id: 'port1', offset: { x: 0, y: 0.5 } },
            { id: 'port2', offset: { x: 0.5, y: 0 } },
            { id: 'port3', offset: { x: 1, y: 0.5 } },
            { id: 'port4', offset: { x: 0.5, y: 1 } }];
            nodesCollection.push({ id: 'node9', offsetX: 100, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node10', offsetX: 700, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node11', offsetX: 100, offsetY: 1000, width: 50, height: 50, ports: portCollection });
            nodesCollection.push({ id: 'node12', offsetX: 700, offsetY: 900, width: 50, height: 50, ports: portCollection });

            let nodes: NodeModel[] = nodesCollection;

            let connectors: ConnectorModel[] = [];
            count = 0;
            let dir = ['Left', 'Right', 'Top', 'Bottom'];
            let ports = ['port1', 'port2', 'port3', 'port4'];
            let sourcePoints = [{ x: 300, y: 200 }, { x: 400, y: 200 }, { x: 300, y: 300 }, { x: 500, y: 300 },
            { x: 300, y: 700 }, { x: 450, y: 700 }, { x: 100, y: 850 }, { x: 700, y: 1150 }];
            let targetNodes = ['node0', 'node2', 'node6', 'node8',
                'node9', 'node10', 'node11', 'node12'];
            for (let i = 0; i < targetNodes.length; i++) {
                for (let j = 0; j < dir.length; j++) {
                    let connector: ConnectorModel = {
                        id: 'connector' + count, type: 'Orthogonal', sourcePoint: sourcePoints[i], targetID: targetNodes[i],
                        segments: [{ type: 'Orthogonal', direction: dir[j], length: 50 },],
                    }
                    connectors.push(connector);
                    count++;
                }
            }

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes,
                connectors: connectors,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthogonalSegmentPointToNodeInteraction');

            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Orthogonal segment - Point To Node Interaction(Target direction-"Bottom To Center")', (done: Function) => {
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            var string = 'diagram.selectedItems.connectors[0]';
            diagram.select([diagram.connectors[2]]);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 150 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 108 - diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 108 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 125 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 100).toBe(true);
            done();
        });

        it('Checking Orthogonal segment - Point To Node Interaction(Target direction-"Bottom To Top")', (done: Function) => {
            diagram.select([diagram.connectors[6]]);
            var string = 'diagram.selectedItems.connectors[0]';
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 150 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 150 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 58 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 58 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 75).toBe(true);
            done();
        });

        it('Checking Orthogonal segment - Point To Node Interaction(Target direction and source point center-"Bottom To Top")', (done: Function) => {
            diagram.select([diagram.connectors[19]]);
            var string = 'diagram.selectedItems.connectors[0]';
            mouseEvents.mouseDownEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 750 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 700 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 650 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 650 + diagram.element.offsetTop);
            done();
        });

        it('Checking Orthogonal segment - Point To Node Interaction(Target direction and source point center-"Top To Bottom")', (done: Function) => {
            diagram.select([diagram.connectors[20]]);
            var string = 'diagram.selectedItems.connectors[0]';
            mouseEvents.mouseDownEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 630 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 650 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 800 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 800 + diagram.element.offsetTop);
            done();
        });
    });

    describe('Conectors with segments - Orthogonal Segment interaction(Drag source node and target node)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        let string = 'diagram.selectedItems.connectors[0]';
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthogonalSegmentDragSource' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = []; let count = 1; let offsetY = 100; let offsetX = 100
            for (var i = 0; i < 9; i++) {
                var node = { id: 'node' + i, offsetX: ((count) * offsetX), offsetY: offsetY, width: 50, height: 50 };
                nodes.push(node);
                count += 3;
                if (count == 10) {
                    count = 1;
                    offsetX = 100;
                    offsetY = offsetY + 200;
                }
            }
            let connectors: ConnectorModel[] = [

                {
                    id: 'connector0', type: 'Orthogonal', sourceID: 'node4', targetID: 'node0',
                    segments: [{ type: 'Orthogonal', direction: 'Left', length: 50 },],
                },
                {
                    id: 'connector1', type: 'Orthogonal', sourceID: 'node4', targetID: 'node2',
                    segments: [{ type: 'Orthogonal', direction: 'Top', length: 50 },],
                },
                {
                    id: 'connector2', type: 'Orthogonal', sourceID: 'node4', targetID: 'node8',
                    segments: [{ type: 'Orthogonal', direction: 'Right', length: 50 },],
                },
                {
                    id: 'connector3', type: 'Orthogonal', sourceID: 'node4', targetID: 'node6',
                    segments: [{ type: 'Orthogonal', direction: 'Bottom', length: 50 },],
                },

            ];

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes,
                connectors: connectors,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthogonalSegmentDragSource');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking Orthogonal segment - drag source node', (done: Function) => {

            let nodes = [diagram.nodes[4]];
            diagram.clearSelection();
            var string = 'diagram.selectedItems.connectors[0]';
            mouseEvents.clickEvent(diagramCanvas, diagram.nodes[4].offsetX + diagram.element.offsetLeft, diagram.nodes[4].offsetY - diagram.element.offsetTop);
            let connector;

            mouseEvents.dragAndDropEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 300 - diagram.element.offsetTop, 300 + diagram.element.offsetLeft, 300 - diagram.element.offsetTop);
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 275 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 125).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 225 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 225 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 700 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 125).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 325 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 475).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 375 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 375 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 475).toBe(true);

            mouseEvents.dragAndDropEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 - diagram.element.offsetTop, 300 + diagram.element.offsetLeft, 200 - diagram.element.offsetTop);
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 275 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 200 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 125).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 175 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 675 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 100).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 325 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 200 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 200 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 475).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 225 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 375 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 375 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 475).toBe(true);

            mouseEvents.dragAndDropEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 200 - diagram.element.offsetTop, 400 + diagram.element.offsetLeft, 200 - diagram.element.offsetTop);
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 375 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 200 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 125).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 400 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 175 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 400 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 675 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 100).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 425 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 200 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 200 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 475).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 400 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 225 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 400 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 375 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 375 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 475).toBe(true);


            mouseEvents.dragAndDropEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 200 - diagram.element.offsetTop, 400 + diagram.element.offsetLeft, 300 - diagram.element.offsetTop);
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 375 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 125).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 400 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 275 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 400 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 100 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 675 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 100).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 425 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 700 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 300 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 700 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 475).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 400 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 325 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 400 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 375 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 375 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 100 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 475).toBe(true);

            done();
        });
    });

    describe('Conectors with segments - Orthogonal Segment interaction(Node To Node)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        let string = 'diagram.selectedItems.connectors[0]';
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthogonalSegmentInteraction' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = []; let count = 1; let offsetY = 100; let offsetX = 100
            for (var i = 0; i < 9; i++) {
                var node = { id: 'node' + i, offsetX: ((count) * offsetX), offsetY: offsetY, width: 50, height: 50 };
                nodes.push(node);
                count += 3;
                if (count == 10) {
                    count = 1;
                    offsetX = 100;
                    offsetY = offsetY + 200;
                }
            }
            let connectors: ConnectorModel[] = [

                {
                    id: 'connector0', type: 'Orthogonal', sourceID: 'node4', targetID: 'node0',
                    segments: [{ type: 'Orthogonal', direction: 'Left', length: 50 },],
                },
                {
                    id: 'connector1', type: 'Orthogonal', sourceID: 'node4', targetID: 'node2',
                    segments: [{ type: 'Orthogonal', direction: 'Top', length: 50 },],
                },
                {
                    id: 'connector2', type: 'Orthogonal', sourceID: 'node4', targetID: 'node8',
                    segments: [{ type: 'Orthogonal', direction: 'Right', length: 50 },],
                },
                {
                    id: 'connector3', type: 'Orthogonal', sourceID: 'node4', targetID: 'node6',
                    segments: [{ type: 'Orthogonal', direction: 'Bottom', length: 50 },],
                },

            ];

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes,
                connectors: connectors,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthogonalSegmentInteraction');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Orthogonal segment - Node to Node(single segment-Left)', (done: Function) => {
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            diagram.select([diagram.connectors[0]]);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, 240 + diagram.element.offsetLeft, 208 - diagram.element.offsetTop);

            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 375 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 283.33 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 283.33 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 125 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 100).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 282 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 360 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 370 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 375 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 380 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 380 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);



            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 275 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 255 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 380 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 255 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 380 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 125 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 100).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 380 + diagram.element.offsetLeft, 180 - diagram.element.offsetTop, 100 + diagram.element.offsetLeft, 180 - diagram.element.offsetTop);



            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 275 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 255 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 100 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 108) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 255 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 100 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 108) && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 125 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 145)).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240 + diagram.element.offsetLeft, 255 + diagram.element.offsetTop, 240 + diagram.element.offsetLeft, 108 - diagram.element.offsetTop);


            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 275 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 100 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 125 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 108) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 100).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 190 - diagram.element.offsetTop, 300 + diagram.element.offsetLeft, 190 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 275 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 216.67 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 200 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 216) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 216.67 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 200 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 216) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 100 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 125 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 108) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 100).toBe(true);
            done();
        });


        it('Checking Orthogonal segment - Node to Node(single segment-Top)', (done: Function) => {
            diagram.select([diagram.connectors[1]]);
            mouseEvents.dragAndDropEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 220 + diagram.element.offsetTop, 550 + diagram.element.offsetLeft, 108 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 275 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 675 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 100).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 400 + diagram.element.offsetLeft, 190 - diagram.element.offsetTop, 500 + diagram.element.offsetLeft, 190 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 275
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 216.67
                && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 616 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 600) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 216.67
                && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 616 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 600) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 100
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 675 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 100).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 160 - diagram.element.offsetTop, 800 + diagram.element.offsetLeft, 160 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 275
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 216.67
                && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 808 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 800) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 216.67
                && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 808 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 800) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 100
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 725 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 100).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 800 + diagram.element.offsetLeft, 160 - diagram.element.offsetTop, 700 + diagram.element.offsetLeft, 160 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 275 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 216.67 &&
                ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 708 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 700) &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 216.67 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 708 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 700) &&
                ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 145) || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 125).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 700 + diagram.element.offsetLeft, 170 - diagram.element.offsetTop, 395 + diagram.element.offsetLeft, 170 - diagram.element.offsetTop);
            mouseEvents.dragAndDropEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 155 - diagram.element.offsetTop, 550 + diagram.element.offsetLeft, 50 - diagram.element.offsetTop);
            mouseEvents.dragAndDropEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 40 + diagram.element.offsetTop, 550 + diagram.element.offsetLeft, 108 - diagram.element.offsetTop);
            done();


        });
        it('Checking Orthogonal segment - Node to Node(single segment-Right)', (done: Function) => {

            diagram.select([diagram.connectors[2]]);
            mouseEvents.dragAndDropEvent(diagramCanvas, 560 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, 560 + diagram.element.offsetLeft, 408 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 425 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 516.67 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 516.67 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 675 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 500).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 520 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 430 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 425 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 420 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 415 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 410 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 410 + diagram.element.offsetLeft, 400 - diagram.element.offsetTop);

            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 325 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 345 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 410 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 345 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 410 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 675 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 500).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 410 + diagram.element.offsetLeft, 420 + diagram.element.offsetTop, 550 + diagram.element.offsetLeft, 420 - diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 325 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 345 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 550 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 345 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 550 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 500 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 675 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 500).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 475 + diagram.element.offsetLeft, 340 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 475 + diagram.element.offsetLeft, 330 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 475 + diagram.element.offsetLeft, 325 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 475 + diagram.element.offsetLeft, 320 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 475 + diagram.element.offsetLeft, 315 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 475 + diagram.element.offsetLeft, 310 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 475 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 475 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 425 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 445 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 445 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 308 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 550 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 308 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 550 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 500 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 675 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 500).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Node to Node(single segment-Bottom)', (done: Function) => {

            diagram.select([diagram.connectors[3]]);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 325 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 375 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 375 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 475).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 250 + diagram.element.offsetLeft, 375 + diagram.element.offsetTop, 250 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 275 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 158 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 158 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 475).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 250 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop, 250 + diagram.element.offsetLeft, 290 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 375 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 300 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 355 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 300 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 355 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 158 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 100 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 158 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 100 &&
                (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 475).toBe(true);
            done();
        });
    });

    describe('Conectors with segments - Orthogonal Segment interaction(Node To Port)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthogonalSegmentNodeToPortInteraction' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = []; let count = 1; let offsetY = 100; let offsetX = 100
            for (var i = 0; i < 9; i++) {
                var node = {
                    id: 'node' + i, offsetX: ((count) * offsetX), offsetY: offsetY, width: 50, height: 50,
                    annotations: [{
                        content: ((count) * offsetX).toString(),
                    },
                    {
                        offset: { x: 0.5, y: 0 },
                        content: offsetY.toString(),
                    }, {
                        offset: { x: 0.5, y: 1 },
                        content: 'node' + i,
                    }],
                    ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                    { id: 'port2', offset: { x: 0.5, y: 0 } },
                    { id: 'port3', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', offset: { x: 0.5, y: 1 } }]
                };
                if (node.id == 'node1') {
                    node.offsetX = 550, node.offsetY = 250,
                        node.annotations = [{
                            content: node.offsetX.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 0 },
                            content: node.offsetY.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 1 },
                            content: node.id.toString(),
                        }];
                }
                else if (node.id == 'node3') {
                    node.offsetX = 250, node.offsetY = 250,
                        node.annotations = [{
                            content: node.offsetX.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 0 },
                            content: node.offsetY.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 1 },
                            content: node.id.toString(),
                        }];
                }
                else if (node.id == 'node5') {
                    node.offsetX = 550, node.offsetY = 400,
                        node.annotations = [{
                            content: node.offsetX.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 0 },
                            content: node.offsetY.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 1 },
                            content: node.id.toString(),
                        }];
                } else if (node.id == 'node7') {
                    node.offsetX = 250, node.offsetY = 400,
                        node.annotations = [{
                            content: node.offsetX.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 0 },
                            content: node.offsetY.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 1 },
                            content: node.id.toString(),
                        }];
                }
                if (node.id !== 'node4')
                    nodes.push(node);
                count += 3;
                if (count == 10) {
                    count = 1;
                    offsetX = 100;
                    offsetY = offsetY + 200;
                }
            }
            let portCollection = [{ id: 'port1', offset: { x: 0, y: 0.5 } },
            { id: 'port2', offset: { x: 0.5, y: 0 } },
            { id: 'port3', offset: { x: 1, y: 0.5 } },
            { id: 'port4', offset: { x: 0.5, y: 1 } }];
            nodes.push({ id: 'node9', offsetX: 100, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node10', offsetX: 700, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node11', offsetX: 100, offsetY: 1000, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node12', offsetX: 700, offsetY: 900, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node13', offsetX: 300, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node14', offsetX: 450, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node15', offsetX: 100, offsetY: 850, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node16', offsetX: 700, offsetY: 1150, width: 50, height: 50, ports: portCollection });

            let connectors: ConnectorModel[] = [];
            count = 0;
            let dir = ['Left', 'Right', 'Top', 'Bottom'];
            let ports = ['port1', 'port2', 'port3', 'port4'];
            let sourceNodes = ['node3', 'node1', 'node7', 'node5', 'node13', 'node14', 'node15', 'node16'];
            let targetNodes = ['node0', 'node2', 'node6', 'node8',
                'node9', 'node10', 'node11', 'node12'];
            for (let i = 0; i < sourceNodes.length; i++) {
                for (let k = 0; k < ports.length; k++) {
                    // for (let j = 0; j < dir.length; j++) {
                    let connector: ConnectorModel = {
                        id: 'connector' + count, type: 'Orthogonal', targetID: targetNodes[i], sourceID: sourceNodes[i], targetPortID: ports[k],
                        segments: [{ type: 'Orthogonal', direction: 'Top', length: 50 },],
                    };
                    // if (count == 99 || count == 99)
                    connectors.push(connector);
                    count++;
                    // }
                }
            }


            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes,
                connectors: connectors,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthogonalSegmentNodeToPortInteraction');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Orthogonal segment - Node to Port(Node Direction - Right and Port Direction - Left)', (done: Function) => {

            diagram.select([diagram.connectors[4]]);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 225
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 100
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 675 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 100).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 160 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 170 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 660 + diagram.element.offsetLeft, 170 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 720 + diagram.element.offsetLeft, 180 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 720 + diagram.element.offsetLeft, 180 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 225
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 183.33
                && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 728 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 720) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 183.33
                && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 728 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 720) && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 55 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 145)
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 655 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 55 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 145)
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 100
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 675 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 100).toBe(true);

            mouseEvents.mouseDownEvent(diagramCanvas, 630 + diagram.element.offsetLeft, 180 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 630 + diagram.element.offsetLeft, 220 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 630 + diagram.element.offsetLeft, 250 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 630 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 630 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 575 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 250
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 595 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 250
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 595 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 308
                && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 728 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 720) && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 308
                && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 728 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 720) && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 55 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 145)
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 655 && ((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 55 || (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 145)
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 100
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[7].x == 675 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[7].y == 100).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Node to Port(Node Direction - Right and Port Direction - Left, Target Node - Bottom)', (done: Function) => {
            diagram.select([diagram.connectors[12]]);
            mouseEvents.mouseDownEvent(diagramCanvas, 550 + diagram.element.offsetLeft, 460 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 460 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 660 + diagram.element.offsetLeft, 450 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 720 + diagram.element.offsetLeft, 440 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 720 + diagram.element.offsetLeft, 440 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 425
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 450
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 720 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 450
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 720 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 455
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 455
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 500
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 675 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 500).toBe(true);
            done();
        });

        it('Checking Orthogonal segment - Node to Port(Node Direction - Left and Port Direction - Left, Target Node - Bottom)', (done: Function) => {

            diagram.select([diagram.connectors[8]]);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 375
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 325
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 325
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 500
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 500).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 55 + diagram.element.offsetLeft, 410 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 410 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 160 + diagram.element.offsetLeft, 410 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 420 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 420 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 375
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 325
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 325
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 455
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 455
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 500
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 500).toBe(true);

            mouseEvents.mouseDownEvent(diagramCanvas, 220 + diagram.element.offsetLeft, 320 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 220 + diagram.element.offsetLeft, 350 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 160 + diagram.element.offsetLeft, 370 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 468 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 468 + diagram.element.offsetTop);

            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 225 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 400
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 205 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 400
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 205 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 476
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 476
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 455
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 455
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 55 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 500
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[7].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[7].y == 500).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Node to Port(One segment like straight segment - Interaction) ', (done: Function) => {
            diagram.select([diagram.connectors[25]]);
            mouseEvents.mouseDownEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 925 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 80 + diagram.element.offsetLeft, 925 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 60 + diagram.element.offsetLeft, 925 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 40 + diagram.element.offsetLeft, 925 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 40 + diagram.element.offsetLeft, 925 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 875
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 900
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 40 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 900
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 40 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 950
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 950
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 100 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 975).toBe(true);

            diagram.select([diagram.connectors[31]]);
            mouseEvents.mouseDownEvent(diagramCanvas, 700 + diagram.element.offsetLeft, 1020 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 720 + diagram.element.offsetLeft, 1020 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 750 + diagram.element.offsetLeft, 1020 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 800 + diagram.element.offsetLeft, 1020 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 800 + diagram.element.offsetLeft, 1020 + diagram.element.offsetTop);

            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 1125
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 1075
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 800 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 1075
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 800 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 975
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 975
                && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 925).toBe(true);
            done();
        });
    });

    describe('Conectors with segments - Orthogonal Segment interaction(Port To Node)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthogonalSegmentInteraction' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = []; let count = 1; let offsetY = 100; let offsetX = 100
            for (var i = 0; i < 9; i++) {
                var node = {
                    id: 'node' + i, offsetX: ((count) * offsetX), offsetY: offsetY, width: 50, height: 50,
                    annotations: [{
                        content: ((count) * offsetX).toString(),
                    },
                    {
                        offset: { x: 0.5, y: 0 },
                        content: offsetY.toString(),
                    }, {
                        offset: { x: 0.5, y: 1 },
                        content: 'node' + i,
                    }],
                    ports: [{ id: 'port1', offset: { x: 0, y: 0.5 } },
                    { id: 'port2', offset: { x: 0.5, y: 0 } },
                    { id: 'port3', offset: { x: 1, y: 0.5 } },
                    { id: 'port4', offset: { x: 0.5, y: 1 } }]
                };
                if (node.id == 'node1') {
                    node.offsetX = 550, node.offsetY = 250,
                        node.annotations = [{
                            content: node.offsetX.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 0 },
                            content: node.offsetY.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 1 },
                            content: node.id.toString(),
                        }];
                }
                else if (node.id == 'node3') {
                    node.offsetX = 250, node.offsetY = 250,
                        node.annotations = [{
                            content: node.offsetX.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 0 },
                            content: node.offsetY.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 1 },
                            content: node.id.toString(),
                        }];
                }
                else if (node.id == 'node5') {
                    node.offsetX = 550, node.offsetY = 400,
                        node.annotations = [{
                            content: node.offsetX.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 0 },
                            content: node.offsetY.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 1 },
                            content: node.id.toString(),
                        }];
                }
                else if (node.id == 'node7') {
                    node.offsetX = 250, node.offsetY = 400,
                        node.annotations = [{
                            content: node.offsetX.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 0 },
                            content: node.offsetY.toString(),
                        },
                        {
                            offset: { x: 0.5, y: 1 },
                            content: node.id.toString(),
                        }];
                }
                if (node.id !== 'node4')
                    nodes.push(node);
                count += 3;
                if (count == 10) {
                    count = 1;
                    offsetX = 100;
                    offsetY = offsetY + 200;
                }
            }
            var portCollection = [{ id: 'port1', offset: { x: 0, y: 0.5 } },
            { id: 'port2', offset: { x: 0.5, y: 0 } },
            { id: 'port3', offset: { x: 1, y: 0.5 } },
            { id: 'port4', offset: { x: 0.5, y: 1 } }];
            nodes.push({ id: 'node9', offsetX: 100, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node10', offsetX: 700, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node11', offsetX: 100, offsetY: 1000, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node12', offsetX: 700, offsetY: 900, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node13', offsetX: 300, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node14', offsetX: 450, offsetY: 700, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node15', offsetX: 100, offsetY: 850, width: 50, height: 50, ports: portCollection });
            nodes.push({ id: 'node16', offsetX: 700, offsetY: 1150, width: 50, height: 50, ports: portCollection });
            let connectors: ConnectorModel[] = [];
            count = 0;
            var dir = ['Left', 'Right', 'Top', 'Bottom'];
            var ports = ['port1', 'port2', 'port3', 'port4'];
            var sourceNodes = ['node3', 'node1', 'node7', 'node5', 'node13', 'node14', 'node15', 'node16'];
            var targetNodes = ['node0', 'node2', 'node6', 'node8',
                'node9', 'node10', 'node11', 'node12'];
            for (var i_2 = 0; i_2 < sourceNodes.length; i_2++) {
                for (var k = 0; k < ports.length; k++) {
                    let connector: ConnectorModel = {
                        id: 'connector' + count, type: 'Orthogonal', sourceID: targetNodes[i_2], targetID: sourceNodes[i_2], sourcePortID: ports[k],
                        segments: [{ type: 'Orthogonal', direction: 'Top', length: 50 },],
                    };
                    connectors.push(connector);
                    count++;
                }
            }
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes,
                connectors: connectors,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthogonalSegmentInteraction');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Orthogonal segment - Port to Node(Node Direction - Top and Port Direction - Bottom(Right))', (done: Function) => {
            diagram.select([diagram.connectors[3]]);
            expect(diagram.selectedItems.connectors.length == 1).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 175 + diagram.element.offsetLeft, 175 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 175 + diagram.element.offsetLeft, 130 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 175 + diagram.element.offsetLeft, 110 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 175 + diagram.element.offsetLeft, 80 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 175 + diagram.element.offsetLeft, 80 + diagram.element.offsetTop);
            done();
        });
        it('Checking Orthogonal segment - Port to Node(Node Direction - Top and Port Direction - Bottom,(Left))', (done: Function) => {
            diagram.select([diagram.connectors[7]]);
            mouseEvents.mouseDownEvent(diagramCanvas, 620 + diagram.element.offsetLeft, 175 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 620 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 620 + diagram.element.offsetLeft, 130 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 620 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 620 + diagram.element.offsetLeft, 30 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 620 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 138 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 138 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 38 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 38 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 225).toBe(true);

            mouseEvents.mouseDownEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 40 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 220 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 250 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 600 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 125 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 138 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 138 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 655 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 308 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 308 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 275).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Port to Node(Node Direction - Right and Port Direction - Top)', (done: Function) => {
            diagram.select([diagram.connectors[13]]);
            mouseEvents.mouseDownEvent(diagramCanvas, 635 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 635 + diagram.element.offsetLeft, 420 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 635 + diagram.element.offsetLeft, 450 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 635 + diagram.element.offsetLeft, 460 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 635 + diagram.element.offsetLeft, 460 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 475 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 468 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 468 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 550 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 425).toBe(true);

            mouseEvents.mouseDownEvent(diagramCanvas, 630 + diagram.element.offsetLeft, 450 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 630 + diagram.element.offsetLeft, 430 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 630 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 630 + diagram.element.offsetLeft, 380 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 630 + diagram.element.offsetLeft, 380 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 475 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 700 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 388 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 595 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 388 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 595 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 400 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 575 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 400).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Port to Node(Node Direction - Bottom and Port Direction - Left)', (done: Function) => {
            diagram.select([diagram.connectors[8]]);
            mouseEvents.mouseDownEvent(diagramCanvas, 60 + diagram.element.offsetLeft, 475 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 465 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 160 + diagram.element.offsetLeft, 465 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 465 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 465 + diagram.element.offsetTop);
            expect((diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].x == 75 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[0].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].x == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[1].y == 500 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].x == 62 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[2].y == 455 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].x == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[3].y == 455 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].x == 200 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[4].y == 450 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[5].y == 450 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].x == 250 && (diagram.selectedItems.connectors[0] as Connector).intermediatePoints[6].y == 425).toBe(true);
            done();
        });
    });

    describe('Conectors with segments - Straight and bezier Segment interaction', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramBezierSegment' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                { id: 'node1', offsetX: 100, offsetY: 200, width: 100, height: 100, },
                { id: 'node2', offsetX: 400, offsetY: 200, width: 100, height: 100, },
            ];
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1', type: 'Straight', sourceID: 'node1', sourcePortID: 'port2', targetID: 'node2',
                    segments: [{ point: { x: 180, y: 150 } }, { point: { x: 250, y: 150 } }]
                },
                {
                    id: 'connector2',
                    type: 'Bezier',
                    sourcePoint: { x: 200, y: 300 },
                    targetPoint: { x: 350, y: 500 },
                    segments: [
                        {
                            type: 'Bezier',
                            point: { x: 300, y: 400 }
                        }
                    ]
                },
                //Point-Point(Multiple Segment)
                {
                    id: 'connector3', type: 'Orthogonal', targetPoint: { x: 900, y: 200 }, sourcePoint: { x: 700, y: 200 },
                    segments: [{ type: 'Orthogonal', direction: 'Right', length: 50 }, { type: 'Orthogonal', direction: 'Top', length: 50 }, { type: 'Orthogonal', direction: 'Left', length: 20 }, { type: 'Orthogonal', direction: 'Top', length: 40 }],
                },
                //Point-Point(Multiple Segment)
                {
                    id: 'connector4', type: 'Orthogonal', targetPoint: { x: 300, y: 500 }, sourcePoint: { x: 900, y: 200 },
                    segments: [{ type: 'Orthogonal', direction: 'Left', length: 50 }, { type: 'Orthogonal', direction: 'Top', length: 50 }, { type: 'Orthogonal', direction: 'Left', length: 20 }, { type: 'Orthogonal', direction: 'Top', length: 40 }],
                }
            ];

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes,
                connectors: connectors,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramBezierSegment');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking straight segment connector - add and remove segment when mouse down with ctrl and shift', (done: Function) => {

            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let connector: (NodeModel | ConnectorModel)[] = [diagram.connectors[0]];
            diagram.select(connector);
            mouseEvents.clickEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop, true, true);
            expect((diagram.connectors[0] as Connector).intermediatePoints.length === 5).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop, true, true);
            expect((diagram.connectors[0] as Connector).intermediatePoints.length === 4).toBe(true);
            done();
        });
        it('Checking straight segment - drag control point', (done: Function) => {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 180 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop, 320 + diagram.element.offsetLeft, 160 + diagram.element.offsetTop);
  
            expect((diagram.connectors[0] as Connector).intermediatePoints[1].x === 320 && (diagram.connectors[0] as Connector).intermediatePoints[1].y === 168).toBe(true)
            done();
        });
        it('Checking straight segment - drag the connector', (done: Function) => {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 160 + diagram.element.offsetTop, 200 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop);
            expect(diagram.selectedItems.connectors[0].sourceID === '' && diagram.selectedItems.connectors[0].targetID === '').toBe(true)
            done();
        });

        it('Checking straight segment - drag comntrol point and add control point(between two segments connected)', (done: Function) => {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let connector: ConnectorModel = diagram.connectors[0] as ConnectorModel;
            let connectors: (NodeModel | ConnectorModel)[] = [diagram.connectors[0]];
            diagram.select(connectors);
            var count = diagram.selectedItems.connectors[0].segments.length;
            mouseEvents.clickEvent(diagramCanvas, 275 + diagram.element.offsetLeft, 160 + diagram.element.offsetTop, true, true);
            expect(diagram.selectedItems.connectors[0].segments.length == count + 1).toBe(true);
            done();
        });

        it('Checking bezier segment - drag sement point', (done: Function) => {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let connector: (NodeModel | ConnectorModel)[] = [diagram.connectors[1]];
            diagram.select(connector);
            mouseEvents.dragAndDropEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 400 + diagram.element.offsetTop, 300 + diagram.element.offsetLeft, 450 + diagram.element.offsetTop);
            expect(((diagram.connectors[1] as Connector).intermediatePoints[1].x === 308|| (diagram.connectors[1] as Connector).intermediatePoints[1].x === 300) && (diagram.connectors[1] as Connector).intermediatePoints[1].y !== 400).toBe(true)
            done();
        });
        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        })
    });
    describe('Orthogonal Segment - last segment overlap to target node issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'lastSegmentOverlapToTargetNode' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [
                    { id: 'node1', offsetX: 300, offsetY: 200, width: 50, height: 50 },
                    { id: 'node2', offsetX: 200, offsetY: 220, width: 50, height: 50 },
                    { id: 'node3', offsetX: 400, offsetY: 180, width: 50, height: 50 },
                    { id: 'node4', offsetX: 280, offsetY: 100, width: 50, height: 50 },
                    { id: 'node5', offsetX: 320, offsetY: 300, width: 50, height: 50 }
                ],
                connectors: [
                    { id: 'con1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal', segments: [{ type: 'Orthogonal', direction: 'Left', length: 70 }] },
                    { id: 'con2', sourceID: 'node1', targetID: 'node3', type: 'Orthogonal', segments: [{ type: 'Orthogonal', direction: 'Right', length: 70 }] },
                    { id: 'con3', sourceID: 'node1', targetID: 'node4', type: 'Orthogonal', segments: [{ type: 'Orthogonal', direction: 'Top', length: 70 }] },
                    { id: 'con4', sourceID: 'node1', targetID: 'node5', type: 'Orthogonal', segments: [{ type: 'Orthogonal', direction: 'Bottom', length: 70 }] },
                ],
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#lastSegmentOverlapToTargetNode');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Orthogonal segment - Node to Node(single segment-Left)', (done: Function) => {

            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 275 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 245 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 200 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 245 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 220 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 225 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 220).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 325 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 200 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 355 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 200 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 355 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 180 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 375 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 180).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 175 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 280 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 280 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 125).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 225 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 255 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 320 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 255 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 320 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 275).toBe(true);
            done();
        });
    });
});


describe('Remove Previous Segment', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'AllowPrevRemove' });
        document.body.appendChild(ele);
        var nodes:NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 250,
            },
        ]
        var connectors: ConnectorModel[] = [{
            id: 'connector1',
            type: 'Orthogonal',
            sourceID:'node1',
            targetID:'node2',
            constraints: (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb),
            segments: [
                {
                    type: 'Orthogonal',
                    length: 100,
                    direction: 'Left',
                },
                
            ],
        }];
        diagram = new Diagram({
            width: '900px', height: '500px', nodes: nodes, connectors: connectors,
            snapSettings: {
                constraints: SnapConstraints.All & ~(SnapConstraints.SnapToHorizontalLines |
                    SnapConstraints.SnapToVerticalLines | SnapConstraints.SnapToLines)
            }
        });
        diagram.appendTo('#AllowPrevRemove');
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Remove Previous Segment', function (done) {
        diagram.select([diagram.connectors[0]]);
        mouseEvents.mouseDownEvent(diagramCanvas, 425, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 425, 107);
        mouseEvents.mouseUpEvent(diagramCanvas, 425, 107);
        expect(diagram.connectors[0].segments.length < 5).toBe(true);
        done();
    });

    it('Remove Next Segment', function (done) {
        diagram.select([diagram.connectors[0]]);
        mouseEvents.mouseDownEvent(diagramCanvas, 500, 150);
        mouseEvents.mouseMoveEvent(diagramCanvas, 600, 150);
        mouseEvents.mouseUpEvent(diagramCanvas, 600, 150);
        mouseEvents.mouseDownEvent(diagramCanvas, 600, 140);
        mouseEvents.mouseMoveEvent(diagramCanvas, 504, 140);
        mouseEvents.mouseUpEvent(diagramCanvas, 504, 140);
        expect(diagram.connectors[0].segments.length < 5).toBe(true);
        done();
    });
});

describe('Conectors Segments - Ortho node to node connection', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement;
    beforeAll((): void => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
    ele = createElement('div', { id: 'diagramOrthoNodeToNode' });
    document.body.appendChild(ele);
    diagram = new Diagram({
        width: 1000, height: 1000,
        nodes: [{ id: 'node1', offsetX: 307.5, offsetY: 211.5, width: 237, height: 213, },
        {
            id: 'node2', offsetX: 572, offsetY: 142, width: 50, height: 50,
        }
        ],
        connectors: [{
            id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal',
            segments: [{ type: 'Orthogonal', direction: 'Right', length: 80 },
            { type: 'Orthogonal', direction: 'Bottom', length: 89.5 },
            { type: 'Orthogonal', direction: 'Right', length: 131 },
            { type: 'Orthogonal', direction: 'Top', length: 114 },]
        },
        {
            id: 'connector2', sourceID: 'node1', targetPoint: { x: 20, y: 60 }, type: 'Orthogonal',
            segments: [{ type: 'Orthogonal', direction: 'Top', length: 80 },
            { type: 'Orthogonal', direction: 'Left', length: 70 },
            { type: 'Orthogonal', direction: 'Top', length: 9 },]
        }],
        getConnectorDefaults: (obj: ConnectorModel) => {
            let connector: ConnectorModel = {};
            connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
            return connector;
        },
        snapSettings: { constraints: SnapConstraints.ShowLines }
    });
    diagram.appendTo('#diagramOrthoNodeToNode');
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    });
    afterAll((): void => {
    diagram.destroy();
    ele.remove();
    });
    it('Checking Orthogonal - when drag segment thumb less node width or node height', function (done) {
    let mouseEvents: MouseEvents = new MouseEvents();
    mouseEvents.clickEvent(diagramCanvas, 10 + diagram.element.offsetLeft, 10 + diagram.element.offsetTop);
    diagram.select([diagram.connectors[0]]);
    let startX = (diagram.connectors[0] as Connector).intermediatePoints[1].x;
    let startY = ((diagram.connectors[0] as Connector).intermediatePoints[1].y + (diagram.connectors[0] as Connector).intermediatePoints[2].y) / 2;
    expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 426 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 211.5 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 506 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 211.5 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 506 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 301 && (diagram.connectors[0] as Connector).intermediatePoints[3].x == 637 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 301 && (diagram.connectors[0] as Connector).intermediatePoints[4].x == 637 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 187 && (diagram.connectors[0] as Connector).intermediatePoints[5].x == 572 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 187 && (diagram.connectors[0] as Connector).intermediatePoints[6].x == 572 && (diagram.connectors[0] as Connector).intermediatePoints[6].y == 167).toBe(true);
    mouseEvents.clickEvent(diagramCanvas, startX + diagram.element.offsetLeft, startY + diagram.element.offsetTop);
    mouseEvents.dragAndDropEvent(diagramCanvas, startX + diagram.element.offsetLeft, startY + diagram.element.offsetTop, (startX - 200) + diagram.element.offsetLeft, startY + diagram.element.offsetTop);
    expect((diagram.connectors[0] as Connector).intermediatePoints.length == 6).toBe(true);
    diagram.select([diagram.connectors[1]]);
    startX = ((diagram.connectors[1] as Connector).intermediatePoints[1].x + (diagram.connectors[1] as Connector).intermediatePoints[2].x) / 2;
    startY = ((diagram.connectors[1] as Connector).intermediatePoints[1].y);
    expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 307.5 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 105 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 307.5 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 25 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 237.5 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 25 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 237.5 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 16 && (diagram.connectors[1] as Connector).intermediatePoints[4].x == 20 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 16 && (diagram.connectors[1] as Connector).intermediatePoints[5].x == 20 && (diagram.connectors[1] as Connector).intermediatePoints[5].y == 60).toBe(true);
    mouseEvents.clickEvent(diagramCanvas, startX + diagram.element.offsetLeft, startY + diagram.element.offsetTop);
    mouseEvents.dragAndDropEvent(diagramCanvas, startX + diagram.element.offsetLeft, startY + diagram.element.offsetTop, startX + diagram.element.offsetLeft, (startY + 80) + diagram.element.offsetTop);
    expect((diagram.connectors[0] as Connector).intermediatePoints.length == 6).toBe(true);
    done();
    });
    
    
});


describe('Connector Segment shapes and style', () => {
  
    describe(' Segment thumb and segment Thumb shape', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramConSeg' });
            document.body.appendChild(ele);

            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Orthogonal';
            connector2.sourcePoint = { x: 250, y: 250 };
            connector2.targetPoint = { x: 350, y: 350 };
            connector2.segments = [{ type: 'Orthogonal', direction: "Right", length: 70 }, { type: 'Orthogonal', direction: "Bottom", length: 20 }];

            diagram = new Diagram({
                width: 900, height: 500,
                connectors: [connector2],
                snapSettings: { constraints: SnapConstraints.ShowLines },
                getConnectorDefaults: function (connector: ConnectorModel) {
                    connector.constraints = (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb) &~ ConnectorConstraints.InheritSegmentThumbShape;
                }
            });
            diagram.appendTo('#diagramConSeg');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            
            
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking the Thumbshape at initial rendering', function (done) {
             diagram.select([diagram.connectors[0]]);
            expect(document.getElementById("orthoThumb_1_1").getAttribute("d")==="M10,5 C10,7.76,7.76,10,5,10 C2.24,10,0,7.76,0,5 C0,2.24,2.24,0,5,0 C7.76,0,10,2.24,10,5 Z ").toBe(true);
            done();
        });
        it('Check the segment thumb visibility for hidden thumbs', function (done) {
            diagram.select([diagram.connectors[0]]);
            diagram.connectors[0].segments[0].allowDrag = false;
            diagram.connectors[0].segments[2].allowDrag = false;
            diagram.dataBind();
            expect(document.getElementById("orthoThumb_1_1").getAttribute("visibility") == 'hidden' &&
            document.getElementById("orthoThumb_3_2").getAttribute("visibility") == 'hidden').toBe(true);
            diagram.connectors[0].segments[0].allowDrag = true;
            diagram.connectors[0].segments[2].allowDrag = true;
            diagram.dataBind();
            done();
        });
        it('Checking connector segments', function (done) {
            diagram.select([diagram.connectors[0]]);
            diagram.dataBind();
            expect(diagram.connectors[0].segments.length === 3).toBe(true);
            done();
        });
        it('Checking the orthogonal thumbshape rendering dynamically', function (done) {
            diagram.select([diagram.connectors[0]]);
            diagram.connectors[0].segmentThumbShape = "OpenArrow";
            diagram.dataBind();
            expect(document.getElementById("orthoThumb_1_1").getAttribute("d") === "M9.08,10 L0,5 L9.08,0 L10,1.21 L3.08,5 L10,8.79 Z ").toBe(true);
            done();
            }); 
    });

    describe('824805-Modify connector segment Thumb shape', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let diagramCanvas: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSTS' });
            document.body.appendChild(ele);

            let connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.type = 'Orthogonal';
            connector2.sourcePoint = { x: 250, y: 250 };
            connector2.targetPoint = { x: 350, y: 350 };
            connector2.segments = [{ type: 'Orthogonal', direction: "Right", length: 70 }, { type: 'Orthogonal', direction: "Bottom", length: 20 }];
            connector2.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
            let connector1: ConnectorModel = 
            {
                id: 'connector1',type: 'Bezier',
                sourcePoint: { x: 500, y: 100 },targetPoint: { x: 800, y: 150 },
                segments: [
                    {
                        type: 'Bezier',
                        point: { x: 550, y: 350 }
                    },
                    {
                        type: 'Bezier',
                        point: { x: 700, y: 250 }
                    }
                ],
                constraints: (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb) &~ ConnectorConstraints.InheritSegmentThumbShape,
            };
            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector2,connector1],
                snapSettings: { constraints: SnapConstraints.ShowLines },
                segmentThumbShape:'Rectangle'
            });
            diagram.appendTo('#diagramSTS');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            
            
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('default shape of bezier segment thumb', function (done) {
            diagram.select([diagram.connectors[1]]);
            //default shape of bezier segment thumb shape to be Circle
            expect(diagram.connectors[1].segmentThumbShape).toBe('Circle');
            done();
        });
        it('Checking bezier thumb shape icon', function (done) {
            diagram.select([diagram.connectors[1]]);
            expect(diagram.connectors[1].segmentThumbShape).toBe('Circle');
            diagram.connectors[1].segmentThumbShape ='Ellipse'
            diagram.dataBind();
            expect(document.getElementById("segementThumb_1").getAttribute("d") === "M10,5 C10,7.76,7.76,10,5,10 C2.24,10,0,7.76,0,5 C0,2.24,2.24,0,5,0 C7.76,0,10,2.24,10,5 Z ").toBe(true);
            diagram.connectors[1].segmentThumbShape = 'Fletch';
            diagram.dataBind();
            expect(document.getElementById("segementThumb_1").getAttribute("d") === "M9.82,0 C9.82,0,6.61,5,10,10 C10,10,7.71,5,0,5 C0,5,6.61,5,9.82,0 Z ").toBe(true);
            done();
        });
        it('Checking bezier thumb shape icon by constraints', function (done) {
            diagram.select([diagram.connectors[1]]);
            expect(diagram.connectors[1].segmentThumbShape).toBe('Fletch');
            diagram.connectors[1].segmentThumbShape ='Arrow'
            diagram.dataBind();
            expect(document.getElementById("segementThumb_1").getAttribute("d") === "M0,10 L10,10 L5,0 Z ").toBe(true);
            diagram.connectors[1].constraints = (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb) & ~ConnectorConstraints.InheritSegmentThumbShape;
            diagram.dataBind();
            diagram.connectors[1].segmentThumbShape = 'Circle';
            diagram.dataBind();
            expect(document.getElementById("segementThumb_1").getAttribute("d") === "M10,5 C10,7.76,7.76,10,5,10 C2.24,10,0,7.76,0,5 C0,2.24,2.24,0,5,0 C7.76,0,10,2.24,10,5 Z ").toBe(true);
            expect(diagram.segmentThumbShape).toBe('Rectangle');
            done();
        });
        it('Checking Orthogonal thumb shape icon by constraints', function (done) {
            diagram.select([diagram.connectors[0]]);
            expect(diagram.segmentThumbShape).toBe('Rectangle');
            diagram.segmentThumbShape ='Arrow'
            diagram.dataBind();
            expect(document.getElementById("orthoThumb_1_1").getAttribute("d") === "M10,0 L10,10 L0,5 Z ").toBe(true);
            diagram.connectors[0].constraints = (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb) & ~ConnectorConstraints.InheritSegmentThumbShape;
            diagram.dataBind();
            expect(document.getElementById("orthoThumb_1_1").getAttribute("d") === "M10,5 C10,7.76,7.76,10,5,10 C2.24,10,0,7.76,0,5 C0,2.24,2.24,0,5,0 C7.76,0,10,2.24,10,5 Z ").toBe(true);
            expect(diagram.connectors[0].segmentThumbShape).toBe('Circle');
            done();
        });
        it('Checking bezier segment - drag segment point', (done: Function) => {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let a1= (diagram.connectors[1].segments[0] as any).points[1].x;
            let b1= (diagram.connectors[1].segments[0] as any).points[1].y;
            let connector: (NodeModel | ConnectorModel)[] = [diagram.connectors[1]];
            diagram.unSelect(diagram.connectors[1]);
            mouseEvents.clickEvent(diagramCanvas, 550, 350);
            mouseEvents.mouseDownEvent(diagramCanvas, 550, 350);
            mouseEvents.mouseMoveEvent(diagramCanvas, 600, 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, 610, 410);
            mouseEvents.mouseUpEvent(diagramCanvas, 610, 410);
            let a2= (diagram.connectors[1].segments[0] as any).points[1].x;
            let b2= (diagram.connectors[1].segments[0] as any).points[1].y;
            mouseEvents.clickEvent(diagramCanvas, 550, 350);
            mouseEvents.dragAndDropEvent(diagramCanvas, 550, 350, 620, 420);
            expect(a1 !== a2 && b1 !== b2).toBe(true);
            done();
        });     
    });
});
//827745-Add or remove Segment Dynamically to the straight connector
describe('Connectors Segments - Add or Remove Segment Runtime', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement;
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'diagramOrthoChangeSourcePoint' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: 1000, height: 1000,
            connectors: [
                {
                    id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 }, type: 'Straight',
                    segments: [{ type: 'Straight',point:{x:100,y:150} },
                    { type: 'Straight',},]
                },
                {
                    id: 'connector2', sourcePoint: { x: 572, y: 40 }, targetPoint: { x: 600, y: 300 }, type: 'Straight',
                    segments: [{ type: 'Straight', direction: 'Bottom', length: 200 },
                    ]
                },
            ],
            getConnectorDefaults: (obj: ConnectorModel) => {
                let connector: ConnectorModel = {};
                connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                return connector;
            },
            snapSettings: { constraints: SnapConstraints.ShowLines }
        });
        diagram.appendTo('#diagramOrthoChangeSourcePoint');
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking Straight - segment Add', function (done) {
        diagram.select([diagram.connectors[0]]);
        expect(diagram.connectors[0].segments.length == 2).toBe(true);
        let point: PointModel = { x: 160, y:180};
        let options: IEditSegmentOptions={
            connector: diagram.connectors[0], 
            point: point,
            SegmentEditing:'Add'
        }
        diagram.editSegment(options);
        expect(diagram.connectors[0].segments.length == 3).toBe(true);
        done();
    });
    it('Checking Straight - segment Remove - in same point ', function (done) {
        diagram.select([diagram.connectors[0]]);
        expect(diagram.connectors[0].segments.length == 3).toBe(true);
        let point: PointModel = { x: 160, y:180};
        let options: IEditSegmentOptions={
            connector: diagram.connectors[0], 
            point: point,
            SegmentEditing:'Remove'
        }
        diagram.editSegment(options);
        expect(diagram.connectors[0].segments.length == 2).toBe(true);
        done();
    });
    it('Checking Straight - segment Toggle - in same point ', function (done) {
        diagram.select([diagram.connectors[0]]);
        expect(diagram.connectors[0].segments.length == 2).toBe(true);
        let point: PointModel = { x: 160, y:180};
        let options: IEditSegmentOptions={
            connector: diagram.connectors[0], 
            point: point,
            SegmentEditing:'Toggle'
        }
        diagram.editSegment(options);
        expect(diagram.connectors[0].segments.length == 3).toBe(true);
        done();
    });
    it('Checking Straight - segment Toggle - in same point ', function (done) {
        diagram.select([diagram.connectors[0]]);
        expect(diagram.connectors[0].segments.length == 3).toBe(true);
        let point: PointModel = { x: 160, y:180};
        let options: IEditSegmentOptions={
            connector: diagram.connectors[0], 
            point: point,
            SegmentEditing:'Toggle'
        }
        diagram.editSegment(options);
        expect(diagram.connectors[0].segments.length == 2).toBe(true);
        done();
    });
}); 

  
describe('Orthogonal connector segment routing issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let diagramCanvas: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramOrtho_seg' });
        document.body.appendChild(ele);

        let connector: ConnectorModel = {
            id: 'connector1', sourceID:'node1', targetID:'node2',type:'Orthogonal',
            constraints:ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb,allowNodeOverlap:true,
            sourcePortID:'bottom',targetPortID:'top', segments: [
                {
                  type: 'Orthogonal',
                  length: 50,
                  direction: 'Bottom',
                  allowDrag: false,
                },
                {
                  type: 'Orthogonal',
                  length: 500,
                  direction: 'Left',
                  allowDrag: true,
                },
                {
                  type: 'Orthogonal',
                  length: 50,
                  direction: 'Bottom',
                  allowDrag: false,
                },
              ],
        };
        let node: NodeModel = {
            id: 'node1', width: 100, height: 50, offsetX: 600, offsetY: 100, annotations: [ { content: 'Node1'}],ports:getPorts()
        };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 50, offsetX: 100, offsetY: 250, annotations: [ { content: 'Node2'}],ports:getPorts()
        };
        diagram = new Diagram({
            width: '1500px', height: '700px', nodes: [node, node2,], connectors: [connector],
        });
        diagram.appendTo('#diagramOrtho_seg');
        diagramCanvas = document.getElementById(diagram.element.id + 'content'); 

        function getPorts():any{

            let ports = [
                { id: 'left', shape: 'Circle', offset: { x: 0, y: 0.5 } },
                { id: 'bottom', shape: 'Circle', offset: { x: 0.5, y: 1 } },
                { id: 'right', shape: 'Circle', offset: { x: 1, y: 0.5 } },
                { id: 'top', shape: 'Circle', offset: { x: 0.5, y: 0 } },
            ];
            return ports;
        
        }
        
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking the connector segment routing after dragging node and segment', function (done) {
        let firstPoint = (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;
        mouseEvents.mouseDownEvent(diagramCanvas, 600, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 600, 200);
        mouseEvents.mouseMoveEvent(diagramCanvas, 600, 300);
        mouseEvents.mouseUpEvent(diagramCanvas, 600, 300);
        diagram.select([diagram.connectors[0]]);
        let prevPoint = (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;
        mouseEvents.mouseDownEvent(diagramCanvas, 385, 343);
        mouseEvents.mouseMoveEvent(diagramCanvas, 385, 395);
        mouseEvents.mouseMoveEvent(diagramCanvas, 385, 410);
        mouseEvents.mouseUpEvent(diagramCanvas, 385, 410);
        let curPoint = (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;
        expect(curPoint !== prevPoint && prevPoint === 4 && curPoint === 2 && firstPoint === 2).toBe(true);
        done();
    });

});

describe('Orthogonal connector segment routing issue-1', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let diagramCanvas: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramOrtho_seg' });
        document.body.appendChild(ele);

        let connector: ConnectorModel = {
            id: 'connector1', sourceID:'node1', targetID:'node2',type:'Orthogonal',
            constraints:ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb,allowNodeOverlap:true,
            sourcePortID:'bottom',targetPortID:'top', segments: [
                {
                  type: 'Orthogonal',
                  length: 50,
                  direction: 'Bottom',
                  allowDrag: false,
                },
                {
                  type: 'Orthogonal',
                  length: 500,
                  direction: 'Left',
                  allowDrag: true,
                },
                {
                  type: 'Orthogonal',
                  length: 50,
                  direction: 'Bottom',
                  allowDrag: false,
                },
              ],
        };
        let node: NodeModel = {
            id: 'node1', width: 100, height: 50, offsetX: 600, offsetY: 100, annotations: [ { content: 'Node1'}],ports:getPorts()
        };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 50, offsetX: 100, offsetY: 250, annotations: [ { content: 'Node2'}],ports:getPorts()
        };
        diagram = new Diagram({
            width: '1500px', height: '700px', nodes: [node, node2,], connectors: [connector],
        });
        diagram.appendTo('#diagramOrtho_seg');
        diagramCanvas = document.getElementById(diagram.element.id + 'content'); 

        function getPorts():any{
            let ports = [
                { id: 'left', shape: 'Circle', offset: { x: 0, y: 0.5 } },
                { id: 'bottom', shape: 'Circle', offset: { x: 0.5, y: 1 } },
                { id: 'right', shape: 'Circle', offset: { x: 1, y: 0.5 } },
                { id: 'top', shape: 'Circle', offset: { x: 0.5, y: 0 } },
            ];
            return ports;
        }
        
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking the connector segment routing after dragging node and segment -1', function (done) {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let firstPoint = (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;
        mouseEvents.mouseDownEvent(diagramCanvas, 600, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 600, 200);
        mouseEvents.mouseMoveEvent(diagramCanvas, 600, 300);
        mouseEvents.mouseUpEvent(diagramCanvas, 600, 300);
        diagram.select([diagram.nodes[1]]);
        let prevPoint = (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;
        mouseEvents.mouseDownEvent(diagramCanvas, 100, 270);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 350);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 450);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 450);
        let curPoint = (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;
        expect(curPoint !== prevPoint && prevPoint === 4 && curPoint === 2 && firstPoint === 2).toBe(true);
        done();
    });

});
describe('Bezier control points are draggable', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramBezBidirectional' });
        document.body.appendChild(ele);
        var nodes:NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 300,
            },
        ]
        var connectors: ConnectorModel[] = [{
            id: 'connector3',
            type: 'Bezier',
            sourceID:'node1',
            targetID:'node2',
            annotations: [{ content: 'bezier' }],
            constraints: (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb),
        }];
        diagram = new Diagram({
            width: '900px', height: '500px', nodes: nodes, connectors: connectors,
            segmentThumbShape: 'Ellipse'
        });
        diagram.appendTo('#diagramBezBidirectional');
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking bezier control points after connecting the node when the segmentEditOrientation is bidirectional', function (done) {
        diagram.connectors[0].bezierSettings.segmentEditOrientation='BiDirectional';
        diagram.select([diagram.connectors[0]]);
        mouseEvents.mouseDownEvent(diagramCanvas,400,200);
        mouseEvents.mouseMoveEvent(diagramCanvas,480,300);
        mouseEvents.mouseUpEvent(diagramCanvas,480,300);
        let curSegment = diagram.connectors[0].segments;
        expect(curSegment.length===2).toBe(true);
        done();
    });
});
describe('Bezier control points are draggable while segment orientation is horizontal', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramBezHorizontal' });
        document.body.appendChild(ele);
        var nodes:NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 300,
            },
        ]
        var connectors: ConnectorModel[] = [{
            id: 'connector3',
            type: 'Bezier',
            sourceID:'node1',
            targetID:'node2',
            annotations: [{ content: 'bezier' }],
            segments: [
                {type: 'Bezier', point: { x: 200, y: 350 }},
                {type: 'Bezier', point: { x: 220, y: 300 }},
                {type: 'Bezier', point: { x: 260, y: 350 }},
            ],
            constraints: (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb),
        }];
        diagram = new Diagram({
            width: '900px', height: '500px', nodes: nodes, connectors: connectors,
            segmentThumbShape: 'Ellipse'
        });
        diagram.appendTo('#diagramBezHorizontal');
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking bezier segment points dragging when the segment orientation is horizontal', function (done) {
        diagram.connectors[0].bezierSettings.segmentEditOrientation='BiDirectional';
        diagram.select([diagram.connectors[0]]);
        mouseEvents.mouseDownEvent(diagramCanvas,200,350);
        mouseEvents.mouseMoveEvent(diagramCanvas,100,300);
        mouseEvents.mouseUpEvent(diagramCanvas,100,300);
        let curSegment = diagram.connectors[0].segments;
        expect(curSegment.length===3).toBe(true);
        done();
    });
    it('Checking bezier segment points dragging when there is more than 3 segment points', function (done) {
        diagram.connectors[0].bezierSettings.segmentEditOrientation='BiDirectional';
        diagram.connectors[0].segments=[
            {type: 'Bezier', point: { x: 200, y: 350 }},
            {type: 'Bezier', point: { x: 220, y: 300 }},
            {type: 'Bezier', point: { x: 260, y: 350 }},
            {type: 'Bezier', point: { x: 300, y: 250 }}
        ];
        diagram.dataBind();
        diagram.select([diagram.connectors[0]]);
        mouseEvents.mouseDownEvent(diagramCanvas,200,350);
        mouseEvents.mouseMoveEvent(diagramCanvas,100,300);
        mouseEvents.mouseUpEvent(diagramCanvas,100,300);
        let curSegment = diagram.connectors[0].segments;
        expect(curSegment.length===4).toBe(true);
        done();
    });
});

describe('973493 - Dragging source point makes connector segments improper', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramSourceEnd' });
        document.body.appendChild(ele);
        function getPorts() {
            let ports = [
                { id: 'leftTop', offset: { x: 0, y: 0.2 }, visibility: PortVisibility.Visible },
                { id: 'leftMiddle', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible },
                { id: 'leftBottom', offset: { x: 0, y: 0.8 }, visibility: PortVisibility.Visible },

                { id: 'rightTop', offset: { x: 1, y: 0.2 }, visibility: PortVisibility.Visible },
                { id: 'rightMiddle', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Visible },
                { id: 'rightBottom', offset: { x: 1, y: 0.8 }, visibility: PortVisibility.Visible },

                { id: 'topLeft', offset: { x: 0.2, y: 0 }, visibility: PortVisibility.Visible },
                { id: 'topMiddle', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Visible },
                { id: 'topRight', offset: { x: 0.8, y: 0 }, visibility: PortVisibility.Visible },

                { id: 'bottomLeft', offset: { x: 0.2, y: 1 }, visibility: PortVisibility.Visible },
                { id: 'bottomMiddle', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Visible },
                { id: 'bottomRight', offset: { x: 0.8, y: 1 }, visibility: PortVisibility.Visible },
            ];
            return ports;

        }
        var nodes:NodeModel[] = [
            {
            id: "node1",
            offsetX: 300,
            offsetY: 300,
            width: 100,
            height: 100,
            ports: getPorts()
        },
         {		
            id: "node2",		
            offsetX: 650,		
            offsetY: 300,		
            width: 100,		
            height: 100,		
            ports: [		
                 { id: 'leftTop', offset: { x: 0, y: 0.2 }, visibility: PortVisibility.Visible },		
            { id: 'leftBottom', offset: { x: 0, y: 0.8 }, visibility: PortVisibility.Visible },		
            { id: 'rightTop', offset: { x: 1, y: 0.2 }, visibility: PortVisibility.Visible },		
            { id: 'rightBottom', offset: { x: 1, y: 0.8 }, visibility: PortVisibility.Visible },		
            { id: 'topLeft', offset: { x: 0.2, y: 0 }, visibility: PortVisibility.Visible },		
            { id: 'topRight', offset: { x: 0.8, y: 0 }, visibility: PortVisibility.Visible },		
            { id: 'bottomLeft', offset: { x: 0.2, y: 1 }, visibility: PortVisibility.Visible },		
            { id: 'bottomRight', offset: { x: 0.8, y: 1 }, visibility: PortVisibility.Visible },		
            ]		
        },
        ]
        var connectors: ConnectorModel[] = [{
            id: 'connector1', sourceID:'node1', targetID:'node1', sourcePortID:'leftTop', targetPortID:'rightMiddle', type:'Orthogonal',
            constraints:ConnectorConstraints.Default| ConnectorConstraints.DragSegmentThumb
        },{		
            id: 'connector2', sourceID: 'node2', targetID: 'node2', sourcePortID: 'leftTop', targetPortID: 'rightBottom', type: 'Orthogonal',		
            constraints: ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb		
        }];
        diagram = new Diagram({
            width: '900px', height: '700px', nodes: nodes, connectors: connectors,
            segmentThumbShape: 'Square', segmentThumbSize:20,
        });
        diagram.appendTo('#diagramSourceEnd');
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Adjust segment connect to leftTop port', function (done) {
        let connector = diagram.connectors[0];
        diagram.select([connector]);
        //case 1:
        mouseEvents.mouseDownEvent(diagramCanvas, 310, 370);
        mouseEvents.mouseMoveEvent(diagramCanvas, 310, 450);
        mouseEvents.mouseUpEvent(diagramCanvas, 310, 450);

        mouseEvents.mouseDownEvent(diagramCanvas, 240, 365);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 365);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 365);

        mouseEvents.mouseDownEvent(diagramCanvas, 380, 380);
        mouseEvents.mouseMoveEvent(diagramCanvas, 480, 380);
        mouseEvents.mouseUpEvent(diagramCanvas, 480, 380);
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let topLeftPort = document.getElementById('node1_topLeft');
        let topLeftBounds: any = topLeftPort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width/ 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width/ 2 - 20, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width/ 2 - 40, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, topLeftBounds.x + topLeftBounds.width/ 2, topLeftBounds.y + topLeftBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, topLeftBounds.x + topLeftBounds.width/ 2, topLeftBounds.y + topLeftBounds.height / 2);
        expect(connector.sourcePortID === 'topLeft').toBe(true);
        done();
    });
     it('Reconnect to topMiddle port', function (done) {
        let connector = diagram.connectors[0];
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let topMiddlePort = document.getElementById('node1_topMiddle');
        let topMiddleBounds: any = topMiddlePort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, topMiddleBounds.x + topMiddleBounds.width / 2, topMiddleBounds.y + topMiddleBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, topMiddleBounds.x + topMiddleBounds.width / 2, topMiddleBounds.y + topMiddleBounds.height / 2);
        expect(connector.sourcePortID === 'topMiddle').toBe(true);
        done();
    });

    it('Reconnect to topRight port', function (done) {
        let connector = diagram.connectors[0];
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let topRightPort = document.getElementById('node1_topRight');
        let topRightBounds: any = topRightPort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, topRightBounds.x + topRightBounds.width / 2, topRightBounds.y + topRightBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, topRightBounds.x + topRightBounds.width / 2, topRightBounds.y + topRightBounds.height / 2);
        expect(connector.sourcePortID === 'topRight').toBe(true);
        done();
    });

    it('Reconnect to rightTop port', function (done) {
        let connector = diagram.connectors[0];
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let rightTopPort = document.getElementById('node1_rightTop');
        let rightTopBounds: any = rightTopPort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, rightTopBounds.x + rightTopBounds.width / 2, rightTopBounds.y + rightTopBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, rightTopBounds.x + rightTopBounds.width / 2, rightTopBounds.y + rightTopBounds.height / 2);
        expect(connector.sourcePortID === 'rightTop').toBe(true);
        done();
    });

    it('Reconnect to rightMiddle port', function (done) {
        let connector = diagram.connectors[0];
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let rightMiddlePort = document.getElementById('node1_rightMiddle');
        let rightMiddleBounds: any = rightMiddlePort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, rightMiddleBounds.x + rightMiddleBounds.width / 2, rightMiddleBounds.y + rightMiddleBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, rightMiddleBounds.x + rightMiddleBounds.width / 2, rightMiddleBounds.y + rightMiddleBounds.height / 2);
        expect(connector.sourcePortID === 'rightMiddle').toBe(true);
        done();
    });

    it('Reconnect to rightBottom port', function (done) {
        let connector = diagram.connectors[0];
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let rightBottomPort = document.getElementById('node1_rightBottom');
        let rightBottomBounds: any = rightBottomPort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, rightBottomBounds.x + rightBottomBounds.width / 2, rightBottomBounds.y + rightBottomBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, rightBottomBounds.x + rightBottomBounds.width / 2, rightBottomBounds.y + rightBottomBounds.height / 2);
        expect(connector.sourcePortID === 'rightBottom').toBe(true);
        done();
    });

    it('Reconnect to bottomRight port', function (done) {
        let connector = diagram.connectors[0];
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let bottomRightPort = document.getElementById('node1_bottomRight');
        let bottomRightBounds: any = bottomRightPort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, bottomRightBounds.x + bottomRightBounds.width / 2, bottomRightBounds.y + bottomRightBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, bottomRightBounds.x + bottomRightBounds.width / 2, bottomRightBounds.y + bottomRightBounds.height / 2);
        expect(connector.sourcePortID === 'bottomRight').toBe(true);
        done();
    });

    it('Reconnect to bottomMiddle port', function (done) {
        let connector = diagram.connectors[0];
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let bottomMiddlePort = document.getElementById('node1_bottomMiddle');
        let bottomMiddleBounds: any = bottomMiddlePort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, bottomMiddleBounds.x + bottomMiddleBounds.width / 2, bottomMiddleBounds.y + bottomMiddleBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, bottomMiddleBounds.x + bottomMiddleBounds.width / 2, bottomMiddleBounds.y + bottomMiddleBounds.height / 2);
        expect(connector.sourcePortID === 'bottomMiddle').toBe(true);
        done();
    });

    it('Reconnect to bottomLeft port', function (done) {
        let connector = diagram.connectors[0];
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let bottomLeftPort = document.getElementById('node1_bottomLeft');
        let bottomLeftBounds: any = bottomLeftPort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, bottomLeftBounds.x + bottomLeftBounds.width / 2, bottomLeftBounds.y + bottomLeftBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, bottomLeftBounds.x + bottomLeftBounds.width / 2, bottomLeftBounds.y + bottomLeftBounds.height / 2);
        expect(connector.sourcePortID === 'bottomLeft').toBe(true);
        done();
    });

    it('Reconnect to leftBottom port', function (done) {
        let connector = diagram.connectors[0];
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let leftBottomPort = document.getElementById('node1_leftBottom');
        let leftBottomBounds: any = leftBottomPort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, leftBottomBounds.x + leftBottomBounds.width / 2, leftBottomBounds.y + leftBottomBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, leftBottomBounds.x + leftBottomBounds.width / 2, leftBottomBounds.y + leftBottomBounds.height / 2);
        expect(connector.sourcePortID === 'leftBottom').toBe(true);
        done();
    });
    
    it('Reconnect to leftMiddle port', function (done) {
        let connector = diagram.connectors[0];
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let leftMiddlePort = document.getElementById('node1_leftMiddle');
        let leftMiddleBounds: any = leftMiddlePort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, leftMiddleBounds.x + leftMiddleBounds.width / 2, leftMiddleBounds.y + leftMiddleBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, leftMiddleBounds.x + leftMiddleBounds.width / 2, leftMiddleBounds.y + leftMiddleBounds.height / 2);
        expect(connector.sourcePortID === 'leftMiddle').toBe(true);
        done();
    });

    it('Adjust segment and connect source to node body near topLeft port', function (done) {
        let connector2 = diagram.connectors[1];
        diagram.select([connector2]);

        // Adjust segments
        mouseEvents.mouseDownEvent(diagramCanvas, 585, 330);
        mouseEvents.mouseMoveEvent(diagramCanvas, 500, 330);
        mouseEvents.mouseUpEvent(diagramCanvas, 500, 330);

        mouseEvents.mouseDownEvent(diagramCanvas, 615, 375);
        mouseEvents.mouseMoveEvent(diagramCanvas, 615, 500);
        mouseEvents.mouseUpEvent(diagramCanvas, 615, 500);

        mouseEvents.mouseDownEvent(diagramCanvas, 555, 275);
        mouseEvents.mouseMoveEvent(diagramCanvas, 555, 180);
        mouseEvents.mouseUpEvent(diagramCanvas, 55, 180);

        // First, connect to the topLeft port
        let sourceThumb_case1_init = document.getElementById('connectorSourceThumb');
        let sourceBounds_case1_init: any = sourceThumb_case1_init.getBoundingClientRect();
        let node2Port_case1 = document.getElementById('node2_topLeft');
        let node2PortBounds_case1: any = node2Port_case1.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceBounds_case1_init.x + sourceBounds_case1_init.width / 2, sourceBounds_case1_init.y + sourceBounds_case1_init.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, node2PortBounds_case1.x + node2PortBounds_case1.width / 2, node2PortBounds_case1.y + node2PortBounds_case1.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, node2PortBounds_case1.x + node2PortBounds_case1.width / 2, node2PortBounds_case1.y + node2PortBounds_case1.height / 2);
        
        // Now, drag from the port to the node's body
        let sourceThumb_case1_final = document.getElementById('connectorSourceThumb');
        let sourceBounds_case1_final: any = sourceThumb_case1_final.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceBounds_case1_final.x + sourceBounds_case1_final.width / 2, sourceBounds_case1_final.y + sourceBounds_case1_final.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, sourceBounds_case1_final.x + sourceBounds_case1_final.width / 2, sourceBounds_case1_final.y + sourceBounds_case1_final.height / 2 - 20);
        mouseEvents.mouseMoveEvent(diagramCanvas, 680, 320); // Move to a point on the node, not a port
        mouseEvents.mouseUpEvent(diagramCanvas, 680, 320);

        expect(connector2.sourcePortID === '' && connector2.sourceID === 'node2').toBe(true);
        done();
    });

    it('Reconnect source to node body near rightTop port', function (done) {
        let connector2 = diagram.connectors[1];
        // First, connect to the rightTop port to set up the scenario
        let sourceThumb_case2_init = document.getElementById('connectorSourceThumb');
        let sourceBounds_case2_init: any = sourceThumb_case2_init.getBoundingClientRect();
        let node2Port_case2 = document.getElementById('node2_rightTop');
        let node2PortBounds_case2: any = node2Port_case2.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceBounds_case2_init.x + sourceBounds_case2_init.width / 2, sourceBounds_case2_init.y + sourceBounds_case2_init.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, node2PortBounds_case2.x + node2PortBounds_case2.width / 2, node2PortBounds_case2.y + node2PortBounds_case2.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, node2PortBounds_case2.x + node2PortBounds_case2.width / 2, node2PortBounds_case2.y + node2PortBounds_case2.height / 2);

        // Now, drag from the port to the node's body
        let sourceThumb_case2_final = document.getElementById('connectorSourceThumb');
        let sourceBounds_case2_final: any = sourceThumb_case2_final.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceBounds_case2_final.x + sourceBounds_case2_final.width / 2, sourceBounds_case2_final.y + sourceBounds_case2_final.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, sourceBounds_case2_final.x + sourceBounds_case2_final.width / 2, sourceBounds_case2_final.y + sourceBounds_case2_final.height / 2 + 20);
        mouseEvents.mouseMoveEvent(diagramCanvas, sourceBounds_case2_final.x + sourceBounds_case2_final.width / 2 - 5, sourceBounds_case2_final.y + sourceBounds_case2_final.height / 2 + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, sourceBounds_case2_final.x + sourceBounds_case2_final.width / 2 - 5, sourceBounds_case2_final.y + sourceBounds_case2_final.height / 2 + 20);
        
        expect(connector2.sourcePortID === '' && connector2.sourceID === 'node2').toBe(true);
        done();
    });

    it('Reconnect source to node body near bottomRight port', function (done) {
        let connector2 = diagram.connectors[1];
        // First, connect to the bottomRight port
        let sourceThumb_case3_init = document.getElementById('connectorSourceThumb');
        let sourceBounds_case3_init: any = sourceThumb_case3_init.getBoundingClientRect();
        let node2Port_case3 = document.getElementById('node2_bottomRight');
        let node2PortBounds_case3: any = node2Port_case3.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceBounds_case3_init.x + sourceBounds_case3_init.width / 2, sourceBounds_case3_init.y + sourceBounds_case3_init.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, node2PortBounds_case3.x + node2PortBounds_case3.width / 2, node2PortBounds_case3.y + node2PortBounds_case3.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, node2PortBounds_case3.x + node2PortBounds_case3.width / 2, node2PortBounds_case3.y + node2PortBounds_case3.height / 2);

        // Now, drag from the port to the node's body
        let sourceThumb_case3_final = document.getElementById('connectorSourceThumb');
        let sourceBounds_case3_final: any = sourceThumb_case3_final.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceBounds_case3_final.x + sourceBounds_case3_final.width / 2, sourceBounds_case3_final.y + sourceBounds_case3_final.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, sourceBounds_case3_final.x + sourceBounds_case3_final.width / 2 - 10, sourceBounds_case3_final.y + sourceBounds_case3_final.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, sourceBounds_case3_final.x + sourceBounds_case3_final.width / 2 - 10, sourceBounds_case3_final.y + sourceBounds_case3_final.height / 2);

        expect(connector2.sourcePortID === '' && connector2.sourceID === 'node2').toBe(true);
        done();
    });

    it('Reconnect source to node body near leftBottom port', function (done) {
        let connector2 = diagram.connectors[1];
        // First, connect to the leftBottom port
        let sourceThumb_case4_init = document.getElementById('connectorSourceThumb');
        let sourceBounds_case4_init: any = sourceThumb_case4_init.getBoundingClientRect();
        let node2Port_case4 = document.getElementById('node2_leftBottom');
        let node2PortBounds_case4: any = node2Port_case4.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceBounds_case4_init.x + sourceBounds_case4_init.width / 2, sourceBounds_case4_init.y + sourceBounds_case4_init.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, node2PortBounds_case4.x + node2PortBounds_case4.width / 2, node2PortBounds_case4.y + node2PortBounds_case4.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, node2PortBounds_case4.x + node2PortBounds_case4.width / 2, node2PortBounds_case4.y + node2PortBounds_case4.height / 2);

        // Now, drag from the port to the node's body
        let sourceThumb_case4_final = document.getElementById('connectorSourceThumb');
        let sourceBounds_case4_final: any = sourceThumb_case4_final.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceBounds_case4_final.x + sourceBounds_case4_final.width / 2, sourceBounds_case4_final.y + sourceBounds_case4_final.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, sourceBounds_case4_final.x + sourceBounds_case4_final.width / 2, sourceBounds_case4_final.y + sourceBounds_case4_final.height / 2 - 10);
        mouseEvents.mouseUpEvent(diagramCanvas, sourceBounds_case4_final.x + sourceBounds_case4_final.width / 2, sourceBounds_case4_final.y + sourceBounds_case4_final.height / 2 - 10);

        expect(connector2.sourcePortID === '' && connector2.sourceID === 'node2').toBe(true);
        done();
    });
});
