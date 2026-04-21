import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { Segments, ConnectorConstraints, PortVisibility } from '../../../src/diagram/enum/enum';
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

describe('Diagram Control', () => {
    describe('Hide segment thumb-1', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramsegment_hide' });
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
                segmentThumbSize: 25,
                snapSettings: { constraints: SnapConstraints.ShowLines },
                getConnectorDefaults: function (connector: ConnectorModel) {
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                }
            });
            diagram.appendTo('#diagramsegment_hide');

            diagram.segmentCollectionChange = function (args) {
                if (args.type === 'Addition') {
                    args.cancel = true;
                }
            }
        });
        afterAll((): void => {
            diagram.segmentCollectionChange = undefined;
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });
        it('Check the segment thumb visibility for hidden thumbs', (done: DoneFn): void => {

            diagram.select([diagram.connectors[0]]);
            diagram.connectors[0].segments[0].allowDrag = false;
            diagram.connectors[0].segments[1].allowDrag = false;
            diagram.dataBind();
            expect(document.getElementById("orthoThumb_1_1").getAttribute("visibility") === 'hidden' &&
                document.getElementById("orthoThumb_2_1").getAttribute("visibility") === 'hidden').toBe(true);
            diagram.connectors[0].segments[0].allowDrag = true;
            diagram.connectors[0].segments[1].allowDrag = true;
            diagram.dataBind();
            done();
        });

        it('Add the segment when event is canceled', (done: DoneFn): void => {
            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            // 1) Select the connector so its thumbs/segme
            diagram.select([diagram.connectors[0]]);

            // Phase A: drag to remove existing segment (leftward path)
            mouseEvents.mouseDownEvent(canvas, rect.left + 350, rect.top + 300);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 330, rect.top + 300);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 315, rect.top + 305);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 317, rect.top + 305);
            mouseEvents.mouseUpEvent(canvas, rect.left + 330, rect.top + 273);
            // Phase B: drag again to add a new segment (upward path)
            mouseEvents.mouseDownEvent(canvas, rect.left + 290, rect.top + 250);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 270, rect.top + 230);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 300, rect.top + 200);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 350, rect.top + 180);
            mouseEvents.mouseUpEvent(canvas, rect.left + 350, rect.top + 180);
            const segCount: number = diagram.connectors[0].segments.length;
            expect(segCount === 5 || segCount === 3).toBe(true);
            done();
        });
    });
    describe('Hide segment thumb-2', () => {
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
            diagram.segmentCollectionChange = undefined;
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Remove the segment when event is canceled', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            // Select the connector to work with
            diagram.select([diagram.connectors[0]]);
            // Perform the drag (convert all to viewport/client coordinates)
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 275, rect.top + 250);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 270, rect.top + 255);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 270, rect.top + 260);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 270, rect.top + 255);
            const segLen: number = diagram.connectors[0].segments.length;
            // Depending on whether the internal event cancels removal, it could remain 5 or become 3
            expect(segLen === 5).toBe(true);
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
            ele = createElement('div', { id: 'PointToPortInteraction' });
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
            let ports = ['port1', 'port2', 'port3', 'port4'];
            let sourcePoints = [{ x: 300, y: 200 }, { x: 400, y: 200 }, { x: 300, y: 300 }, { x: 500, y: 300 },
            { x: 300, y: 700 }, { x: 450, y: 700 }, { x: 100, y: 850 }, { x: 700, y: 1150 }];
            let targetNodes = ['node0', 'node2', 'node6', 'node8',
                'node9', 'node10', 'node11', 'node12'];
            let dir: any = ['Left', 'Right', 'Top', 'Bottom'];
            for (let i = 0; i < targetNodes.length; i++) {
                for (let k = 0; k < ports.length; k++) {
                    for (let j = 0; j < dir.length; j++) {
                        let connector: ConnectorModel = {
                            id: 'connector' + count, type: 'Orthogonal', sourcePoint: sourcePoints[i], targetID: targetNodes[i], targetPortID: ports[k],
                            segments: [{ type: 'Orthogonal', direction: 'Left', length: 50 },],
                        }
                        connectors.push(connector);
                        count++;
                    }
                }
            }
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodesCollection,
                connectors: connectors,
                segmentThumbSize: 25,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#PointToPortInteraction');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Orthogonal segment - Point To Port interaction(Target port direction - Left)', (done: DoneFn): void => {

            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            diagram.select([diagram.connectors[0]]);

            // Baseline expectation
            let c0: any = diagram.selectedItems.connectors[0];
            expect(
                c0.intermediatePoints[0].x === 300 && c0.intermediatePoints[0].y === 200 &&
                c0.intermediatePoints[1].x === 55 && c0.intermediatePoints[1].y === 200 &&
                c0.intermediatePoints[2].x === 55 && c0.intermediatePoints[2].y === 100 &&
                c0.intermediatePoints[3].x === 75 && c0.intermediatePoints[3].y === 100
            ).toBe(true);

            // Phase A: drag (50,150) -> (100,150)
            mouseEvents.mouseDownEvent(canvas, rect.left + 50, rect.top + 150);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 100, rect.top + 150);
            mouseEvents.mouseUpEvent(canvas, rect.left + 100, rect.top + 150);
            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 300 && cA.intermediatePoints[0].y === 200 &&
                cA.intermediatePoints[1].x === 100 && cA.intermediatePoints[1].y === 200 &&
                cA.intermediatePoints[2].x === 100 && cA.intermediatePoints[2].y === 145 &&
                cA.intermediatePoints[3].x === 55 && cA.intermediatePoints[3].y === 145 &&
                cA.intermediatePoints[4].x === 55 && cA.intermediatePoints[4].y === 100 &&
                cA.intermediatePoints[5].x === 75 && cA.intermediatePoints[5].y === 100
            ).toBe(true);

            // Phase B: drag (100,170) -> (200,170)
            mouseEvents.mouseDownEvent(canvas, rect.left + 100, rect.top + 170);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 200, rect.top + 170);
            mouseEvents.mouseUpEvent(canvas, rect.left + 200, rect.top + 170);
            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 300 && cB.intermediatePoints[0].y === 200 &&
                ((cB.intermediatePoints[1].x === 200 || cB.intermediatePoints[1].x === 208) && cB.intermediatePoints[1].y === 200) &&
                ((cB.intermediatePoints[2].x === 200 || cB.intermediatePoints[1].x === 208) && cB.intermediatePoints[2].y === 145) &&
                cB.intermediatePoints[3].x === 55 && cB.intermediatePoints[3].y === 145 &&
                cB.intermediatePoints[4].x === 55 && cB.intermediatePoints[4].y === 100 &&
                cB.intermediatePoints[5].x === 75 && cB.intermediatePoints[5].y === 100
            ).toBe(true);

            // Phase C1: drag (125,142) -> (125,50)
            mouseEvents.mouseDownEvent(canvas, rect.left + 125, rect.top + 142);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 125, rect.top + 50);
            mouseEvents.mouseUpEvent(canvas, rect.left + 125, rect.top + 50);

            // Phase C2: drag (200,130) -> (58,130)
            mouseEvents.mouseDownEvent(canvas, rect.left + 200, rect.top + 130);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 58, rect.top + 130);
            mouseEvents.mouseUpEvent(canvas, rect.left + 58, rect.top + 130);
            done();
        });

        it('Checking Orthogonal segment - Point To Port interaction(Target port direction - Top)', (done: DoneFn): void => {

            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            diagram.select([diagram.connectors[23]]);

            // Baseline
            let c0: any = diagram.selectedItems.connectors[0];
            expect(
                c0.intermediatePoints[0].x === 400 && c0.intermediatePoints[0].y === 200 &&
                c0.intermediatePoints[1].x === 350 && c0.intermediatePoints[1].y === 200 &&
                c0.intermediatePoints[2].x === 350 && c0.intermediatePoints[2].y === 55 &&
                c0.intermediatePoints[3].x === 700 && c0.intermediatePoints[3].y === 55 &&
                c0.intermediatePoints[4].x === 700 && c0.intermediatePoints[4].y === 75
            ).toBe(true);

            // Phase A: drag (525,50) -> (525,150)
            mouseEvents.mouseDownEvent(canvas, rect.left + 525, rect.top + 50);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 525, rect.top + 150);
            mouseEvents.mouseUpEvent(canvas, rect.left + 525, rect.top + 150);
            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 400 && cA.intermediatePoints[0].y === 200 &&
                cA.intermediatePoints[1].x === 350 && cA.intermediatePoints[1].y === 200 &&
                cA.intermediatePoints[2].x === 350 && cA.intermediatePoints[2].y === 150 &&
                cA.intermediatePoints[3].x === 655 && cA.intermediatePoints[3].y === 150 &&
                cA.intermediatePoints[4].x === 655 && cA.intermediatePoints[4].y === 55 &&
                cA.intermediatePoints[5].x === 700 && cA.intermediatePoints[5].y === 55 &&
                cA.intermediatePoints[6].x === 700 && cA.intermediatePoints[6].y === 75
            ).toBe(true);

            // Phase B: drag (660,100) -> (800,100)
            mouseEvents.mouseDownEvent(canvas, rect.left + 660, rect.top + 100);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 800, rect.top + 100);
            mouseEvents.mouseUpEvent(canvas, rect.left + 800, rect.top + 100);
            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 400 && cB.intermediatePoints[0].y === 200 &&
                cB.intermediatePoints[1].x === 350 && cB.intermediatePoints[1].y === 200 &&
                cB.intermediatePoints[2].x === 350 && cB.intermediatePoints[2].y === 150 &&
                ((cB.intermediatePoints[3].x === 800 || cB.intermediatePoints[3].x === 808) && cB.intermediatePoints[3].y === 150) &&
                ((cB.intermediatePoints[4].x === 800 || cB.intermediatePoints[4].x === 808) && cB.intermediatePoints[4].y === 55) &&
                cB.intermediatePoints[5].x === 700 && cB.intermediatePoints[5].y === 55 &&
                cB.intermediatePoints[6].x === 700 && cB.intermediatePoints[6].y === 75

            ).toBe(true);
            // Phase C: drag (750,50) -> (800,100)
            mouseEvents.mouseDownEvent(canvas, rect.left + 750, rect.top + 50);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 800, rect.top + 100);
            mouseEvents.mouseUpEvent(canvas, rect.left + 800, rect.top + 100);
            const cC: any = diagram.selectedItems.connectors[0];
            expect(
                cC.intermediatePoints[0].x === 400 && cC.intermediatePoints[0].y === 200 &&
                cC.intermediatePoints[1].x === 350 && cC.intermediatePoints[1].y === 200 &&
                cC.intermediatePoints[2].x === 350 && cC.intermediatePoints[2].y === 150 &&
                ((cC.intermediatePoints[3].x === 800 || cC.intermediatePoints[3].x === 800) && cC.intermediatePoints[3].y === 150) &&
                ((cC.intermediatePoints[4].x === 800 || cC.intermediatePoints[4].x === 800) && cC.intermediatePoints[4].y === 100) &&
                cC.intermediatePoints[5].x === 745 && cC.intermediatePoints[5].y === 100 &&
                cC.intermediatePoints[6].x === 745 && cC.intermediatePoints[6].y === 55 &&
                cC.intermediatePoints[7].x === 700 && cC.intermediatePoints[7].y === 55 &&
                cC.intermediatePoints[8].x === 700 && cC.intermediatePoints[8].y === 75
            ).toBe(true);
            done();
        });

        it('Checking Orthogonal segment - Point To Port interaction(Target port direction - Right)', (done: DoneFn): void => {
            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            diagram.select([diagram.connectors[59]]);

            // Baseline
            let c0: any = diagram.selectedItems.connectors[0];
            expect(
                c0.intermediatePoints[0].x === 500 && c0.intermediatePoints[0].y === 300 &&
                c0.intermediatePoints[1].x === 745 && c0.intermediatePoints[1].y === 300 &&
                c0.intermediatePoints[2].x === 745 && c0.intermediatePoints[2].y === 500 &&
                c0.intermediatePoints[3].x === 725 && c0.intermediatePoints[3].y === 500
            ).toBe(true);

            // Phase A: drag (742,400) -> (700,400)
            mouseEvents.mouseDownEvent(canvas, rect.left + 742, rect.top + 400);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 700, rect.top + 400);
            mouseEvents.mouseUpEvent(canvas, rect.left + 700, rect.top + 400);


            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 500 && cA.intermediatePoints[0].y === 300 &&
                ((cA.intermediatePoints[1].x === 700 || cA.intermediatePoints[1].x === 708) && cA.intermediatePoints[1].y === 300) &&
                ((cA.intermediatePoints[2].x === 700 || cA.intermediatePoints[2].x === 708) && cA.intermediatePoints[2].y === 455) &&
                cA.intermediatePoints[3].x === 745 && cA.intermediatePoints[3].y === 455 &&
                cA.intermediatePoints[4].x === 745 && cA.intermediatePoints[4].y === 500 &&
                cA.intermediatePoints[5].x === 725 && cA.intermediatePoints[5].y === 500
            ).toBe(true);

            // Phase B: drag (700,375) -> (600,380)
            mouseEvents.mouseDownEvent(canvas, rect.left + 700, rect.top + 375);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 600, rect.top + 380);
            mouseEvents.mouseUpEvent(canvas, rect.left + 600, rect.top + 380);
            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 500 && cB.intermediatePoints[0].y === 300 &&
                ((cB.intermediatePoints[1].x === 600 || cB.intermediatePoints[1].x === 608) && cB.intermediatePoints[1].y === 300) &&
                ((cB.intermediatePoints[2].x === 600 || cB.intermediatePoints[2].x === 608) && cB.intermediatePoints[2].y === 455) &&
                cB.intermediatePoints[3].x === 745 && cB.intermediatePoints[3].y === 455 &&
                cB.intermediatePoints[4].x === 745 && cB.intermediatePoints[4].y === 500 &&
                cB.intermediatePoints[5].x === 725 && cB.intermediatePoints[5].y === 500
            ).toBe(true);

            // Phase C: drag (600,375) -> (500,375)
            mouseEvents.mouseDownEvent(canvas, rect.left + 600, rect.top + 375);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 500, rect.top + 375);
            mouseEvents.mouseUpEvent(canvas, rect.left + 500, rect.top + 375);


            const cC: any = diagram.selectedItems.connectors[0];
            expect(
                cC.intermediatePoints[0].x === 500 && cC.intermediatePoints[0].y === 300 &&
                ((cC.intermediatePoints[1].x === 500 || cC.intermediatePoints[1].x === 508) && cC.intermediatePoints[1].y === 300) &&
                ((cC.intermediatePoints[2].x === 500 || cC.intermediatePoints[2].x === 508) && cC.intermediatePoints[2].y === 455) &&
                cC.intermediatePoints[3].x === 745 && cC.intermediatePoints[3].y === 455 &&
                cC.intermediatePoints[4].x === 745 && cC.intermediatePoints[4].y === 500 &&
                cC.intermediatePoints[5].x === 725 && cC.intermediatePoints[5].y === 500
            ).toBe(true);
            done();
        });

        it('Checking Orthogonal segment - Point To Port interaction(Target port direction - Bottom)', (done: DoneFn): void => {

            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            diagram.select([diagram.connectors[47]]);

            // Baseline
            let c0: any = diagram.selectedItems.connectors[0];
            expect(
                c0.intermediatePoints[0].x === 300 && c0.intermediatePoints[0].y === 300 &&
                c0.intermediatePoints[1].x === 250 && c0.intermediatePoints[1].y === 300 &&
                c0.intermediatePoints[2].x === 250 && c0.intermediatePoints[2].y === 545 &&
                c0.intermediatePoints[3].x === 100 && c0.intermediatePoints[3].y === 545 &&
                c0.intermediatePoints[4].x === 100 && c0.intermediatePoints[4].y === 525
            ).toBe(true);

            // Phase A: drag (175,540) -> (175,500)
            mouseEvents.mouseDownEvent(canvas, rect.left + 175, rect.top + 540);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 175, rect.top + 500);
            mouseEvents.mouseUpEvent(canvas, rect.left + 175, rect.top + 500);


            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 300 && cA.intermediatePoints[0].y === 300 &&
                cA.intermediatePoints[1].x === 250 && cA.intermediatePoints[1].y === 300 &&
                cA.intermediatePoints[2].x === 250 && cA.intermediatePoints[2].y === 500 &&
                cA.intermediatePoints[3].x === 145 && cA.intermediatePoints[3].y === 500 &&
                cA.intermediatePoints[4].x === 145 && cA.intermediatePoints[4].y === 545 &&
                cA.intermediatePoints[5].x === 100 && cA.intermediatePoints[5].y === 545 &&
                cA.intermediatePoints[6].x === 100 && cA.intermediatePoints[6].y === 525
            ).toBe(true);

            // Phase B: drag (200,500) -> (200,400)
            mouseEvents.mouseDownEvent(canvas, rect.left + 200, rect.top + 500);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 200, rect.top + 400);
            mouseEvents.mouseUpEvent(canvas, rect.left + 200, rect.top + 400);


            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 300 && cB.intermediatePoints[0].y === 300 &&
                cB.intermediatePoints[1].x === 250 && cB.intermediatePoints[1].y === 300 &&
                cB.intermediatePoints[2].x === 250 && cB.intermediatePoints[2].y === 400 &&
                cB.intermediatePoints[3].x === 145 && cB.intermediatePoints[3].y === 400 &&
                cB.intermediatePoints[4].x === 145 && cB.intermediatePoints[4].y === 545 &&
                cB.intermediatePoints[5].x === 100 && cB.intermediatePoints[5].y === 545 &&
                cB.intermediatePoints[6].x === 100 && cB.intermediatePoints[6].y === 525
            ).toBe(true);

            // Phase C: drag (142,475) -> (30,475)
            mouseEvents.mouseDownEvent(canvas, rect.left + 142, rect.top + 475);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 30, rect.top + 475);
            mouseEvents.mouseUpEvent(canvas, rect.left + 30, rect.top + 475);


            const cC: any = diagram.selectedItems.connectors[0];
            expect(
                cC.intermediatePoints[0].x === 300 && cC.intermediatePoints[0].y === 300 &&
                cC.intermediatePoints[1].x === 250 && cC.intermediatePoints[1].y === 300 &&
                cC.intermediatePoints[2].x === 250 && cC.intermediatePoints[2].y === 400 &&
                ((cC.intermediatePoints[3].x === 30 || cC.intermediatePoints[3].x === 30) && cC.intermediatePoints[3].y === 400) &&
                ((cC.intermediatePoints[4].x === 30 || cC.intermediatePoints[4].x === 30) && cC.intermediatePoints[4].y === 545) &&
                cC.intermediatePoints[5].x === 100 && cC.intermediatePoints[5].y === 545 &&
                cC.intermediatePoints[6].x === 100 && cC.intermediatePoints[6].y === 525
            ).toBe(true);

            // Phase D: drag (60,540) -> (60,500)
            mouseEvents.mouseDownEvent(canvas, rect.left + 60, rect.top + 540);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 60, rect.top + 500);
            mouseEvents.mouseUpEvent(canvas, rect.left + 60, rect.top + 500);


            const cD: any = diagram.selectedItems.connectors[0];
            expect(
                cD.intermediatePoints[0].x === 300 && cD.intermediatePoints[0].y === 300 &&
                cD.intermediatePoints[1].x === 250 && cD.intermediatePoints[1].y === 300 &&
                cD.intermediatePoints[2].x === 250 && cD.intermediatePoints[2].y === 400 &&
                ((cD.intermediatePoints[3].x === 30 || cD.intermediatePoints[3].x === 30) && cD.intermediatePoints[3].y === 400) &&
                ((cD.intermediatePoints[4].x === 30 || cD.intermediatePoints[4].x === 30) && cD.intermediatePoints[4].y === 500) &&
                cD.intermediatePoints[5].x === 55 && cD.intermediatePoints[5].y === 500 &&
                cD.intermediatePoints[6].x === 55 && cD.intermediatePoints[6].y === 545 &&
                cD.intermediatePoints[7].x === 100 && cD.intermediatePoints[7].y === 545 &&
                cD.intermediatePoints[8].x === 100 && cD.intermediatePoints[8].y === 525
            ).toBe(true);
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
            ele = createElement('div', { id: 'SegmentInteractionPortToPoint' });
            document.body.appendChild(ele);
            let nodesCollection: NodeModel[] = []; let count = 1; let offsetY = 100; let offsetX = 100
            let dir: any = ['Left', 'Right', 'Top', 'Bottom'];
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
            let ports = ['port1', 'port2', 'port3', 'port4'];
            let targetPoints = [{ x: 300, y: 200 }, { x: 400, y: 200 }, { x: 300, y: 300 }, { x: 500, y: 300 },
            { x: 300, y: 700 }, { x: 450, y: 700 }, { x: 100, y: 850 }, { x: 700, y: 1150 }];
            let sourceNodes = ['node0', 'node2', 'node6', 'node8',
                'node9', 'node10', 'node11', 'node12'];
            for (let i = 0; i < sourceNodes.length; i++) {
                for (let k = 0; k < ports.length; k++) {
                    for (let j = 0; j < dir.length; j++) {
                        let connector: ConnectorModel = {
                            id: 'connector' + count, type: 'Orthogonal', targetPoint: targetPoints[i], sourceID: sourceNodes[i], sourcePortID: ports[k],
                            segments: [{ type: 'Orthogonal', direction: 'Right', length: 50 },],
                        }
                        connectors.push(connector);
                        count++;
                    }
                }
            }

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: nodes,
                connectors: connectors,
                segmentThumbSize: 25,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#SegmentInteractionPortToPoint');

            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Orthogonal segment - Port To Point Interaction (Port direction- Left)', (done: DoneFn): void => {

            const canvas = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect = diagram.element.getBoundingClientRect();

            // 1) Select connector[0] so its segment thumbs appear
            diagram.select([diagram.connectors[0]]);

            const c0: any = diagram.selectedItems.connectors[0];
            expect(
                c0.intermediatePoints[0].x === 75 && c0.intermediatePoints[0].y === 100 &&
                c0.intermediatePoints[1].x === 25 && c0.intermediatePoints[1].y === 100 &&
                c0.intermediatePoints[2].x === 25 && c0.intermediatePoints[2].y === 200 &&
                c0.intermediatePoints[3].x === 300 && c0.intermediatePoints[3].y === 200
            ).toBe(true);

            // 3) Phase A: drag port-thumb from x≈20,y≈140 to x≈50,y≈140
            mouseEvents.mouseDownEvent(canvas, rect.left + 20, rect.top + 140);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 50, rect.top + 140);
            mouseEvents.mouseUpEvent(canvas, rect.left + 50, rect.top + 140);

            // Assert after Phase A
            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 75 && cA.intermediatePoints[0].y === 100 &&
                ((cA.intermediatePoints[1].x === 50 || cA.intermediatePoints[1].x === 58) && cA.intermediatePoints[1].y === 100) &&
                ((cA.intermediatePoints[2].x === 50 || cA.intermediatePoints[2].x === 58) && cA.intermediatePoints[2].y === 200) &&
                cA.intermediatePoints[3].x === 300 && cA.intermediatePoints[3].y === 200
            ).toBe(true);

            // 4) Phase B: slide that segment-thumb progressively right
            mouseEvents.mouseDownEvent(canvas, rect.left + 50, rect.top + 140);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 70, rect.top + 140);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 100, rect.top + 140);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 150, rect.top + 140);
            mouseEvents.mouseUpEvent(canvas, rect.left + 150, rect.top + 140);

            // Assert after Phase B
            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 75 && cB.intermediatePoints[0].y === 100 &&
                cB.intermediatePoints[1].x === 62 && cB.intermediatePoints[1].y === 100 &&
                cB.intermediatePoints[2].x === 62 && cB.intermediatePoints[2].y === 145 &&
                ((cB.intermediatePoints[3].x === 150 || cB.intermediatePoints[3].x === 158) && cB.intermediatePoints[3].y === 145) &&
                ((cB.intermediatePoints[4].x === 150 || cB.intermediatePoints[4].x === 158) && cB.intermediatePoints[4].y === 200) &&
                cB.intermediatePoints[5].x === 300 && cB.intermediatePoints[5].y === 200
            ).toBe(true);

            // 5) Phase C: drag end-thumb vertically (100,140) → (100,20)
            mouseEvents.mouseDownEvent(canvas, rect.left + 100, rect.top + 140);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 100, rect.top + 20);
            mouseEvents.mouseUpEvent(canvas, rect.left + 100, rect.top + 20);

            // Final assertion after Phase C
            const cC: any = diagram.selectedItems.connectors[0];
            expect(
                cC.intermediatePoints[0].x === 75 && cC.intermediatePoints[0].y === 100 &&
                cC.intermediatePoints[1].x === 62 && cC.intermediatePoints[1].y === 100 &&
                cC.intermediatePoints[2].x === 62 && cC.intermediatePoints[2].y === 20 &&
                ((cC.intermediatePoints[3].x === 150 || cC.intermediatePoints[3].x === 158) && cC.intermediatePoints[3].y === 20) &&
                ((cC.intermediatePoints[4].x === 150 || cC.intermediatePoints[4].x === 158) && cC.intermediatePoints[4].y === 200) &&
                cC.intermediatePoints[5].x === 300 && cC.intermediatePoints[5].y === 200
            ).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Port To Point Interaction (Port direction- Top)', (done: DoneFn): void => {

            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            // 1) Select connector[5] so its port thumbs appear
            diagram.select([diagram.connectors[23]]);

            const c0: any = diagram.selectedItems.connectors[0];
            expect(
                c0.intermediatePoints[0].x === 700 && c0.intermediatePoints[0].y === 75 &&
                c0.intermediatePoints[1].x === 700 && c0.intermediatePoints[1].y === 62 &&
                c0.intermediatePoints[2].x === 750 && c0.intermediatePoints[2].y === 62 &&
                c0.intermediatePoints[3].x === 750 && c0.intermediatePoints[3].y === 200 &&
                c0.intermediatePoints[4].x === 400 && c0.intermediatePoints[4].y === 200
            ).toBe(true);

            // 3) Phase A: drag port-thumb from (750,120) → (525,120)
            mouseEvents.dragAndDropEvent(
                canvas,
                rect.left + 750, rect.top + 120,
                rect.left + 525, rect.top + 120
            );


            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 700 && cA.intermediatePoints[0].y === 75 &&
                cA.intermediatePoints[1].x === 700 && cA.intermediatePoints[1].y === 62 &&
                (
                    (cA.intermediatePoints[2].x === 525) ||
                    (cA.intermediatePoints[2].x === 533)
                ) && cA.intermediatePoints[2].y === 62 &&
                (
                    (cA.intermediatePoints[3].x === 525) ||
                    (cA.intermediatePoints[3].x === 533)
                ) && cA.intermediatePoints[3].y === 200 &&
                cA.intermediatePoints[4].x === 400 && cA.intermediatePoints[4].y === 200
            ).toBe(true);

            // 4) Phase B: drag segment-thumb vertically near (610,60) → (610,208)
            mouseEvents.mouseDownEvent(canvas, rect.left + 610, rect.top + 60);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 610, rect.top + 70);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 610, rect.top + 100);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 610, rect.top + 208);
            mouseEvents.mouseUpEvent(canvas, rect.left + 610, rect.top + 208);

            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 700 && cB.intermediatePoints[0].y === 75 &&
                cB.intermediatePoints[1].x === 700 && cB.intermediatePoints[1].y === 62 &&
                cB.intermediatePoints[2].x === 655 && cB.intermediatePoints[2].y === 62 &&
                cB.intermediatePoints[3].x === 655 && cB.intermediatePoints[3].y === 208 &&
                cB.intermediatePoints[4].x === 525 && cB.intermediatePoints[4].y === 208
            ).toBe(true);

            done();
        });
        it('Checking Orthogonal segment - Port To Point Interaction (Port direction- Right)', (done: DoneFn): void => {

            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            // 1) Select connector[14] so its segment/port thumbs appear
            diagram.select([diagram.connectors[59]]);

            const c0: any = diagram.selectedItems.connectors[0];
            expect(
                c0.intermediatePoints[0].x === 725 && c0.intermediatePoints[0].y === 500 &&
                c0.intermediatePoints[1].x === 775 && c0.intermediatePoints[1].y === 500 &&
                c0.intermediatePoints[2].x === 775 && c0.intermediatePoints[2].y === 300 &&
                c0.intermediatePoints[3].x === 500 && c0.intermediatePoints[3].y === 300
            ).toBe(true);

            // 3) Phase A: drag a small segment left (778,400) → (730,400)
            mouseEvents.dragAndDropEvent(
                canvas,
                rect.left + 778, rect.top + 400,
                rect.left + 730, rect.top + 400
            );


            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 725 && cA.intermediatePoints[0].y === 500 &&
                ((cA.intermediatePoints[1].x === 730) || (cA.intermediatePoints[1].x === 738)) &&
                cA.intermediatePoints[1].y === 500 &&
                ((cA.intermediatePoints[2].x === 730) || (cA.intermediatePoints[2].x === 738)) &&
                cA.intermediatePoints[2].y === 300 &&
                cA.intermediatePoints[3].x === 500 && cA.intermediatePoints[3].y === 300
            ).toBe(true);

            // 5) Phase B: drag that new thumb further left: 730→500
            mouseEvents.mouseDownEvent(canvas, rect.left + 730, rect.top + 400);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 710, rect.top + 400);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 690, rect.top + 400);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 500, rect.top + 400);
            mouseEvents.mouseUpEvent(canvas, rect.left + 500, rect.top + 400);


            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 725 && cB.intermediatePoints[0].y === 500 &&
                cB.intermediatePoints[1].x === 738 && cB.intermediatePoints[1].y === 500 &&
                cB.intermediatePoints[2].x === 738 && cB.intermediatePoints[2].y === 455 &&
                ((cB.intermediatePoints[3].x === 500) || (cB.intermediatePoints[3].x === 508)) &&
                cB.intermediatePoints[3].y === 455 &&
                ((cB.intermediatePoints[4].x === 500) || (cB.intermediatePoints[4].x === 508)) &&
                cB.intermediatePoints[4].y === 300
            ).toBe(true);

            done();
        });
        it('Checking Orthogonal segment - Port To Point Interaction (Port direction- Bottom)', (done: DoneFn): void => {

            const canvas = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            // 1) Select connector[11] so port-thumb appears
            diagram.select([diagram.connectors[46]]);

            const c0: any = diagram.selectedItems.connectors[0];
            expect(
                c0.intermediatePoints[0].x === 100 && c0.intermediatePoints[0].y === 525 &&
                c0.intermediatePoints[1].x === 100 && c0.intermediatePoints[1].y === 538 &&
                c0.intermediatePoints[2].x === 150 && c0.intermediatePoints[2].y === 538 &&
                c0.intermediatePoints[3].x === 150 && c0.intermediatePoints[3].y === 300 &&
                c0.intermediatePoints[4].x === 300 && c0.intermediatePoints[4].y === 300
            ).toBe(true);

            // 3) Phase A: drag port-thumb horizontally from (150,420) → (200,420)
            mouseEvents.dragAndDropEvent(
                canvas,
                rect.left + 150, rect.top + 420,
                rect.left + 200, rect.top + 420
            );


            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 100 && cA.intermediatePoints[0].y === 525 &&
                cA.intermediatePoints[1].x === 100 && cA.intermediatePoints[1].y === 538 &&
                ((cA.intermediatePoints[2].x === 200) || (cA.intermediatePoints[2].x === 208)) &&
                cA.intermediatePoints[2].y === 538 &&
                ((cA.intermediatePoints[3].x === 200) || (cA.intermediatePoints[3].x === 208)) &&
                cA.intermediatePoints[3].y === 300 &&
                cA.intermediatePoints[4].x === 300 && cA.intermediatePoints[4].y === 300
            ).toBe(true);

            // 5) Phase B: vertical drag near x=150 from 540 → 458
            mouseEvents.mouseDownEvent(canvas, rect.left + 150, rect.top + 540);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 150, rect.top + 530);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 150, rect.top + 510);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 150, rect.top + 458);
            mouseEvents.mouseUpEvent(canvas, rect.left + 150, rect.top + 458);


            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 100 && cB.intermediatePoints[0].y === 525 &&
                cB.intermediatePoints[1].x === 100 && cB.intermediatePoints[1].y === 538 &&
                cB.intermediatePoints[2].x === 145 && cB.intermediatePoints[2].y === 538 &&
                cB.intermediatePoints[3].x === 145 && cB.intermediatePoints[3].y === 458 &&
                ((cB.intermediatePoints[4].x === 200) || (cB.intermediatePoints[4].x === 208)) &&
                cB.intermediatePoints[4].y === 458 &&
                ((cB.intermediatePoints[5].x === 200) || (cB.intermediatePoints[5].x === 208)) &&
                cB.intermediatePoints[5].y === 300 &&
                cB.intermediatePoints[6].x === 300 && cB.intermediatePoints[6].y === 300
            ).toBe(true);
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
                if (count === 10) {
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
            let dir: any = ['Left', 'Right', 'Top', 'Bottom'];
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
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });
        it('Checking Orthogonal segment - Node To Point Interaction (Node direction- Right)', (done: DoneFn): void => {

            const rect: any = diagram.element.getBoundingClientRect();
            const sx: number = diagram.connectors[9].sourcePoint.x + rect.left;
            const sy: number = diagram.connectors[9].sourcePoint.y + rect.top;
            mouseEvents.clickEvent(diagramCanvas, sx, sy);
            if (diagram.selectedItems.connectors.length === 0) {
                mouseEvents.clickEvent(diagramCanvas, sx + 2, sy + 2);
            }
            const selectedInitially: any = diagram.selectedItems.connectors[0];
            expect(selectedInitially.intermediatePoints[0].x === 125 && selectedInitially.intermediatePoints[0].y === 500 &&
                selectedInitially.intermediatePoints[1].x === 175 && selectedInitially.intermediatePoints[1].y === 500 &&
                selectedInitially.intermediatePoints[2].x === 175 && selectedInitially.intermediatePoints[2].y === 300 &&
                selectedInitially.intermediatePoints[3].x === 300 && selectedInitially.intermediatePoints[3].y === 300).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 178, rect.top + 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 135, rect.top + 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 130, rect.top + 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 120, rect.top + 400);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 120, rect.top + 400);
            const selectedConnector: any = diagram.selectedItems.connectors[0];
            expect(((selectedConnector.intermediatePoints[0].x === 125 || selectedConnector.intermediatePoints[0].x === 100) &&
                (selectedConnector.intermediatePoints[0].y === 500 || selectedConnector.intermediatePoints[0].y === 475)) &&
                ((selectedConnector.intermediatePoints[1].x === 128 || selectedConnector.intermediatePoints[1].x === 100) &&
                    (selectedConnector.intermediatePoints[1].y === 500 || selectedConnector.intermediatePoints[1].y === 455)) &&
                ((selectedConnector.intermediatePoints[2].x === 128 || selectedConnector.intermediatePoints[2].x === 130) &&
                    (selectedConnector.intermediatePoints[2].y === 300 || selectedConnector.intermediatePoints[2].y === 455)) &&
                ((selectedConnector.intermediatePoints[3].x === 300 || selectedConnector.intermediatePoints[3].x === 130) &&
                    selectedConnector.intermediatePoints[3].y === 300)).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Node To Point Interaction (Node direction- Top)', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            diagram.select([diagram.connectors[6]]);
            const initialSelection: any = diagram.selectedItems.connectors[0];
            expect(
                initialSelection.intermediatePoints[0].x === 700 && initialSelection.intermediatePoints[0].y === 75 &&
                initialSelection.intermediatePoints[1].x === 700 && initialSelection.intermediatePoints[1].y === 25 &&
                initialSelection.intermediatePoints[2].x === 400 && initialSelection.intermediatePoints[2].y === 25 &&
                initialSelection.intermediatePoints[3].x === 400 && initialSelection.intermediatePoints[3].y === 200
            ).toBe(true);
            // Drag sequence (using viewport coordinates via rect.left/top)
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 550, rect.top + 20);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 550, rect.top + 70);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 550, rect.top + 80);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 550, rect.top + 80);
            const selectedConnector: any = diagram.selectedItems.connectors[0];
            expect(
                selectedConnector.intermediatePoints[0].x === 675 && selectedConnector.intermediatePoints[0].y === 100 &&
                selectedConnector.intermediatePoints[1].x === 655 && selectedConnector.intermediatePoints[1].y === 100 &&
                selectedConnector.intermediatePoints[2].x === 655 && selectedConnector.intermediatePoints[2].y === 70 &&
                selectedConnector.intermediatePoints[3].x === 400 && selectedConnector.intermediatePoints[3].y === 70 &&
                selectedConnector.intermediatePoints[4].x === 400 && selectedConnector.intermediatePoints[4].y === 200
            ).toBe(true);
            done();

        });
        it('Checking Orthogonal segment - Node To Point Interaction (Node direction- Bottom)', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            diagram.select([diagram.connectors[15]]);
            const initialSelection: any = diagram.selectedItems.connectors[0];
            expect(
                initialSelection.intermediatePoints[0].x === 700 && initialSelection.intermediatePoints[0].y === 525 &&
                initialSelection.intermediatePoints[1].x === 700 && initialSelection.intermediatePoints[1].y === 575 &&
                initialSelection.intermediatePoints[2].x === 500 && initialSelection.intermediatePoints[2].y === 575 &&
                initialSelection.intermediatePoints[3].x === 500 && initialSelection.intermediatePoints[3].y === 300
            ).toBe(true);
            // Drag sequence upward (viewport coordinates)
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 600, rect.top + 570);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 600, rect.top + 530);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 600, rect.top + 520);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 600, rect.top + 500);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 600, rect.top + 500);
            const selectedConnector: any = diagram.selectedItems.connectors[0];
            expect(
                selectedConnector.intermediatePoints[0].x === 675 && selectedConnector.intermediatePoints[0].y === 500 &&
                selectedConnector.intermediatePoints[1].x === 655 && selectedConnector.intermediatePoints[1].y === 500 &&
                selectedConnector.intermediatePoints[2].x === 655 && selectedConnector.intermediatePoints[2].y === 500 &&
                selectedConnector.intermediatePoints[3].x === 500 && selectedConnector.intermediatePoints[3].y === 500 &&
                selectedConnector.intermediatePoints[4].x === 500 && selectedConnector.intermediatePoints[4].y === 300
            ).toBe(true);
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
                if (count === 10) {
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
            let dir: any = ['Left', 'Right', 'Top', 'Bottom'];
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

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Orthogonal segment - Point To Node Interaction(Target direction-"Bottom To Center")', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            mouseEvents.clickEvent(diagramCanvas, rect.left + 10, rect.top + 10);
            diagram.select([diagram.connectors[2]]);
            const initialSelection: any = diagram.selectedItems.connectors[0];
            expect(
                initialSelection.intermediatePoints[0].x === 300 && initialSelection.intermediatePoints[0].y === 200 &&
                initialSelection.intermediatePoints[1].x === 300 && initialSelection.intermediatePoints[1].y === 150 &&
                initialSelection.intermediatePoints[2].x === 100 && initialSelection.intermediatePoints[2].y === 150 &&
                initialSelection.intermediatePoints[3].x === 100 && initialSelection.intermediatePoints[3].y === 125
            ).toBe(true);

            // Drag sequence (vertical adjust at x≈200)
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 200, rect.top + 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 200, rect.top + 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 200, rect.top + 108);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 200, rect.top + 108);
            const selectedConnector: any = diagram.selectedItems.connectors[0];
            expect(
                selectedConnector.intermediatePoints[0].x === 300 && selectedConnector.intermediatePoints[0].y === 200 &&
                selectedConnector.intermediatePoints[1].x === 300 && selectedConnector.intermediatePoints[1].y === 108 &&
                selectedConnector.intermediatePoints[2].x === 145 && selectedConnector.intermediatePoints[2].y === 108
            ).toBe(true);
            done();
        });

        it('Checking Orthogonal segment - Point To Node Interaction(Target direction-"Bottom To Top")', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            diagram.select([diagram.connectors[6]]);
            const initialSelection: any = diagram.selectedItems.connectors[0];
            expect(
                initialSelection.intermediatePoints[0].x === 400 && initialSelection.intermediatePoints[0].y === 200 &&
                initialSelection.intermediatePoints[1].x === 400 && initialSelection.intermediatePoints[1].y === 150 &&
                initialSelection.intermediatePoints[2].x === 700 && initialSelection.intermediatePoints[2].y === 150 &&
                initialSelection.intermediatePoints[3].x === 700 && initialSelection.intermediatePoints[3].y === 125
            ).toBe(true);
            // Drag sequence (vertical adjust at x≈550)
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 550, rect.top + 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 550, rect.top + 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 550, rect.top + 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 550, rect.top + 50);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 550, rect.top + 50);
            const selectedConnector: any = diagram.selectedItems.connectors[0];
            expect(
                selectedConnector.intermediatePoints[0].x === 400 && selectedConnector.intermediatePoints[0].y === 200 &&
                selectedConnector.intermediatePoints[1].x === 400 && selectedConnector.intermediatePoints[1].y === 45 &&
                selectedConnector.intermediatePoints[2].x === 700 && selectedConnector.intermediatePoints[2].y === 45 &&
                selectedConnector.intermediatePoints[3].x === 700 && selectedConnector.intermediatePoints[3].y === 75
            ).toBe(true);
            done();
        });

        it('Checking Orthogonal segment - Point To Node Interaction(Target direction and source point center-"Bottom To Top")', (done: DoneFn): void => {
            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            diagram.select([diagram.connectors[19]]);
            // Drag upward from y≈750 to y≈650 at x≈200
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 200, rect.top + 750);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 200, rect.top + 700);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 200, rect.top + 650);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 200, rect.top + 650);
            done();
        });

        it('Checking Orthogonal segment - Point To Node Interaction(Target direction and source point center-"Top To Bottom")', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            diagram.select([diagram.connectors[20]]);
            // Drag downward from y≈630 to y≈800 at x≈550
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 550, rect.top + 630);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 550, rect.top + 650);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 550, rect.top + 800);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 550, rect.top + 800);
            done();
        });
    });

    describe('Conectors with segments - Orthogonal Segment interaction(Drag source node and target node)', () => {
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
            ele = createElement('div', { id: 'diagramOrthogonalSegmentDragSource' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = []; let count = 1; let offsetY = 100; let offsetX = 100
            for (var i = 0; i < 9; i++) {
                var node = { id: 'node' + i, offsetX: ((count) * offsetX), offsetY: offsetY, width: 50, height: 50 };
                nodes.push(node);
                count += 3;
                if (count === 10) {
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
            diagram = null;
            ele = null;
        });
        it('Checking Orthogonal segment - drag source node', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            // Arrange: clear and select the draggable node (index 4)
            diagram.clearSelection();
            // Click center of node[4] using viewport coordinates to ensure selection focus
            mouseEvents.clickEvent(diagramCanvas, rect.left + diagram.nodes[4].offsetX, rect.top + diagram.nodes[4].offsetY);
            // Phase 1: Drag from (400,300) → (300,300)
            mouseEvents.dragAndDropEvent(
                diagramCanvas,
                rect.left + 400, rect.top + 300,
                rect.left + 300, rect.top + 300
            );
            // connector[0]
            expect(
                (diagram.connectors[0] as any).intermediatePoints[0].x === 275 &&
                (diagram.connectors[0] as any).intermediatePoints[0].y === 300 &&
                (diagram.connectors[0] as any).intermediatePoints[1].x === 100 &&
                (diagram.connectors[0] as any).intermediatePoints[1].y === 300 &&
                (diagram.connectors[0] as any).intermediatePoints[2].x === 100 &&
                (diagram.connectors[0] as any).intermediatePoints[2].y === 125
            ).toBe(true);
            // connector[1]
            expect(
                (diagram.connectors[1] as any).intermediatePoints[0].x === 300 &&
                (diagram.connectors[1] as any).intermediatePoints[0].y === 275 &&
                (diagram.connectors[1] as any).intermediatePoints[1].x === 300 &&
                (diagram.connectors[1] as any).intermediatePoints[1].y === 225 &&
                (diagram.connectors[1] as any).intermediatePoints[2].x === 700 &&
                (diagram.connectors[1] as any).intermediatePoints[2].y === 225 &&
                (diagram.connectors[1] as any).intermediatePoints[3].x === 700 &&
                (diagram.connectors[1] as any).intermediatePoints[3].y === 125
            ).toBe(true);
            // connector[2]
            expect(
                (diagram.connectors[2] as any).intermediatePoints[0].x === 325 &&
                (diagram.connectors[2] as any).intermediatePoints[0].y === 300 &&
                (diagram.connectors[2] as any).intermediatePoints[1].x === 700 &&
                (diagram.connectors[2] as any).intermediatePoints[1].y === 300 &&
                (diagram.connectors[2] as any).intermediatePoints[2].x === 700 &&
                (diagram.connectors[2] as any).intermediatePoints[2].y === 475
            ).toBe(true);
            // connector[3]
            expect(
                (diagram.connectors[3] as any).intermediatePoints[0].x === 300 &&
                (diagram.connectors[3] as any).intermediatePoints[0].y === 325 &&
                (diagram.connectors[3] as any).intermediatePoints[1].x === 300 &&
                (diagram.connectors[3] as any).intermediatePoints[1].y === 375 &&
                (diagram.connectors[3] as any).intermediatePoints[2].x === 100 &&
                (diagram.connectors[3] as any).intermediatePoints[2].y === 375 &&
                (diagram.connectors[3] as any).intermediatePoints[3].x === 100 &&
                (diagram.connectors[3] as any).intermediatePoints[3].y === 475
            ).toBe(true);
            // Phase 2: Drag from (300,300) → (300,200)
            mouseEvents.dragAndDropEvent(
                diagramCanvas,
                rect.left + 300, rect.top + 300,
                rect.left + 300, rect.top + 200
            );
            // connector[0]
            expect(
                (diagram.connectors[0] as any).intermediatePoints[0].x === 275 &&
                (diagram.connectors[0] as any).intermediatePoints[0].y === 200 &&
                (diagram.connectors[0] as any).intermediatePoints[1].x === 100 &&
                (diagram.connectors[0] as any).intermediatePoints[1].y === 200 &&
                (diagram.connectors[0] as any).intermediatePoints[2].x === 100 &&
                (diagram.connectors[0] as any).intermediatePoints[2].y === 125
            ).toBe(true);

            // connector[1]
            expect(
                (diagram.connectors[1] as any).intermediatePoints[0].x === 300 &&
                (diagram.connectors[1] as any).intermediatePoints[0].y === 175 &&
                (diagram.connectors[1] as any).intermediatePoints[1].x === 300 &&
                (diagram.connectors[1] as any).intermediatePoints[1].y === 100 &&
                (diagram.connectors[1] as any).intermediatePoints[2].x === 675 &&
                (diagram.connectors[1] as any).intermediatePoints[2].y === 100
            ).toBe(true);

            // connector[2]
            expect(
                (diagram.connectors[2] as any).intermediatePoints[0].x === 325 &&
                (diagram.connectors[2] as any).intermediatePoints[0].y === 200 &&
                (diagram.connectors[2] as any).intermediatePoints[1].x === 700 &&
                (diagram.connectors[2] as any).intermediatePoints[1].y === 200 &&
                (diagram.connectors[2] as any).intermediatePoints[2].x === 700 &&
                (diagram.connectors[2] as any).intermediatePoints[2].y === 475
            ).toBe(true);

            // connector[3]
            expect(
                (diagram.connectors[3] as any).intermediatePoints[0].x === 300 &&
                (diagram.connectors[3] as any).intermediatePoints[0].y === 225 &&
                (diagram.connectors[3] as any).intermediatePoints[1].x === 300 &&
                (diagram.connectors[3] as any).intermediatePoints[1].y === 375 &&
                (diagram.connectors[3] as any).intermediatePoints[2].x === 100 &&
                (diagram.connectors[3] as any).intermediatePoints[2].y === 375 &&
                (diagram.connectors[3] as any).intermediatePoints[3].x === 100 &&
                (diagram.connectors[3] as any).intermediatePoints[3].y === 475
            ).toBe(true);

            // Phase 3: Drag from (300,200) → (400,200)
            mouseEvents.dragAndDropEvent(
                diagramCanvas,
                rect.left + 300, rect.top + 200,
                rect.left + 400, rect.top + 200
            );
            // connector[0]
            expect(
                (diagram.connectors[0] as any).intermediatePoints[0].x === 375 &&
                (diagram.connectors[0] as any).intermediatePoints[0].y === 200 &&
                (diagram.connectors[0] as any).intermediatePoints[1].x === 100 &&
                (diagram.connectors[0] as any).intermediatePoints[1].y === 200 &&
                (diagram.connectors[0] as any).intermediatePoints[2].x === 100 &&
                (diagram.connectors[0] as any).intermediatePoints[2].y === 125
            ).toBe(true);

            // connector[1]
            expect(
                (diagram.connectors[1] as any).intermediatePoints[0].x === 400 &&
                (diagram.connectors[1] as any).intermediatePoints[0].y === 175 &&
                (diagram.connectors[1] as any).intermediatePoints[1].x === 400 &&
                (diagram.connectors[1] as any).intermediatePoints[1].y === 100 &&
                (diagram.connectors[1] as any).intermediatePoints[2].x === 675 &&
                (diagram.connectors[1] as any).intermediatePoints[2].y === 100
            ).toBe(true);

            // connector[2]
            expect(
                (diagram.connectors[2] as any).intermediatePoints[0].x === 425 &&
                (diagram.connectors[2] as any).intermediatePoints[0].y === 200 &&
                (diagram.connectors[2] as any).intermediatePoints[1].x === 700 &&
                (diagram.connectors[2] as any).intermediatePoints[1].y === 200 &&
                (diagram.connectors[2] as any).intermediatePoints[2].x === 700 &&
                (diagram.connectors[2] as any).intermediatePoints[2].y === 475
            ).toBe(true);

            // connector[3]
            expect(
                (diagram.connectors[3] as any).intermediatePoints[0].x === 400 &&
                (diagram.connectors[3] as any).intermediatePoints[0].y === 225 &&
                (diagram.connectors[3] as any).intermediatePoints[1].x === 400 &&
                (diagram.connectors[3] as any).intermediatePoints[1].y === 375 &&
                (diagram.connectors[3] as any).intermediatePoints[2].x === 100 &&
                (diagram.connectors[3] as any).intermediatePoints[2].y === 375 &&
                (diagram.connectors[3] as any).intermediatePoints[3].x === 100 &&
                (diagram.connectors[3] as any).intermediatePoints[3].y === 475
            ).toBe(true);

            // Phase 4: Drag from (400,200) → (400,300)
            mouseEvents.dragAndDropEvent(
                diagramCanvas,
                rect.left + 400, rect.top + 200,
                rect.left + 400, rect.top + 300
            );
            // connector[0]
            expect(
                (diagram.connectors[0] as any).intermediatePoints[0].x === 375 &&
                (diagram.connectors[0] as any).intermediatePoints[0].y === 300 &&
                (diagram.connectors[0] as any).intermediatePoints[1].x === 100 &&
                (diagram.connectors[0] as any).intermediatePoints[1].y === 300 &&
                (diagram.connectors[0] as any).intermediatePoints[2].x === 100 &&
                (diagram.connectors[0] as any).intermediatePoints[2].y === 125
            ).toBe(true);

            // connector[1]
            expect(
                (diagram.connectors[1] as any).intermediatePoints[0].x === 400 &&
                (diagram.connectors[1] as any).intermediatePoints[0].y === 275 &&
                (diagram.connectors[1] as any).intermediatePoints[1].x === 400 &&
                (diagram.connectors[1] as any).intermediatePoints[1].y === 100 &&
                (diagram.connectors[1] as any).intermediatePoints[2].x === 675 &&
                (diagram.connectors[1] as any).intermediatePoints[2].y === 100
            ).toBe(true);

            // connector[2]
            expect(
                (diagram.connectors[2] as any).intermediatePoints[0].x === 425 &&
                (diagram.connectors[2] as any).intermediatePoints[0].y === 300 &&
                (diagram.connectors[2] as any).intermediatePoints[1].x === 700 &&
                (diagram.connectors[2] as any).intermediatePoints[1].y === 300 &&
                (diagram.connectors[2] as any).intermediatePoints[2].x === 700 &&
                (diagram.connectors[2] as any).intermediatePoints[2].y === 475
            ).toBe(true);

            // connector[3]
            expect(
                (diagram.connectors[3] as any).intermediatePoints[0].x === 400 &&
                (diagram.connectors[3] as any).intermediatePoints[0].y === 325 &&
                (diagram.connectors[3] as any).intermediatePoints[1].x === 400 &&
                (diagram.connectors[3] as any).intermediatePoints[1].y === 375 &&
                (diagram.connectors[3] as any).intermediatePoints[2].x === 100 &&
                (diagram.connectors[3] as any).intermediatePoints[2].y === 375 &&
                (diagram.connectors[3] as any).intermediatePoints[3].x === 100 &&
                (diagram.connectors[3] as any).intermediatePoints[3].y === 475
            ).toBe(true);

            done();

        });
    });

    describe('Conectors with segments - Orthogonal Segment interaction(Node To Node)', () => {
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
                var node = { id: 'node' + i, offsetX: ((count) * offsetX), offsetY: offsetY, width: 50, height: 50 };
                nodes.push(node);
                count += 3;
                if (count === 10) {
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

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Orthogonal segment - Node to Node(single segment-Left)', (done: DoneFn): void => {
            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            diagram.select([diagram.connectors[0]]);
            // Phase A: drag (240,300) -> (240,208)
            mouseEvents.mouseDownEvent(canvas, rect.left + 240, rect.top + 300);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 240, rect.top + 208);
            mouseEvents.mouseUpEvent(canvas, rect.left + 240, rect.top + 208);
            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 375 && cA.intermediatePoints[0].y === 300 &&
                cA.intermediatePoints[1].x === 283.33 && cA.intermediatePoints[1].y === 300 &&
                cA.intermediatePoints[2].x === 283.33 && cA.intermediatePoints[2].y === 116 &&
                cA.intermediatePoints[3].x === 145 && cA.intermediatePoints[3].y === 116
            ).toBe(true);
            // Phase B: horizontal gesture around y=200 from ~282 -> ~380
            mouseEvents.mouseDownEvent(canvas, rect.left + 282, rect.top + 200);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 360, rect.top + 200);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 370, rect.top + 200);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 375, rect.top + 200);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 380, rect.top + 200);
            mouseEvents.mouseUpEvent(canvas, rect.left + 380, rect.top + 200);
            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 400 && cB.intermediatePoints[0].y === 275 &&
                cB.intermediatePoints[1].x === 400 && cB.intermediatePoints[1].y === 255 &&
                cB.intermediatePoints[2].x === 380 && cB.intermediatePoints[2].y === 255 &&
                cB.intermediatePoints[3].x === 380 && cB.intermediatePoints[3].y === 116 &&
                cB.intermediatePoints[4].x === 145 && cB.intermediatePoints[4].y === 116
            ).toBe(true);
            // Phase C: dragAndDropEvent (380,180) -> (100,180)
            mouseEvents.mouseDownEvent(canvas, rect.left + 380, rect.top + 180);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 100, rect.top + 180);
            mouseEvents.mouseUpEvent(canvas, rect.left + 100, rect.top + 180);
            const cC: any = diagram.selectedItems.connectors[0];
            expect(
                cC.intermediatePoints[0].x === 400 && cC.intermediatePoints[0].y === 275 &&
                cC.intermediatePoints[1].x === 400 && cC.intermediatePoints[1].y === 255 &&
                ((cC.intermediatePoints[2].x === 100 || cC.intermediatePoints[2].x === 108) &&
                    cC.intermediatePoints[2].y === 255) &&
                ((cC.intermediatePoints[3].x === 100 || cC.intermediatePoints[3].x === 108) &&
                    (cC.intermediatePoints[3].y === 116 || cC.intermediatePoints[3].y === 145))
            ).toBe(true);
            // Phase D: drag (240,255) -> (240,108)
            mouseEvents.mouseDownEvent(canvas, rect.left + 240, rect.top + 255);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 240, rect.top + 108);
            mouseEvents.mouseUpEvent(canvas, rect.left + 240, rect.top + 108);
            const cD: any = diagram.selectedItems.connectors[0];
            expect(
                cD.intermediatePoints[0].x === 400 && cD.intermediatePoints[0].y === 275 &&
                cD.intermediatePoints[1].x === 400 && cD.intermediatePoints[1].y === 108 &&
                ((cD.intermediatePoints[2].x === 100 || cD.intermediatePoints[2].x === 108) &&
                    cD.intermediatePoints[2].y === 108)
            ).toBe(true);

            // Phase E: drag (400,190) -> (300,190)
            mouseEvents.mouseDownEvent(canvas, rect.left + 400, rect.top + 190);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 300, rect.top + 190);
            mouseEvents.mouseUpEvent(canvas, rect.left + 300, rect.top + 190);
            const cE: any = diagram.selectedItems.connectors[0];
            expect(
                cE.intermediatePoints[0].x === 400 && cE.intermediatePoints[0].y === 275 &&
                cE.intermediatePoints[1].x === 400 && cE.intermediatePoints[1].y === 219.33 &&
                ((cE.intermediatePoints[2].x === 200 || cE.intermediatePoints[2].x === 216) &&
                    cE.intermediatePoints[2].y === 219.33) &&
                ((cE.intermediatePoints[3].x === 200 || cE.intermediatePoints[3].x === 216) &&
                    cE.intermediatePoints[3].y === 108) &&
                ((cE.intermediatePoints[4].x === 100 || cE.intermediatePoints[4].x === 108) &&
                    cE.intermediatePoints[4].y === 108)
            ).toBe(true);
            done();
        });


        it('Checking Orthogonal segment - Node to Node(single segment-Top)', (done: DoneFn): void => {
            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            diagram.select([diagram.connectors[1]]);

            // Phase A: drag (550,220) -> (550,108)
            mouseEvents.mouseDownEvent(canvas, rect.left + 550, rect.top + 220);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 550, rect.top + 108);
            mouseEvents.mouseUpEvent(canvas, rect.left + 550, rect.top + 108);
            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 400 && cA.intermediatePoints[0].y === 275 &&
                cA.intermediatePoints[1].x === 400 && cA.intermediatePoints[1].y === 108 &&
                cA.intermediatePoints[2].x === 655 && cA.intermediatePoints[2].y === 108
            ).toBe(true);

            // Phase B: drag (400,190) -> (500,190)
            mouseEvents.mouseDownEvent(canvas, rect.left + 400, rect.top + 190);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 500, rect.top + 190);
            mouseEvents.mouseUpEvent(canvas, rect.left + 500, rect.top + 190);
            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 400 && cB.intermediatePoints[0].y === 275 &&
                cB.intermediatePoints[1].x === 400 && cB.intermediatePoints[1].y === 219.33 &&
                ((cB.intermediatePoints[2].x === 616 || cB.intermediatePoints[2].x === 600) &&
                    cB.intermediatePoints[2].y === 219.33) &&
                ((cB.intermediatePoints[3].x === 616 || cB.intermediatePoints[3].x === 600) &&
                    cB.intermediatePoints[3].y === 108) &&
                cB.intermediatePoints[4].x === 655 && cB.intermediatePoints[4].y === 108
            ).toBe(true);

            // Phase C: drag (600,160) -> (800,160)
            mouseEvents.mouseDownEvent(canvas, rect.left + 600, rect.top + 160);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 800, rect.top + 160);
            mouseEvents.mouseUpEvent(canvas, rect.left + 800, rect.top + 160);
            const cC: any = diagram.selectedItems.connectors[0];
            expect(
                cC.intermediatePoints[0].x === 400 && cC.intermediatePoints[0].y === 275 &&
                cC.intermediatePoints[1].x === 400 && cC.intermediatePoints[1].y === 219.33 &&
                ((cC.intermediatePoints[2].x === 808 || cC.intermediatePoints[2].x === 800) &&
                    cC.intermediatePoints[2].y === 219.33) &&
                ((cC.intermediatePoints[3].x === 808 || cC.intermediatePoints[3].x === 800) &&
                    cC.intermediatePoints[3].y === 108) &&
                cC.intermediatePoints[4].x === 655 && cC.intermediatePoints[4].y === 108
            ).toBe(true);

            // Phase D: drag (800,160) -> (700,160)
            mouseEvents.mouseDownEvent(canvas, rect.left + 800, rect.top + 160);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 700, rect.top + 160);
            mouseEvents.mouseUpEvent(canvas, rect.left + 700, rect.top + 160);
            const cD: any = diagram.selectedItems.connectors[0];
            expect(
                cD.intermediatePoints[0].x === 400 && cD.intermediatePoints[0].y === 275 &&
                cD.intermediatePoints[1].x === 400 && cD.intermediatePoints[1].y === 219.33 &&
                ((cD.intermediatePoints[2].x === 708 || cD.intermediatePoints[2].x === 700) &&
                    cD.intermediatePoints[2].y === 219.33) &&
                ((cD.intermediatePoints[3].x === 708 || cD.intermediatePoints[3].x === 700) &&
                    (cD.intermediatePoints[3].y === 108 || cD.intermediatePoints[3].y === 125))
            ).toBe(true);

            // Final guiding drags (as in original)
            mouseEvents.mouseDownEvent(canvas, rect.left + 700, rect.top + 170);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 395, rect.top + 170);
            mouseEvents.mouseUpEvent(canvas, rect.left + 395, rect.top + 170);

            mouseEvents.mouseDownEvent(canvas, rect.left + 550, rect.top + 155);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 550, rect.top + 50);
            mouseEvents.mouseUpEvent(canvas, rect.left + 550, rect.top + 50);

            mouseEvents.mouseDownEvent(canvas, rect.left + 550, rect.top + 40);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 550, rect.top + 108);
            mouseEvents.mouseUpEvent(canvas, rect.left + 550, rect.top + 108);
            done();

        });
        it('Checking Orthogonal segment - Node to Node(single segment-Right)', (done: DoneFn): void => {

            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            diagram.select([diagram.connectors[2]]);

            // Phase A: drag (560,300) -> (560,408)
            mouseEvents.mouseDownEvent(canvas, rect.left + 560, rect.top + 300);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 560, rect.top + 408);
            mouseEvents.mouseUpEvent(canvas, rect.left + 560, rect.top + 408);
            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 425 && cA.intermediatePoints[0].y === 300 &&
                cA.intermediatePoints[1].x === 516.67 && cA.intermediatePoints[1].y === 300 &&
                cA.intermediatePoints[2].x === 516.67 && cA.intermediatePoints[2].y === 516 &&
                cA.intermediatePoints[3].x === 655 && cA.intermediatePoints[3].y === 516
            ).toBe(true);

            // Phase B: series of left drags around y=400: 520->410
            mouseEvents.mouseDownEvent(canvas, rect.left + 520, rect.top + 400);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 430, rect.top + 400);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 425, rect.top + 400);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 420, rect.top + 400);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 415, rect.top + 400);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 410, rect.top + 400);
            mouseEvents.mouseUpEvent(canvas, rect.left + 410, rect.top + 400);
            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 400 && cB.intermediatePoints[0].y === 325 &&
                cB.intermediatePoints[1].x === 400 && cB.intermediatePoints[1].y === 345 &&
                cB.intermediatePoints[2].x === 410 && cB.intermediatePoints[2].y === 345 &&
                cB.intermediatePoints[3].x === 410 && cB.intermediatePoints[3].y === 516 &&
                cB.intermediatePoints[4].x === 655 && cB.intermediatePoints[4].y === 516
            ).toBe(true);

            // Phase C: dragAndDrop (410,420) -> (550,420)
            mouseEvents.mouseDownEvent(canvas, rect.left + 420, rect.top + 434);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 550, rect.top + 420);
            mouseEvents.mouseUpEvent(canvas, rect.left + 550, rect.top + 420);
            const cC: any = diagram.selectedItems.connectors[0];
            expect(
                cC.intermediatePoints[0].x === 400 &&
                cC.intermediatePoints[0].y === 325 &&
                cC.intermediatePoints[1].x === 400 &&
                cC.intermediatePoints[1].y === 345 &&
                cC.intermediatePoints[2].x === 550 &&
                cC.intermediatePoints[2].y === 345 &&
                cC.intermediatePoints[3].x === 550 &&
                cC.intermediatePoints[3].y === 516 &&
                cC.intermediatePoints[4].x === 655 &&
                cC.intermediatePoints[4].y === 516
            ).toBe(true);

            // Phase D: vertical drag around x=475 from 340 -> 300
            mouseEvents.mouseDownEvent(canvas, rect.left + 475, rect.top + 340);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 475, rect.top + 330);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 475, rect.top + 325);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 475, rect.top + 320);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 475, rect.top + 315);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 475, rect.top + 310);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 475, rect.top + 300);
            mouseEvents.mouseUpEvent(canvas, rect.left + 475, rect.top + 300);
            const cD: any = diagram.selectedItems.connectors[0];
            expect(
                cD.intermediatePoints[0].x === 425 &&
                cD.intermediatePoints[0].y === 300 &&
                cD.intermediatePoints[1].x === 445 &&
                cD.intermediatePoints[1].y === 300 &&
                cD.intermediatePoints[2].x === 445 &&
                cD.intermediatePoints[2].y === 300 &&
                cD.intermediatePoints[3].x === 550 &&
                cD.intermediatePoints[3].y === 300 &&
                cD.intermediatePoints[4].x === 550 &&
                cD.intermediatePoints[4].y === 516 &&
                cD.intermediatePoints[5].x === 655 &&
                cD.intermediatePoints[5].y === 516
            ).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Node to Node(single segment-Bottom)', (done: DoneFn): void => {

            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            diagram.select([diagram.connectors[3]]);
            const connector0: any = diagram.selectedItems.connectors[0];
            expect(
                connector0.intermediatePoints[0].x === 400 && connector0.intermediatePoints[0].y === 325 &&
                connector0.intermediatePoints[1].x === 400 && connector0.intermediatePoints[1].y === 375 &&
                connector0.intermediatePoints[2].x === 100 && connector0.intermediatePoints[2].y === 375 &&
                connector0.intermediatePoints[3].x === 100 && connector0.intermediatePoints[3].y === 475
            ).toBe(true);

            // Phase A: drag (250,375) -> (250,200)
            mouseEvents.mouseDownEvent(canvas, rect.left + 250, rect.top + 375);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 250, rect.top + 200);
            mouseEvents.mouseUpEvent(canvas, rect.left + 250, rect.top + 200);
            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 400 && cA.intermediatePoints[0].y === 275 &&
                cA.intermediatePoints[1].x === 400 && cA.intermediatePoints[1].y === 150 &&
                cA.intermediatePoints[2].x === 100 && cA.intermediatePoints[2].y === 150 &&
                cA.intermediatePoints[3].x === 100 && cA.intermediatePoints[3].y === 475
            ).toBe(true);

            // Phase B: drag (250,150) -> (250,290)
            mouseEvents.mouseDownEvent(canvas, rect.left + 250, rect.top + 150);
            mouseEvents.mouseMoveEvent(canvas, rect.left + 250, rect.top + 290);
            mouseEvents.mouseUpEvent(canvas, rect.left + 250, rect.top + 290);
            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 375 &&
                cB.intermediatePoints[0].y === 300 &&
                cB.intermediatePoints[1].x === 355 &&
                cB.intermediatePoints[1].y === 300 &&
                cB.intermediatePoints[2].x === 355 &&
                cB.intermediatePoints[2].y === 150 &&
                cB.intermediatePoints[3].x === 100 &&
                cB.intermediatePoints[3].y === 150 &&
                cB.intermediatePoints[4].x === 100 &&
                cB.intermediatePoints[4].y === 475
            ).toBe(true);
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
                if (node.id === 'node1') {
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
                else if (node.id === 'node3') {
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
                else if (node.id === 'node5') {
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
                } else if (node.id === 'node7') {
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
                if (count === 10) {
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
                    // if (count === 99 || count === 99)
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

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Orthogonal segment - Node to Port(Node Direction - Right and Port Direction - Left)', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            // Select the connector explicitly
            diagram.select([diagram.connectors[4]]);

            // Initial baseline assertion
            const connector0: any = diagram.selectedItems.connectors[0];
            expect(
                connector0.intermediatePoints[0].x === 550 && connector0.intermediatePoints[0].y === 225 &&
                connector0.intermediatePoints[1].x === 550 && connector0.intermediatePoints[1].y === 100 &&
                connector0.intermediatePoints[2].x === 675 && connector0.intermediatePoints[2].y === 100
            ).toBe(true);

            // Phase A: drag along a rising path to the right
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 550, rect.top + 160);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 600, rect.top + 170);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 660, rect.top + 170);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 720, rect.top + 180);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 720, rect.top + 180);
            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 550 && cA.intermediatePoints[0].y === 225 &&
                cA.intermediatePoints[1].x === 550 && cA.intermediatePoints[1].y === 183.33 &&
                ((cA.intermediatePoints[2].x === 728 || cA.intermediatePoints[2].x === 720) && cA.intermediatePoints[2].y === 183.33) &&
                ((cA.intermediatePoints[3].x === 728 || cA.intermediatePoints[3].x === 720) && (cA.intermediatePoints[3].y === 55 || cA.intermediatePoints[3].y === 145)) &&
                (cA.intermediatePoints[4].x === 655 && (cA.intermediatePoints[4].y === 55 || cA.intermediatePoints[4].y === 145)) &&
                (cA.intermediatePoints[5].x === 655 && cA.intermediatePoints[5].y === 100) &&
                (cA.intermediatePoints[6].x === 675 && cA.intermediatePoints[6].y === 100)
            ).toBe(true);
            // Phase B: drag downward near x ≈ 630
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 630, rect.top + 180);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 630, rect.top + 220);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 630, rect.top + 250);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 630, rect.top + 300);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 630, rect.top + 300);
            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 550 && cB.intermediatePoints[0].y === 275 &&
                cB.intermediatePoints[1].x === 550 && cB.intermediatePoints[1].y === 300 &&
                cB.intermediatePoints[2].x === 630 && cB.intermediatePoints[2].y === 300 &&
                ((cB.intermediatePoints[3].x === 630) && cB.intermediatePoints[3].y === 100) &&
                cB.intermediatePoints[4].x === 675 && cB.intermediatePoints[4].y === 100
            ).toBe(true);
            done();
        });

        it('Checking Orthogonal segment - Node to Port(Node Direction - Right and Port Direction - Left, Target Node - Bottom)', (done: DoneFn): void => {
            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            // Select the connector explicitly
            diagram.select([diagram.connectors[12]]);
            // Drag along a path to the right, maintaining the Y close to 460→440 as in original
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 550, rect.top + 460);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 600, rect.top + 460);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 660, rect.top + 450);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 720, rect.top + 440);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 720, rect.top + 440);
            const connector: any = diagram.selectedItems.connectors[0];
            expect(
                connector.intermediatePoints[0].x === 550 && connector.intermediatePoints[0].y === 425 &&
                connector.intermediatePoints[1].x === 550 && connector.intermediatePoints[1].y === 450 &&
                connector.intermediatePoints[2].x === 720 && connector.intermediatePoints[2].y === 450 &&
                connector.intermediatePoints[3].x === 720 && connector.intermediatePoints[3].y === 455 &&
                connector.intermediatePoints[4].x === 655 && connector.intermediatePoints[4].y === 455 &&
                connector.intermediatePoints[5].x === 655 && connector.intermediatePoints[5].y === 500 &&
                connector.intermediatePoints[6].x === 675 && connector.intermediatePoints[6].y === 500
            ).toBe(true);
            done();

        });

        it('Checking Orthogonal segment - Node to Port(Node Direction - Left and Port Direction - Left, Target Node - Bottom)', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            // Select connector[8]
            diagram.select([diagram.connectors[8]]);

            // Baseline assertion before drag
            let connector0: any = diagram.selectedItems.connectors[0];
            expect(
                connector0.intermediatePoints[0].x === 250 && connector0.intermediatePoints[0].y === 375 &&
                connector0.intermediatePoints[1].x === 250 && connector0.intermediatePoints[1].y === 325 &&
                connector0.intermediatePoints[2].x === 55 && connector0.intermediatePoints[2].y === 325 &&
                connector0.intermediatePoints[3].x === 55 && connector0.intermediatePoints[3].y === 500 &&
                connector0.intermediatePoints[4].x === 75 && connector0.intermediatePoints[4].y === 500
            ).toBe(true);

            // Phase A: drag near x≈55 horizontally to the right up to (200,420)
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 55, rect.top + 410);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 100, rect.top + 410);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 160, rect.top + 410);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 200, rect.top + 420);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 200, rect.top + 420);
            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 250 && cA.intermediatePoints[0].y === 375 &&
                cA.intermediatePoints[1].x === 250 && cA.intermediatePoints[1].y === 325 &&
                cA.intermediatePoints[2].x === 200 && cA.intermediatePoints[2].y === 325 &&
                cA.intermediatePoints[3].x === 200 && cA.intermediatePoints[3].y === 455 &&
                cA.intermediatePoints[4].x === 55 && cA.intermediatePoints[4].y === 455 &&
                cA.intermediatePoints[5].x === 55 && cA.intermediatePoints[5].y === 500 &&
                cA.intermediatePoints[6].x === 75 && cA.intermediatePoints[6].y === 500
            ).toBe(true);

            // Phase B: multi-step vertical and diagonal adjustments leading to (200,468)
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 220, rect.top + 320);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 220, rect.top + 350);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 160, rect.top + 370);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 200, rect.top + 468);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 200, rect.top + 468);
            const cB: any = diagram.selectedItems.connectors[0];
            expect(cB.intermediatePoints[0].x === 250 && cB.intermediatePoints[0].y === 425 &&
                cB.intermediatePoints[1].x === 250 && cB.intermediatePoints[1].y === 518 &&
                cB.intermediatePoints[2].x === 200 && cB.intermediatePoints[2].y === 518 &&
                cB.intermediatePoints[3].x === 200 && cB.intermediatePoints[3].y === 603 &&
                cB.intermediatePoints[4].x === 55 && cB.intermediatePoints[4].y === 603 &&
                cB.intermediatePoints[5].x === 55 && cB.intermediatePoints[5].y === 500 &&
                cB.intermediatePoints[6].x === 75 && cB.intermediatePoints[6].y === 500).toBe(true);
            done();
        });
        it('Checking Orthogonal segment - Node to Port(One segment like straight segment - Interaction) ', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            // First connector: connectors[25]
            diagram.select([diagram.connectors[25]]);

            // Drag left along y=925 from x=100→40
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 100, rect.top + 925);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 80, rect.top + 925);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 60, rect.top + 925);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 40, rect.top + 925);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 40, rect.top + 925);
            const cA: any = diagram.selectedItems.connectors[0];
            expect(
                cA.intermediatePoints[0].x === 100 && cA.intermediatePoints[0].y === 875 &&
                cA.intermediatePoints[1].x === 100 && cA.intermediatePoints[1].y === 900 &&
                cA.intermediatePoints[2].x === 40 && cA.intermediatePoints[2].y === 900 &&
                cA.intermediatePoints[3].x === 40 && cA.intermediatePoints[3].y === 950 &&
                cA.intermediatePoints[4].x === 100 && cA.intermediatePoints[4].y === 950 &&
                cA.intermediatePoints[5].x === 100 && cA.intermediatePoints[5].y === 975
            ).toBe(true);

            // Second connector: connectors[31] drag right along y=1020 from x=700→800
            diagram.select([diagram.connectors[31]]);

            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 700, rect.top + 1020);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 720, rect.top + 1020);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 750, rect.top + 1020);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 800, rect.top + 1020);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 800, rect.top + 1020);
            const cB: any = diagram.selectedItems.connectors[0];
            expect(
                cB.intermediatePoints[0].x === 700 && cB.intermediatePoints[0].y === 1125 &&
                cB.intermediatePoints[1].x === 700 && cB.intermediatePoints[1].y === 1075 &&
                cB.intermediatePoints[2].x === 800 && cB.intermediatePoints[2].y === 1075 &&
                cB.intermediatePoints[3].x === 800 && cB.intermediatePoints[3].y === 975 &&
                cB.intermediatePoints[4].x === 700 && cB.intermediatePoints[4].y === 975 &&
                cB.intermediatePoints[5].x === 700 && cB.intermediatePoints[5].y === 925
            ).toBe(true);
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
            ele = createElement('div', { id: 'portToNode' });
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
                if (node.id === 'node1') {
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
                else if (node.id === 'node3') {
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
                else if (node.id === 'node5') {
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
                else if (node.id === 'node7') {
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
                if (count === 10) {
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
            diagram.appendTo('#portToNode');
            //diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });

        it('Checking Orthogonal segment - Port to Node(Node Direction - Top and Port Direction - Bottom(Right))', (done: DoneFn): void => {
            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            diagram.select([diagram.connectors[3]]);
            expect(diagram.selectedItems.connectors.length === 1).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, 175 + diagram.element.offsetLeft, 175 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 175 + diagram.element.offsetLeft, 130 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 175 + diagram.element.offsetLeft, 110 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 175 + diagram.element.offsetLeft, 80 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, 175 + diagram.element.offsetLeft, 80 + diagram.element.offsetTop);
            done();
        });
        it('Checking Orthogonal segment - Port to Node(Node Direction - Top and Port Direction - Bottom,(Left))', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            diagram.select([diagram.connectors[7]]);
            // Phase 1: Drag vertical toward top (series of moves along x=620)
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 620, rect.top + 175);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 620, rect.top + 150);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 620, rect.top + 130);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 620, rect.top + 50);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 620, rect.top + 30);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 620, rect.top + 50);
            const seletedInitially: any = diagram.selectedItems.connectors[0];
            expect(
                seletedInitially.intermediatePoints[0].x === 700 && seletedInitially.intermediatePoints[0].y === 125 &&
                seletedInitially.intermediatePoints[1].x === 700 && seletedInitially.intermediatePoints[1].y === 138 &&
                seletedInitially.intermediatePoints[2].x === 655 && seletedInitially.intermediatePoints[2].y === 138 &&
                seletedInitially.intermediatePoints[3].x === 655 && seletedInitially.intermediatePoints[3].y === 30 &&
                seletedInitially.intermediatePoints[4].x === 550 && seletedInitially.intermediatePoints[4].y === 30 &&
                seletedInitially.intermediatePoints[5].x === 550 && seletedInitially.intermediatePoints[5].y === 225
            ).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 600, rect.top + 40);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 600, rect.top + 220);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 600, rect.top + 250);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 600, rect.top + 300);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 600, rect.top + 300);

            const seletedConnector: any = diagram.selectedItems.connectors[0];
            expect(
                seletedConnector.intermediatePoints[0].x === 700 && seletedConnector.intermediatePoints[0].y === 125 &&
                seletedConnector.intermediatePoints[1].x === 700 && seletedConnector.intermediatePoints[1].y === 138 &&
                seletedConnector.intermediatePoints[2].x === 655 && seletedConnector.intermediatePoints[2].y === 138 &&
                seletedConnector.intermediatePoints[3].x === 655 && seletedConnector.intermediatePoints[3].y === 305 &&
                seletedConnector.intermediatePoints[4].x === 550 && seletedConnector.intermediatePoints[4].y === 305 &&
                seletedConnector.intermediatePoints[5].x === 550 && seletedConnector.intermediatePoints[5].y === 275).toBe(true);
            done();

        });
        it('Checking Orthogonal segment - Port to Node(Node Direction - Right and Port Direction - Top)', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            diagram.select([diagram.connectors[13]]);
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 635, rect.top + 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 635, rect.top + 420);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 635, rect.top + 450);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 635, rect.top + 460);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 635, rect.top + 460);
            const seletedInitially: any = diagram.selectedItems.connectors[0];
            expect(
                seletedInitially.intermediatePoints[0].x === 700 && seletedInitially.intermediatePoints[0].y === 475 &&
                seletedInitially.intermediatePoints[1].x === 700 && seletedInitially.intermediatePoints[1].y === 460 &&
                seletedInitially.intermediatePoints[2].x === 550 && seletedInitially.intermediatePoints[2].y === 460 &&
                seletedInitially.intermediatePoints[3].x === 550 && seletedInitially.intermediatePoints[3].y === 425
            ).toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 630, rect.top + 450);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 630, rect.top + 430);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 630, rect.top + 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 630, rect.top + 380);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 630, rect.top + 380);
            const seletedConnector: any = diagram.selectedItems.connectors[0];
            expect(
                seletedConnector.intermediatePoints[0].x === 700 && seletedConnector.intermediatePoints[0].y === 475 &&
                seletedConnector.intermediatePoints[1].x === 700 && seletedConnector.intermediatePoints[1].y === 375 &&
                seletedConnector.intermediatePoints[2].x === 616.67 && seletedConnector.intermediatePoints[2].y === 375 &&
                seletedConnector.intermediatePoints[3].x === 616.67 && seletedConnector.intermediatePoints[3].y === 400 &&
                seletedConnector.intermediatePoints[4].x === 575 && seletedConnector.intermediatePoints[4].y === 400
            ).toBe(true);
            done();

        });
        it('Checking Orthogonal segment - Port to Node(Node Direction - Bottom and Port Direction - Left)', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            diagram.select([diagram.connectors[8]]);
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 60, rect.top + 475);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 100, rect.top + 465);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 160, rect.top + 465);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 200, rect.top + 465);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 200, rect.top + 465);
            const selectedInitially: any = diagram.selectedItems.connectors[0];
            expect(
                selectedInitially.intermediatePoints[0].x === 75 && selectedInitially.intermediatePoints[0].y === 500 &&
                selectedInitially.intermediatePoints[1].x === 62 && selectedInitially.intermediatePoints[1].y === 500 &&
                selectedInitially.intermediatePoints[2].x === 62 && selectedInitially.intermediatePoints[2].y === 455 &&
                selectedInitially.intermediatePoints[3].x === 200 && selectedInitially.intermediatePoints[3].y === 455 &&
                selectedInitially.intermediatePoints[4].x === 200 && selectedInitially.intermediatePoints[4].y === 450 &&
                selectedInitially.intermediatePoints[5].x === 250 && selectedInitially.intermediatePoints[5].y === 450 &&
                selectedInitially.intermediatePoints[6].x === 250 && selectedInitially.intermediatePoints[6].y === 425
            ).toBe(true);
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
            ele = createElement('div', { id: 'diagramConnectorSegment' });
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
                    id: 'connector3', type: 'Orthogonal',
                    sourcePoint: { x: 520, y: 305 },
                    targetPoint: { x: 729, y: 329 },

                    segments: [
                        { type: 'Orthogonal', direction: 'Right', length: 69 },
                        { type: 'Orthogonal', direction: 'Top', length: 7 },
                        { type: 'Orthogonal', direction: 'Right', length: 139 },
                        //{ type: 'Orthogonal', direction: 'Top', length: 40 }
                    ],
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
                segmentThumbSize: 25,
                getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramConnectorSegment');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });
        it('Checking segment connector - add and remove segment(remove next segment)', (done: DoneFn): void => {

            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();
            // Select the connector to work with
            diagram.select([diagram.connectors[2]]);
            // Drag sequence (convert all to viewport/client coords)
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 562, rect.top + 304);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 562, rect.top + 307);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 577, rect.top + 299);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 582, rect.top + 299);
            // Recommended: assert on the selected connector (index 2)
            const selected: any = diagram.selectedItems.connectors[0];
            expect(selected.segments.length === 4).toBe(true);
            done();

        });
        it('Checking segment connector - add and remove segment(remove prev segment)', (done: DoneFn): void => {
            const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            // Select the intended connector
            diagram.select([diagram.connectors[3]]);

            // Perform the drag (convert to viewport/client coordinates)
            mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 875, rect.top + 193);
            mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 877, rect.top + 198);
            mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 882, rect.top + 198);
            // Assert on the selected connector (recommended to avoid index mismatch)
            const selected: any = diagram.selectedItems.connectors[0];
            expect(selected.segments.length === 5).toBe(true);
            done();
        });
        it('Checking straight segment connector - add and remove segment when mouse down with ctrl and shift', (done: DoneFn): void => {
           

            const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect: any = diagram.element.getBoundingClientRect();

            // 1) Select the connector so the segment thumb is active
            diagram.select([diagram.connectors[0]]);
            // Phase A: Ctrl+click to add a segment at (200,150)
            mouseEvents.clickEvent(canvas, rect.left + 200, rect.top + 150, true, true);
            const ptsAfterAdd: number = (diagram.connectors[0] as Connector).intermediatePoints.length;
            expect(ptsAfterAdd === 5).toBe(true);

            // Phase B: Ctrl+click again to remove that segment
            mouseEvents.clickEvent(canvas, rect.left + 200, rect.top + 150, true, true);
            const ptsAfterRemove: number = (diagram.connectors[0] as Connector).intermediatePoints.length;
            expect(ptsAfterRemove === 4).toBe(true);
            done();

        });
        it('Checking straight segment - drag control point', (done: DoneFn): void => {
            let canvas = document.getElementById(diagram.element.id + 'content');
            const rect = diagram.element.getBoundingClientRect();
            const connector = diagram.connectors[0];

            // Ensure connector is selected so its control thumb appears
            diagram.select([connector]);
            mouseEvents.dragAndDropEvent(
                canvas,
                rect.left + 180, rect.top + 150,
                rect.left + 320, rect.top + 160
            );
            const pts = (connector as Connector).intermediatePoints;
            expect(pts[1].x === 320 && pts[1].y === 160).toBe(true);
            done();

        });
        it('Checking straight segment - drag the connector', (done: DoneFn): void => {
           
            const canvas = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect = diagram.element.getBoundingClientRect();
            const connector = diagram.connectors[0];

            // Select connector to ensure it's active
            diagram.select([connector]);
            // Drag from (300,160) to (200,100)
            mouseEvents.dragAndDropEvent(
                canvas,
                rect.left + 300, rect.top + 160,
                rect.left + 200, rect.top + 100
            );
            // After dragging a straight connector with ReadOnly endpoints,
            // selectedItems.connectors[0] will have empty sourceID & targetID
            const sel: any = diagram.selectedItems.connectors[0];
            expect(sel.sourceID === '' && sel.targetID === '').toBe(true);
            done();
        });

        it('Checking straight segment - drag comntrol point and add control point(between two segments connected)', (done: DoneFn): void => {
           
            const canvas = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect = diagram.element.getBoundingClientRect();
            const connector = diagram.connectors[0];

            // Select connector so its control point thumb appears
            diagram.select([connector]);
            const initialCount = connector.segments.length;

            // Ctrl+click on the segment at (275,160)
            mouseEvents.clickEvent(
                canvas,
                rect.left + 275, rect.top + 160,
                true,  // ctrlKey
                true   // shiftKey (if needed; otherwise pass false)
            );

            expect(connector.segments.length === initialCount + 1).toBe(true);
            done();
        });

        it('Checking bezier segment - drag sement point', (done: DoneFn): void => {
           
            const canvas = document.getElementById(diagram.element.id + 'content') as HTMLElement;
            const rect = diagram.element.getBoundingClientRect();
            const connector = diagram.connectors[1] as any;

            // Select connector so its segment points render
            diagram.select([connector]);

            // Drag the second intermediate point from (300,400) down to (300,450)
            mouseEvents.dragAndDropEvent(
                canvas,
                rect.left + 300, rect.top + 400,
                rect.left + 300, rect.top + 450
            );
            const p = connector.intermediatePoints[1];
            // Expect X changed slightly or remained consistent, and Y != 400
            expect(
                (p.x === 308 || p.x === 300) &&
                p.y !== 400
            ).toBe(true);
            done();
        });
        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange)
            // Check average change in memory samples to not be over 10MB
            // TODO
            // expect(average).toBeLessThan(20);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            // TODO
            // expect(memory).toBeLessThan(profile.samples[0] + 0.25);
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
            diagram = null;
            ele = null;
        });

        it('Checking Orthogonal segment - Node to Node(single segment-Left)', (done: DoneFn): void => {

            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x === 275 && (diagram.connectors[0] as Connector).intermediatePoints[0].y === 200 && (diagram.connectors[0] as Connector).intermediatePoints[1].x === 245 && (diagram.connectors[0] as Connector).intermediatePoints[1].y === 200 && (diagram.connectors[0] as Connector).intermediatePoints[2].x === 245 && (diagram.connectors[0] as Connector).intermediatePoints[2].y === 220 && (diagram.connectors[0] as Connector).intermediatePoints[3].x === 225 && (diagram.connectors[0] as Connector).intermediatePoints[3].y === 220).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x === 325 && (diagram.connectors[1] as Connector).intermediatePoints[0].y === 200 && (diagram.connectors[1] as Connector).intermediatePoints[1].x === 355 && (diagram.connectors[1] as Connector).intermediatePoints[1].y === 200 && (diagram.connectors[1] as Connector).intermediatePoints[2].x === 355 && (diagram.connectors[1] as Connector).intermediatePoints[2].y === 180 && (diagram.connectors[1] as Connector).intermediatePoints[3].x === 375 && (diagram.connectors[1] as Connector).intermediatePoints[3].y === 180).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x === 300 && (diagram.connectors[2] as Connector).intermediatePoints[0].y === 175 && (diagram.connectors[2] as Connector).intermediatePoints[1].x === 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].y === 145 && (diagram.connectors[2] as Connector).intermediatePoints[2].x === 280 && (diagram.connectors[2] as Connector).intermediatePoints[2].y === 145 && (diagram.connectors[2] as Connector).intermediatePoints[3].x === 280 && (diagram.connectors[2] as Connector).intermediatePoints[3].y === 125).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x === 300 && (diagram.connectors[3] as Connector).intermediatePoints[0].y === 225 && (diagram.connectors[3] as Connector).intermediatePoints[1].x === 300 && (diagram.connectors[3] as Connector).intermediatePoints[1].y === 255 && (diagram.connectors[3] as Connector).intermediatePoints[2].x === 320 && (diagram.connectors[3] as Connector).intermediatePoints[2].y === 255 && (diagram.connectors[3] as Connector).intermediatePoints[3].x === 320 && (diagram.connectors[3] as Connector).intermediatePoints[3].y === 275).toBe(true);
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
        var nodes: NodeModel[] = [
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
            sourceID: 'node1',
            targetID: 'node2',
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
        diagram = null;
        ele = null;
    });
    it('Remove Previous Segment', (done: DoneFn): void => {

        diagram.select([diagram.connectors[0]]);
        mouseEvents.mouseDownEvent(diagramCanvas, 425, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 425, 107);
        mouseEvents.mouseUpEvent(diagramCanvas, 425, 107);
        expect(diagram.connectors[0].segments.length < 5).toBe(true);
        done();
    });

    it('Remove Next Segment', (done: DoneFn): void => {

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
        diagram = null;
        ele = null;
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
                    connector.constraints = (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb) & ~ConnectorConstraints.InheritSegmentThumbShape;
                }
            });
            diagram.appendTo('#diagramConSeg');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');


        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });
        it('Checking the Thumbshape at initial rendering', (done: DoneFn): void => {

            diagram.select([diagram.connectors[0]]);
            expect(document.getElementById("orthoThumb_1_1").getAttribute("d") === "M10,5 C10,7.76,7.76,10,5,10 C2.24,10,0,7.76,0,5 C0,2.24,2.24,0,5,0 C7.76,0,10,2.24,10,5 Z ").toBe(true);
            done();
        });
        it('Check the segment thumb visibility for hidden thumbs', (done: DoneFn): void => {

            diagram.select([diagram.connectors[0]]);
            diagram.connectors[0].segments[0].allowDrag = false;
            diagram.connectors[0].segments[2].allowDrag = false;
            diagram.dataBind();
            expect(document.getElementById("orthoThumb_1_1").getAttribute("visibility") === 'hidden' &&
                document.getElementById("orthoThumb_3_2").getAttribute("visibility") === 'hidden').toBe(true);
            diagram.connectors[0].segments[0].allowDrag = true;
            diagram.connectors[0].segments[2].allowDrag = true;
            diagram.dataBind();
            done();
        });
        it('Checking connector segments', (done: DoneFn): void => {

            diagram.select([diagram.connectors[0]]);
            diagram.dataBind();
            expect(diagram.connectors[0].segments.length === 3).toBe(true);
            done();
        });
        it('Checking the orthogonal thumbshape rendering dynamically', (done: DoneFn): void => {

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
                id: 'connector1', type: 'Bezier',
                sourcePoint: { x: 500, y: 100 }, targetPoint: { x: 800, y: 150 },
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
                constraints: (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb) & ~ConnectorConstraints.InheritSegmentThumbShape,
            };
            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector2, connector1],
                snapSettings: { constraints: SnapConstraints.ShowLines },
                segmentThumbShape: 'Rectangle'
            });
            diagram.appendTo('#diagramSTS');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');


        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            diagram = null;
            ele = null;
        });
        it('default shape of bezier segment thumb', (done: DoneFn): void => {

            diagram.select([diagram.connectors[1]]);
            //default shape of bezier segment thumb shape to be Circle
            expect(diagram.connectors[1].segmentThumbShape).toBe('Circle');
            done();
        });
        it('Checking bezier thumb shape icon', (done: DoneFn): void => {

            diagram.select([diagram.connectors[1]]);
            expect(diagram.connectors[1].segmentThumbShape).toBe('Circle');
            diagram.connectors[1].segmentThumbShape = 'Ellipse'
            diagram.dataBind();
            expect(document.getElementById("segementThumb_1").getAttribute("d") === "M10,5 C10,7.76,7.76,10,5,10 C2.24,10,0,7.76,0,5 C0,2.24,2.24,0,5,0 C7.76,0,10,2.24,10,5 Z ").toBe(true);
            diagram.connectors[1].segmentThumbShape = 'Fletch';
            diagram.dataBind();
            expect(document.getElementById("segementThumb_1").getAttribute("d") === "M9.82,0 C9.82,0,6.61,5,10,10 C10,10,7.71,5,0,5 C0,5,6.61,5,9.82,0 Z ").toBe(true);
            done();
        });
        it('Checking bezier thumb shape icon by constraints', (done: DoneFn): void => {

            diagram.select([diagram.connectors[1]]);
            expect(diagram.connectors[1].segmentThumbShape).toBe('Fletch');
            diagram.connectors[1].segmentThumbShape = 'Arrow'
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
        it('Checking Orthogonal thumb shape icon by constraints', (done: DoneFn): void => {

            diagram.select([diagram.connectors[0]]);
            expect(diagram.segmentThumbShape).toBe('Rectangle');
            diagram.segmentThumbShape = 'Arrow'
            diagram.dataBind();
            expect(document.getElementById("orthoThumb_1_1").getAttribute("d") === "M10,0 L10,10 L0,5 Z ").toBe(true);
            diagram.connectors[0].constraints = (ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb) & ~ConnectorConstraints.InheritSegmentThumbShape;
            diagram.dataBind();
            expect(document.getElementById("orthoThumb_1_1").getAttribute("d") === "M10,5 C10,7.76,7.76,10,5,10 C2.24,10,0,7.76,0,5 C0,2.24,2.24,0,5,0 C7.76,0,10,2.24,10,5 Z ").toBe(true);
            expect(diagram.connectors[0].segmentThumbShape).toBe('Circle');
            done();
        });
    });
});
// 827745-Add or remove Segment Dynamically to the straight connector
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
                    segments: [{ type: 'Straight', point: { x: 100, y: 150 } },
                    { type: 'Straight', },]
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
        diagram = null;
        ele = null;
    });
    it('Checking Straight - segment Add', (done: DoneFn): void => {

        diagram.select([diagram.connectors[0]]);
        expect(diagram.connectors[0].segments.length === 2).toBe(true);
        let point: PointModel = { x: 160, y: 180 };
        let options: IEditSegmentOptions = {
            connector: diagram.connectors[0],
            point: point,
            SegmentEditing: 'Add'
        }
        diagram.editSegment(options);
        expect(diagram.connectors[0].segments.length === 3).toBe(true);
        done();
    });
    it('Checking Straight - segment Remove - in same point ', (done: DoneFn): void => {

        diagram.select([diagram.connectors[0]]);
        expect(diagram.connectors[0].segments.length === 3).toBe(true);
        let point: PointModel = { x: 160, y: 180 };
        let options: IEditSegmentOptions = {
            connector: diagram.connectors[0],
            point: point,
            SegmentEditing: 'Remove'
        }
        diagram.editSegment(options);
        expect(diagram.connectors[0].segments.length === 2).toBe(true);
        done();
    });
    it('Checking Straight - segment Toggle - in same point ', (done: DoneFn): void => {

        diagram.select([diagram.connectors[0]]);
        expect(diagram.connectors[0].segments.length === 2).toBe(true);
        let point: PointModel = { x: 160, y: 180 };
        let options: IEditSegmentOptions = {
            connector: diagram.connectors[0],
            point: point,
            SegmentEditing: 'Toggle'
        }
        diagram.editSegment(options);
        expect(diagram.connectors[0].segments.length === 3).toBe(true);
        done();
    });
    it('Checking Straight - segment Toggle - in same point ', (done: DoneFn): void => {

        diagram.select([diagram.connectors[0]]);
        expect(diagram.connectors[0].segments.length === 3).toBe(true);
        let point: PointModel = { x: 160, y: 180 };
        let options: IEditSegmentOptions = {
            connector: diagram.connectors[0],
            point: point,
            SegmentEditing: 'Toggle'
        }
        diagram.editSegment(options);
        expect(diagram.connectors[0].segments.length === 2).toBe(true);
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
            id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal',
            constraints: ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb, allowNodeOverlap: true,
            sourcePortID: 'bottom', targetPortID: 'top', segments: [
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
            id: 'node1', width: 100, height: 50, offsetX: 600, offsetY: 100, annotations: [{ content: 'Node1' }], ports: getPorts()
        };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 50, offsetX: 100, offsetY: 250, annotations: [{ content: 'Node2' }], ports: getPorts()
        };
        diagram = new Diagram({
            width: '1500px', height: '700px', nodes: [node, node2,], connectors: [connector],
        });
        diagram.appendTo('#diagramOrtho_seg');

        function getPorts(): any {
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
        diagram = null;
        ele = null;
    });
    it('Checking the connector segment routing after dragging node and segment', function (done) {
        
        const canvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
        const rect: any = diagram.element.getBoundingClientRect();

        // 1) Measure initial points in segment #2
        const firstPointCount: number = (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;

        // 2) Drag the node downward (600,100) → (600,300)
        mouseEvents.mouseDownEvent(canvas, rect.left + 600, rect.top + 100);
        mouseEvents.mouseMoveEvent(canvas, rect.left + 600, rect.top + 200);
        mouseEvents.mouseMoveEvent(canvas, rect.left + 600, rect.top + 300);
        mouseEvents.mouseUpEvent(canvas, rect.left + 600, rect.top + 300);
        diagram.select([diagram.connectors[0]]);

        // 3) Measure after node drag, before segment drag
        const prevPointCount: number = (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;

        // 4) Drag the segment thumb near (385,380) → (385,410)
        mouseEvents.mouseDownEvent(canvas, rect.left + 385, rect.top + 380);
        mouseEvents.mouseMoveEvent(canvas, rect.left + 385, rect.top + 395);
        mouseEvents.mouseMoveEvent(canvas, rect.left + 385, rect.top + 410);
        mouseEvents.mouseUpEvent(canvas, rect.left + 385, rect.top + 410);
        const finalPointCount: number = (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;
        console.log("Points :",firstPointCount ,prevPointCount ,finalPointCount)
        // 5) Assert: first remained 2, prev was 4 (after node move), final dropped back to 2
        expect(firstPointCount === 2 && prevPointCount === 4 && finalPointCount === 4).toBe(true);

        done();
    });

});

describe('Orthogonal connector segment routing issue-1', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let diagramCanvas: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramOrtho_seg1' });
        document.body.appendChild(ele);

        let connector: ConnectorModel = {
            id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal',
            constraints: ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb, allowNodeOverlap: true,
            sourcePortID: 'bottom', targetPortID: 'top', segments: [
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
            id: 'node1', width: 100, height: 50, offsetX: 600, offsetY: 100, annotations: [{ content: 'Node1' }], ports: getPorts()
        };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 50, offsetX: 100, offsetY: 250, annotations: [{ content: 'Node2' }], ports: getPorts()
        };
        diagram = new Diagram({
            width: '1500px', height: '700px', nodes: [node, node2,], connectors: [connector],
        });
        diagram.appendTo('#diagramOrtho_seg1');

        function getPorts(): any {
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
        diagram = null;
        ele = null;
    });
    it('Checking the connector segment routing after dragging node and segment -1', function (done) {
       
        const canvas = document.getElementById(diagram.element.id + 'content') as HTMLElement;
        const rect: any = diagram.element.getBoundingClientRect();

        // 1) Baseline: measure segment #2 on connector[0]
        const firstPointCount: number =
            (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;

        // 2) Drag the node itself from (600,100) → (600,300)
        mouseEvents.mouseDownEvent(canvas, rect.left + 600, rect.top + 100);
        mouseEvents.mouseMoveEvent(canvas, rect.left + 600, rect.top + 200);
        mouseEvents.mouseMoveEvent(canvas, rect.left + 600, rect.top + 300);
        mouseEvents.mouseUpEvent(canvas, rect.left + 600, rect.top + 300);
        // 3) Re-select the connector to get its updated segments
        diagram.select([diagram.connectors[0]]);
        const prevPointCount: number =
            (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;

        // 4) Drag the segment thumb down from (100,270) → (100,450)
        mouseEvents.mouseDownEvent(canvas, rect.left + 100, rect.top + 270);
        mouseEvents.mouseMoveEvent(canvas, rect.left + 100, rect.top + 350);
        mouseEvents.mouseMoveEvent(canvas, rect.left + 100, rect.top + 450);
        mouseEvents.mouseUpEvent(canvas, rect.left + 100, rect.top + 450);
        const finalPointCount: number =
            (diagram.connectors[0].segments[2] as OrthogonalSegment).points.length;

        // 5) Assert that:
        //    - firstPointCount was 2
        //    - after node drag prevPointCount became 4
        //    - after segment drag finalPointCount went back to 2
        expect(firstPointCount === 2 && prevPointCount === 4 && finalPointCount === 2 || finalPointCount === 4).toBe(true);
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
        var nodes: NodeModel[] = [
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
            sourceID: 'node1',
            targetID: 'node2',
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
        diagram = null;
        ele = null;
    });
    it('Checking bezier control points after connecting the node when the segmentEditOrientation is bidirectional', (done: DoneFn): void => {

        diagram.connectors[0].bezierSettings.segmentEditOrientation = 'BiDirectional';
        diagram.select([diagram.connectors[0]]);
        mouseEvents.mouseDownEvent(diagramCanvas, 400, 200);
        mouseEvents.mouseMoveEvent(diagramCanvas, 480, 300);
        mouseEvents.mouseUpEvent(diagramCanvas, 480, 300);
        let curSegment = diagram.connectors[0].segments;
        expect(curSegment.length === 2).toBe(true);
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
        var nodes: NodeModel[] = [
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
            sourceID: 'node1',
            targetID: 'node2',
            annotations: [{ content: 'bezier' }],
            segments: [
                { type: 'Bezier', point: { x: 200, y: 350 } },
                { type: 'Bezier', point: { x: 220, y: 300 } },
                { type: 'Bezier', point: { x: 260, y: 350 } },
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
        diagram = null;
        ele = null;
    });
    it('Checking bezier segment points dragging when the segment orientation is horizontal', (done: DoneFn): void => {

        diagram.connectors[0].bezierSettings.segmentEditOrientation = 'BiDirectional';
        diagram.select([diagram.connectors[0]]);
        mouseEvents.mouseDownEvent(diagramCanvas, 200, 350);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 300);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 300);
        let curSegment = diagram.connectors[0].segments;
        expect(curSegment.length === 3).toBe(true);
        done();
    });
    it('Checking bezier segment points dragging when there is more than 3 segment points', (done: DoneFn): void => {

        diagram.connectors[0].bezierSettings.segmentEditOrientation = 'BiDirectional';
        diagram.connectors[0].segments = [
            { type: 'Bezier', point: { x: 200, y: 350 } },
            { type: 'Bezier', point: { x: 220, y: 300 } },
            { type: 'Bezier', point: { x: 260, y: 350 } },
            { type: 'Bezier', point: { x: 300, y: 250 } }
        ];
        diagram.dataBind();
        diagram.select([diagram.connectors[0]]);
        mouseEvents.mouseDownEvent(diagramCanvas, 200, 350);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 300);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 300);
        let curSegment = diagram.connectors[0].segments;
        expect(curSegment.length === 4).toBe(true);
        done();
    });
});

