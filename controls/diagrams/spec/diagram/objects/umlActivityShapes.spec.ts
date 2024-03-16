import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, PathModel, UmlActivityShapeModel, FlowShapeModel } from '../../../src/diagram/objects/node-model';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { Rect } from '../../../src/diagram/primitives/rect';
import { Matrix, transformPointByMatrix, identityMatrix } from '../../../src/diagram/primitives/matrix';

import {
    SymbolPalette, SymbolInfo,
} from '../../../src/symbol-palette/index';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { ActivityFlow } from '../../../src/diagram/objects/connector';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
/**
 * umlActivityShapes spec
 */
describe('Diagram Control', () => {

    describe('umlActivityShapes', () => {
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
            ele = createElement('div', { id: 'diagramuml' });
            document.body.appendChild(ele);
            let node: NodeModel[] = [{
                id: 'InitialNode', width: 90, height: 90, offsetX: 100, offsetY: 100,
                shape: { type: 'UmlActivity', shape: 'InitialNode' },
                annotations: [{
                    id: 'label1', content: 'InitialNode', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'Action', width: 90, height: 90, offsetX: 300, offsetY: 100,
                shape: { type: 'UmlActivity', shape: 'Action' },
                annotations: [{
                    id: 'label2', content: 'Action', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'Decision', width: 90, height: 90, offsetX: 500, offsetY: 100,
                shape: { type: 'UmlActivity', shape: 'Decision' },
                annotations: [{
                    id: 'label3', content: 'Decision', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'MergeNode', width: 90, height: 90, offsetX: 700, offsetY: 100,
                shape: { type: 'UmlActivity', shape: 'MergeNode' },
                annotations: [{
                    id: 'label4', content: 'MergeNode', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'FinalNode', width: 90, height: 90, offsetX: 900, offsetY: 100,
                shape: { type: 'UmlActivity', shape: 'FinalNode' },
                style: { strokeColor: 'yellow' },
                annotations: [{
                    id: 'label5', content: 'FinalNode', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'ForkNode', width: 90, height: 90, offsetX: 100, offsetY: 300,
                shape: { type: 'UmlActivity', shape: 'ForkNode' },
                annotations: [{
                    id: 'label6', content: 'ForkNode', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'JoinNode', width: 90, height: 90, offsetX: 300, offsetY: 300,
                shape: { type: 'UmlActivity', shape: 'JoinNode' },
                annotations: [{
                    id: 'label7', content: 'JoinNode', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'TimeEvent', width: 90, height: 90, offsetX: 500, offsetY: 300,
                shape: { type: 'UmlActivity', shape: 'TimeEvent' },
                annotations: [{
                    id: 'label8', content: 'TimeEvent', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'AcceptingEvent', width: 90, height: 90, offsetX: 700, offsetY: 300,
                shape: { type: 'UmlActivity', shape: 'AcceptingEvent' },
                annotations: [{
                    id: 'label9', content: 'AcceptingEvent', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'SendSignal', width: 90, height: 90, offsetX: 900, offsetY: 300,
                shape: { type: 'UmlActivity', shape: 'SendSignal' },
                annotations: [{
                    id: 'label10', content: 'SendSignal', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'ReceiveSignal', width: 90, height: 90, offsetX: 100, offsetY: 500,
                shape: { type: 'UmlActivity', shape: 'ReceiveSignal' },
                annotations: [{
                    id: 'label11', content: 'ReceiveSignal', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'StructuredNode', width: 90, height: 90, offsetX: 300, offsetY: 500,
                shape: { type: 'UmlActivity', shape: 'StructuredNode' },
                annotations: [{
                    id: 'label12', content: 'StructuredNode', style: { strokeColor: 'white' }
                }]
            }, {
                id: 'Note', width: 90, height: 90, offsetX: 500, offsetY: 500,
                shape: { type: 'UmlActivity', shape: 'Note' },
                annotations: [{
                    id: 'label13', content: 'Note', style: { strokeColor: 'white' }
                }]
            }];
            let connectors: ConnectorModel[] = [{
                id: 'connector1', type: 'Straight', annotations: [{ content: 'objectFlow' }], targetDecorator: { width: 1 },
                sourcePoint: { x: 100, y: 700 }, targetPoint: { x: 200, y: 800 },
                shape: { type: 'UmlActivity', flow: 'Object' } as ActivityFlow
            }, {
                id: 'connector2', type: 'Straight', sourcePoint: { x: 300, y: 700 },
                targetDecorator: { width: 1 },
                targetPoint: { x: 500, y: 800 }, shape: { type: 'UmlActivity', flow: 'Control' } as ActivityFlow
            }, {
                id: 'connector3', type: 'Straight', sourcePoint: { x: 100, y: 100 },
                targetDecorator: { width: 1 },
                targetPoint: { x: 100, y: 400 }, shape: { type: 'UmlActivity', flow: 'Exception' }
            }];
            diagram = new Diagram({
                width: 1500, height: 1500, nodes: node, connectors: connectors,
            });
            diagram.appendTo('#diagramuml');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking before, after,  UML Activity shape and type as InitialNode ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas;
            expect((
                document.getElementById(
                    diagram.nodes[0].id + '_content').getAttribute('d') === 'M45,90 C20.19,90,0,69.81,0,45 C0,20.189999999999998,20.19,0,45,0 C69.81,0,90,20.19,90,45 C90,69.81,69.81,90,45,90 Z ' &&
                wrapper.actualSize.width === 90 && wrapper.actualSize.height === 90)).toBe(true);
            done();
        });
        it('Checking before, after,  UML Activity shape and type as Action ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[1] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.actualSize.width === 90 && wrapper.actualSize.height === 90 &&
                wrapper.offsetX === 300 && wrapper.offsetY === 100
            )).toBe(true);
            done();
        });
        it('Checking UmlActivity shapes-Decision', (done: Function) => {
            let node: NodeModel = diagram.nodes[2];
            let element: DiagramElement = node.wrapper.children[0];
            expect(
                document.getElementById(diagram.nodes[2].id + '_content').getAttribute('d') === 'M45,90 L0,45 L45,0 L90,45 L45,90 Z ' &&
                (element as PathModel).data == 'M10,19.707L0.293,10L10,0.293L19.707,10L10,19.707z').toBe(true);
            done();
        });
        it('Checking before, after,  UML Activity shape and type as MergeNode ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[3] as NodeModel).wrapper.children[0] as Canvas;
            expect(
                document.getElementById(diagram.nodes[3].id + '_content').getAttribute('d') === 'M45,90 L0,45 L45,0 L90,45 L45,90 Z ' &&
                (wrapper.actualSize.width === 90 && wrapper.actualSize.height === 90 &&
                    wrapper.offsetX === 700 && wrapper.offsetY === 100
                )).toBe(true);
            done();
        });
        it('Checking before, after,  UML Activity shape and type as FinalNode ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[4] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 90
                && wrapper.children[0].actualSize.height === 90 &&
                wrapper.children[0].offsetX === 900 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 60
                    && wrapper.children[1].actualSize.height === 60 &&
                    wrapper.children[1].offsetX === 900 && wrapper.children[1].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Resize finalNode', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 800, 300);
            let matrix: Matrix = identityMatrix();
            let bounds: Rect = (diagram.nodes[4] as NodeModel).wrapper.bounds;
            let refPoint: PointModel = transformPointByMatrix(matrix, bounds.topLeft); refPoint.x += 8; refPoint.y += 8;
            mouseEvents.dragAndDropEvent(diagramCanvas, refPoint.x, refPoint.y, refPoint.x + 5, refPoint.y - 10);
            mouseEvents.mouseMoveEvent(diagramCanvas, 860, 90);
            mouseEvents.mouseDownEvent(diagramCanvas, 860, 90);
            mouseEvents.mouseMoveEvent(diagramCanvas, 800, 90);
            expect(Math.round(diagram.nodes[4].width) == 145 || Math.round(diagram.nodes[4].width) == 150).toBe(true);
            mouseEvents.mouseUpEvent(diagramCanvas, 800, 90);
            done();
        });

        it('Checking before, after,  UML Activity shape and type as ForkNode ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[5] as NodeModel).wrapper.children[0] as Canvas;
            expect(
                document.getElementById(diagram.nodes[5].id + '_content').getAttribute('d') === 'M0,0 L90,0 L90,90 L0,90 L0,0 Z ' &&
                (wrapper.actualSize.width === 90
                    && wrapper.actualSize.height === 90 &&
                    wrapper.offsetX === 100 && wrapper.offsetY === 300)
            ).toBe(true);
            done();
        });
        it('Checking UmlActivity shapes-JoinNode', (done: Function) => {
            let node: NodeModel = diagram.nodes[6];
            let element: DiagramElement = node.wrapper.children[0];
            expect(
                (diagram.nodes[6] as NodeModel).wrapper.children[0].height === 90 &&
                document.getElementById(diagram.nodes[6].id + '_content').getAttribute('d') === "M0,0 L90,0 L90,90 L0,90 L0,0 Z " &&
                (element as PathModel).data == 'm0.75,0.75l636.00002,0l0,290l-636.00002,0l0,-290z').toBe(true);
            done();
        });
        it('Checking UmlActivity shapes-TimeEvent', (done: Function) => {
            let node: NodeModel = diagram.nodes[7];
            let element: DiagramElement = node.wrapper.children[0];
            expect(
                document.getElementById(diagram.nodes[7].id + '_content').getAttribute('d') === "M90,0 L45,45 L0,0 L90,0 Z M0,90 L45,45 L90,90 L0,90 Z " &&
                (element as PathModel).data == 'M50.001,0.00286865 L25.001,25.0029 L0.000976562,0.00286865 L50.001,0.00286865 z ' +
                'M0.000976562,50.0029 L25.001,25.0029 L50.001,50.0029 L0.000976562,50.0029 z').toBe(true);
            done();
        });
        it('Checking UmlActivity shapes-AcceptingEvent', (done: Function) => {
            let node: NodeModel = diagram.nodes[8];
            let element: DiagramElement = node.wrapper.children[0];
            expect(
                document.getElementById(diagram.nodes[8].id + '_content').getAttribute('d') === "M1.48,90 L35.56,44.54 L0,0 L89.04,0 L90,89.09 Z " &&
                (element as PathModel).data == 'M17.8336 32.164 L29.64 24 L17.32 16 L48.1664 16 L48.5 32 Z').toBe(true);
            done();
        });
        it('Checking UmlActivity shapes-SendSignal', (done: Function) => {
            let node: NodeModel = diagram.nodes[9];
            let element: DiagramElement = node.wrapper.children[0];
            expect(document.getElementById(diagram.nodes[9].id + '_content').getAttribute('d') === "M72.3,90 L90,44.52 L71.55,0 L0,0 L0,90 Z " &&
                (element as PathModel).data == 'M48.164 31.8336 L56 23.832 L47.836 16 L16.168 16 L16.1668 31.8336 Z').toBe(true);
            done();
        });
        it('Checking UmlActivity shapes-ReceiveSignal', (done: Function) => {
            let node: NodeModel = diagram.nodes[10];
            let element: DiagramElement = node.wrapper.children[0];
            expect(document.getElementById(diagram.nodes[10].id + '_content').getAttribute('d') === "M90,89.99 L66.57,45.47 L89.07,0 L0,0 L0,90 Z " &&
                (element as PathModel).data == 'M48.1664 31.8336 L39.836 24 L47.836 16 L16.168 16 L16.168 31.836 Z').toBe(true);
            done();
        });
        it('Checking UmlActivity shapes-StructuredNode', (done: Function) => {
            let node: NodeModel = diagram.nodes[11];
            let element: DiagramElement = node.wrapper.children[0];
            expect(document.getElementById(diagram.nodes[11].id + '_content').getAttribute('d') === "M0,0 L90,0 L90,90 L0,90 Z " &&
                (element as PathModel).data == 'M0,0 L50,0 L50,50 L0,50 z').toBe(true);
            done();
        });
        it('Checking UmlActivity shapes-Note', (done: Function) => {
            let node: NodeModel = diagram.nodes[12];
            let element: DiagramElement = node.wrapper.children[0];
            expect(document.getElementById(diagram.nodes[12].id + '_content').getAttribute('d') === "M80,0 L0,0 L0,90 L90,90 L90,18 L80,18 L80,0 L90,18 Z " &&
                (element as PathModel).data == 'M20 12 L4 12 L4 22 L22 22 L22 14 L20 14 L20 12 L22 14 Z').toBe(true);
            done();
        });
        it('Checking UmlActivity shapes-flow - control flow', (done: Function) => {
            let connector: ConnectorModel = diagram.connectors[0];
            diagram.connectors
            let element: DiagramElement = connector.wrapper.children[0];
            expect(element.style.strokeWidth == 1).toBe(true);
            done();
        });
        it('Checking UmlActivity shapes-flow - object flow', (done: Function) => {
            let connector: ConnectorModel = diagram.connectors[1];
            let element: DiagramElement = connector.wrapper.children[0];
            expect(element.style.strokeWidth == 1).toBe(true);
            done();
        });
        it('Checking UmlActivity shapes-flow - exception flow', (done: Function) => {
            let connector: ConnectorModel = diagram.connectors[2];
            let element: DiagramElement = connector.wrapper.children[0];
            expect((element as PathModel).data == 'M100 100 L110.61 260.61 L89.39 239.39 L99.97 399.5').toBe(true);
            done();
        });
        it('Checking uml Activity shapes InitialNode to decision', (done: Function) => {
            ((diagram.nodes[0] as NodeModel).shape as UmlActivityShapeModel).shape = 'Decision';
            diagram.dataBind();
            let node: NodeModel = diagram.nodes[0];
            let element: DiagramElement = node.wrapper.children[0];
            expect((element as PathModel).data == 'M10,19.707L0.293,10L10,0.293L19.707,10L10,19.707z').toBe(true);
            done();

        });

        it('Checking uml Activity flow shapes controlFlow to exceptionFlow', (done: Function) => {
            ((diagram.connectors[1] as ConnectorModel).shape as ActivityFlow).flow = 'Exception';
            diagram.dataBind();
            expect((diagram.connectors[1].wrapper.children[0] as PathElement).data === "M300 700 L499.55 799.78").toBe(true);
            done();

        });

        it('Checking node fill style property change', (done: Function) => {
            diagram.nodes[0].style.fill = 'red';
            diagram.nodes[0].style.opacity = 5;
            diagram.nodes[0].style.strokeColor = 'green';
            diagram.dataBind();
            let node: NodeModel = diagram.nodes[0];
            expect(node.style.fill == 'red').toBe(true);
            done();
        });
        it('Add umlActivity shapes at runtime', (done: Function) => {
            let nodeNew: NodeModel = {
                id: 'nodeNew', width: 90, height: 90, offsetX: 500, offsetY: 800,
                shape: { type: 'UmlActivity', shape: 'Note' } as UmlActivityShapeModel,
            };
            diagram.add(nodeNew);
            expect(diagram.nodes.length === 14).toBe(true);
            done();
        });
        it('Remove node', (done: Function) => {
            let temp: number = diagram.nodes.length;
            diagram.remove(diagram.nodes[1]);
            expect(diagram.nodes.length !== temp).toBe(true);
            done();
        });
        it('Update Shapes', (done: Function) => {
            diagram.nodes[2].shape.type = 'Flow';
            (diagram.nodes[2].shape as FlowShapeModel).shape = 'MultiDocument';
            diagram.dataBind()
            expect((
                document.getElementById(
                    diagram.nodes[2].id + '_content').getAttribute('d') != "M45,90 L0,45 L45,0 L90,45 L45,90 Z ")).toBe(true);
            done();
        });
        it('Update Shapes', (done: Function) => {
            (diagram.nodes[3].shape as UmlActivityShapeModel).shape = 'InitialNode';
            diagram.dataBind()
            expect((
                document.getElementById(
                    diagram.nodes[3].id + '_content').getAttribute('d') != "M78.62,72 C80.77,73.11,82.54,74.43,84.3,75.8 L84.3,8.54 L5.57,8.54 L5.57,19.71 M84.3,63.26 C86.44,64.38,88.24,65.89,90,67.26 L90,0 L11.27,0 L11.27,8.54 M78.62,84.8 L78.62,19.37 L0,19.37 L0,84.8 C0,84.8,22.65,96.5,39.31,84.8 C55.98,73.11,69.82,78.11,78.62,84.8 Z ")).toBe(true);
            done();
        });
        it('Update Shapes', (done: Function) => {
            (diagram.nodes[3].shape as UmlActivityShapeModel).shape = 'ForkNode';
            diagram.dataBind()
            expect((
                document.getElementById(
                    diagram.nodes[3].id + '_content').getAttribute('d') != "M78.62,72 C80.77,73.11,82.54,74.43,84.3,75.8 L84.3,8.54 L5.57,8.54 L5.57,19.71 M84.3,63.26 C86.44,64.38,88.24,65.89,90,67.26 L90,0 L11.27,0 L11.27,8.54 M78.62,84.8 L78.62,19.37 L0,19.37 L0,84.8 C0,84.8,22.65,96.5,39.31,84.8 C55.98,73.11,69.82,78.11,78.62,84.8 Z ")).toBe(true);
            done();
        });
        it('Update Shapes', (done: Function) => {
            (diagram.nodes[3].shape as UmlActivityShapeModel).shape = 'FinalNode';
            diagram.dataBind()
            expect((
                document.getElementById(
                    diagram.nodes[3].id + '_content').getAttribute('d') != "M78.62,72 C80.77,73.11,82.54,74.43,84.3,75.8 L84.3,8.54 L5.57,8.54 L5.57,19.71 M84.3,63.26 C86.44,64.38,88.24,65.89,90,67.26 L90,0 L11.27,0 L11.27,8.54 M78.62,84.8 L78.62,19.37 L0,19.37 L0,84.8 C0,84.8,22.65,96.5,39.31,84.8 C55.98,73.11,69.82,78.11,78.62,84.8 Z ")).toBe(true);
            done();
        });
        it('Add umlActivity shapes JoinNode at runtime without height and width', (done: Function) => {
            let nodeNew: NodeModel = {
                id: 'nodeNew2', offsetX: 500, offsetY: 800,
                shape: { type: 'UmlActivity', shape: 'JoinNode' } as UmlActivityShapeModel,
            };
            diagram.add(nodeNew);
            expect(diagram.nodes.length === 14).toBe(true);
            done();
        });
        it('Add umlActivity shapes JoinNode at runtime without style fill', (done: Function) => {
            let nodeNew: NodeModel = {
                id: 'nodeNew3', offsetX: 800, offsetY: 100,
                style: { strokeColor: 'yellow' },
                shape: { type: 'UmlActivity', shape: 'JoinNode' } as UmlActivityShapeModel,
            };
            diagram.add(nodeNew);
            expect(diagram.nodes.length === 15).toBe(true);
            done();
        });
        it('Add umlActivity shapes InitialNode at runtime ', (done: Function) => {
            let nodeNew: NodeModel = {
                id: 'nodeNew6', offsetX: 800, offsetY: 800, style: { strokeColor: 'yellow' },
                shape: { type: 'UmlActivity', shape: 'InitialNode' } as UmlActivityShapeModel,
            };
            diagram.add(nodeNew);
            expect(diagram.nodes.length === 16).toBe(true);
            done();
        });
        it('Add umlActivity shapes ForkNode at runtime without style', (done: Function) => {
            let nodeNew: NodeModel = {
                id: 'nodeNew7', offsetX: 1000, offsetY: 800,
                shape: { type: 'UmlActivity', shape: 'ForkNode' } as UmlActivityShapeModel,
            };
            diagram.add(nodeNew);
            expect(diagram.nodes.length === 17).toBe(true);
            done();
        });
        it('Add umlActivity shapes InitialNode at runtime without style', (done: Function) => {
            let nodeNew: NodeModel = {
                id: 'nodeNew8', offsetX: 1000, offsetY: 800,
                shape: { type: 'UmlActivity', shape: 'InitialNode' } as UmlActivityShapeModel,
            };
            diagram.add(nodeNew);
            expect(diagram.nodes.length === 18).toBe(true);
            done();
        });
        it('Add umlActivity flow shapes', (done: Function) => {
            let connector1: ConnectorModel = {
                id: 'flow2',
                type: 'Straight', style: { fill: 'red', strokeDashArray: ' 2 3', strokeColor: 'yellow', strokeWidth: 5 },
                shape: { type: 'UmlActivity', flow: 'Control' } as ActivityFlow,
                targetDecorator: { shape: 'None' },
                sourceDecorator: { shape: 'None' },
                sourcePoint: { x: 500, y: 350 }, targetPoint: { x: 550, y: 350 }
            };
            diagram.add(connector1);
            expect(diagram.connectors.length === 4).toBe(true);
            done();
        });
        it('Add umlActivity flow shapes ', (done: Function) => {
            let connector1: ConnectorModel = {
                id: 'flow1',
                type: 'Straight', style: { fill: 'red', strokeDashArray: ' 2 3', strokeColor: 'yellow', strokeWidth: 5 },
                shape: { type: 'UmlActivity', flow: 'Object' } as ActivityFlow,
                sourcePoint: { x: 50, y: 450 }, targetPoint: { x: 250, y: 450 },
                targetDecorator: { shape: 'None' },
            };
            diagram.add(connector1);
            expect(diagram.connectors.length === 5).toBe(true);
            done();
        });

    });


    describe('Testing symbol palette', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let umlActivitySymbols: NodeModel[] = [
            { id: 'Action', shape: { type: 'UmlActivity', shape: 'Action' }, annotations: [{ content: 'FinalNode' }] },
            { id: 'Decision', shape: { type: 'UmlActivity', shape: 'Decision' } },
            { id: 'MergeNode', shape: { type: 'UmlActivity', shape: 'MergeNode' } },
            { id: 'InitialNode', shape: { type: 'UmlActivity', shape: 'InitialNode' } },
            { id: 'FinalNode', shape: { type: 'UmlActivity', shape: 'FinalNode' } },
            { id: 'ForkNode', shape: { type: 'UmlActivity', shape: 'ForkNode' } },
            { id: 'JoinNode', shape: { type: 'UmlActivity', shape: 'JoinNode' } },
            { id: 'TimeEvent', shape: { type: 'UmlActivity', shape: 'TimeEvent' } },
            { id: 'AcceptingEvent', shape: { type: 'UmlActivity', shape: 'AcceptingEvent' } },
            { id: 'SendSignal', shape: { type: 'UmlActivity', shape: 'SendSignal' } },
            { id: 'ReceiveSignal', shape: { type: 'UmlActivity', shape: 'ReceiveSignal' } },
            { id: 'StructuredNode', shape: { type: 'UmlActivity', shape: 'StructuredNode' } },
            { id: 'Note', shape: { type: 'UmlActivity', shape: 'Note' } },
        ];
        let umlActivityFlowSymbols: ConnectorModel[] = [
            {
                id: 'objectFlow', style: { fill: 'red' },
                sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
                shape: { type: 'UmlActivity', flow: 'Object' } as ActivityFlow
            },
            {
                id: 'controlFlow', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 }, style: { fill: 'red' },
                shape: { type: 'UmlActivity', flow: 'Control' } as ActivityFlow
            },
            {
                id: 'ExceptionFlow', sourcePoint: { x: 0, y: 10 }, targetPoint: { x: 40, y: 100 },
                shape: { type: 'UmlActivity', flow: 'Exception' }
            },
        ];
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'umlActivitySymbolPalette', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'umlActivityDiagram', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);
            diagram = new Diagram({
                nodes: [
                    {
                        id: 'node12', width: 100, height: 100, offsetX: 100, offsetY: 100,
                        annotations: [{ content: 'Default Shape' }]
                    },
                    {
                        id: 'node22', width: 100, height: 100, offsetX: 300, offsetY: 100,
                        shape: {
                            type: 'Basic', shape: 'Cylinder'
                        },
                    },
                ],
            });
            diagram.appendTo('#umlActivityDiagram');

            palette = new SymbolPalette({
                width: '25%', height: '500px',
                palettes: [
                    { id: 'umlActivity', expanded: true, symbols: umlActivitySymbols, title: 'UmlActivity Shapes' },
                    { id: 'umlActivityFlow', expanded: true, symbols: umlActivityFlowSymbols, title: 'UmlActivity Flow Shapes' },
                ],
                expandMode: 'Multiple',
                symbolHeight: 50, symbolWidth: 50,
                symbolPreview: { height: 100, width: 100 },
                enableSearch: true,
                getNodeDefaults: setPaletteNodeDefaults,
                symbolMargin: { left: 12, right: 12, top: 12, bottom: 12 },
                getSymbolInfo: (symbol: NodeModel): SymbolInfo => {
                    return { fit: true };
                }
            });
            palette.appendTo('#umlActivitySymbolPalette');
            function setPaletteNodeDefaults(node: NodeModel): void {
                node.width = 50;
                node.height = 50;
            }
            diagram.drop = (arg) => {
                arg.cancel = true;
            };
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });

        it('Checking default palette rendering', (done: Function) => {
            let node: any = palette.symbolTable['InitialNode'].wrapper.children[0];
            expect(node.offsetX === 14.5 && node.offsetY === 14.5).toBe(true);
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

    //831806 - UML Class Connector Multiplicity - Many To Many not Working
    describe('Testing UmlConnector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        
        let umlActivityFlowSymbols: ConnectorModel[] = [
            {
                id: "umlConn2",
                sourcePoint: { x: 210, y: 100 },
                targetPoint: { x: 304, y: 166 },
                type: "Straight",
                shape: {
                    type: "UmlClassifier",
                    relationship: "Association",
                    multiplicity: {
                        type: "ManyToMany",
                        source: {
                            optional: true,
                            lowerBounds: '50',
                            upperBounds: '67'
                        },
                        target: {
                            optional: true,
                            lowerBounds: '50',
                            upperBounds: '90'
                        }
                    }
                }
            }
        ];
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'umlActivityDiagram', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);
            diagram = new Diagram({
                connectors:umlActivityFlowSymbols,
            });
            diagram.appendTo('#umlActivityDiagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('831806-Umlclass connector Mulitiplicity - Many to Many', (done: Function) => {
            expect(diagram.connectors[0].annotations[0].content == '50...67').toBe(true);
            done();
        });
    });
});