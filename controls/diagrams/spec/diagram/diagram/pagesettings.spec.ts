import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramTools, NodeConstraints } from '../../../src/diagram/enum/enum';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { DiagramScroller } from '../../../src/diagram/interaction/scroller';
import { LayerModel, Rect, UndoRedo, PointModel } from '../../../src/index';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../../../src/diagram/primitives/matrix';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(BpmnDiagrams, UndoRedo);
/**
 * PageSettings Spec
 */
describe('PageSettings', () => {

    describe('Page Settings', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100,
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350,
            };
            diagram = new Diagram({
                width: '1200px', height: '1600px', nodes: [node, node2, node3], connectors: [connector],
                pageSettings: {
                    orientation: 'Landscape',
                    background: { color: 'blue' }
                }
            });
            diagram.appendTo('#diagram');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Page Settings with orientation Horizontal', (done: Function) => {
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 25 && bounds.right === 502 && bounds.top === 50 && bounds.bottom === 504).toBe(true);
            done();
        });
        it('Page Settings with height and width', (done: Function) => {
            diagram.pageSettings.height = 300;
            diagram.pageSettings.width = 500;
            diagram.pageSettings.background.color = 'red';
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 25 && bounds.right === 502 && bounds.top === 50 && bounds.bottom === 504).toBe(true);
            done();
        });

        it('Page Settings with orientation Portrait', (done: Function) => {
            diagram.pageSettings.orientation = 'Portrait';
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 25 && bounds.right === 502 && bounds.top === 50 && bounds.bottom === 504).toBe(true);
            done();
        });

        it('Page Settings with Pagebreaks', (done: Function) => {
            diagram.pageSettings.showPageBreaks = true;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 25 && bounds.right === 502 && bounds.top === 50 && bounds.bottom === 504).toBe(true);
            done();
        });
        it('Page Settings with Multiple Page', (done: Function) => {
            diagram.pageSettings.multiplePage = true;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === 25 && bounds.right === 502 && bounds.top === 50 && bounds.bottom === 504).toBe(true);
            done();
        });
        it('Page Settings with height and width with Horizontal', (done: Function) => {
            diagram.pageSettings.height = 500;
            diagram.pageSettings.width = 300;
            diagram.pageSettings.orientation = 'Landscape';
            diagram.nodes[0].offsetX = -100; diagram.nodes[0].offsetY = -100;
            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.left === -175 && bounds.right === 502 && bounds.top === -150 && bounds.bottom === 504).toBe(true);
            done();
        });
        it('Checking swapping based on orientation', (done: Function) => {
            diagram.pageSettings.multiplePage = false;
            diagram.pageSettings.width = 300;
            diagram.pageSettings.height = 600;
            diagram.pageSettings.orientation = 'Landscape';
            diagram.dataBind();
            expect(diagram.pageSettings.width === 600 && diagram.pageSettings.height == 300).toBe(true);
            done();
        });
    });
    describe('BPMN Sequence connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrambpmn' });
            document.body.appendChild(ele);
            let connector: ConnectorModel[] = [{
                id: 'Connector1',
                sourcePoint: { x: 700, y: 100 },
                targetPoint: { x: 800, y: 200 },
                type: 'Straight',
                shape: {
                    type: 'Bpmn',
                    flow: 'Sequence',
                    sequence: 'Default'
                },
                cornerRadius: 10
            },
            {
                id: 'Connector2',
                sourceID: 'node0',
                targetID: 'node1',
                shape: {
                    type: 'Bpmn',
                    flow: 'Sequence',
                    sequence: 'Default'
                },
                style: {
                    strokeColor: '#888888',
                    fill: '#555555',
                    strokeWidth: 1
                },
                targetDecorator: {
                    style: {
                        fill: '#555555',
                        strokeColor: '#888888'
                    }
                },
                type: 'Orthogonal',
                cornerRadius: 10
            },
            {
                id: 'Connector3',
                sourcePoint: { x: 600, y: 100 },
                targetPoint: { x: 700, y: 200 },
                shape: {
                    type: 'Bpmn',
                    flow: 'Sequence',
                    sequence: 'Default'
                },
                style: {
                    strokeColor: '#888888',
                    fill: '#555555',
                    strokeWidth: 1
                },
                targetDecorator: {
                    style: {
                        fill: '#555555',
                        strokeColor: '#888888'
                    }
                },
                type: 'Orthogonal',
                cornerRadius: 10
            },
            ];
            let nodes: NodeModel[] = [
                {
                    id: 'node0',
                    offsetX: 100,
                    offsetY: 100,
                    width: 30,
                    height: 30,
                    annotations: [{
                        content: 'Start',
                        margin: { bottom: -30 }
                    }],
                    shape: {
                        type: 'Bpmn',
                        shape: 'Event',
                        event: {
                            event: 'Start',
                            trigger: 'None'
                        }
                    },
                    style: {
                        strokeColor: '#62A716',
                        strokeWidth: 1
                    }
                },
                {
                    id: 'node1',
                    offsetX: 250,
                    offsetY: 250,
                    width: 90,
                    height: 60,
                    annotations: [
                        {
                            content: 'Activity 1'
                        }
                    ],
                    /*borderColor: '#78BE83',*/
                    borderWidth: 4,
                    shape: {
                        type: 'Bpmn',
                        shape: 'Activity',
                        activity: {
                            activity: 'Task',
                            task: {
                                type: 'Service'
                            }
                        }
                    },
                    style: {
                        fill: '#d8ecdc',
                        strokeColor: '#78BE83',
                        strokeWidth: 3,
                        gradient: {
                            // Start point of linear gradient
                            x1: 0,
                            y1: 0,
                            // End point of linear gradient
                            x2: 1,
                            y2: 1,
                            // Sets an array of stop objects
                            stops: [
                                {
                                    color: 'white',
                                    offset: 30,
                                    opacity: 0.1
                                },
                                {
                                    color: '#d8ecdc',
                                    offset: 100,
                                    opacity: 0.1
                                }
                            ],
                            type: 'Linear'
                        }
                    }
                },
                {
                    id: 'node2',
                    offsetX: 250,
                    offsetY: 400,
                    width: 90,
                    height: 60,
                    /*borderColor: '#78BE83',*/
                    borderWidth: 4,
                    shape: {
                        type: 'Flow',
                        shape: 'Annotation',
                    },
                    annotations: [
                        {
                            content: `Sample Text`,
                            style: {
                                textOverflow: 'Clip',
                                textWrapping: 'WrapWithOverflow',
                                textAlign: 'Left'
                            },
                            height: 50,
                            width: 80,
                            margin: { left: 0, top: 0, right: 0, bottom: 0 }
                        }
                    ],
                    style: {
                        strokeColor: '#778899',
                        strokeWidth: 3
                    }
                },
                {
                    id: 'node3', height: 100, width: 100, offsetX: 500, offsetY: 100
                },
            ];
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: nodes,
                connectors: connector
            });
            diagram.appendTo('#diagrambpmn');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('BPMN Sequence default Rendering', (done: Function) => {

            let pathElement: HTMLElement = document.getElementById('Connector1_Default');
            expect(pathElement.getAttribute('transform') === "rotate(45,721.71,121.71)translate(713.2249841308594,113.22499938964843)").toBe(true);
            done();
        });

        it('BPMN Sequence connector Dragging', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.connectors[0]]);
            mouseEvents.mouseMoveEvent(diagramCanvas, 746, 140);
            mouseEvents.mouseDownEvent(diagramCanvas, 746, 140);
            mouseEvents.mouseMoveEvent(diagramCanvas, 756, 160);
            mouseEvents.mouseUpEvent(diagramCanvas, 756, 160);
            let pathElement: HTMLElement = document.getElementById('Connector1_Default');
            expect(pathElement.getAttribute('transform') === "rotate(45,731.71,141.71)translate(723.2249841308594,133.22499938964845)" ||
                pathElement.getAttribute('transform') === 'rotate(45,741.71,136.71)translate(733.2249841308594,128.22499938964845)').toBe(true);
            done();
        });
        it('BPMN Sequence connector Dragging with node move', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 250, 340);
            mouseEvents.mouseDownEvent(diagramCanvas, 250, 340);
            mouseEvents.mouseMoveEvent(diagramCanvas, 350, 400);
            mouseEvents.mouseUpEvent(diagramCanvas, 350, 400);
            let pathElement: HTMLElement = document.getElementById('Connector2_Default');
            expect(pathElement.getAttribute('transform') === "rotate(45,250.5,165.5)translate(250.5,153.5)").toBe(true);
            done();
        });
        it('BPMN Sequence connector rotating with node move', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.nodes[3], diagram.connectors[2]]);
            mouseEvents.mouseMoveEvent(diagramCanvas, 575, 22);
            mouseEvents.mouseDownEvent(diagramCanvas, 575, 22);
            mouseEvents.mouseMoveEvent(diagramCanvas, 600, 50);
            mouseEvents.mouseUpEvent(diagramCanvas, 600, 50);
            let pathElement: HTMLElement = document.getElementById('Connector2_Default');
            console.log(pathElement.getAttribute('transform'));
            expect(pathElement.getAttribute('transform') === "rotate(45,250.5,165.5)translate(250.5,153.5)").toBe(true);
            done();
        });
    });

});

