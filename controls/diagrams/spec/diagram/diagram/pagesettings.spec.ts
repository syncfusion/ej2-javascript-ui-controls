import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramTools, NodeConstraints } from '../../../src/diagram/enum/enum';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { DiagramScroller } from '../../../src/diagram/interaction/scroller';
import { Rect } from '../../../src/index';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(BpmnDiagrams);
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
                console.log("Unsupported environment, window.performance.memory is unavailable");
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
                sourcePoint: { x: 600, y:100},
                targetPoint: { x: 700, y:200},
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
            console.log(pathElement.getAttribute('transform'));
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
            console.log(pathElement.getAttribute('transform'));
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
            expect(diagram.selectedItems.nodes[0].wrapper.bounds.right != 615
                || diagram.selectedItems.nodes[0].wrapper.bounds.right != 620).toBe(true);
            done();
        });
        it('boundary constraints for rotate', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.pageSettings.boundaryConstraints = 'Page';
            mouseEvents.dragAndDropEvent(diagramCanvas, 500, 100, 515, 100);
            mouseEvents.dragAndDropEvent(diagramCanvas, 520, 20, 590, 20);
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
            expect(diagram.connectors[2].targetPoint.y === 400).toBe(true);
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

});