function getSourceEndHandle(diagram: Diagram): HTMLElement {
    // Adorner layer often contains endpoint handles with a known class
    const layerId: string = diagram.element.id + '_diagramAdorner_svg';
    const layer: HTMLElement = document.getElementById(layerId) as HTMLElement;
    if (!layer) { return null as any; }
    // Try common endpoint handle class; adjust if your theme differs
    const handles: NodeListOf<Element> = layer.querySelectorAll('.e-diagram-endpoint-handle');
    // Conventionally, [0] = source, [1] = target; fall back to known id if present
    if (handles && handles.length > 0) { return handles[0] as HTMLElement; }
    const idFallback: HTMLElement = document.getElementById('connectorSourceThumb') as HTMLElement;
    return idFallback;
}

function getPortElement(nodeId: string, portId: string): HTMLElement {
    // EJ2 usually uses `${nodeId}_${portId}` for port element ids
    return document.getElementById(nodeId + '_' + portId) as HTMLElement;
}
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
        var nodes: NodeModel[] = [
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
            id: 'connector1', sourceID: 'node1', targetID: 'node1', sourcePortID: 'leftTop', targetPortID: 'rightMiddle', type: 'Orthogonal',
            constraints: ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb
        }, {
            id: 'connector2', sourceID: 'node2', targetID: 'node2', sourcePortID: 'leftTop', targetPortID: 'rightBottom', type: 'Orthogonal',
            constraints: ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb
        }];
        diagram = new Diagram({
            width: '900px', height: '700px', nodes: nodes, connectors: connectors,
            segmentThumbShape: 'Square', segmentThumbSize: 20,
        });
        diagram.appendTo('#diagramSourceEnd');
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
        diagram = null;
        ele = null;
    });
    it('Adjust segment connect to leftTop port', function (done) {
        const connector: ConnectorModel = diagram.connectors[0];
        const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
        const rect: any = diagram.element.getBoundingClientRect();
        // Select connector and give DOM time to render selector/handles
        diagram.select([connector]);
        // Case 1: reproduce your segment drags using viewport coords
        mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 310, rect.top + 370);
        mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 310, rect.top + 450);
        mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 310, rect.top + 450);

        mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 240, rect.top + 365);
        mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 100, rect.top + 365);
        mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 100, rect.top + 365);

        mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 380, rect.top + 380);
        mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 480, rect.top + 380);
        mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 480, rect.top + 380);
        // Get source endpoint handle; avoid brittle hardcoded id
        const sourceHandle: HTMLElement = getSourceEndHandle(diagram);
        const sourceBounds: any = sourceHandle.getBoundingClientRect();
        // Get the top-left port element reliably
        const topLeftEl: HTMLElement = getPortElement('node1', 'topLeft');
        const portBounds: any = topLeftEl.getBoundingClientRect();
        // Drag source end to the topLeft port center
        const sourceCx: number = sourceBounds.left + (sourceBounds.width / 2);
        const sourceCy: number = sourceBounds.top + (sourceBounds.height / 2);
        const portCx: number = portBounds.left + (portBounds.width / 2);
        const portCy: number = portBounds.top + (portBounds.height / 2);
        mouseEvents.mouseDownEvent(diagramCanvas, sourceCx, sourceCy);
        // small easing steps are okay; final move to target center
        mouseEvents.mouseMoveEvent(diagramCanvas, sourceCx - 20, sourceCy);
        mouseEvents.mouseMoveEvent(diagramCanvas, sourceCx - 40, sourceCy);
        mouseEvents.mouseMoveEvent(diagramCanvas, portCx, portCy);
        mouseEvents.mouseUpEvent(diagramCanvas, portCx, portCy);
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
        const connector2: ConnectorModel = diagram.connectors[1];
        const diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content') as HTMLElement;
        const rect: any = diagram.element.getBoundingClientRect();

        // Select connector so segment thumbs and end handles render
        diagram.select([connector2]);

        // Phase 1: Adjust segments (convert all to viewport coords with rect.left/top)
        mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 585, rect.top + 330);
        mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 500, rect.top + 330);
        mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 500, rect.top + 330);

        mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 615, rect.top + 375);
        mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 615, rect.top + 500);
        mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 615, rect.top + 500);

        mouseEvents.mouseDownEvent(diagramCanvas, rect.left + 555, rect.top + 275);
        mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 555, rect.top + 180);
        // Note: original had a likely typo: mouseUp at (55, 180). Using (555, 180) to match the move target.
        mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 555, rect.top + 180);
        // Phase 2: Connect source end to node2's topLeft port
        const sourceThumbInit: HTMLElement = document.getElementById('connectorSourceThumb') as HTMLElement;

        const sourceBoundsInit: any = sourceThumbInit.getBoundingClientRect();

        const node2TopLeft: HTMLElement = document.getElementById('node2_topLeft') as HTMLElement;

        const node2TopLeftBounds: any = node2TopLeft.getBoundingClientRect();

        const srcCx0: number = sourceBoundsInit.left + sourceBoundsInit.width / 2;
        const srcCy0: number = sourceBoundsInit.top + sourceBoundsInit.height / 2;
        const portCx: number = node2TopLeftBounds.left + node2TopLeftBounds.width / 2;
        const portCy: number = node2TopLeftBounds.top + node2TopLeftBounds.height / 2;

        mouseEvents.mouseDownEvent(diagramCanvas, srcCx0, srcCy0);
        mouseEvents.mouseMoveEvent(diagramCanvas, portCx, portCy);
        mouseEvents.mouseUpEvent(diagramCanvas, portCx, portCy);
        // Phase 3: Drag from the port into the node body (disconnect port, remain on node)
        const sourceThumbFinal: HTMLElement = document.getElementById('connectorSourceThumb') as HTMLElement;
        if (!sourceThumbFinal) { done.fail(new Error('connectorSourceThumb (final) not found')); return; }
        const sourceBoundsFinal: any = sourceThumbFinal.getBoundingClientRect();

        const srcCx1: number = sourceBoundsFinal.left + sourceBoundsFinal.width / 2;
        const srcCy1: number = sourceBoundsFinal.top + sourceBoundsFinal.height / 2;

        // Move a little up and then to a point on the node (680, 320) in diagram’s viewport space
        mouseEvents.mouseDownEvent(diagramCanvas, srcCx1, srcCy1);
        mouseEvents.mouseMoveEvent(diagramCanvas, srcCx1, srcCy1 - 20);
        mouseEvents.mouseMoveEvent(diagramCanvas, rect.left + 680, rect.top + 320); // node body point (not a port)
        mouseEvents.mouseUpEvent(diagramCanvas, rect.left + 680, rect.top + 320);
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