describe('PageSettings boundary constraints', () => {

    describe('Page Settings with orientation', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }

            ele = createElement('div', { id: 'diagramconstraints' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100,
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350,
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 75, offsetX: 700, offsetY: 750,
            };
            diagram = new Diagram({
                width: 800, height: 800, nodes: [node, node2, node3], connectors: [connector],
                pageSettings: {
                    orientation: 'Landscape',
                    width: 600, height: 500,
                }
            });
            diagram.appendTo('#diagramconstraints');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('changing nodes properties   at runtime', (done: Function) => {
            diagram.pageSettings.boundaryConstraints = 'Page';
            diagram.nodes[0].offsetX = 800;
            diagram.nodes[0].offsetY = 800;
            diagram.nodes[0].width = 600;
            diagram.nodes[0].height = 600;
            diagram.nodes[0].rotateAngle = 90;
            diagram.dataBind();
            expect(diagram.nodes[0].offsetX == 100 && diagram.nodes[0].offsetY == 100
                && diagram.nodes[0].width == 150).toBe(true)
            done();
        });
        it('changing connector properties  at runtime', (done: Function) => {
            diagram.pageSettings.boundaryConstraints = 'Page';
            diagram.connectors[0].targetPoint = { x: 601, y: 100 };
            diagram.connectors[0].sourcePoint = { x: 601, y: 100 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourcePoint.x == 300 && diagram.connectors[0].sourcePoint.y == 400).toBe(true)
            done();
        });
        it('addnode  at runtime', (done: Function) => {
            diagram.pageSettings.boundaryConstraints = 'Page';
            let pathNode: NodeModel = {
                id: 'node11', width: 100, height: 100, offsetX: 700, offsetY: 700,
                style: { fill: 'green' },
                shape: {
                    type: 'Basic', shape: 'Rectangle',
                }, ports: [{ id: 'port', shape: 'Square', offset: { x: 0.5, y: 1 } }]
            };
            diagram.add(pathNode);
            diagram.dataBind();
            expect(diagram.nodes.length === 3).toBe(true)
            done();
        });

        it('boundary constraints for drag ', (done: Function) => {
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 600, 100);
            expect(diagram.nodes[0].offsetX === 600 || diagram.nodes[0].offsetX === 595).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 600, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 600, 100, 100, 100);
            diagram.pageSettings.boundaryConstraints = 'Page'
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 600, 100);
            expect(diagram.nodes[0].offsetX != 600).toBe(true);
            diagram.pageSettings.boundaryConstraints = 'Diagram'
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 800, 100);
            expect(diagram.nodes[0].offsetX != 800).toBe(true);
            done();
        });
        it('boundary constraints for resize', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.pageSettings.boundaryConstraints = 'Page';
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 100, 500, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 580, 100, 620, 100);
            // expect(diagram.selectedItems.nodes[0].wrapper.bounds.right != 615
            //     || diagram.selectedItems.nodes[0].wrapper.bounds.right !== 620).toBe(true);
            done();
            mouseEvents.dragAndDropEvent(diagramCanvas, 620, 50, 700, 100);
            // expect(diagram.selectedItems.nodes[0].wrapper.bounds.right != 615
            //     || diagram.selectedItems.nodes[0].wrapper.bounds.right !== 620).toBe(true);
            done();
        });
        it('boundary constraints for rotate', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.pageSettings.boundaryConstraints = 'Page';
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 100, 515, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 520, 100, 590, 20);
            expect(diagram.selectedItems.nodes[0].rotateAngle === 0).toBe(true);
            done();
        });

        it('boundary constraints for connector dragging target end ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            mouseEvents.clickEvent(diagramCanvas, 400, 450);
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 500, 600, 600);
            expect(diagram.connectors[0].targetPoint.x === 592 || diagram.connectors[0].targetPoint.x === 600).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 600, 600, 500, 500);
            diagram.pageSettings.boundaryConstraints = 'Page';
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 500, 600, 600);
            expect(diagram.connectors[0].targetPoint.x !== 592).toBe(true);
            done();
        });
        it('boundary constraints for connector dragging source end ', (done: Function) => {
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            mouseEvents.dragAndDropEvent(diagramCanvas, 300, 400, 320, 520);
            expect(diagram.connectors[0].sourcePoint.y === 520).toBe(true);
            mouseEvents.dragAndDropEvent(diagramCanvas, 320, 520, 320, 400);
            diagram.pageSettings.boundaryConstraints = 'Page';
            mouseEvents.dragAndDropEvent(diagramCanvas, 320, 400, 320, 520);
            expect(diagram.connectors[0].targetPoint.x != 522).toBe(true);
            done();
        });

        it('Draw Simple Shape for ', (done: Function) => {
            diagram.tool = DiagramTools.ContinuousDraw
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            diagram.drawingObject = { id: 'node11', shape: { type: 'Basic', shape: 'Rectangle' } };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 200, 610, 300);
            let drawElement: HTMLElement = document.getElementById('node11');
            expect(diagram.nodes[3].width === 110).toBe(true);
            diagram.pageSettings.boundaryConstraints = 'Page';
            diagram.drawingObject = { id: 'node12', shape: { type: 'Basic', shape: 'Rectangle' } };
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 400, 200, 520);
            expect(diagram.nodes.length === 4).toBe(true);
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            diagram.drawingObject = { id: 'node13', shape: { type: 'Basic', shape: 'Rectangle' } };
            mouseEvents.mouseDownEvent(diagramCanvas, 700, 200);
            mouseEvents.mouseUpEvent(diagramCanvas, 700, 200);
            expect(diagram.nodes.length === 4).toBe(true);
            done();
        });

        it('Draw Straight Connector Reverse', (done: Function) => {
            diagram.tool = DiagramTools.ContinuousDraw
            diagram.pageSettings.boundaryConstraints = 'Infinity';
            diagram.drawingObject = { id: 'connector11', type: 'Straight' };
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 400, 200, 520);
            let drawElement: HTMLElement = document.getElementById('connector1');
            expect(diagram.connectors[1].targetPoint.y === 520).toBe(true);
            diagram.pageSettings.boundaryConstraints = 'Page';
            diagram.drawingObject = { id: 'connector11', type: 'Straight' };
            mouseEvents.dragAndDropEvent(diagramCanvas, 250, 400, 250, 520);
            expect((diagram.connectors[2].targetPoint.y === 392) || diagram.connectors[2].targetPoint.y === 400).toBe(true);
            done();
        });
        it('branch coverage for drag', (done: Function) => {
            diagram.pageSettings.boundaryConstraints = 'Page';
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 300, 200);
            expect(diagram.nodes[2].offsetX === 300).toBe(true);
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
    describe('Boundary Constraints rotate angle issue', () => {
        let diagram: Diagram;
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
            let node: NodeModel = {
                id: "node1",
                offsetX: 875,
                offsetY: 100,
                width: 44,
                height: 140,
                pivot: { x: 0.5, y: 0.5 },
                shape: {
                    type: 'Native',
                    content: '<svg width="22" height="70" xmlns="http://www.w3.org/2000/svg"><ellipse fill="none" stroke-width="1.5" cx="11.00001" cy="27.206965" id="svg_3" rx="10.187688" ry="10.187688" stroke="#0f0f00"/><ellipse fill="none" stroke-width="1.5" cx="11.00001" cy="40.902413" id="svg_1" rx="10.187688" ry="10.187688" stroke="#0f0f00"/><line stroke="#0f0f00" fill="none" stroke-width="1.5" fill-opacity="null" x1="11.15" y1="0" x2="11.15" y2="16.764379" id="svg_10" stroke-linejoin="null" stroke-linecap="null"/><line stroke="#0f0f00" fill="none" stroke-width="1.5" fill-opacity="null" x1="11.15" y1="51" x2="11.15" y2="70" id="svg_6" stroke-linejoin="null" stroke-linecap="null"/></svg>'
                },

                constraints: NodeConstraints.Default | NodeConstraints.AspectRatio
            };
            diagram = new Diagram({
                width: '900', height: '900', nodes: [node], //connectors: connectors,

                pageSettings: {
                    background: {
                        color: "gray",
                    },
                    width: 900,
                    height: 900,
                    // Sets the BoundaryConstraints to page
                    boundaryConstraints: 'Diagram',

                }
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Boundary Constraints rotate angle issue', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let mouseEvents: MouseEvents = new MouseEvents();
            mouseEvents.clickEvent(diagramCanvas, 875, 100);
            mouseEvents.mouseDownEvent(diagramCanvas, 875, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 875 + 10, 100);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            var node = diagram.nodes[0];
            node.rotateAngle = 90;
            diagram.dataBind();
            expect(node.rotateAngle === 0).toBe(true)
            done()

        });

    });

    describe('Diagram Get Custom Cursor - Blazor Support', () => {
        let diagram: Diagram;
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
            let node: NodeModel = {
                id: "node1",
                offsetX: 300,
                offsetY: 200,
                width: 100,
                height: 100,
            };
            diagram = new Diagram({
                width: '900', height: '900', nodes: [node],
                customCursor: [{
                    action: "Select", cursor: "crosshair"
                }],
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Diagram Cursor', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let mouseEvents: MouseEvents = new MouseEvents();
            mouseEvents.mouseMoveEvent(diagramCanvas, 300, 200);
            expect(diagramCanvas.style.cursor === 'crosshair').toBe(true);
            done();
        });

    });

    describe('Diagram - Zoom pan enabled', () => {
        let diagram: Diagram;
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
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2' }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350, annotations: [{ content: 'Node3' }]
            };
            diagram = new Diagram({
                width: '900', height: '900', nodes: [node, node2, node3],
                tool: DiagramTools.ZoomPan

            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Diagram Selected Items', (done: Function) => {
            let mouseevents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseevents.keyDownEvent(diagramCanvas, 'A', true);
            expect(diagram.selectedItems.nodes.length === 0).toBe(true);
            done();
        });

    });

});
describe('Page Settings with orientation', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramconstraints' });
        document.body.appendChild(ele);
        let node: NodeModel = {
            id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100,
        };
        diagram = new Diagram({
            width: 800, height: 800, nodes: [node],
            pageSettings: {
                orientation: 'Landscape',
                width: 600, height: 500,
                multiplePage: true, showPageBreaks: true,
                margin: { left: 10, top: 10, bottom: 10 },
            }
        });
        diagram.appendTo('#diagramconstraints');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('boundary constraints for drag and drop', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        diagram.pageSettings.boundaryConstraints = 'Diagram';
        mouseEvents.dragAndDropEvent(diagramCanvas, diagram.nodes[0].offsetX, diagram.nodes[0].offsetY, 600, 600);
        console.log(diagram.nodes[0].offsetX);
        expect(diagram.nodes[0].offsetX === 595).toBe(true);
        done();
    });
})

