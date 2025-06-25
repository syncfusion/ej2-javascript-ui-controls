import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, ContainerModel } from '../../../src/diagram/objects/node-model';
import { ShapeStyleModel } from '../../../src/diagram/core/appearance-model';
import { ShadowModel, RadialGradientModel, StopModel } from '../../../src/diagram/core/appearance-model';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
import { BpmnShape, GroupableView } from '../../../src';
import { NodeConstraints} from '../../../src/index';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { Node, Selector } from '../../../src/diagram/objects/node';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
Diagram.Inject(BpmnDiagrams);

/**
 * BPMN DataObjects shapes
 */
describe('Diagram Control', () => {

    describe('Diagram Element', () => {
        let diagram: Diagram;
        let mouseEvents: MouseEvents = new MouseEvents();
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                { id: 'node1', offsetX: 300, offsetY: 250, width: 100, height: 40 },
                { id: 'node2', offsetX: 450, offsetY: 250, width: 100, height: 40, margin: { left: 150 } },
                { id: 'node3', offsetX: 500, offsetY: 250, width: 100, height: 70 },
                { id: 'node4', offsetX: 600, offsetY: 250, width: 100, height: 70 },
                {
                    id: 'container', width: 300, height: 300, offsetX: 100, offsetY: 100,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        header: {
                            annotation: {
                                content: 'Process Map',
                                style: { fill: 'transparent', color: 'white' },
                                horizontalAlignment: 'Center',
                                verticalAlignment: 'Top',
                                offset: { x: 0.5, y: 0 },
                            },
                            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                        },
                        children:['node1', 'node2'],
                    } as ContainerModel,
                },
                {
                    id: 'container2', offsetX: 700, offsetY: 100, maxHeight: 500, maxWidth: 500, minHeight:300, minWidth: 300,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        header: {
                            annotation: {
                                content: 'Process Map2',
                                style: { fill: 'transparent', color: 'white' },
                                horizontalAlignment: 'Center',
                                verticalAlignment: 'Top',
                                offset: { x: 0.5, y: 0 },
                            },
                            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                        }
                    } as ContainerModel,
                },
                {
                    id: 'container3', offsetX: 700, offsetY: 500, width: 300, height: 300,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        header: {
                            annotation: {
                                content: 'Process Map2',
                                style: { fill: 'transparent', color: 'white' },
                                horizontalAlignment: 'Center',
                                verticalAlignment: 'Top',
                                offset: { x: 0.5, y: 0 },
                            },
                            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                        },
                        children:['node4']
                    } as ContainerModel,
                },
            ];

            diagram = new Diagram({
                width: 1500, height: 800, nodes: nodes
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Drag and drop the child inside container', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['node3'].wrapper;
            let container = diagram.nameTable['container'].wrapper;
            mouseEvents.dragAndDropEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y, container.bounds.center.x, container.bounds.center.y);
            expect((diagram.nameTable['node3'] as Node).parentId === 'container').toBe(true);
            diagram.undo();
            expect((diagram.nameTable['node3'] as Node).parentId === '').toBe(true);
            diagram.redo();
            expect((diagram.nameTable['node3'] as Node).parentId === 'container').toBe(true);
            done();
        });

        it('Drag child inside container', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['node4'].wrapper;
            mouseEvents.mouseDownEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.bounds.center.x + 300, node.bounds.center.y + 300);
            mouseEvents.mouseUpEvent(diagramCanvas, node.bounds.center.x + 300, node.bounds.center.y + 300);
            expect((diagram.nameTable['node4'] as Node).parentId === 'container3').toBe(true);
            done();
        });

        it('Drag child in x axis inside container', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['node4'].wrapper;
            mouseEvents.mouseDownEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.bounds.center.x + 10, node.bounds.center.y);
            mouseEvents.mouseUpEvent(diagramCanvas, node.bounds.center.x + 10, node.bounds.center.y);
            expect((diagram.nameTable['node4'] as Node).parentId === 'container3').toBe(true);
            done();
        });

        it('Drag child in y axis inside container', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['node4'].wrapper;
            mouseEvents.mouseDownEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y + 10);
            mouseEvents.mouseUpEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y + 10);
            expect((diagram.nameTable['node4'] as Node).parentId === 'container3').toBe(true);
            done();
        });

        it('Drag child in negative axis inside container', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['node4'].wrapper;
            mouseEvents.mouseDownEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.bounds.center.x - 350, node.bounds.center.y - 380);
            mouseEvents.mouseUpEvent(diagramCanvas, node.bounds.center.x - 350, node.bounds.center.y - 380);
            expect((diagram.nameTable['node4'] as Node).parentId === 'container3').toBe(true);
            done();
        });

        it('Delete Child from container', (done: Function) => {
            let node = diagram.nameTable['node2'];
            diagram.remove(node);
            expect(diagram.nameTable['node2'] === undefined).toBe(true);
            diagram.undo();
            expect((diagram.nameTable['node2'] as Node).parentId === 'container').toBe(true);
            diagram.redo();
            expect(diagram.nameTable['node2'] === undefined).toBe(true);
            done();
        });

        it('Drag and drop child from one container to another', function (done) {
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            var node = diagram.nameTable['node3'].wrapper;
            var container = diagram.nameTable['container3'].wrapper;
            mouseEvents.mouseDownEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.bounds.center.x - 10, node.bounds.center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, container.bounds.left + 30, container.bounds.top + 60);
            mouseEvents.mouseUpEvent(diagramCanvas, container.bounds.left + 30, container.bounds.top + 60);
            expect(diagram.nameTable['node3'].parentId === 'container3').toBe(true);
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

    describe('Diagram Element', () => {
        let diagram: Diagram;
        let mouseEvents: MouseEvents = new MouseEvents();
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                { id: 'node1', offsetX: 300, offsetY: 250, width: 100, height: 40 },
                { id: 'node2', offsetX: 450, offsetY: 250, width: 100, height: 40, margin: { left: 150 } },
                {
                    id: 'container', width: 300, height: 300, offsetX: 100, offsetY: 100,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        header: {
                            annotation: {
                                content: 'Process Map',
                                style: { fill: 'transparent', color: 'white' },
                                horizontalAlignment: 'Center',
                                verticalAlignment: 'Top',
                                offset: { x: 0.5, y: 0 },
                            },
                            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                        },
                        children:['node1', 'node2'],
                    } as ContainerModel,
                }
            ];
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector',
                    type: 'Orthogonal',
                    sourceID: 'node1',
                    targetID: 'node2'
                }
            ];

            diagram = new Diagram({
                width: 1500, height: 800, nodes: nodes,
                connectors: connectors
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Drag child with connector inside container', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['node1'].wrapper;
            mouseEvents.dragAndDropEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y, node.bounds.center.x + 5, node.bounds.center.y + 5);
            expect((diagram.nameTable['node1'] as Node).parentId === 'container').toBe(true);
            done();
        });

        it('remove child with connector inside container', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['node1'].wrapper;
            mouseEvents.mouseDownEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.bounds.center.x + 10, node.bounds.center.y + 10);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.bounds.center.x + 310, node.bounds.center.y + 600);
            mouseEvents.mouseUpEvent(diagramCanvas, node.bounds.center.x + 310, node.bounds.center.y + 600);
            expect(diagram.nameTable['container'].wrapper.bounds.containsRect(node.bounds)).toBe(false);
            done();
        });

        it('Delete Child with connector from container', (done: Function) => {
            let node = diagram.nameTable['node2'];
            diagram.remove(node);
            expect(diagram.nameTable['node2'] === undefined).toBe(true);
            diagram.undo();
            expect((diagram.nameTable['node2'] as Node).parentId === 'container').toBe(true);
            diagram.redo();
            expect(diagram.nameTable['node2'] === undefined).toBe(true);
            done();
        });

    });
    describe('Diagram Element', () => {
        let diagram: Diagram;
        let mouseEvents: MouseEvents = new MouseEvents();
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                { id: 'node1', offsetX: 300, offsetY: 250, width: 100, height: 40 },
                { id: 'node2', offsetX: 450, offsetY: 250, width: 100, height: 40, margin: { left: 150 } },
                {
                    id: 'container', width: 300, height: 300, offsetX: 100, offsetY: 100,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        header: {
                            annotation: {
                                content: 'Process Map',
                                style: { fill: 'transparent', color: 'white' },
                                horizontalAlignment: 'Center',
                                verticalAlignment: 'Top',
                                offset: { x: 0.5, y: 0 },
                            },
                            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                        },
                        children:['node1', 'node2'],
                    } as ContainerModel,
                },
                {
                    id: 'container2',  width: 700, height: 400, offsetX: 300, offsetY: 400, maxWidth:700,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                    } as ContainerModel,
                },
                {
                    id: 'container3', width: 300, height: 300, offsetX: 700, offsetY: 400,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        header: {
                            annotation: {},
                            style: {} as ShapeStyleModel,
                        },
                        children:['node3']
                    } as ContainerModel,
                },
                { id: 'node3', offsetX: 300, offsetY: 250, width: 100, height: 40 },
            ];
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector',
                    type: 'Orthogonal',
                    sourceID: 'node1',
                    targetID: 'node2'
                }
            ];

            diagram = new Diagram({
                width: 1500, height: 800, nodes: nodes,
                connectors: connectors
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Copy paste the container', (done: Function) => {
            let node = diagram.nameTable['container'];
            let length1 = diagram.nodes.length;
            diagram.select([node]);
            diagram.copy();
            diagram.paste();
            let length2 = diagram.nodes.length;
            expect(length2 > length1).toBe(true);
            done();
        });
        it('Resize Container', (done: Function) => {
            let node = diagram.nameTable['container'];
            diagram.select([node]);
            diagram.scale(diagram.nodes[0], 2, 2, { x: 1, y: 1 });
            expect(diagram.nameTable['container'].width !== 300).toBe(true);
            done();
        });
    });
    describe('Diagram Element - Container Changes', () => {
        let diagram: Diagram;
        let mouseEvents: MouseEvents = new MouseEvents();
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                { id: 'node1', offsetX: 300, offsetY: 250, width: 100, height: 40 },
                { id: 'node2', offsetX: 450, offsetY: 250, width: 100, height: 40, margin: { left: 150, top: 20 } },
                {
                    id: 'container', width: 300, height: 300, offsetX: 100, offsetY: 100,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        header: {
                            annotation: {
                                content: 'Process Map',
                                style: { fill: 'transparent', color: 'white' },
                                horizontalAlignment: 'Center',
                                verticalAlignment: 'Top',
                                offset: { x: 0.5, y: 0 },
                            },
                            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                        },
                    } as ContainerModel,
                    shadow : { angle: 45, distance: 15, opacity: 0.3, color: 'grey' },
                    constraints: NodeConstraints.Default | NodeConstraints.Shadow,
                },
                {
                    id: 'container4', offsetX: 300, offsetY: 400,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container'
                    } as ContainerModel,
                },
                {
                    id: 'container3', width: 300, height: 300, offsetX: 700, offsetY: 400,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        header: {
                            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                        },
                        children:['node1', 'node2'],
                    } as ContainerModel,
                },
                {
                    id: 'container2', width: 700, height: 400, offsetX: 300, offsetY: 400, maxWidth:700,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        header: {},
                    } as ContainerModel,
                },
                { id: 'node3', offsetX: 500, offsetY: 550, width: 100, height: 70 }
            ];
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector',
                    type: 'Orthogonal',
                    sourceID: 'container',
                    targetID: 'container3'
                },
                {
                    id: 'connector',
                    type: 'Orthogonal',
                    sourceID: 'node1',
                    targetID: 'node2'
                }
            ];

            diagram = new Diagram({
                width: 1500, height: 1000, nodes: nodes,
                connectors: connectors
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('add container inside container', function (done: Function) {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['container3'].wrapper;
            let node1 = diagram.nameTable['container2'].wrapper;
            let child = diagram.nameTable['container3'];
            diagram.select([child]);
            mouseEvents.mouseDownEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, node1.bounds.center.x, node1.bounds.center.y);
            mouseEvents.mouseUpEvent(diagramCanvas, node1.bounds.center.x, node1.bounds.center.y);
            expect(diagram.nameTable['container3'].parentId === 'container2').toBe(true);
            done();
        });
        it('move parent container with child container', function (done: Function) {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let node1 = diagram.nameTable['container2'].wrapper;
            let offsetX = diagram.nameTable['container2'].offsetX;
            mouseEvents.mouseDownEvent(diagramCanvas, node1.bounds.center.x + 200,node1.bounds.center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, node1.bounds.center.x - 10,node1.bounds.center.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, node1.bounds.center.x + 300,node1.bounds.center.y);
            mouseEvents.mouseUpEvent(diagramCanvas, node1.bounds.center.x+300,node1.bounds.center.y);
            expect(diagram.nameTable['container2'].offsetX < offsetX).toBe(true);
            done();
        });
        it('remove container from container', function (done: Function) {
            let child = diagram.nameTable['container3'];
            diagram.remove(child);
            expect(diagram.nameTable['container3'] === undefined).toBe(true);
            done();
        });

        it('Resize Headerless Container', (done: Function) => {
            let node = diagram.nameTable['container4'];
            let width = node.width;
            diagram.select([node]);
            diagram.scale(node, 2, 2, { x: 1, y: 1 });
            expect(diagram.nameTable['container4'].width > width).toBe(true);
            done();
        });

        it('add child to container by Public method', function (done: Function) {
             var child = {   
                id:'child', width: 100, height: 100, offsetX: 300, offsetY: 200
            };
            diagram.addChildToGroup(diagram.nameTable['container'], child);
            expect(diagram.nameTable['child'].parentId === 'container').toBe(true);
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
    describe('Diagram Element - Container Deletion', () => {
        let diagram: Diagram;
        let mouseEvents: MouseEvents = new MouseEvents();
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'container', width: 300, height: 300, offsetX: 100, offsetY: 100,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        header: {
                            annotation: {
                                content: 'Process Map',
                                style: { fill: 'transparent', color: 'white' },
                                horizontalAlignment: 'Center',
                                verticalAlignment: 'Top',
                                offset: { x: 0.5, y: 0 },
                            },
                            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                        },
                    } as ContainerModel,
                    shadow : { angle: 45, distance: 15, opacity: 0.3, color: 'grey' },
                    constraints: NodeConstraints.Default | NodeConstraints.Shadow,
                },
                {
                    id: 'container2', offsetX: 300, offsetY: 400,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container'
                    } as ContainerModel,
                }
            ];

            diagram = new Diagram({
                width: 1500, height: 1000, nodes: nodes
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('remove header container without children', function (done: Function) {
            let child = diagram.nameTable['container'];
            diagram.remove(child);
            expect(diagram.nameTable['container'] === undefined).toBe(true);
            done();
        });

        it('remove headerless container without children', function (done: Function) {
            let child = diagram.nameTable['container2'];
            diagram.remove(child);
            expect(diagram.nameTable['container2'] === undefined).toBe(true);
            done();
        });
    });
    describe('Diagram Element - Container Group', () => {
        let diagram: Diagram;
        let mouseEvents: MouseEvents = new MouseEvents();
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                { id: 'node1', offsetX: 300, offsetY: 250, width: 100, height: 40 },
                { id: 'node2', offsetX: 450, offsetY: 250, width: 100, height: 40},
                {
                    id: 'container', width: 300, height: 300, offsetX: 100, offsetY: 100,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        header: {
                            annotation: {
                                content: 'Process Map',
                                style: { fill: 'transparent', color: 'white' },
                                horizontalAlignment: 'Center',
                                verticalAlignment: 'Top',
                                offset: { x: 0.5, y: 0 },
                            },
                            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                        },
                        children: ['container2']
                    } as ContainerModel,
                    shadow : { angle: 45, distance: 15, opacity: 0.3, color: 'grey' },
                    constraints: NodeConstraints.Default | NodeConstraints.Shadow,
                },
                {
                    id: 'container2', width: 200, height: 200, offsetX: 100, offsetY: 100,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                    shape: {
                        type: 'Container',
                        children: ['node1']
                    } as ContainerModel,
                    shadow : { angle: 45, distance: 15, opacity: 0.3, color: 'grey' },
                    constraints: NodeConstraints.Default | NodeConstraints.Shadow,
                }
            ];

            diagram = new Diagram({
                width: 1500, height: 1000, nodes: nodes
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('paste nodes and container with multiselect and Group', function (done) {
            let targetNode = [diagram.nameTable["container"], diagram.nameTable["node2"]];
            diagram.select(targetNode);
            diagram.group();
            diagram.copy();
            diagram.paste();
            expect(diagram.nodes.length>0).toBe(true);
            done();

        });
    });
});