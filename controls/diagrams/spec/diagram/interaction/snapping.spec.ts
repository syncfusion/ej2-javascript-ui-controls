import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { GridlinesModel, SnapSettingsModel } from '../../../src/diagram/diagram/grid-lines-model';
import { SnapConstraints, NodeConstraints } from '../../../src/diagram/enum/enum';
import { DiagramScroller } from '../../../src/diagram/interaction/scroller';
import { Snapping } from '../../../src/diagram/objects/snapping';
import { Rect } from '../../../src/index';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../../src/diagram/primitives/matrix';
import { MouseEvents } from './mouseevents.spec';
import { SelectorConstraints } from '../../../src/diagram/index';
Diagram.Inject(Snapping);

/**
 * SnapSettings Spec
 */
describe('SnapSettings', () => {

    describe('Snap Settings', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();
        let horizontalGridlines: GridlinesModel = { lineColor: 'black', lineDashArray: '1,1' };
        let verticalGridlines: GridlinesModel = { lineColor: 'black', lineDashArray: '1,1' };
        let snapSettings: SnapSettingsModel = {
            snapObjectDistance: 5,
            constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
            horizontalGridlines, verticalGridlines
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 60, height: 60, offsetX: 100, offsetY: 100,
            };
            let node2: NodeModel = {
                id: 'node2', width: 60, height: 90, offsetX: 170, offsetY: 100,
            };
            let node3: NodeModel = {
                id: 'node3', width: 60, height: 120, offsetX: 240, offsetY: 100,
            };
            let node4: NodeModel = {
                id: 'node4', width: 60, height: 90, offsetX: 100, offsetY: 250,
            };
            let node5: NodeModel = {
                id: 'node5', width: 90, height: 90, offsetX: 185, offsetY: 250,
            };
            let node6: NodeModel = {
                id: 'node6', width: 120, height: 90, offsetX: 300, offsetY: 250,
            };
            let node7: NodeModel = {
                id: 'node7', width: 60, height: 60, offsetX: 100, offsetY: 380,
            };
            let node8: NodeModel = {
                id: 'node8', width: 60, height: 60, offsetX: 170, offsetY: 380,
            };
            let node9: NodeModel = {
                id: 'node9', width: 60, height: 60, offsetX: 240, offsetY: 380,
            };
            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 500, y: 100 }, targetPoint: { x: 550, y: 100 } };
            diagram = new Diagram({
                width: '1200px', height: '1600px',
                nodes: [node, node2, node3, node4, node5, node6, node7, node8, node9],
                connectors: [connector], snapSettings: { constraints: SnapConstraints.ShowLines },
                selectedItems: { constraints: SelectorConstraints.All & ~SelectorConstraints.ToolTip }
            });
            diagram.appendTo('#diagram');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Snap to object false', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 100, 243, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null).toBe(true);
            done();
        });
        it('Snap to object false with resize Left', (done: Function) => {
            diagram.nodes[2].offsetX = 240;
            diagram.nodes[2].offsetY = 100;
            diagram.nodes[2].height = 120;
            diagram.nodes[2].width = 60;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 140, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 140, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 138, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null).toBe(true);
            done();

            mouseEvents.mouseUpEvent(diagramCanvas, 138, 100);
        });
        it('Snap to object false with resize bottom', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 145);
            mouseEvents.mouseDownEvent(diagramCanvas, 170, 145);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 143);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 170, 143);
        });
        it('Snap to object false with Node constraints as Aspect ratio', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            (diagram.nodes[1] as NodeModel).constraints = NodeConstraints.AspectRatio | NodeConstraints.Default;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 200, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 202, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null && diagram.nodes[1].height !== 90).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 202, 100);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object false with Node constraints as Aspect ratio with start and end point same', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            (diagram.nodes[1] as NodeModel).constraints = NodeConstraints.AspectRatio | NodeConstraints.Default;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 200, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null && diagram.nodes[1].height === 90).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 200, 100);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object false with Node constraints as Aspect ratio with Resizing north east', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            (diagram.nodes[1] as NodeModel).constraints = NodeConstraints.AspectRatio | NodeConstraints.Default;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200, 55);
            mouseEvents.mouseDownEvent(diagramCanvas, 200, 55);
            mouseEvents.mouseMoveEvent(diagramCanvas, 202, 53);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null && diagram.nodes[1].height !== 90).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 202, 53);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Node constraints as Aspect ratio with Resizing north east with start and end point same', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            (diagram.nodes[1] as NodeModel).constraints = NodeConstraints.AspectRatio | NodeConstraints.Default;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200, 55);
            mouseEvents.mouseDownEvent(diagramCanvas, 200, 55);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200, 55);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null && diagram.nodes[1].height === 90).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 200, 55);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap with connector', (done: Function) => {
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 550, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 550, 100, 555, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 400, 100);
        });
        it('Snap to Lines with Resizing Left', (done: Function) => {
            diagram.nodes[0].offsetX = 100;
            diagram.nodes[0].offsetY = 100;
            diagram.nodes[0].height = 60;
            diagram.nodes[0].width = 60;
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 70, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 70, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 68, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null && selectionRect.firstChild !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 68, 100);
            mouseEvents.clickEvent(diagramCanvas, 400, 100);
        });
        it('Snap to Lines with Resizing Right', (done: Function) => {
            diagram.nodes[0].offsetX = 100;
            diagram.nodes[0].offsetY = 100;
            diagram.nodes[0].height = 60;
            diagram.nodes[0].width = 60;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 130, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 130, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 132, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null && selectionRect.firstChild !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 132, 100);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing Right With no Spacing Lines', (done: Function) => {
            diagram.nodes[0].offsetX = 100;
            diagram.nodes[0].offsetY = 100;
            diagram.nodes[0].height = 60;
            diagram.nodes[0].width = 60;
            let snapSettings1: SnapSettingsModel;
            snapSettings1 = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.SnapToObject | SnapConstraints.SnapToVerticalLines) | SnapConstraints.ShowLines,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings1;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 250);
            mouseEvents.mouseMoveEvent(diagramCanvas, 360, 250);
            mouseEvents.mouseDownEvent(diagramCanvas, 360, 250);
            mouseEvents.mouseMoveEvent(diagramCanvas, 361, 250);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 361, 250);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing Left With no Spacing Lines', (done: Function) => {
            diagram.nodes[5].offsetX = 300;
            diagram.nodes[5].offsetY = 250;
            diagram.nodes[5].height = 90;
            diagram.nodes[5].width = 120;
            let snapSettings1: SnapSettingsModel;
            snapSettings1 = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.SnapToObject | SnapConstraints.SnapToVerticalLines) | SnapConstraints.ShowLines,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings1;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 250);
            mouseEvents.mouseMoveEvent(diagramCanvas, 240, 250);
            mouseEvents.mouseDownEvent(diagramCanvas, 240, 250);
            mouseEvents.mouseMoveEvent(diagramCanvas, 238, 250);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 238, 250);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing Left With no Spacing Lines', (done: Function) => {
            diagram.nodes[5].offsetX = 300;
            diagram.nodes[5].offsetY = 250;
            diagram.nodes[5].height = 90;
            diagram.nodes[5].width = 120;
            let snapSettings1: SnapSettingsModel;
            snapSettings1 = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.SnapToObject | SnapConstraints.SnapToHorizontalLines) | SnapConstraints.ShowLines,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings1;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 250);
            mouseEvents.mouseMoveEvent(diagramCanvas, 240, 250);
            mouseEvents.mouseDownEvent(diagramCanvas, 240, 250);
            mouseEvents.mouseMoveEvent(diagramCanvas, 238, 250);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 238, 250);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing Right with distance as 5', (done: Function) => {
            diagram.nodes[5].offsetX = 300;
            diagram.nodes[5].offsetY = 250;
            diagram.nodes[5].height = 90;
            diagram.nodes[5].width = 120;
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 130, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 130, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 136, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 136, 100);
        });
        it('Snap to Lines with Resizing Top', (done: Function) => {
            diagram.nodes[0].offsetX = 100;
            diagram.nodes[0].offsetY = 100;
            diagram.nodes[0].height = 60;
            diagram.nodes[0].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100, 70);
            mouseEvents.mouseDownEvent(diagramCanvas, 100, 70);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100, 73);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null && selectionRect.firstChild !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 100, 73);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing Top with snap distance as 20', (done: Function) => {
            diagram.nodes[0].offsetX = 100;
            diagram.nodes[0].offsetY = 100;
            diagram.nodes[0].height = 60;
            diagram.nodes[0].width = 60;
            snapSettings = {
                snapObjectDistance: 20,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100, 70);
            mouseEvents.mouseDownEvent(diagramCanvas, 100, 70);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100, 73);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null && selectionRect.firstChild !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 100, 73);
        });
        it('Snap to Lines with Resizing TopBottom with snap distance as 5', (done: Function) => {
            for (let i: number = 0; i < diagram.connectors.length; i++) {
                diagram.remove(diagram.connectors[i]);
                //diagram.refreshDiagramLayer();
            }
            diagram.nodes[0].offsetX = 100;
            diagram.nodes[0].offsetY = 100;
            diagram.nodes[0].height = 60;
            diagram.nodes[0].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            diagram.refreshDiagramLayer();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 55);
            mouseEvents.mouseDownEvent(diagramCanvas, 170, 55);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 130);
            mouseEvents.mouseUpEvent(diagramCanvas, 170, 130);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing Bottom', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            diagram.dataBind();
            snapSettings = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 145);
            mouseEvents.mouseDownEvent(diagramCanvas, 170, 145);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 132);
            mouseEvents.mouseUpEvent(diagramCanvas, 170, 132);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing Bottomtop with snap Distance as 5', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            diagram.refreshDiagramLayer();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 145);
            mouseEvents.mouseDownEvent(diagramCanvas, 170, 145);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 72);
            mouseEvents.mouseUpEvent(diagramCanvas, 170, 72);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing top with horizontal lines', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.SnapToLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            diagram.refreshDiagramLayer();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 55);
            mouseEvents.mouseDownEvent(diagramCanvas, 170, 55);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 67);
            mouseEvents.mouseUpEvent(diagramCanvas, 170, 67);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing Right with Vertical lines', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.SnapToLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            diagram.refreshDiagramLayer();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 200, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 201, 100);
            let selection: HTMLElement = document.getElementById('_SnappingLines');
            expect(selection !== null).toBe(true);
            mouseEvents.mouseUpEvent(diagramCanvas, 201, 100);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing Left with Vertical lines', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.SnapToLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            diagram.refreshDiagramLayer();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 140, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 140, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 139, 100);
            let selection: HTMLElement = document.getElementById('_SnappingLines');
            expect(selection !== null).toBe(true);
            mouseEvents.mouseUpEvent(diagramCanvas, 139, 100);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing Bottom with Horizontal lines', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.SnapToLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            diagram.refreshDiagramLayer();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 145);
            mouseEvents.mouseDownEvent(diagramCanvas, 170, 145);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 132);
            mouseEvents.mouseUpEvent(diagramCanvas, 170, 132);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines With start and end point same', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.SnapToLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            diagram.refreshDiagramLayer();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 170, 93);
            mouseEvents.mouseDownEvent(diagramCanvas, 170, 93);
            mouseEvents.mouseUpEvent(diagramCanvas, 170, 93);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines With start and end point same with same width and same height lines', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.SnapToLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            diagram.refreshDiagramLayer();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 200, 100);
            mouseEvents.mouseUpEvent(diagramCanvas, 200, 100);

            mouseEvents.clickEvent(diagramCanvas, 240, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 270, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 270, 100);
            mouseEvents.mouseUpEvent(diagramCanvas, 270, 100);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to Lines with Resizing NorthEast', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 70, 70);
            mouseEvents.mouseDownEvent(diagramCanvas, 70, 70);
            mouseEvents.mouseMoveEvent(diagramCanvas, 68, 72);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null && selectionRect.firstChild !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 68, 72);
        });
        it('Snap to Lines with Resizing NorthWest', (done: Function) => {
            diagram.nodes[0].offsetX = 100;
            diagram.nodes[0].offsetY = 100;
            diagram.nodes[0].height = 60;
            diagram.nodes[0].width = 60;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 130, 70);
            mouseEvents.mouseDownEvent(diagramCanvas, 130, 70);
            mouseEvents.mouseMoveEvent(diagramCanvas, 132, 72);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 132, 72);
        });
        it('Snap to Lines with Resizing SouthEast', (done: Function) => {
            diagram.nodes[0].offsetX = 100;
            diagram.nodes[0].offsetY = 100;
            diagram.nodes[0].height = 60;
            diagram.nodes[0].width = 60;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 70, 130);
            mouseEvents.mouseDownEvent(diagramCanvas, 70, 130);
            mouseEvents.mouseMoveEvent(diagramCanvas, 68, 128);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null && selectionRect.firstChild !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 68, 128);
        });
        it('Snap to Lines with Resizing SouthWest', (done: Function) => {
            diagram.nodes[0].offsetX = 100;
            diagram.nodes[0].offsetY = 100;
            diagram.nodes[0].height = 60;
            diagram.nodes[0].width = 60;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 130, 130);
            mouseEvents.mouseDownEvent(diagramCanvas, 130, 130);
            mouseEvents.mouseMoveEvent(diagramCanvas, 128, 128);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 128, 128);
        });
        it('Snap to object true with Snap Left', (done: Function) => {
            diagram.nodes[2].offsetX = 240;
            diagram.nodes[2].offsetY = 100;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 100, 243, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap right', (done: Function) => {
            diagram.nodes[2].offsetX = 240;
            diagram.nodes[2].offsetY = 100;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 103, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap Top', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 380);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 380, 240, 377);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap Bottom', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 100, 171, 97);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap right with resize', (done: Function) => {
            diagram.nodes[2].offsetX = 240;
            diagram.nodes[2].offsetY = 100;
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 200, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 200, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 203, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null && selectionRect.firstChild !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 203, 100);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to vertical lines with same width', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].width = 60;
            diagram.nodes[1].height = 90;
            snapSettings = {
                constraints: SnapConstraints.SnapToVerticalLines | SnapConstraints.SnapToObject,
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 380);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 380, 240, 377);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to horizontal lines with same width', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].width = 60;
            diagram.nodes[1].height = 90;
            snapSettings = {
                constraints: SnapConstraints.SnapToHorizontalLines | SnapConstraints.SnapToObject,
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 103, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with nodes at left with Spacing Lines', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].width = 60;
            diagram.nodes[1].height = 90;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 250);
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 250, 298, 250);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with nodes at Right with Spacing Lines', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].width = 60;
            diagram.nodes[1].height = 90;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 185, 250);
            mouseEvents.dragAndDropEvent(diagramCanvas, 185, 250, 490, 250);
            mouseEvents.clickEvent(diagramCanvas, 100, 250);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 250, 115, 250);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with nodes at Bottom with Spacing Lines', (done: Function) => {
            diagram.nodes[4].offsetX = 185;
            diagram.nodes[4].offsetY = 250;
            diagram.nodes[3].offsetX = 100;
            diagram.nodes[3].offsetY = 250;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 100, 170, 125);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with nodes at Top with Spacing Lines', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 380);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 380, 170, 325);
            mouseEvents.clickEvent(diagramCanvas, 185, 250);
            mouseEvents.dragAndDropEvent(diagramCanvas, 185, 250, 185, 232);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with nodes at Top with Vertical Spacing Lines', (done: Function) => {
            diagram.nodes[4].offsetX = 185;
            diagram.nodes[4].offsetY = 250;
            diagram.nodes[7].offsetX = 170;
            diagram.nodes[7].offsetY = 380;
            diagram.nodes[8].height = 90;
            diagram.nodes[8].width = 90;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 380);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 380, 328, 365);
            mouseEvents.clickEvent(diagramCanvas, 240, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 100, 326, 124);
            mouseEvents.clickEvent(diagramCanvas, 326, 124);
            mouseEvents.mouseDownEvent(diagramCanvas, 326, 124);
            mouseEvents.mouseMoveEvent(diagramCanvas, 328, 124);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.mouseUpEvent(diagramCanvas, 328, 124);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object - Nodes at top with Spacing lines', (done: Function) => {
            for (let i: number = 0; i < diagram.connectors.length; i++) {
                diagram.remove(diagram.connectors[i]);
                //diagram.refreshDiagramLayer();
            }
            diagram.nodes[2].offsetX = 240;
            diagram.nodes[2].offsetY = 100;
            diagram.nodes[8].offsetX = 240;
            diagram.nodes[8].offsetY = 380;
            diagram.nodes[8].height = 90;
            diagram.nodes[8].width = 60;
            diagram.nodes[7].height = 90;
            diagram.nodes[7].width = 60;
            diagram.nodes[6].height = 90;
            diagram.nodes[6].width = 60;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 100, 326, 121);
            mouseEvents.clickEvent(diagramCanvas, 240, 380);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 380, 330, 368);
            mouseEvents.clickEvent(diagramCanvas, 330, 368);
            mouseEvents.mouseDownEvent(diagramCanvas, 330, 368);
            mouseEvents.mouseMoveEvent(diagramCanvas, 328, 364);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.mouseUpEvent(diagramCanvas, 328, 364);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with h Snap left as snap object distance 20', (done: Function) => {
            diagram.nodes[2].offsetX = 240;
            diagram.nodes[2].offsetY = 100;
            diagram.nodes[8].offsetX = 240;
            diagram.nodes[8].offsetY = 380;
            snapSettings = {
                snapObjectDistance: 20,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 210, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 206, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null && selectionRect.firstChild !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 206, 100);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with h Snap right as snap object distance 20', (done: Function) => {
            diagram.nodes[2].offsetX = 240;
            diagram.nodes[2].offsetY = 100;
            diagram.nodes[2].height = 120;
            diagram.nodes[2].width = 60;
            snapSettings = {
                snapObjectDistance: 20,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 270, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 254, 100);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null && selectionRect.firstChild !== null).toBe(true);
            done();
            mouseEvents.mouseUpEvent(diagramCanvas, 254, 100);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with towards left', (done: Function) => {
            diagram.nodes[2].offsetX = 240;
            diagram.nodes[2].offsetY = 100;
            diagram.nodes[2].height = 120;
            diagram.nodes[2].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.SnapToLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 100, 226, 96);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with towards top', (done: Function) => {
            diagram.nodes[2].offsetX = 240;
            diagram.nodes[2].offsetY = 100;
            diagram.nodes[2].height = 120;
            diagram.nodes[2].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.SnapToLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 100, 246, 94);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with towards top with bounds high', (done: Function) => {
            diagram.nodes[2].offsetX = 240;
            diagram.nodes[2].offsetY = 100;
            diagram.nodes[2].height = 120;
            diagram.nodes[2].width = 60;
            diagram.nodes[8].height = 90;
            diagram.nodes[8].width = 60;
            diagram.nodes[7].height = 90;
            diagram.nodes[7].width = 60;
            diagram.nodes[6].height = 90;
            diagram.nodes[6].width = 60;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.SnapToHorizontalLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 250);
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 250, 300, 246);
            //mouseEvents.dragAndDropEvent(diagramCanvas, 242, 372, 243, 265);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with towards bottom with bounds high', (done: Function) => {
            diagram.nodes[8].offsetX = 240;
            diagram.nodes[8].offsetY = 380;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.SnapToLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 380);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 380, 242, 396);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with towards bottom with bounds high', (done: Function) => {
            diagram.nodes[8].offsetX = 240;
            diagram.nodes[8].offsetY = 380;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.ShowLines | SnapConstraints.None,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 240, 380);
            mouseEvents.dragAndDropEvent(diagramCanvas, 240, 380, 242, 380);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with top object length as 1', (done: Function) => {
            diagram.nodes[8].offsetX = 240;
            diagram.nodes[8].offsetY = 380;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.ShowLines | SnapConstraints.None,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 250);
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 250, 302, 246);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect === null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with top object length as 1 with snap constraints', (done: Function) => {
            diagram.nodes[8].offsetX = 240;
            diagram.nodes[8].offsetY = 380;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.ShowLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 250);
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 250, 302, 246);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with right and left object length as 1', (done: Function) => {
            diagram.nodes[5].offsetX = 300;
            diagram.nodes[5].offsetY = 250;
            diagram.nodes[0].offsetX = 80;
            diagram.nodes[1].offsetX = 160;
            diagram.nodes[6].offsetX = 80;
            diagram.nodes[7].offsetX = 160;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.ShowLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 185, 250);
            mouseEvents.dragAndDropEvent(diagramCanvas, 185, 250, 186, 250);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with right and left object length as 1', (done: Function) => {
            diagram.nodes[4].offsetX = 185;
            diagram.nodes[4].offsetY = 250;
            diagram.nodes[0].offsetX = 80;
            diagram.nodes[1].offsetX = 160;
            diagram.nodes[6].offsetX = 80;
            diagram.nodes[7].offsetX = 160;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.ShowLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 185, 250);
            mouseEvents.dragAndDropEvent(diagramCanvas, 185, 250, 184, 250);
            mouseEvents.clickEvent(diagramCanvas, 185, 250);
            mouseEvents.dragAndDropEvent(diagramCanvas, 184, 250, 183, 250);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap Object with equally spaced as right', (done: Function) => {
            diagram.nodes[4].offsetX = 185;
            diagram.nodes[4].offsetY = 250;
            diagram.nodes[0].offsetX = 100;
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[6].offsetX = 100;
            diagram.nodes[7].offsetX = 170;
            diagram.nodes[3].width = 120;
            diagram.nodes[3].offsetX = 100;
            diagram.nodes[4].offsetX = 225;
            diagram.nodes[5].width = 60;
            diagram.nodes[5].offsetX = 325;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: SnapConstraints.ShowLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 250);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 250, 94, 250);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap Center Y', (done: Function) => {
            for (let i: number = diagram.nodes.length - 1; i > 1; i--) {
                diagram.remove(diagram.nodes[i]);
                //diagram.refreshDiagramLayer();
            }
            for (let i: number = 0; i < diagram.connectors.length; i++) {
                diagram.remove(diagram.connectors[i]);
                //diagram.refreshDiagramLayer();
            }
            diagram.nodes[0].offsetX = 100;
            diagram.nodes[0].offsetY = 100;
            diagram.nodes[0].height = 60;
            diagram.nodes[0].width = 60;
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            diagram.snapSettings = snapSettings;
            snapSettings = {
                snapObjectDistance: 5,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 100, 95, 215);
            mouseEvents.mouseDownEvent(diagramCanvas, 95, 215);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100, 215);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap LeftRight', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 100, 40, 215);
            mouseEvents.mouseDownEvent(diagramCanvas, 40, 215);
            mouseEvents.mouseMoveEvent(diagramCanvas, 43, 215);

            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap RightLeft', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 100, 160, 215);
            mouseEvents.mouseDownEvent(diagramCanvas, 160, 215);
            mouseEvents.mouseMoveEvent(diagramCanvas, 156, 215);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap TopBottom', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 100, 215, 170);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap BottomTop', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 100, 215, 30);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap Bottom', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 100, 200, 85);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap Top', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 100, 200, 115);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap angle', (done: Function) => {
            diagram.nodes[1].offsetX = 300;
            diagram.nodes[1].offsetY = 300;
            diagram.nodes[1].height = 100;
            diagram.nodes[1].width = 100;
            snapSettings = {
                snapObjectDistance: 5, snapAngle: 5,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            let output: string = '';
            let bounds: Rect = (diagram.nodes[1] as NodeModel).wrapper.bounds;
            let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, 50, bounds.center.x, bounds.center.y);
            let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
            mouseEvents.dragAndDropEvent(diagramCanvas, rotator.x + 8, rotator.y + 8, endPoint.x + 8, endPoint.y + 8);
            diagram.nodes[1].rotateAngle = Math.round(diagram.nodes[1].rotateAngle);
            expect(diagram.nodes[1].rotateAngle % 360 === 54).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Snap angle as 1', (done: Function) => {
            diagram.nodes[1].offsetX = 300;
            diagram.nodes[1].offsetY = 300;
            diagram.nodes[1].height = 100;
            diagram.nodes[1].width = 100;
            diagram.nodes[1].rotateAngle = 0;
            snapSettings = {
                snapObjectDistance: 5, snapAngle: 1,
                constraints: (SnapConstraints.ShowLines & SnapConstraints.SnapToLines) | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            let output: string = '';
            let bounds: Rect = (diagram.nodes[1] as NodeModel).wrapper.bounds;
            let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, 50, bounds.center.x, bounds.center.y);
            let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
            mouseEvents.dragAndDropEvent(diagramCanvas, rotator.x + 0.2, rotator.y + 0.2, endPoint.x + 0.2, endPoint.y + 0.2);
            diagram.nodes[1].rotateAngle = Math.round(diagram.nodes[1].rotateAngle);
            expect(diagram.nodes[1].rotateAngle % 360 === 46).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Vertical grid lines', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 100;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            diagram.nodes[1].rotateAngle = 0;
            snapSettings = {
                snapObjectDistance: 5, snapAngle: 1,
                constraints: SnapConstraints.SnapToVerticalLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 100, 168, 100);
            diagram.nodes[1].rotateAngle = Math.round(diagram.nodes[1].rotateAngle);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Snap to object true with Horizontal Snap', (done: Function) => {
            diagram.nodes[1].offsetX = 170;
            diagram.nodes[1].offsetY = 180;
            diagram.nodes[1].height = 90;
            diagram.nodes[1].width = 60;
            snapSettings = {
                snapObjectDistance: 5, snapAngle: 1,
                constraints: SnapConstraints.SnapToHorizontalLines | SnapConstraints.SnapToObject,
                horizontalGridlines, verticalGridlines
            };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 180);
            mouseEvents.dragAndDropEvent(diagramCanvas, 170, 180, 171, 181);
            diagram.nodes[1].rotateAngle = Math.round(diagram.nodes[1].rotateAngle);
            let selectionRect: HTMLElement = document.getElementById('_SnappingLines');
            expect(selectionRect !== null && selectionRect.firstChild === null).toBe(true);
            done();
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
        });
        it('Dragging the node outside the diagram issue fix', (done: Function) => {
            diagram.zoom(1.2);
            diagram.nodes;
            let node: HTMLElement = document.getElementById("node1_content")
            expect(node.attributes[6].value === 'rotate(0,100.5,100.5)').toBe(true);
            done();
        });

    });
    describe('Snap lines - Multiple selection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'SnapLinesMultipleSelection' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'NewIdea', width: 150, height: 60, offsetX: 300, offsetY: 60,
                shape: { type: 'Flow', shape: 'Terminator' },
                annotations: [{
                    id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
                }],
                constraints: NodeConstraints.Default | NodeConstraints.AspectRatio
            };

            let node2: NodeModel = {
                id: 'Meeting', width: 150, height: 60, offsetX: 300, offsetY: 155,
                shape: { type: 'Flow', shape: 'Process' },
                annotations: [{
                    id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
                }]
            };
            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Straight', sourceID: 'NewIdea', targetID: 'Meeting'
            };
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [node1, node2],
                connectors: [connector1
                ],
                snapSettings: {
                    horizontalGridlines: { lineIntervals: [0.95, 9.05, 0.2, 9.75], snapIntervals: [10] },
                    verticalGridlines: { lineIntervals: [0.95, 9.05, 0.2, 9.75], snapIntervals: [10] }
                },
                selectedItems: { constraints: SelectorConstraints.All & ~SelectorConstraints.ToolTip }
            });
            diagram.appendTo('#SnapLinesMultipleSelection');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking snap lines between seleted nodes - multiple selection', (done: Function) => {
            diagram.selectAll();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseDownEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 60 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, 400, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 410, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 410, 100);
            expect(document.getElementById('_SnappingLines') && document.getElementById('_SnappingLines').children.length == 0).toBe(true);
            done();
        });
    });
});