describe('BPMN Shape Style Change', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
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
        let node: NodeModel = {
            id: 'node12', width: 100, height: 100, offsetX: 1100, offsetY: 100,
            shape: {
                type: 'Bpmn', shape: 'Event',
                event: { event: 'End', trigger: 'None' }
            },
        };
        diagram = new Diagram({
            width: 800, height: 800, nodes: [node],
        });
        diagram.appendTo('#diagram');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check BPMN Node color after save and load', (done: Function) => {
        diagram.nodes[0].style.fill = "red";
        let save: string = diagram.saveDiagram();
        diagram.loadDiagram(save);
        expect(diagram.nodes[0].style.fill === "red").toBe(true);
        done();
    });
})

describe('Node undo-redo style change', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
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
        let node: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
        };
        diagram = new Diagram({
            width: 800, height: 800, nodes: [node],
        });
        diagram.appendTo('#diagram');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check node color after undo and redo', (done: Function) => {
        diagram.nodes[0].style = {
            fill: '#d8ecdc',
            strokeColor: '#78BE83',
            strokeWidth: 3,
            gradient: {
                // Start point of linear gradient
                x1: 0,
                y1: 0,
                // End point of linear gradient
                x2: 100,
                y2: 100,
                // Sets an array of stop objects
                stops: [
                    {
                        color: 'white',
                        offset: 30,
                        opacity: 0.1
                    },
                    {
                        color: '#d8ecdc',
                        offset: 100,
                        opacity: 0.1
                    }
                ],
                type: 'Linear'
            }
        };
        diagram.dataBind();
        diagram.undo();
        expect(diagram.nodes[0].style.fill === "white").toBe(true);
        diagram.redo();
        expect(diagram.nodes[0].style.fill === "#d8ecdc").toBe(true);
        done();
    });
    it('Add layer', (done: Function) => {
        var newNode = {
            id: 'new', offsetX: 300, offsetY: 300, height: 50, width: 50
        }
        diagram.addLayer({ objects: [], visible: true }, [newNode]);
        expect(diagram.layers.length === 2).toBe(true);
        done();
    });
    it('Remove layer', (done: Function) => {
        diagram.removeLayer(diagram.layers[1].id);
        expect(diagram.layers.length === 1).toBe(true);
        done();
    });
})
describe('Swimlane child disappears', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'Order',
                                    annotations: [
                                        {
                                            content: 'ORDER',
                                            style: { fontSize: 11 }
                                        }
                                    ],
                                    margin: { left: 60, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'selectItemaddcart',
                                    annotations: [{ content: 'Select item\nAdd cart' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                            ],
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
        ];
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', sourceID: 'Order',
                targetID: 'selectItemaddcart'
            },

        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes,
            connectors: connectors
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send swimlane child back and Check lane selection', (done: Function) => {
        diagram.select([diagram.getObject('Order')]);
        diagram.sendToBack();
        diagram.clearSelection();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200, 300);
        expect(diagram.selectedItems.nodes[0].id === "swimlanestackCanvas10").toBe(true);
        done();
    });
})
describe('Swimlane send to back', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'Order',
                                    annotations: [
                                        {
                                            content: 'ORDER',
                                            style: { fontSize: 11 }
                                        }
                                    ],
                                    margin: { left: 60, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'selectItemaddcart',
                                    annotations: [{ content: 'Select item\nAdd cart' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                            ],
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
        ];
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', sourceID: 'Order',
                targetID: 'selectItemaddcart'
            },

        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes,
            connectors: connectors
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send swimlane back and check 1st index swimlane got selected', (done: Function) => {
        diagram.select([diagram.getObject('swimlane')]);
        diagram.copy();
        diagram.paste();
        diagram.sendToBack();
        diagram.clearSelection();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 550, 300);
        expect(diagram.selectedItems.nodes[0].id === "swimlanestackCanvas10").toBe(true);
        done();
    });
})
describe('Swimlane Resize functionality', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            canMove: false,
                            children: [
                                {
                                    id: 'Order',
                                    annotations: [
                                        {
                                            content: 'ORDER',
                                            style: { fontSize: 11 }
                                        }
                                    ],
                                    margin: { left: 60, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'selectItemaddcart',
                                    annotations: [{ content: 'Select item\nAdd cart' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                            ],
                        },
                        {
                            id: 'stackCanvas2',
                            header: {
                                annotation: { content: 'CUSTOMER-2' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'node1',
                                    annotations: [
                                        {
                                            content: 'Node',
                                            style: { fontSize: 11 }
                                        }
                                    ],
                                    margin: { left: 60, top: 20 },
                                    height: 40, width: 100
                                },
                               
                            ],
                        },

                    ],

                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
        ];
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', sourceID: 'Order',
                targetID: 'selectItemaddcart'
            },

        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes,
            connectors: connectors
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether swimlane is resized properly or not ', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200+diagram.element.offsetLeft, 300+diagram.element.offsetTop);
        let x = diagram.selectedItems.wrapper.bounds.x + diagram.selectedItems.wrapper.bounds.width / 2 + diagram.element.offsetLeft;
        let y = diagram.selectedItems.wrapper.bounds.y + diagram.selectedItems.wrapper.bounds.height + diagram.element.offsetTop;
        mouseEvents.mouseMoveEvent(diagramCanvas, x, y);
        mouseEvents.mouseDownEvent(diagramCanvas, 200+diagram.element.offsetLeft, y);
        mouseEvents.mouseMoveEvent(diagramCanvas, 200+diagram.element.offsetLeft, y +50);
        mouseEvents.mouseUpEvent(diagramCanvas, 200+diagram.element.offsetLeft, y+50);
        console.log(diagram.selectedItems.nodes[0].wrapper.height);
        expect(diagram.selectedItems.nodes[0].wrapper.height != 100).toBe(true);
        done();
    });
})