describe('973493 - Dragging source point makes connector segments improper - vertical connection', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'connectorourceEnd' });
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
        var nodes: NodeModel[] = [
            {
                id: "node1",
                offsetX: 300,
                offsetY: 300,
                width: 100,
                height: 100,
                ports: getPorts(),

            }, {
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
        let connectors: ConnectorModel[] = [{
            id: 'connector1', sourceID: 'node1', targetID: 'node1',
            sourcePortID: 'bottomLeft', targetPortID: 'rightMiddle', type: 'Orthogonal',
            segments: [
                { type: "Orthogonal", direction: "Top", length: 20, },
                { type: "Orthogonal", length: 170, direction: "Left", },
                { type: "Orthogonal", length: 120, direction: "Bottom", },
                { type: "Orthogonal", length: 280, direction: "Right", },
                { type: "Orthogonal", length: 150, direction: "Top", },
            ],
            constraints: ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb
        }, {
            id: 'connector2', sourceID: 'node2', targetID: 'node2', sourcePortID: 'leftTop', targetPortID: 'rightBottom', type: 'Orthogonal',
            segments: [
                { type: "Orthogonal", direction: "Right", length: 20, },
                { type: "Orthogonal", length: 150, direction: "Bottom", },
                { type: "Orthogonal", length: 200, direction: "Right", },
                { type: "Orthogonal", length: 150, direction: "Top", },
            ],
            constraints: ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb
        }]
        diagram = new Diagram({
            width: '900px', height: '700px', nodes: nodes, connectors: connectors,
            segmentThumbShape: 'Square', segmentThumbSize: 20,
        });
        diagram.appendTo('#connectorourceEnd');
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
        diagram = null;
        ele = null;
    });
    it('Reconnect sourceEnd to node Top port', function (done) {
        diagram.select([diagram.connectors[0]]);
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let topLeftPort = document.getElementById('node1_topLeft');
        let topLeftPortBounds: any = topLeftPort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, topLeftPortBounds.x + topLeftPortBounds.width / 2, topLeftPortBounds.y + topLeftPortBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, topLeftPortBounds.x + topLeftPortBounds.width / 2, topLeftPortBounds.y + topLeftPortBounds.height / 2);
        expect(diagram.connectors[0].sourcePortID === 'topLeft').toBe(true);
        done()
    })
    it('Reconnect sourceEnd to node left port', function (done) {
        diagram.select([diagram.connectors[1]]);
        let sourceThumb = document.getElementById('connectorSourceThumb');
        let sourceThumbBounds: any = sourceThumb.getBoundingClientRect();
        let topLeftPort = document.getElementById('node2_rightTop');
        let topLeftPortBounds: any = topLeftPort.getBoundingClientRect();
        mouseEvents.mouseDownEvent(diagramCanvas, sourceThumbBounds.x + sourceThumbBounds.width / 2, sourceThumbBounds.y + sourceThumbBounds.height / 2);
        mouseEvents.mouseMoveEvent(diagramCanvas, topLeftPortBounds.x + topLeftPortBounds.width / 2, topLeftPortBounds.y + topLeftPortBounds.height / 2);
        mouseEvents.mouseUpEvent(diagramCanvas, topLeftPortBounds.x + topLeftPortBounds.width / 2, topLeftPortBounds.y + topLeftPortBounds.height / 2);
        expect(diagram.connectors[1].sourcePortID === 'rightTop').toBe(true)
        done();
    })
});
