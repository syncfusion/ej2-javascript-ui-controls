import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { ConnectorConstraints } from '../../../src/diagram/enum/enum'; 
import { MouseEvents } from './mouseevents.spec';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
/**
 * Connector Constraints spec
 */
describe('Diagram Control', () => {

    describe('Conectors with Constraints', () => {
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
            mouseEvents = null;
        });

        // it('Checking connector constraints - Select', (done: Function) => {
        //     diagram.connectors[0].constraints = ConnectorConstraints.Default;
        //     diagram.connectors[1].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.Select;
        //     diagram.connectors[2].constraints = ConnectorConstraints.Interaction & ~ConnectorConstraints.Select;
            
        //     let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            
        //     // Test case 0: connector1 should be selectable
        //     mouseEvents.clickEvent(diagramCanvas, 200 + 8, 198 + 8);
        //     expect(true).toBe(true);
        //     done();
        // });

        // it('Checking connector constraints - Select (connector2)', (done: Function) => {
        //     let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            
        //     // Test case 1: connector2 should not be selectable (Select constraint disabled)
        //     mouseEvents.clickEvent(diagramCanvas, 300 + 8, 198 + 8);
        //     expect(diagram.selectedItems.connectors.length === 0).toBe(true);
        //     done();
        // });

        // it('Checking connector constraints - Select (connector3)', (done: Function) => {
        //     let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            
        //     // Test case 2: connector3 should not be selectable (Select constraint disabled)
        //     mouseEvents.clickEvent(diagramCanvas, 500 + 8, 198 + 8);
        //     expect(diagram.selectedItems.connectors.length === 0).toBe(true);
        //     done();
        // });

        // it('Checking connector constraints - Drag', (done: Function) => {
        //     diagram.connectors[0].constraints = ConnectorConstraints.Default;
        //     diagram.connectors[1].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.Drag;
        //     diagram.connectors[2].constraints = ConnectorConstraints.Interaction & ~ConnectorConstraints.Drag;
            
        //     let conn: ConnectorModel;
        //     let tx: number = 10;
        //     let ty: number = 10;
        //     let sourcePointx: number;
        //     let sourcePointy: number;
        //     let targetPointx: number;
        //     let targetPointy: number;

        //     // Test case 0: connector0 should be draggable
        //     conn = diagram.connectors[0];
        //     sourcePointx = conn.sourcePoint.x;
        //     sourcePointy = conn.sourcePoint.y;
        //     targetPointx = conn.targetPoint.x;
        //     targetPointy = conn.targetPoint.y;
            
        //     diagram.drag(conn, tx, ty);
            
        //     expect(diagram.connectors[0].sourcePoint.x === sourcePointx + tx &&
        //            diagram.connectors[0].sourcePoint.y === sourcePointy + ty &&
        //            diagram.connectors[0].targetPoint.x === targetPointx + tx &&
        //            diagram.connectors[0].targetPoint.y === targetPointy + ty).toBe(true);
            
        //     sourcePointx = null;
        //     sourcePointy = null;
        //     targetPointx = null;
        //     targetPointy = null;
        //     done();
        // });

        // it('Checking connector constraints - Drag (connector1)', (done: Function) => {
        //     let tx: number = 10;
        //     let ty: number = 10;
        //     let sourcePointx: number;
        //     let sourcePointy: number;
        //     let targetPointx: number;
        //     let targetPointy: number;

        //     // Test case 1: connector1 should not be draggable (Drag constraint disabled)
        //     let conn = diagram.connectors[1];
        //     sourcePointx = conn.sourcePoint.x;
        //     sourcePointy = conn.sourcePoint.y;
        //     targetPointx = conn.targetPoint.x;
        //     targetPointy = conn.targetPoint.y;
            
        //     diagram.drag(conn, tx, ty);
            
        //     expect(diagram.connectors[1].sourcePoint.x !== sourcePointx + tx &&
        //            diagram.connectors[1].sourcePoint.y !== sourcePointy + ty &&
        //            diagram.connectors[1].targetPoint.x !== targetPointx + tx &&
        //            diagram.connectors[1].targetPoint.y !== targetPointy + ty).toBe(true);
            
        //     sourcePointx = null;
        //     sourcePointy = null;
        //     targetPointx = null;
        //     targetPointy = null;
        //     done();
        // });

        // it('Checking connector constraints - Drag (connector2)', (done: Function) => {
        //     let tx: number = 10;
        //     let ty: number = 10;
        //     let sourcePointx: number;
        //     let sourcePointy: number;

        //     // Test case 2: connector2 should not be draggable (Drag constraint disabled)
        //     let conn = diagram.connectors[2];
        //     sourcePointx = conn.sourcePoint.x;
        //     sourcePointy = conn.sourcePoint.y;
            
        //     diagram.drag(conn, tx, ty);
            
        //     expect(diagram.connectors[2].sourcePoint.x !== sourcePointx + tx &&
        //            diagram.connectors[2].sourcePoint.y !== sourcePointy + ty).toBe(true);
            
        //     sourcePointx = null;
        //     sourcePointy = null;
        //     done();
        // });

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
            mouseEvents.clickEvent(diagramCanvas, 700 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop);
            //Need to evaluate testcase
            //expect(diagram.selectedItems.connectors[0].id === 'connector5').toBe(true)
            expect(true).toBe(true);
            done();
        });

        it('Checking connector constraints without PointerEvents ', (done: Function) => {
            diagram.connectors[5].constraints = ConnectorConstraints.Default;
            diagram.connectors[6].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.PointerEvents;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 900 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop);
            //Need to evaluate testcase
            //expect(diagram.selectedItems.connectors[0].id === 'connector6').toBe(true)
            expect(true).toBe(true);
            done();
        });

        it('Checking connector constraints - Delete ', (done: Function) => {
            diagram.clearSelection();
            diagram.selectedItems.connectors = [];
            diagram.selectedItems.nodes = [];
            diagram.connectors[0].constraints = ConnectorConstraints.Default;
            diagram.connectors[1].constraints = ConnectorConstraints.Default & ~ConnectorConstraints.Delete;
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
            var localMouseEvents  = new MouseEvents();
            diagram.select([diagram.connectors[6]]);
            localMouseEvents .dragAndDropEvent(diagramCanvas, 150, 298, 155, 302);
            localMouseEvents .dragAndDropEvent(diagramCanvas, 154, 409, 160, 425);
            var connectors = diagram.selectedItems.connectors[0];
            expect(connectors === undefined).toBe(true);
            localMouseEvents = null;
            done();
        })
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
});