describe('Node Selection Functionality', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', height: 75, width: 75, offsetX: 200, offsetY: 100,
            },
            {
                id: 'node2', height: 75, width: 75, offsetX: 350, offsetY: 100,
            },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },
                    ],
                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
        ];
        diagram = new Diagram({
            width: 1000, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Check whether node is select properly or not', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 200, 100);
        mouseEvents.mouseDownEvent(diagramCanvas, 200, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 300);
        mouseEvents.mouseUpEvent(diagramCanvas, 300, 300);
        mouseEvents.mouseUpEvent(diagramCanvas, 300, 300);
        mouseEvents.dragAndDropEvent(diagramCanvas, 350, 100, 350, 200);
        diagram.clearSelection();
        mouseEvents.clickEvent(diagramCanvas, 350, 200);
        expect(diagram.selectedItems.nodes[0].id === 'node2').toBe(true);
        done();
    });
})

describe('Swimlane child disappears', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
               id: 'nodes', height: 100, width: 100, offsetX: 200, offsetY: 200
            },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },
        
                    ],
        
                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send swimlane back and check z index', (done: Function) => {
        diagram.select([diagram.nodes[1]]);
        let zIndex: number = diagram.nodes[1].zIndex;
        diagram.sendToBack();
        diagram.clearSelection();
        expect(diagram.nodes[1].zIndex !== zIndex).toBe(true);
        done();
    });
    it('Send swimlane front and check z index', (done: Function) => {
        diagram.select([diagram.nodes[1]]);
        let zIndex: number = diagram.nodes[1].zIndex;
        diagram.bringToFront();
        diagram.clearSelection();
        expect(diagram.nodes[1].zIndex !== zIndex).toBe(true);
        done();
    });
})

