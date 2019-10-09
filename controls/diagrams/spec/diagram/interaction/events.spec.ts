import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { Connector } from '../../../src/diagram/objects/connector';
import { Node } from '../../../src/diagram/objects/node';
import { ConnectorModel, OrthogonalSegmentModel, ConnectorSegmentModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { Rect } from '../../../src/diagram/primitives/rect';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../../src/diagram/primitives/matrix';
import { MouseEvents } from './mouseevents.spec';
import { DiagramTools, ConnectorConstraints } from '../../../src/diagram/enum/enum';
import { ISelectionChangeEventArgs, IClickEventArgs, IDoubleClickEventArgs, ITextEditEventArgs, ICollectionChangeEventArgs, IHistoryChangeArgs, IDraggingEventArgs, IEndChangeEventArgs, ISizeChangeEventArgs, IRotationEventArgs, IPropertyChangeEventArgs, IConnectionChangeEventArgs } from '../../../src/diagram/objects/interface/IElement'
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
import { DiagramModel } from '../../../src';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { ConnectorEditing } from '../../../src/diagram/interaction/connector-editing';
Diagram.Inject(BpmnDiagrams);
Diagram.Inject(UndoRedo);
Diagram.Inject(ConnectorEditing);
/**
 * Interaction Specification Document
 */
describe('Diagram Control', () => {
    let TopLeft: string = 'topLeft';
    let TopRight: string = 'topRight';
    let MiddleLeft: string = 'middleLeft';
    let MiddleRight: string = 'middleRight';
    let TopCenter: string = 'topCenter';
    let BottomLeft: string = 'bottomLeft';
    let BottomCenter: string = 'bottomCenter';
    let BottomRight: string = 'bottomRight';

    describe('Diagram Control', () => {
        describe('Testing events', () => {
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
                ele = createElement('div', { id: 'diagram2' });
                document.body.appendChild(ele);
                let selArray: (NodeModel | ConnectorModel)[] = [];
                let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
                let node1: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 150, offsetY: 150 };
                let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };
                let connector1: ConnectorModel = { id: 'connector2', sourcePoint: { x: 300, y: 300 }, targetPoint: { x: 200, y: 200 } };
                diagram = new Diagram({
                    width: 1000, height: 1000, nodes: [node, node1],
                    connectors: [connector, connector1]
                });
                diagram.appendTo('#diagram2');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Checking selection Change', (done: Function) => {
                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                diagram.selectionChange = (args: ISelectionChangeEventArgs) => {
                    if (args.state === 'Changed') {
                        expect(args.newValue.length === 1 && args.newValue[0].id == 'connector2').toBe(true);

                    }
                };
                mouseEvents.clickEvent(diagramCanvas, 250 + 8, 250 + 8);
                done();
            });
        });
    });
    describe('Testing event', () => {
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
            ele = createElement('div', { id: 'diagram11' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300 };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 500 };

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [node, node2],
                connectors: [{ id: 'connector1', sourcePoint: { x: 400, y: 400 }, targetPoint: { x: 500, y: 500 } }]
            });

            diagram.appendTo('#diagram11');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking size change event', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            mouseEvents.clickEvent(diagramCanvas, 300, 500, true);
            mouseEvents.clickEvent(diagramCanvas, 400 + 8, 400 + 8, true);

            let width: number = diagram.selectedItems.width;
            let height: number = diagram.selectedItems.height;
            let offsetX: number = diagram.selectedItems.offsetX;
            let offsetY: number = diagram.selectedItems.offsetY;
            let topLeft: PointModel = diagram.selectedItems.wrapper.bounds.bottomRight;
            let topLeft1: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.middleRight;
            diagram.sizeChange = (args: ISizeChangeEventArgs) => {
                args.cancel = true;
                if (args.state === 'Completed') {
                    expect(args.newValue.offsetX == offsetX &&
                        args.newValue.offsetY == offsetY).toBe(true);

                }
            };
            //increase size at top
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft.x, topLeft.y, topLeft.x + 20, topLeft.y + 20);
            mouseEvents.dragAndDropEvent(diagramCanvas, topLeft.x, topLeft.y, topLeft.x + 20, topLeft.y + 20);
            done();
        });
    });
    describe('Testing envent', () => {
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
            ele = createElement('div', { id: 'diagram10' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300 };
            let node2: NodeModel = { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 500 };
            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 400, y: 400 }, targetPoint: { x: 500, y: 500 } };


            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [node, node2],
                connectors: [connector]
            });
            diagram.appendTo('#diagram10');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking rotation change', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            mouseEvents.clickEvent(diagramCanvas, 300, 300, true);

            mouseEvents.clickEvent(diagramCanvas, 300, 500, true);

            mouseEvents.clickEvent(diagramCanvas, 400 + 8, 400 + 8, true);

            let bounds: Rect = diagram.selectedItems.wrapper.bounds;
            let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };

            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, 320, bounds.center.x, bounds.center.y);
            let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
            diagram.rotateChange = (args: IRotationEventArgs) => {
                args.cancel = true;
                if (args.state === 'Completed') {
                    expect(diagram.nameTable['node2'].rotateAngle !== 320).toBe(true);

                }
            };
            mouseEvents.dragAndDropEvent(diagramCanvas, rotator.x + 8, rotator.y + 8, endPoint.x + 8, endPoint.y + 8);
            done();
        });
    });

    describe('Connector End Dragging', () => {
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
            ele = createElement('div', { id: 'diagrambac' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300 };

            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [node]
            });

            diagram.appendTo('#diagrambac');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking targetPoint dragging', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            diagram.positionChange = (args: IDraggingEventArgs) => {
                args.cancel = true;
                if (args.state === 'Completed') {
                    expect(args.newValue.offsetX == 300 &&
                        args.newValue.offsetY == 300).toBe(true);
                }
            };
            diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
                if (args.newValue) {
                    expect((args.newValue as DiagramModel).selectedItems.width === 100).toBe(true);
                }
            }
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 300, 320, 320);
            done();
        });
    });

    describe('Testing events', () => {
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
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 500, offsetY: 500 };
            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };

            diagram = new Diagram({
                width: 800, height: 500, nodes: [node],
                connectors: [connector]
            });
            diagram.appendTo('#diagram2');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking source end', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.sourcePointChange = (args: IEndChangeEventArgs) => {
                args.cancel = true;
                if (args.state) {
                    done();
                }
            };
            diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
                if (args.newValue) {
                    done();
                }
            };
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 250, 250);
            done();
        });

        it('Checking targer end ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.targetPointChange = (args: IEndChangeEventArgs) => {
                args.cancel = true;
                if (args.state) {
                    done();
                }
            };
            mouseEvents.clickEvent(diagramCanvas, 300, 300);
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 300, 400, 400);
            done();
        });

        it('Checking connection change event ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.connectionChange = (args: IConnectionChangeEventArgs) => {
                args.cancel = true;
                done();
            };
            mouseEvents.clickEvent(diagramCanvas, 400, 400);
            mouseEvents.dragAndDropEvent(diagramCanvas, 400, 400, 500, 500);
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            diagram.connectionChange = (args: IConnectionChangeEventArgs) => {
                args.cancel = true;
                done();
            };
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 500, 300, 300);
            done();
        });
    });
    describe('Testing connection changeevents', () => {
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
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 500, offsetY: 500 };
            let node1: NodeModel = { id: 'node11', width: 100, height: 100, offsetX: 100, offsetY: 500 };

            let connector: ConnectorModel = { id: 'connector1', sourceID: 'node1', targetID: 'node11' };

            diagram = new Diagram({
                width: 800, height: 500, nodes: [node, node1],
                connectors: [connector]
            });
            diagram.appendTo('#diagram2');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });



        it('Checking connection change event ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.connectionChange = (args: IConnectionChangeEventArgs) => {
                args.cancel = false;
                done();
            };
            mouseEvents.clickEvent(diagramCanvas, 300, 500);
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 500, 500, 600);
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            diagram.connectionChange = (args: IConnectionChangeEventArgs) => {
                args.cancel = true;
                done();
            };
            mouseEvents.clickEvent(diagramCanvas, 300, 500);
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 500, 500, 600);
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 0, 0);
            done();
        });
    });

    describe('Testing events', () => {
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
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
            let connector: ConnectorModel = { id: 'connector1', sourcePoint: { x: 200, y: 200 }, targetPoint: { x: 300, y: 300 } };

            diagram = new Diagram({
                width: 800, height: 500, nodes: [node],
                connectors: [connector]
            });
            diagram.appendTo('#diagram2');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });



        it('Checking click', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.click = (args: IClickEventArgs) => {
                if (args.count === 1) {
                    expect(args.count === 1).toBe(true);
                    done();
                }
            };
            mouseEvents.clickEvent(diagramCanvas, 100, 500);
            done();
        });

        it('Checking connection change event ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.historyChange = (args) => {
                expect(args.cause === 'Internal').toBe(true);
                done();
            };
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 510, 510);
            done();
        });
    });

    describe('Events Issues', () => {
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
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
            diagram = new Diagram({
                width: 800, height: 500, nodes: [node]
            });
            diagram.appendTo('#diagram2');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });



        it('Checking  SourcePointChange and TargetPointChange event is raised – drawing tools', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            let isSourcePointChange = false; let isTargetPointChange = false; let isCollectionChange = false;
            diagram.sourcePointChange = (args: IEndChangeEventArgs) => {
                isSourcePointChange = true;
            };
            diagram.targetPointChange = (args: IEndChangeEventArgs) => {
                isTargetPointChange = true;
            };
            diagram.collectionChange = (args: ICollectionChangeEventArgs) => {
                isCollectionChange = true;
            };

            diagram.tool = DiagramTools.DrawOnce
            diagram.drawingObject = { id: 'connector3', type: 'Straight' };
            mouseEvents.dragAndDropEvent(diagramCanvas, 150, 150, 200, 200);
            expect(isSourcePointChange == false && isTargetPointChange == false && isCollectionChange).toBe(true);
            done();
        });

        it('Checking Draw Text tool - Text edit is rasied or not', (done: Function) => {

            let isTextEdit = false; let isCollectionChange = false;
            diagram.textEdit = (args: ITextEditEventArgs) => {
                isTextEdit = true;
            };
            diagram.collectionChange = (args: ICollectionChangeEventArgs) => {
                isCollectionChange = true;
            };

            let node: NodeModel = {
                shape: { type: 'Text' }, style: { strokeColor: 'none', fill: 'none', color: 'blue' }
            };
            diagram.tool = DiagramTools.DrawOnce;
            diagram.drawingObject = node;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 150, 150);
            (document.getElementById(diagram.element.id + '_editBox') as HTMLTextAreaElement).value = 'editText1';
            mouseEvents.keyDownEvent(diagramCanvas, 'Escape');
            expect(isCollectionChange && isTextEdit == false).toBe(true);
            done();
        });

        it('Checking Double click event', (done: Function) => {
            let event: string = '';
            let isTextEdit = false; let isPositionChange = false;
            diagram.positionChange = (args: IDraggingEventArgs) => {
                isPositionChange = true;
            };
            diagram.doubleClick = (args: IDoubleClickEventArgs) => {
                event += 'doubleClick'
            };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dblclickEvent(diagramCanvas, 100, 100);
            mouseEvents.keyDownEvent(diagramCanvas, 'Escape');
            expect(event == 'doubleClick' && isPositionChange == false).toBe(true);
            done();
        });
        it('Checking Selection Change Event-Paste Object', (done: Function) => {
            let event: string = '';
            diagram.selectionChange = function (args) {
                event += 'Select';
            };
            diagram.collectionChange = function (args) {
                event += 'CollectionChange'
            }
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.nodes[0]]);
            diagram.copy();
            diagram.paste();
            expect(event == 'SelectSelectCollectionChangeCollectionChangeSelectSelect').toBe(true);
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

    describe('Testing events', () => {
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
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 200, offsetY: 200 };

            diagram = new Diagram({
                width: 800, height: 500, nodes: [node],
            });
            diagram.appendTo('#diagram2');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking Selection change event ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 220, 220);
            diagram.selectionChange = (args: ISelectionChangeEventArgs) => {
                expect(args.type === 'Removal').toBe(true);
                done();
            };
            mouseEvents.dragAndDropEvent(diagramCanvas, 320, 100, 410, 140);
            done();
        });
    });

    describe('Position Change- Property Change', () => {
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
            ele = createElement('div', { id: 'diagrambac' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }],
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 500, y: 200 }, annotations: [{ content: 'Connector' }],
            };
            let connector2: ConnectorModel = {
                id: 'connector2', sourcePoint: { x: 550, y: 100 }, targetPoint: { x: 700, y: 200 }, type: 'Bezier', annotations: [{ content: 'Connector' }],
            };
            let connector3: ConnectorModel = {
                id: 'connector3', sourcePoint: { x: 300, y: 250 }, targetPoint: { x: 500, y: 350 }, type: 'Orthogonal', annotations: [{ content: 'Connector' }],
                constraints: ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb
            };
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [node], connectors: [connector, connector2, connector3],
                pageSettings: { height: 300, width: 300, showPageBreaks: true },
            });
            diagram.appendTo('#diagrambac');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking node Position Change', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
                if (args.newValue) {
                    expect((args.newValue as NodeModel).offsetX === 430).toBe(true);
                    done();
                }
            }
            mouseEvents.clickEvent(diagramCanvas, 120, 120);
            mouseEvents.dragAndDropEvent(diagramCanvas, 120, 120, 450, 150);
            done();
        });
        it('Checking node Position Change-undo', (done: Function) => {
            diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
                if (args.newValue) {
                    expect((args.newValue as NodeModel).offsetX === 100).toBe(true);
                    done();
                }
            }
            diagram.undo();
            done();
        });
        it('Checking fill color', (done: Function) => {
            diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
                if (args.newValue) {
                    expect((args.newValue as NodeModel).style.fill === 'blue').toBe(true);
                    done();
                }
            }
            diagram.nodes[0].style.fill = 'blue';
            done();
        });
        it('Change node width', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
                if (args.newValue) {
                    expect((args.newValue as NodeModel).width !== 100).toBe(true);
                    done();
                }
            }
            mouseEvents.clickEvent(diagramCanvas, 120, 120);
            mouseEvents.dragAndDropEvent(diagramCanvas, 148, 100, 160, 100);
            done();
        });
        it('Change node rotate angle', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
                if (args.newValue) {
                    expect((args.newValue as NodeModel).rotateAngle === 50).toBe(true);
                    done();
                }
            }
            diagram.nodes[0].rotateAngle = 50;
            done();
        });

        it('Change pageSettings', (done: Function) => {
            diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
                if (args.newValue) {
                    expect((args.newValue as DiagramModel).pageSettings.height === 500).toBe(true);
                    expect((args.newValue as DiagramModel).pageSettings.width === 500).toBe(true);
                    done();
                }
            }
            diagram.pageSettings.width = 500;
            diagram.pageSettings.height = 500;
            diagram.dataBind();
            done();
        });
        it('Target Point Change-Straight Connector', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
                if (args.newValue) {
                    expect((args.newValue as ConnectorModel).targetPoint.x !== 500).toBe(true);
                    expect((args.newValue as ConnectorModel).targetPoint.y === 200).toBe(true);
                    done();
                }
            };
            mouseEvents.clickEvent(diagramCanvas, 320, 110);
            mouseEvents.dragAndDropEvent(diagramCanvas, 501, 200, 530, 200);
            done();
        });
        it('Target Point Change-Besizer Connector', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.propertyChange = (args: IPropertyChangeEventArgs) => {
                if (args.newValue && (args.newValue as ConnectorModel).targetPoint) {
                    expect((args.newValue as ConnectorModel).targetPoint.x === 700).toBe(true);
                    expect((args.newValue as ConnectorModel).targetPoint.y === 200).toBe(true);
                    done();
                }
            }
            mouseEvents.clickEvent(diagramCanvas, 580, 110);
            mouseEvents.dragAndDropEvent(diagramCanvas, 640, 200, 620, 220);
            done();
        });

        it('Selection Change Event - Checking', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.nodes[0]]);
            diagram.selectionChange = (args: ISelectionChangeEventArgs) => {
                if (args.state === 'Changing') {
                    args.cancel = true;
                    expect(diagram.selectedItems.nodes.length === 1).toBe(true);
                    done();
                }
            }
            mouseEvents.clickEvent(diagramCanvas, 300, 700);
            done();
        });
    });

});