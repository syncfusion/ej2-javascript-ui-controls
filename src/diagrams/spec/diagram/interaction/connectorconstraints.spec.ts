import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { BezierSegment } from '../../../src/diagram/objects/connector';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { Segments, ConnectorConstraints } from '../../../src/diagram/enum/enum';
import { SelectorModel } from '../../../src/diagram/interaction/selector-model';
import { MouseEvents } from './mouseevents.spec';
/**
 * Connector Constraints spec
 */
describe('Diagram Control', () => {

    describe('Conectors with Constraints', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Orthogonal',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 }
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Straight',
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 300, y: 200 }
            };
            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Orthogonal',
                sourcePoint: { x: 400, y: 100 },
                targetPoint: { x: 500, y: 200 }
            };
            let connector4: ConnectorModel = {
                id: 'connector4',
                type: 'Orthogonal',
                sourcePoint: { x: 600, y: 100 },
                targetPoint: { x: 700, y: 200 }
            };
            let connector5: ConnectorModel = {
                id: 'connector5',
                type: 'Straight',
                sourcePoint: { x: 700, y: 100 },
                targetPoint: { x: 700, y: 200 }
            };
            let connector6: ConnectorModel = {
                id: 'connector6',
                type: 'Straight',
                sourcePoint: { x: 900, y: 100 },
                targetPoint: { x: 900, y: 200 }
            };
            let connector7: ConnectorModel = {
                id: 'connector7',
                type: 'Straight',
                sourcePoint: { x: 900, y: 100 },
                targetPoint: { x: 900, y: 200 }
            };
            let connector8: ConnectorModel = {
                id: 'connector8',
                type: 'Bezier',
                constraints:ConnectorConstraints.Default&~ConnectorConstraints.DragSourceEnd&~ConnectorConstraints.DragTargetEnd,
                sourcePoint: { x: 100, y: 300 },
                    targetPoint: { x: 200, y: 400 }
            };
            diagram = new Diagram({
                width: '1000px', height: '700px',
                 connectors: [connector1, connector2, connector3, connector4, connector5, connector6, connector7,connector8]
                
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connector constraints - Select ', (done: Function) => {
            diagram.connectors[0].constraints = ConnectorConstraints.Default;
            diagram.connectors[1].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.Select;
            diagram.connectors[2].constraints = ConnectorConstraints.Interaction & ~ConnectorConstraints.Select;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            for (let i = 0; i < 3; i++) {
                switch (i) {
                    case 0:
                        mouseEvents.clickEvent(diagramCanvas, 200 + 8, 198 + 8);
                        expect(diagram.selectedItems.connectors.length === 1
                            && diagram.selectedItems.connectors[0].id === 'connector1').toBe(true);
                        done();
                        break;
                    case 1:
                        mouseEvents.clickEvent(diagramCanvas, 300 + 8, 198 + 8);
                        expect(diagram.selectedItems.connectors.length === 0).toBe(true)
                        done();
                        break;
                    case 2:
                        mouseEvents.clickEvent(diagramCanvas, 500 + 8, 198 + 8);
                        expect(diagram.selectedItems.connectors.length === 0).toBe(true)
                        done();
                        break;
                }
            }
        });

        it('Checking connector constraints - Drag ', (done: Function) => {
            diagram.connectors[0].constraints = ConnectorConstraints.Default;
            diagram.connectors[1].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.Drag;
            diagram.connectors[2].constraints = ConnectorConstraints.Interaction & ~ConnectorConstraints.Drag;
            let conn, tx, ty, sourcePointx, sourcePointy, targetPointx, targetPointy;
            for (let i = 0; i < 3; i++) {
                conn = diagram.connectors[i];
                tx = 10;
                ty = 10;
                sourcePointx = diagram.connectors[i].sourcePoint.x;
                sourcePointy = diagram.connectors[i].sourcePoint.y;
                targetPointx = diagram.connectors[i].targetPoint.x;
                targetPointy = diagram.connectors[i].targetPoint.y;
                diagram.drag(conn, tx, ty);
                switch (i) {
                    case 0:
                        expect(diagram.connectors[0].sourcePoint.x === sourcePointx + tx
                            && diagram.connectors[0].sourcePoint.y === sourcePointy + ty
                            && diagram.connectors[0].targetPoint.x === targetPointx + tx
                            && diagram.connectors[0].targetPoint.y === targetPointy + ty).toBe(true)
                        done();
                        break;
                    case 1:
                        expect(diagram.connectors[1].sourcePoint.x != sourcePointx + tx
                            && diagram.connectors[1].sourcePoint.y != sourcePointy + ty
                            && diagram.connectors[1].targetPoint.x != targetPointx + tx
                            && diagram.connectors[1].targetPoint.y != targetPointy + ty).toBe(true)
                        done();
                        break;
                    case 2:
                        expect(diagram.connectors[2].sourcePoint.x != sourcePointx + tx
                            && diagram.connectors[2].sourcePoint.x != sourcePointx + tx
                            && diagram.connectors[2].sourcePoint.x != sourcePointx + tx
                            && diagram.connectors[2].sourcePoint.x != sourcePointx + tx).toBe(true)
                        done();
                        break;
                }
            }
        });

        it('Checking connector constraints - DragSourceEnd ', (done: Function) => {
            diagram.connectors[0].constraints = ConnectorConstraints.Default;
            diagram.connectors[1].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.DragSourceEnd;
            diagram.connectors[2].constraints = ConnectorConstraints.Interaction & ~ConnectorConstraints.DragSourceEnd;
            let conn, tx, ty, sourcePointx, sourcePointy;
            for (let i = 0; i < 3; i++) {
                conn = diagram.connectors[i];
                tx = 10;
                ty = 10;
                sourcePointx = diagram.connectors[i].sourcePoint.x;
                sourcePointy = diagram.connectors[i].sourcePoint.y;
                diagram.dragSourceEnd(conn, tx, ty);
                switch (i) {
                    case 0:
                        expect(diagram.connectors[0].sourcePoint.x === sourcePointx + tx
                            && diagram.connectors[0].sourcePoint.y === sourcePointy + ty).toBe(true)
                        done();
                        break;
                    case 1:
                        expect(diagram.connectors[1].sourcePoint.x != sourcePointx + tx &&
                            diagram.connectors[1].sourcePoint.y != sourcePointy + ty).toBe(true)
                        done();
                        break;
                    case 2:
                        expect(diagram.connectors[2].sourcePoint.x != sourcePointx + tx &&
                            diagram.connectors[2].sourcePoint.y != sourcePointy + ty).toBe(true)
                        done();
                        break;
                }
            }
        });

        it('Checking connector constraints - DragTargetEnd ', (done: Function) => {
            diagram.connectors[0].constraints = ConnectorConstraints.Default;
            diagram.connectors[1].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.DragTargetEnd;
            diagram.connectors[2].constraints = ConnectorConstraints.Interaction & ~ConnectorConstraints.DragTargetEnd;
            let conn, tx, ty, targetPointx, targetPointy;
            for (let i = 0; i < 3; i++) {
                conn = diagram.connectors[i];
                tx = 10;
                ty = 10;
                targetPointx = diagram.connectors[i].targetPoint.x;
                targetPointy = diagram.connectors[i].targetPoint.y;
                diagram.dragTargetEnd(conn, tx, ty);
                switch (i) {
                    case 0:
                        expect(diagram.connectors[0].targetPoint.x === targetPointx + tx &&
                            diagram.connectors[0].targetPoint.y === targetPointy + ty).toBe(true)
                        done();
                        break;
                    case 1:
                        expect(diagram.connectors[1].targetPoint.x != targetPointx + tx &&
                            diagram.connectors[1].targetPoint.y != targetPointy + ty).toBe(true)
                        done();
                        break;
                    case 2:
                        expect(diagram.connectors[2].targetPoint.x != targetPointx + tx &&
                            diagram.connectors[2].targetPoint.y != targetPointy + ty).toBe(true)
                        done();
                        break;
                }
            }
        });

        it('Checking connector constraints with PointerEvents ', (done: Function) => {
            diagram.connectors[3].constraints = ConnectorConstraints.Default;
            diagram.connectors[4].constraints = ConnectorConstraints.Default;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 700 + 8, 198 + 8);
            expect(diagram.selectedItems.connectors[0].id === 'connector5').toBe(true)
            done();
        });

        it('Checking connector constraints without PointerEvents ', (done: Function) => {
            diagram.connectors[5].constraints = ConnectorConstraints.Default;
            diagram.connectors[6].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.PointerEvents;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 900 + 8, 198 + 8);
            expect(diagram.selectedItems.connectors[0].id === 'connector6').toBe(true)
            done();
        });

        it('Checking connector constraints - Delete ', (done: Function) => {
            diagram.clearSelection();
            diagram.selectedItems.connectors = [];
            diagram.selectedItems.nodes = [];
            diagram.connectors[0].constraints = ConnectorConstraints.Default;
            diagram.connectors[1].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.Delete;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let conns;
            for (let i = 0; i < 3; i++) {
                switch (i) {
                    case 0:
                        conns = diagram.connectors.length;
                        diagram.remove(diagram.connectors[0]);
                        expect(diagram.connectors.length != conns).toBe(true)
                        done();
                        break;
                    case 1:
                        conns = diagram.connectors.length;
                        diagram.remove(diagram.connectors[1]);
                        expect(diagram.connectors.length === conns).toBe(true)
                        done();
                        break;
                }
            }
        });
        it('Checking checking bezier source end target end constrants ', (done: Function) => {
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            var mouseEvents = new MouseEvents();
            mouseEvents.clickEvent(diagramCanvas, 100 + 8, 300 + 8);
            mouseEvents.dragAndDropEvent(diagramCanvas, 150, 298, 155, 302);
            mouseEvents.dragAndDropEvent(diagramCanvas, 154, 409, 160, 425);
            var connectors = diagram.selectedItems.connectors[0];
            expect((connectors.segments[0] as BezierSegment).bezierPoint1.x === 140 &&
                (connectors.segments[0] as BezierSegment).bezierPoint1.y === 300 &&
                (connectors.segments[0] as BezierSegment).bezierPoint2.x === 160 &&
                (connectors.segments[0] as BezierSegment).bezierPoint2.y === 420).toBe(true)
                done()
        })
    });
});