describe('Group Node - SendToBack & BringToFront', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node2', width: 200, height: 50, offsetX: 300, offsetY: 100, style: { fill: 'red' },
                annotations: [{ content: 'node2' }],
            },
            {
                id: 'node3', width: 250, height: 150, offsetX: 300, offsetY: 200, style: { fill: 'blue' },
                annotations: [{ content: 'node3' }]
            },
            { id: 'group1', children: ['node2', 'node3'], },
            {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200, style: { fill: 'yellow' },
                annotations: [{ content: 'node1' }],
            }
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramlane');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send group node front and check z index', (done: Function) => {
        diagram.select([diagram.getObject('group1')]);
        diagram.bringToFront();
        expect(diagram.selectedItems.nodes[0].zIndex === 3).toBe(true);
        done();
    });
    it('Send group back and check z index', (done: Function) => {
        diagram.select([diagram.getObject('group1')]);
        diagram.sendToBack();
        expect(diagram.selectedItems.nodes[0].zIndex === 0).toBe(true);
        done();
    });
})

describe('Child Node - Backward & Forward', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node2', width: 200, height: 50, offsetX: 300, offsetY: 100, style: { fill: 'red' },
                annotations: [{ content: 'node2' }],
            },
            {
                id: 'node3', width: 250, height: 150, offsetX: 300, offsetY: 200, style: { fill: 'blue' },
                annotations: [{ content: 'node3' }]
            },
            { id: 'group1', children: ['node2', 'node3'], },
            {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200, style: { fill: 'yellow' },
                annotations: [{ content: 'node1' }],
            }
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramlane');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send group node front and check z index', (done: Function) => {
        diagram.select([diagram.getObject('node1')]);
        diagram.sendBackward();
        expect(diagram.selectedItems.nodes[0].zIndex === 2).toBe(true);
        done();
    });
    it('Send group back and check z index', (done: Function) => {
        diagram.select([diagram.getObject('node1')]);
        diagram.moveForward();
        expect(diagram.selectedItems.nodes[0].zIndex === 3).toBe(true);
        done();
    });
})

describe('Swimlane - Z order commands', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramlane' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] =  [
            {
                id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200, 
             },
             {
                 id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200, 
              },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },
        
                    ],
        
                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
            
             
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramlane');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send Swimlane backward - Send to back command', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.sendToBack();
        diagram.clearSelection();
        expect(node.zIndex === 3).toBe(true);
        done();
    });
    it('Bring Swimlane to front - Bring to front Command', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.bringToFront();
        diagram.clearSelection();
        expect(node.zIndex === 5).toBe(true);
        done();
    });
})

describe('Swimlane & Child - Send to back command', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] =  [
            {
                id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200, 
             },
             {
                 id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200, 
              },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },
        
                    ],
        
                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
            
             
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramorder');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Send child backward to swimlane', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.sendToBack();
        diagram.clearSelection();
        let node2: NodeModel = diagram.getObject('node1');
        diagram.select([node2]);
        diagram.sendToBack();
        diagram.clearSelection();
        expect(node.zIndex === 4).toBe(true);
        done();
    });
    it('Send Swimlane backward to all child', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.sendToBack();
        diagram.clearSelection();
        expect(node.zIndex === 3).toBe(true);
        done();
    });
})

describe('Swimlane & Child - Bring to Front command', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] =  [
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },
        
                    ],
        
                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
            
             
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Bring child Front to swimlane', (done: Function) => {
        let newnode: NodeModel =  {
            id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200, 
         };
         diagram.add(newnode);
         let newNode2: NodeModel = {
            id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200, 
         };
         diagram.add(newNode2);
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.bringToFront();
        diagram.clearSelection();
        let node2: NodeModel = diagram.getObject('node1');
        diagram.select([node2]);
        diagram.bringToFront();
        diagram.clearSelection();
        expect(node.zIndex === 4).toBe(true);
        done();
    });
    it('Bring Swimlane Front to all child', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.bringToFront();
        diagram.clearSelection();
        expect(node.zIndex === 5).toBe(true);
        done();
    });
})

describe('Swimlane Order commands - Undo & Redo', () => {
    let diagram: Diagram;
    let zIndex: number = 0;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] =  [
            {
                id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200, 
             },
             {
                 id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200, 
              },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'Lane 1' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 150
                        },
                        {
                            id: 'stackCanvas2',
                            header: {
                                annotation: { content: 'Lane 2' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 150
                        },
        
                    ],
        
                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
            
             
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Diagram Save and load operaion', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.sendToBack();
        zIndex = node.zIndex;
        let save: string = diagram.saveDiagram();
        diagram.loadDiagram(save);
        expect(node.zIndex === zIndex).toBe(true);
        done();
    });
    it('Diagram order commands after save and load', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        zIndex = node.zIndex;
        diagram.bringToFront();
        expect(node.zIndex !== zIndex).toBe(true);
        done();
    });
})

describe('Swimlane Order commands - Undo & Redo', () => {
    let diagram: Diagram;
    let zIndex: number = 0;
    let ele: HTMLElement;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] =  [
            {
                id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200, 
             },
             {
                 id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200, 
              },
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'Lane 1' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 150
                        },
                        {
                            id: 'stackCanvas2',
                            header: {
                                annotation: { content: 'Lane 2' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 150
                        },
        
                    ],
        
                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
            
             
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Diagram Undo operation for Send to back order command', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.sendToBack();
        zIndex = node.zIndex;
        diagram.undo();
        expect(node.zIndex !== zIndex).toBe(true);
        done();
    });
    it('Diagram Redo operation for Send to back order command', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.redo();
        expect(node.zIndex === zIndex).toBe(true);
        done();
    });
})

describe('Swimlane & Child - Bring to Front command - undo', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] =  [
            {
                id: 'swimlane',
                shape: {
                    type: 'SwimLane',
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fontSize: 11 },
                    },
                    lanes: [
                        {
                            id: 'stackCanvas1',
                            header: {
                                annotation: { content: 'CUSTOMER' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100
                        },
        
                    ],
        
                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
            
             
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Bring child Front to swimlane', (done: Function) => {
        let newnode: NodeModel =  {
            id: 'node1', height: 100, width: 100, offsetX: 200, offsetY: 200, 
         };
         diagram.add(newnode);
         let newNode2: NodeModel = {
            id: 'node2', height: 100, width: 100, offsetX: 350, offsetY: 200, 
         };
         diagram.add(newNode2);
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.select([node]);
        diagram.bringToFront();
        zIndex = node.zIndex;
        diagram.clearSelection();
        diagram.undo();
        expect(node.zIndex !== zIndex ).toBe(true);
        done();
    });
    it('Bring Swimlane Front to all child', (done: Function) => {
        let node: NodeModel = diagram.getObject('swimlane');
        diagram.redo();
        expect(node.zIndex === zIndex).toBe(true);
        done();
    });
})

describe('Connector Segment -Rotate', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1',
                type: 'Orthogonal',
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 400, y: 200 },
            },
            {
                id: 'connector10', sourcePoint: { x: 400, y: 100 },
                targetPoint: { x: 500, y: 200 }, type: 'Orthogonal',
                segments: [{ type: 'Orthogonal', length: 100, direction: 'Right' }, { type: 'Orthogonal', length: 100, direction: 'Top' }]
            },
        ];
        diagram = new Diagram({
            width: '1000px',
            height: '800px',
            connectors: connectors,
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Rotate the connectors and check rotate angle', (done: Function) => {
        diagram.selectAll();
        diagram.rotate(diagram.selectedItems, 300);
        expect(diagram.selectedItems.rotateAngle === 300 ).toBe(true);
        done();
    });
    it('Rotate the connector with segment and check points', (done: Function) => {
        diagram.selectAll();
        diagram.rotate(diagram.selectedItems, 300);
        expect(diagram.connectors[1].sourcePoint.x > 355 && diagram.connectors[1].sourcePoint.y > 174 &&
            diagram.connectors[1].targetPoint.x > 392 && diagram.connectors[1].targetPoint.y > 37).toBe(true);
        done();
    });
})

describe('Multiple Connector Rotate Issue', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndex: number = 0;
    let scroller: DiagramScroller;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }

        ele = createElement('div', { id: 'diagramorder2' });
        document.body.appendChild(ele);
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 250, y: 150 },
                targetPoint: { x: 150, y: 200 },
            },
            {
                id: 'connector10', sourcePoint: { x: 200, y: 100 },
                targetPoint: { x: 400, y: 200 },
                segments: [{ type: 'Straight' }]
            },
        ];
        diagram = new Diagram({
            width: '750px',
            height: '800px',
            connectors: connectors,
        });
        diagram.appendTo('#diagramorder2');

    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Rotate the multiple connectors and check rotate angle', (done: Function) => {
        diagram.selectAll();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let bounds: Rect = diagram.selectedItems.wrapper.bounds;
        let rotator: PointModel = { x: bounds.center.x, y: bounds.y - 30 };
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, 320, bounds.center.x, bounds.center.y);
        let endPoint: PointModel = transformPointByMatrix(matrix, rotator);
        mouseEvents.dragAndDropEvent(diagramCanvas, rotator.x + 8, rotator.y + 8, endPoint.x + 8, endPoint.y + 8);
        console.log("Rotate Angle: "+ diagram.selectedItems.rotateAngle);
        expect(Math.floor(diagram.selectedItems.rotateAngle) === 316 || Math.floor(diagram.selectedItems.rotateAngle) === 320 || Math.floor(diagram.selectedItems.rotateAngle) === 315 ).toBe(true);
        done();
    });
    it('Scale the connector and check selector offset', (done: Function) => {
        diagram.scale(diagram.selectedItems, 1.2, 1, { x: 0.5, y: 0.5 });
        expect(diagram.selectedItems.offsetX === 275 && diagram.selectedItems.offsetY === 150 ).toBe(true);
        done();
    });
})
