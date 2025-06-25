import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, PathModel, UmlActivityShapeModel, FlowShapeModel, UmlClassifierShapeModel } from '../../../src/diagram/objects/node-model';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { PointModel } from '../../../src/diagram/primitives/point-model';
import { Rect } from '../../../src/diagram/primitives/rect';
import { Matrix, transformPointByMatrix, identityMatrix } from '../../../src/diagram/primitives/matrix';
import { UmlSequenceDiagramModel, UmlSequenceParticipantModel, UmlSequenceMessageModel, UmlSequenceFragmentModel  } from "../../../src/diagram/diagram/sequence-diagram-model";
import { UmlSequenceMessageType, UmlSequenceFragmentType, UmlSequenceDiagram,  } from "../../../src/diagram/diagram/sequence-diagram";

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


     describe('Code coverage UML node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
                    //Set the default values of nodes.
                    function getNodeDefaults(obj: NodeModel): NodeModel {
                        obj.style = { fill: '#26A0DA', strokeColor: 'white' };
                        return obj;
                    }

                    //Set an annoation style at runtime.
                    function setNodeTemplate(node: NodeModel): void {
                        if (node.annotations.length > 0) {
                        for (let i: number = 0; i < node.annotations.length; i++) {
                            node.annotations[i].style.color = 'white';
                        }
                        }
                    }

                    //create class Property
                    function createProperty(name: string, type: string): object {
                        return { name: name, type: type };
                    }

                    //create class Methods
                    function createMethods(name: string, type: string): object {
                        return { name: name, type: type };
                    }

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'umlClassDiagram', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);



            let nodes: NodeModel[] = [
                {
                  id: 'Patient',
                  shape: {
                    type: 'UmlClassifier',
                    classShape: {
                      name: 'Patient',
                      attributes: [
                        createProperty('accepted', 'Date'),
                        createProperty('sickness', 'History'),
                        createProperty('prescription', 'String[*]'),
                        createProperty('allergies', 'String[*]'),
                      ],
                      methods: [createMethods('getHistory', 'History')],
                    },
                    classifier: 'Class',
                  } as UmlClassifierShapeModel,
                  offsetX: 200,
                  offsetY: 250,
                },
                {
                    id: 'Hospital',
                    shape: {
                        type: 'UmlClassifier',
                        classShape: {
                            name: 'Hospital',
                            methods: [
                                createMethods('getDepartment', 'String'),
                            ]
                        },
                        classifier: 'Interface'
                    } as UmlClassifierShapeModel,
                    offsetX: 638,
                    offsetY: 100,
                },
                {
                    id: 'Enumerarion',
                    shape: {
                        type: 'UmlClassifier',
                        classShape: {
                            name: 'Enumerarion',
                            methods: [
                                createMethods('getDepartment', 'String'),
                            ]
                        },
                        classifier: 'Enumeration'
                    } as UmlClassifierShapeModel,
                    offsetX: 338,
                    offsetY: 400,
                },
              ];
            let connectors: ConnectorModel[] = [];

            diagram = new Diagram({
            width: '100%',
            height: '700px',
            nodes: nodes,
            connectors: connectors,
            //Sets the default values of nodes
            getNodeDefaults: getNodeDefaults,
            //Customize the content of the node
            setNodeTemplate: setNodeTemplate,
            });
            diagram.appendTo('#umlClassDiagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Adding uml node at runtime', (done: Function) => {
            let node1 = diagram.nameTable['Patient'];
            let node2 = diagram.nameTable['Hospital'];
            let node3 = diagram.nameTable['Enumerarion'];
            let child = createProperty('newchild', 'data');
            diagram.addChildToUmlNode(node1, child, 'Attribute');
            diagram.addChildToUmlNode(node1, child, 'Method');
            diagram.addChildToUmlNode(node2, child, 'Attribute');
            diagram.addChildToUmlNode(node2, child, 'Method');
            diagram.addChildToUmlNode(node3, child, 'Attribute');
            diagram.addChildToUmlNode(node3, child, 'Member');
            expect(diagram.nodes.length === 21).toBe(true);
            done();
        });
        it('Changing locale', (done: Function) => {
            diagram.locale = 'de-DE'
            diagram.dataBind();
            expect(diagram.locale === 'de-DE').toBe(true);
            done();
        });
    });
    describe('Code coverage UML classifier nodes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        //Set the default values of nodes.
        function getNodeDefaults(obj: NodeModel): NodeModel {
            obj.style = { fill: '#26A0DA', strokeColor: 'white' };
            return obj;
        }

        //Set an annoation style at runtime.
        function setNodeTemplate(node: NodeModel): void {
            if (node.annotations.length > 0) {
                for (let i: number = 0; i < node.annotations.length; i++) {
                    node.annotations[i].style.color = 'white';
                }
            }
        }

        //create class Property
        function createProperty(name: string, type: string): object {
            return { name: name, type: type };
        }

        //create class Methods
        function createMethods(name: string, type: string): object {
            return { name: name, type: type };
        }

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'umlClassDiagram', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);



            let nodes: NodeModel[] = [
                {
                    id: 'Patient', style: { fontFamily: 'Calibri' },
                    shape: {
                        type: 'UmlClassifier',
                        classShape: {
                            name: 'Patient',
                            attributes: [
                                createProperty('accepted', 'Date'),
                                createProperty('sickness', 'History'),
                                createProperty('prescription', 'String[*]'),
                                createProperty('allergies', 'String[*]'),
                            ],
                            methods: [createMethods('getHistory', 'History')],
                        },
                        classifier: 'Class',
                    } as UmlClassifierShapeModel,
                    offsetX: 100,
                    offsetY: 100,
                },
                {
                    id: 'Hospital',
                    shape: {
                        type: 'UmlClassifier',
                        classShape: {
                            name: 'Hospital',
                            methods: [
                                createMethods('getDepartment', 'String'),
                            ]
                        },
                        classifier: 'Interface'
                    } as UmlClassifierShapeModel,
                    offsetX: 300,
                    offsetY: 100,
                },
                {
                    id: 'Enumerarion',
                    shape: {
                        type: 'UmlClassifier',
                        classShape: {
                            name: 'Enumerarion',
                            methods: [
                                createMethods('getDepartment', 'String'),
                            ]
                        },
                        classifier: 'Enumeration'
                    } as UmlClassifierShapeModel,
                    offsetX: 500,
                    offsetY: 100,
                },
                {
                    id: 'Patient1',
                    shape: {
                        type: 'UmlClassifier',
                        classShape: {
                            name: 'Patient',
                            attributes: [
                                createProperty('accepted', 'Date'),
                                createProperty('sickness', 'History'),
                                createProperty('prescription', 'String[*]'),
                                createProperty('allergies', 'String[*]'),
                            ],
                            methods: [createMethods('getHistory', 'History')],
                        },
                        classifier: 'Class',
                    } as UmlClassifierShapeModel,
                    offsetX: 100,
                    offsetY: 300,
                },
                {
                    id: 'Patient2',
                    shape: {
                        type: 'UmlClassifier',
                        classShape: {
                            name: 'Patient',
                            attributes: [
                                createProperty('accepted', 'Date'),
                                createProperty('sickness', 'History'),
                                createProperty('prescription', 'String[*]'),
                                createProperty('allergies', 'String[*]'),
                            ],
                            methods: [createMethods('getHistory', 'History')],
                        },
                        classifier: 'Class',
                    } as UmlClassifierShapeModel,
                    offsetX: 300,
                    offsetY: 300,
                },
            ];
            let connectors: ConnectorModel[] = [];

            diagram = new Diagram({
                width: '100%',
                height: '700px',
                nodes: nodes,
                connectors: connectors,
                //Sets the default values of nodes
                getNodeDefaults: getNodeDefaults,
                //Customize the content of the node
                setNodeTemplate: setNodeTemplate,
            });
            diagram.appendTo('#umlClassDiagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Adding umlchild node at runtime', (done: Function) => {
            diagram.select([diagram.nodes[3]]);
            let node = diagram.selectedItems.nodes[0];
            let methods = { name: '0', style: { color: "red", }, parameters: [{ name: 'Date', style: {} }], type: 'History', scope: 'Protected' };
            diagram.addChildToUmlNode(node, methods, 'Method');

            diagram.select([diagram.nodes[3]]);
            let node0 = diagram.selectedItems.nodes[0];
            let attributes = { name: '1', type: 'Date', style: { color: "red" }, scope: 'Protected' };
            diagram.addChildToUmlNode(node0, attributes, "Attribute");

            diagram.select([diagram.nodes[4]]);
            let node1 = diagram.selectedItems.nodes[0];
            let method1 = { name: '0', style: { color: "red", }, parameters: [{ name: 'Date', style: {} }], type: 'History', scope: 'Private' };
            diagram.addChildToUmlNode(node1, method1, 'Method');

            diagram.select([diagram.nodes[4]]);
            let node01 = diagram.selectedItems.nodes[0];
            let attribute1 = { name: '1', type: 'Date', style: { color: "red" }, scope: 'Private' };
            diagram.addChildToUmlNode(node01, attribute1, "Attribute");

            expect(diagram.nodes.length === 35).toBe(true);
            done();
        });
        it('Changing locale', (done: Function) => {
            diagram.locale = 'de-DE'
            diagram.dataBind();
            expect(diagram.locale === 'de-DE').toBe(true);
            done();
        });
    });
    describe('Code coverage UML classifier for class node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        //Set the default values of nodes.
        function getNodeDefaults(obj: NodeModel): NodeModel {
            obj.style = { fill: '#26A0DA', strokeColor: 'white' };
            return obj;
        }

        //Set an annoation style at runtime.
        function setNodeTemplate(node: NodeModel): void {
            if (node.annotations.length > 0) {
                for (let i: number = 0; i < node.annotations.length; i++) {
                    node.annotations[i].style.color = 'white';
                }
            }
        }
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'umlClassDiagram', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);

            let nodes: NodeModel[] = [
                {
                    id: 'Patient', style: { fontFamily: 'Calibri' },
                    shape: {
                        type: 'UmlClassifier',
                        classShape: {
                            name: 'Patient',
                            methods: [{ name: 'getHistory', style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' }],
                            attributes: [
                                { name: 'web', type: 'Date', style: { color: "blue" }, isSeparator: true },
                                { name: 'diagram', type: 'Date', style: { color: "blue" }, isSeparator: true }
                            ],
                        },
                        classifier: 'Class',
                    } as UmlClassifierShapeModel,
                    offsetX: 100,
                    offsetY: 100,
                },
                {
                    id: 'Enumerarion',
                    offsetX: 300,
                    offsetY: 100,
                    style: {
                        fill: '#26A0DA', strokeColor: 'black'
                    }, borderColor: 'white',
                    shape: {
                        type: 'UmlClassifier',
                        enumerationShape: {
                            name: 'AccountType',
                            members: [
                                {
                                    name: 'Checking Account', style: {}, isSeparator: true
                                },
                                {
                                    name: 'Savings Account',
                                },
                                {
                                    name: 'Credit Account',
                                }
                            ]
                        }, classifier: 'Enumeration'
                    } as UmlClassifierShapeModel,
                },
                {
                    id: 'Hospital',
                    shape: {
                        type: 'UmlClassifier',
                        interfaceShape: {
                            name: 'Hospital',
                            methods: []
                        },
                        classifier: 'Interface'
                    } as UmlClassifierShapeModel,
                    offsetX: 400,
                    offsetY: 300,
                },
            ];
            let connectors: ConnectorModel[] = [];

            diagram = new Diagram({
                width: '100%',
                height: '700px',
                nodes: nodes,
                connectors: connectors,
                //Sets the default values of nodes
                getNodeDefaults: getNodeDefaults,
                //Customize the content of the node
                setNodeTemplate: setNodeTemplate,
            });
            diagram.appendTo('#umlClassDiagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Adding umlchild node at runtime', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            var node0 = diagram.selectedItems.nodes[0];
            var attributes = { name: '1', type: 'Date', style: { color: "red" }, scope: '', isSeparator: true };
            diagram.addChildToUmlNode(node0, attributes, "Attribute");

            diagram.select([diagram.nodes[1]]);
            let node = diagram.selectedItems.nodes[0];
            let members = { name: 'Checking new', style: { color: "red", strokecolor: 'black', fontFamily: 'Calibri' }, isSeparator: true, scope: 'Private' };
            diagram.addChildToUmlNode(node, members, "Member");

            diagram.select([diagram.nodes[2]]);
            var node01 = diagram.selectedItems.nodes[0];
            var method1 = { name: '0', style: { color: "red", }, parameters: [{ name: 'interface', style: {}, type: 'History' }], type: 'History', scope: '' };
            diagram.addChildToUmlNode(node01, method1, 'Method');
            expect(diagram.nodes.length === 20).toBe(true);

            done();
        });
        it('Changing locale', (done: Function) => {
            diagram.locale = 'de-DE'
            diagram.dataBind();
            expect(diagram.locale === 'de-DE').toBe(true);
            done();
        });
    });
    describe('UmlSequenceDiagram', () => {
        describe('Sample-1', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'umlSequenceDiagram-1', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);

                const model: UmlSequenceDiagramModel = {
                    spaceBetweenParticipants: 200,
                    participants: [
                        {
                            id: "User",
                            content: "User",
                            isActor: true,
                            showDestructionMarker: true,
                            activationBoxes: [
                                { id: "act1", startMessageID: 101, endMessageID: 125 }
                            ]
                        },
                        {
                            id: "ATMMachine",
                            content: "ATMMachine",
                            isActor: false,
                            showDestructionMarker: true,
                            activationBoxes: [
                                { id: "act2", startMessageID: 101, endMessageID: 125 }
                            ]
                        },
                        {
                            id: "BankServer",
                            content: "BankServer",
                            isActor: false,
                            activationBoxes: [
                                { id: "act3", startMessageID: 104, endMessageID: 105 },
                                { id: "act4", startMessageID: 108, endMessageID: 109 },
                                { id: "act5", startMessageID: 113, endMessageID: 114 },
                                { id: "act6", startMessageID: 119, endMessageID: 120 }
                            ]
                        }
                    ],
                    messages: [
                        { id: 101, content: "InsertCard", fromParticipantID: "User", toParticipantID: "ATMMachine", type: UmlSequenceMessageType.Synchronous },
                        { id: 102, content: "RequestPIN", fromParticipantID: "ATMMachine", toParticipantID: "User", type: UmlSequenceMessageType.Synchronous },
                        { id: 103, content: "InsertPIN", fromParticipantID: "User", toParticipantID: "ATMMachine", type: UmlSequenceMessageType.Synchronous },
                        { id: 104, content: "VerifyPIN", fromParticipantID: "ATMMachine", toParticipantID: "BankServer", type: UmlSequenceMessageType.Synchronous },
                        { id: 105, content: "PIN Verified", fromParticipantID: "BankServer", toParticipantID: "ATMMachine", type: UmlSequenceMessageType.Reply },
                        { id: 106, content: "Show Options", fromParticipantID: "ATMMachine", toParticipantID: "User", type: UmlSequenceMessageType.Synchronous },
                        { id: 107, content: "Choose Option", fromParticipantID: "User", toParticipantID: "ATMMachine", type: UmlSequenceMessageType.Synchronous },
                        { id: 108, content: "GetBalance", fromParticipantID: "ATMMachine", toParticipantID: "BankServer", type: UmlSequenceMessageType.Synchronous },
                        { id: 109, content: "Balance", fromParticipantID: "BankServer", toParticipantID: "ATMMachine", type: UmlSequenceMessageType.Reply },
                        { id: 110, content: "ShowBalance", fromParticipantID: "ATMMachine", toParticipantID: "User", type: UmlSequenceMessageType.Synchronous },
                        { id: 111, content: "GetAmount", fromParticipantID: "ATMMachine", toParticipantID: "User", type: UmlSequenceMessageType.Synchronous },
                        { id: 112, content: "EnterAmount", fromParticipantID: "User", toParticipantID: "ATMMachine", type: UmlSequenceMessageType.Synchronous },
                        { id: 113, content: "CheckBalance", fromParticipantID: "ATMMachine", toParticipantID: "BankServer", type: UmlSequenceMessageType.Synchronous },
                        { id: 114, content: "Balance", fromParticipantID: "BankServer", toParticipantID: "ATMMachine", type: UmlSequenceMessageType.Reply },
                        { id: 115, content: "Display(\"Insufficient Balance\")", fromParticipantID: "ATMMachine", toParticipantID: "User", type: UmlSequenceMessageType.Synchronous },
                        { id: 116, content: "DispenseCash", fromParticipantID: "ATMMachine", toParticipantID: "User", type: UmlSequenceMessageType.Synchronous },
                        { id: 117, content: "Display(\"Collect Cash\")", fromParticipantID: "ATMMachine", toParticipantID: "User", type: UmlSequenceMessageType.Synchronous },
                        { id: 118, content: "CollectCash", fromParticipantID: "User", toParticipantID: "ATMMachine", type: UmlSequenceMessageType.Synchronous },
                        { id: 119, content: "UpdateBalance", fromParticipantID: "ATMMachine", toParticipantID: "BankServer", type: UmlSequenceMessageType.Synchronous },
                        { id: 120, content: "BalanceUpdated", fromParticipantID: "BankServer", toParticipantID: "ATMMachine", type: UmlSequenceMessageType.Reply },
                        { id: 121, content: "Display(\"Transaction Cancelled\")", fromParticipantID: "ATMMachine", toParticipantID: "User", type: UmlSequenceMessageType.Synchronous },
                        { id: 122, content: "Print Receipt", fromParticipantID: "ATMMachine", toParticipantID: "User", type: UmlSequenceMessageType.Synchronous },
                        { id: 123, content: "Eject Card", fromParticipantID: "ATMMachine", toParticipantID: "User", type: UmlSequenceMessageType.Synchronous },
                        { id: 124, content: "Collect Card", fromParticipantID: "User", toParticipantID: "ATMMachine", type: UmlSequenceMessageType.Synchronous },
                        { id: 125, content: "Display(\"Thank You\")", fromParticipantID: "ATMMachine", toParticipantID: "User", type: UmlSequenceMessageType.Synchronous }
                    ],
                    fragments: [
                        {
                            id: "1.1",
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "Balance < Withdrawal Amount",
                                    messageIds: [115]
                                },
                                {
                                    content: "Balance >= Withdrawal Amount",
                                    messageIds: [116, 117, 118, 119, 120]
                                }
                            ]
                        },
                        {
                            id: 1,
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "option = BalanceEnquiry",
                                    messageIds: [108, 109, 110]
                                },
                                {
                                    content: "option = Withdraw",
                                    messageIds: [111, 112, 113, 114],
                                    fragmentIds: ["1.1"]
                                },
                                {
                                    content: "option = Cancel",
                                    messageIds: [121]
                                }
                            ]
                        },
                    ]
                };

                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                diagram.appendTo('#umlSequenceDiagram-1');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                debugger;
                expect(diagram.nodes.length).toBe(11);
                expect(diagram.connectors.length).toBe(28);
                done();
            });
        });
        describe('Sample-2', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { id: 'umlSequenceDiagram-2', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    spaceBetweenParticipants: 120,
                    participants: [
                        {
                            id: 'p1', content: 'Client', isActor: true, showDestructionMarker: false,
                            activationBoxes: [{ id: 'act1', startMessageID: 'm1', endMessageID: 'm2' }, { id: 'act2', startMessageID: 'm5', endMessageID: 'm7' }]
                        },
                        {
                            id: 'p2', content: 'Server', isActor: false, showDestructionMarker: true,
                            activationBoxes: [{ id: 'act2', startMessageID: 'm2', endMessageID: 'm5' },]
                        },
                        {
                            id: 'p3', content: 'DB', isActor: false, showDestructionMarker: false,
                            activationBoxes: [{ id: 'act3', startMessageID: 'm3', endMessageID: 'm4' }]
                        }
                    ],
                    messages: [
                        { id: 'm1', type: UmlSequenceMessageType.Create, fromParticipantID: 'p1', toParticipantID: 'p2', content: 'init()' },
                        { id: 'm2', type: UmlSequenceMessageType.Synchronous, fromParticipantID: 'p1', toParticipantID: 'p2', content: 'request()' },
                        { id: 'm3', type: UmlSequenceMessageType.Asynchronous, fromParticipantID: 'p2', toParticipantID: 'p3', content: 'query()' },
                        { id: 'm4', type: UmlSequenceMessageType.Reply, fromParticipantID: 'p3', toParticipantID: 'p2', content: 'result' },
                        { id: 'm5', type: UmlSequenceMessageType.Reply, fromParticipantID: 'p2', toParticipantID: 'p1', content: 'response' },
                        { id: 'm6', type: UmlSequenceMessageType.Self, fromParticipantID: 'p2', toParticipantID: 'p2', content: 'log()' },
                        { id: 'm7', type: UmlSequenceMessageType.Delete, fromParticipantID: 'p1', toParticipantID: 'p2', content: 'terminate()' }
                    ],
                    fragments: [
                        {
                            id: 'altFrag',
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                { content: 'DB available', messageIds: ['m3', 'm4'] },
                                { content: 'DB down', messageIds: ['m6'] }
                            ]
                        },
                        {
                            id: 'optFrag',
                            type: UmlSequenceFragmentType.Optional,
                            conditions: [
                                { content: 'Request valid', messageIds: ['m2', 'm5'] }
                            ]
                        },
                        {
                            id: 'loopFrag',
                            type: UmlSequenceFragmentType.Loop,
                            conditions: [
                                { content: 'Retry 3 times', messageIds: ['m2', 'm3', 'm4'] }
                            ]
                        }
                    ]
                }
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                diagram.appendTo('#umlSequenceDiagram-2');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(diagram.nodes.length).toBe(10);
                expect(diagram.connectors.length).toBe(10);
                done();
            });
        });
        describe('Sample-3', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let model: UmlSequenceDiagramModel;
            beforeAll((): void => {
                ele = createElement('div', { id: 'umlSequenceDiagram-3', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                model = {
                    participants: [
                        {
                            id: "1",
                            content: "Alice",
                            isActor: true,
                            showDestructionMarker: true
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true,
                            showDestructionMarker: true
                        },
                        {
                            id: "2",
                            content: "Evaluator",
                            isActor: true,
                            showDestructionMarker: false,
                            activationBoxes: [
                                { id: "Act1", startMessageID: 103, endMessageID: 115 }
                            ]
                        },
                        {
                            id: "D123",
                            content: "Developer",
                            isActor: true,
                            showDestructionMarker: true,
                            activationBoxes: [
                                { id: "Act2", startMessageID: 109, endMessageID: 113 }
                            ]
                        },
                        {
                            id: "3",
                            content: "Customer",
                            isActor: true,
                            showDestructionMarker: true,
                            activationBoxes: [
                                { id: "Act3", startMessageID: "111", endMessageID: 112 }
                            ]
                        }
                    ],
                    messages: [
                        { id: "MSG1", content: "Hey Bob, do you have the report?", fromParticipantID: "1", toParticipantID: "B", type: UmlSequenceMessageType.Synchronous },
                        { id: 102, content: "Not yet, I'm still working on it.", fromParticipantID: "B", toParticipantID: "1", type: UmlSequenceMessageType.Synchronous },
                        { id: 103, content: "Can you assist Bob with that?", fromParticipantID: "1", toParticipantID: "2", type: UmlSequenceMessageType.Create },
                        { id: "104", content: "Let's get this done together.", fromParticipantID: "2", toParticipantID: "B", type: UmlSequenceMessageType.Synchronous },
                        { id: 105, content: "Thanks for your help, Eve.", fromParticipantID: "B", toParticipantID: "2", type: UmlSequenceMessageType.Synchronous },
                        { id: "106", content: "The report is ready.", fromParticipantID: "2", toParticipantID: "1", type: UmlSequenceMessageType.Synchronous },
                        { id: 107, content: "Great job, Bob!", fromParticipantID: "1", toParticipantID: "B", type: UmlSequenceMessageType.Synchronous },
                        { id: "MSG108", content: "Thanks, Eve!", fromParticipantID: "1", toParticipantID: "2", type: UmlSequenceMessageType.Synchronous },
                        { id: 109, content: "We need to check the code.", fromParticipantID: "B", toParticipantID: "D123", type: UmlSequenceMessageType.Create },
                        { id: "110", content: "Sure, I'll review the code.", fromParticipantID: "D123", toParticipantID: "B", type: UmlSequenceMessageType.Synchronous },
                        { id: "111", content: "Report is finalized, sending it to you.", fromParticipantID: "B", toParticipantID: "3", type: UmlSequenceMessageType.Create },
                        { id: 112, content: "Received, thank you.", fromParticipantID: "3", toParticipantID: "B", type: UmlSequenceMessageType.Synchronous },
                        { id: 113, content: "Thanks for the review", fromParticipantID: "1", toParticipantID: "D123", type: UmlSequenceMessageType.Delete },
                        { id: "114", content: "We're done here.", fromParticipantID: "2", toParticipantID: "1", type: UmlSequenceMessageType.Synchronous },
                        { id: 115, content: "Let's proceed with closing steps.", fromParticipantID: "1", toParticipantID: "2", type: UmlSequenceMessageType.Delete },
                        { id: 116, content: "Shall we wrap up the project meeting?", fromParticipantID: "1", toParticipantID: "B", type: UmlSequenceMessageType.Synchronous },
                        { id: "117", content: "Yes, let's finalize it.", fromParticipantID: "B", toParticipantID: "1", type: UmlSequenceMessageType.Synchronous },
                        { id: "118", content: "I'm done with the project.", fromParticipantID: "B", toParticipantID: "1", type: UmlSequenceMessageType.Delete }
                    ],
                    fragments: [
                        {
                            id: 1,
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "If assistance is needed",
                                    messageIds: ["104", 105, "106"]
                                },
                                {
                                    content: "If review is needed",
                                    messageIds: [107, "MSG108", 109, 110]
                                }
                            ]
                        },
                        {
                            id: 2,
                            type: UmlSequenceFragmentType.Loop,
                            conditions: [
                                {
                                    content: "For each review cycle",
                                    messageIds: ["111", 112, 113]
                                }
                            ]
                        }
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                diagram.appendTo('#umlSequenceDiagram-3');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(diagram.nodes.length).toBe(10);
                expect(diagram.connectors.length).toBe(23);
                done();
            });
            it('render', (done: Function) => {
                const rajParticipant: UmlSequenceParticipantModel = {
                    id: "4",
                    content: "Raj",
                    isActor: false,
                    showDestructionMarker: true,
                    activationBoxes: [
                        {
                            id: "Act4",
                            startMessageID: 120,
                            endMessageID: 123
                        }
                    ]
                };
                model.participants.push(rajParticipant);

                const rajMessages: UmlSequenceMessageModel[] = [
                    { id: 120, content: "Hello Alice!", fromParticipantID: "B", toParticipantID: "4", type: UmlSequenceMessageType.Create },
                    { id: 121, content: "Can you send the report to Bob?", fromParticipantID: "4", toParticipantID: "B", type: UmlSequenceMessageType.Synchronous },
                    { id: 122, content: "Bob, did you receive the report?", fromParticipantID: "4", toParticipantID: "B", type: UmlSequenceMessageType.Synchronous },
                    { id: 123, content: "Thank you all for your efforts!", fromParticipantID: "4", toParticipantID: "B", type: UmlSequenceMessageType.Synchronous }
                ];
                model.messages = model.messages.concat(rajMessages);

                const rajLoopFragment: UmlSequenceFragmentModel = {
                    id: 3,
                    type: UmlSequenceFragmentType.Loop,
                    conditions: [
                        {
                            content: "Raj iterates over communication",
                            messageIds: [120, 121, 122, 123]
                        }
                    ]
                };
                model.fragments.push(rajLoopFragment);
                diagram.model = model;
                diagram.updateFromModel();
                expect(diagram.nodes.length).toBe(13);
                expect(diagram.connectors.length).toBe(28);
                done();
            });
        });
        describe('errorHandling', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling',  styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            content: "Unnamed Participant",
                            isActor: true
                        }
                    ],
                    messages: [],
                    fragments: []
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                diagram.appendTo('#errorHandling');

            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Participant ID undefined', (done: Function) => {
                expect(diagram.nodes.length).toBe(0);
                done();
            });
            it('Message ID undefined', (done: Function) => {
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: 'User1',
                            content: "ParticipantA",
                            isActor: true
                        },
                        {
                            id: 'User2',
                            content: 'ParticipantB',
                        }
                    ],
                    messages: [{content: 'message', fromParticipantID: 'User1', toParticipantID: 'User1'}],
                    fragments: []
                };
                diagram.model = model;
                diagram.updateFromModel();
                expect(diagram.nodes.length).toBe(2);
                expect(diagram.connectors.length).toBe(2);
                done();
            });
            it('Message ID not given', (done: Function) => {
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: 'User1',
                            content: "ParticipantA",
                            isActor: true
                        },
                        {
                            id: 'User2',
                            content: 'ParticipantB',
                        }
                    ],
                    messages: [{id: 'msg1', content: 'message', fromParticipantID: 'User1'}],
                    fragments: []
                };
                diagram.model = model;
                diagram.updateFromModel();
                expect(diagram.nodes.length).toBe(2);
                expect(diagram.connectors.length).toBe(2);
                done();
            });
             it('Incorrect from & to participant ID', (done: Function) => {
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: 'User1',
                            content: "ParticipantA",
                            isActor: true
                        },
                        {
                            id: 'User2',
                            content: 'ParticipantB',
                            activationBoxes: [{id: 'Act2', startMessageID: "X", endMessageID: "Y" }]
                        }
                    ],
                    messages: [
                        {id: 'msg1', content: 'message1', fromParticipantID: 'A', toParticipantID: 'B'},
                        {id: 'msg2', content: 'message2', fromParticipantID: 'User2', toParticipantID: 'User1'},

                    ],
                    fragments: []
                };
                diagram.model = model;
                diagram.updateFromModel();
                expect(diagram.nodes.length).toBe(2);
                expect(diagram.connectors.length).toBe(3);
                done();
            });
            it('Activation ID undefined', (done: Function) => {
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: 'User1',
                            content: "ParticipantA",
                            isActor: true
                        },
                        {
                            id: 'User2',
                            content: 'ParticipantB',
                            activationBoxes: [{startMessageID: "message1", endMessageID: "message2" }]
                        }
                    ],
                    messages: [
                        {id: 'message1',content: 'message1', fromParticipantID: 'User1', toParticipantID: 'User2'},
                        {id: 'message2',content: 'message2', fromParticipantID: 'User2', toParticipantID: 'User1'},

                    ],
                    fragments: []
                };
                diagram.model = model;
                diagram.updateFromModel();
                expect(diagram.nodes.length).toBe(3);
                done();
            });
            it('Incorrect activation start & end message ID', (done: Function) => {
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: 'User1',
                            content: "ParticipantA",
                            isActor: true
                        },
                        {
                            id: 'User2',
                            content: 'ParticipantB',
                            activationBoxes: [{id: 'Act2', startMessageID: "X", endMessageID: "Y" }]
                        }
                    ],
                    messages: [
                        {id: 'message1', content: 'message1', fromParticipantID: 'User1', toParticipantID: 'User2'},
                        {id: 'message2', content: 'message2', fromParticipantID: 'User2', toParticipantID: 'User1'},

                    ],
                    fragments: []
                };
                diagram.model = model;
                diagram.updateFromModel();
                expect(diagram.nodes.length).toBe(2);
                done();
            });
            it('Fragment ID undefined', (done: Function) => {
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: 'User1',
                            content: "ParticipantA",
                            isActor: true
                        },
                        {
                            id: 'User2',
                            content: 'ParticipantB',
                            activationBoxes: [{id: 'Act2', startMessageID: "message1", endMessageID: "message2" }]
                        }
                    ],
                    messages: [
                        {id: 'message1', content: 'message1', fromParticipantID: 'User1', toParticipantID: 'User2'},
                        {id: 'message2', content: 'message2', fromParticipantID: 'User2', toParticipantID: 'User1'},

                    ],
                    fragments: [{
                            type: UmlSequenceFragmentType.Loop,
                            conditions: [{ content: "Looping" }]
                    }]
                };
                diagram.model = model;
                diagram.updateFromModel();
                expect(diagram.nodes.length).toBe(3);
                done();
            });
        });
        describe('errorHandling-7', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-7', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true
                        }
                    ],
                    messages: [
                        {
                            id: "m1",
                            toParticipantID: "A", // valid ID
                            content: "Invalid IDs",
                            type: UmlSequenceMessageType.Self
                        }
                    ],
                    fragments: []
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-7');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
        
        describe('errorHandling-10', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-10', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true,
                            activationBoxes: [
                                { id: "Act1" } // Missing start and end IDs
                            ]
                        },
                        {
                            id: "B",
                            content: "BOb",
                            isActor: true,
                            activationBoxes: [
                                { id: "Act2", startMessageID: 'msg1' } // Missing end IDs
                            ]
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'message1', fromParticipantID: 'A', toParticipantID: 'B', type: UmlSequenceMessageType.Synchronous },
                        { id: 'msg2', content: 'message2', fromParticipantID: 'A', toParticipantID: 'B', type: UmlSequenceMessageType.Asynchronous }
                    ],
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-10');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });

        describe('errorHandling-11', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-11', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true
                        }
                    ],
                    fragments: [
                        {
                            id: "frag1",
                            type: UmlSequenceFragmentType.Loop,
                            conditions: []
                        }
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-11');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });

        describe('errorHandling-12', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-12', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'message', fromParticipantID: 'B', toParticipantID: 'A', type: UmlSequenceMessageType.Reply }
                    ],
                    fragments: [
                        {
                            id: "childFrag",
                            type: UmlSequenceFragmentType.Optional,
                            conditions: [{ content: "Inner Condition", messageIds: ['msg1', 'msg2'] }]
                        },
                        {
                            id: "parentFrag",
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "Parent Condition", messageIds: ['msg2'],
                                    fragmentIds: ['childFrag']
                                }
                            ]
                        }
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-12');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
        describe('errorHandling-13', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-13', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'message', fromParticipantID: 'B', toParticipantID: 'A', type: UmlSequenceMessageType.Reply }
                    ],
                    fragments: [
                        {
                            id: "childFrag",
                            type: UmlSequenceFragmentType.Optional,
                            conditions: [{ content: "Inner Condition", messageIds: ['msg1', 'msg2'] }]
                        },
                        {
                            id: "parentFrag",
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "Parent Condition", messageIds: [''],
                                }
                            ]
                        }
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-13');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
    
        describe('errorHandling-15', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-15', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true,
                        }
                    ],
                    messages: [{ id: 'msg', content: 'message', toParticipantID: 'A', type: UmlSequenceMessageType.Self }],
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-15');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
        describe('errorHandling-16', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-16', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'message', fromParticipantID: 'B', toParticipantID: 'A', type: UmlSequenceMessageType.Reply }
                    ],
                    fragments: [
                        {
                            id: "childFrag",
                            type: UmlSequenceFragmentType.Optional,
                            conditions: [
                                {
                                    content: "Parent Condition", messageIds: ['msg1'],
                                }
                            ]
                        },
                        {
                            id: "parentFrag",
                            type: UmlSequenceFragmentType.Optional,
                            conditions: [{ content: "Inner Condition", messageIds: ['msg1', 'msg2'], fragmentIds: ['childFrag'] }]
                        },
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-16');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
        describe('errorHandling-17', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-17', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'message', fromParticipantID: 'B', toParticipantID: 'A', type: UmlSequenceMessageType.Reply },
                        { id: 'msg3', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg4', content: 'message', fromParticipantID: 'B', toParticipantID: 'A', type: UmlSequenceMessageType.Reply },
                        { id: 'msg5', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg6', content: 'message', fromParticipantID: 'A', toParticipantID: 'A', type: UmlSequenceMessageType.Reply },

                    ],
                    fragments: [
                        {
                            id: "nestedFrag",
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "Nest1", messageIds: ['msg1'],
                                },
                                {
                                    content: "Nest2", messageIds: ['msg2'],
                                }
                            ]
                        },
                        {
                            id: "childFrag",
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "child1", fragmentIds: ['nestedFrag']
                                },
                                {
                                    content: "child2", messageIds: ['msg3']
                                }
                            ]
                        },
                        {
                            id: "parentFrag",
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                { content: "Inner Condition", fragmentIds: ['childFrag'] },
                                {
                                    content: "Inner Condition2", messageIds: ['msg4'],
                                }]
                        },
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-17');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
        describe('errorHandling-18', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-18', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true,
                            activationBoxes: [{ id: 'act1', startMessageID: 'msg2', endMessageID: 'msg3' }]
                        },
                        {
                            id: "C",
                            content: "Kevin",
                            isActor: true,
                            activationBoxes: [{ id: 'act2', startMessageID: 'msg3', endMessageID: 'msg4' }]
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'Command', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'Accept', fromParticipantID: 'B', toParticipantID: 'B', type: UmlSequenceMessageType.Self },
                        { id: 'msg3', content: 'Create', fromParticipantID: 'B', toParticipantID: 'C', type: UmlSequenceMessageType.Create },
                        { id: 'msg4', content: 'Created', fromParticipantID: 'C', toParticipantID: 'A', type: UmlSequenceMessageType.Reply }
                    ],
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-18');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
        describe('errorHandling-19', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-19', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        },
                        {
                            id: "C",
                            content: "Kevin",
                            isActor: true
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'message', fromParticipantID: 'B', toParticipantID: 'C', type: UmlSequenceMessageType.Create },
                        { id: 'msg3', content: 'message', fromParticipantID: 'C', toParticipantID: 'A', type: UmlSequenceMessageType.Asynchronous }
                    ],
                    fragments: [
                        {
                            id: "childFrag",
                            type: UmlSequenceFragmentType.Optional,
                            conditions: [
                                {
                                    content: "Parent Condition", messageIds: ['msg1', 'msg2', 'msg3']
                                }
                            ]
                        },
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-19');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
        describe('errorHandling-20', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-20', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true,
                            showDestructionMarker: true,
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        },
                        {
                            id: "C",
                            content: "Kevin",
                            isActor: true
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'message', fromParticipantID: 'B', toParticipantID: 'C', type: UmlSequenceMessageType.Create },
                        { id: 'msg3', content: 'message', fromParticipantID: 'C', toParticipantID: 'A', type: UmlSequenceMessageType.Delete }
                    ],
                    fragments: [
                        {
                            id: "childFrag",
                            type: UmlSequenceFragmentType.Optional,
                            conditions: [
                                {
                                    content: "Parent Condition", messageIds: ['msg1', 'msg2', 'msg3']
                                }
                            ]
                        },
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-20');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
        describe('errorHandling-21', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-21', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true,
                            showDestructionMarker: true,
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        },
                        {
                            id: "C",
                            content: "Kevin",
                            isActor: true
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'message', fromParticipantID: 'B', toParticipantID: 'C', type: UmlSequenceMessageType.Create },
                    ],
                    fragments: [
                        {
                            id: "childFrag",
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "Parent Condition", messageIds: []
                                }
                            ]
                        },
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-21');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
      
        describe('errorHandling-23', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-23', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true,
                            showDestructionMarker: true,
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        },
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'message', fromParticipantID: 'B', toParticipantID: 'A' },
                        { id: 'msg3', content: 'message', fromParticipantID: 'B', toParticipantID: 'A' },
                        { id: 'msg4', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },

                    ],
                    fragments: [
                        {
                            id: 'firstNest',
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "InCondition1", messageIds: ['msg1']
                                },
                                {
                                    content: "InCondition2", messageIds: ['msg2']
                                }
                            ]
                        },
                        {
                            id: 'secondNest',
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "InCondition1", messageIds: ['msg3']
                                },
                                {
                                    content: "InCondition2", messageIds: ['msg4']
                                }
                            ]
                        },
                        {
                            id: "ParnetFragment",
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "Nested Alts1", fragmentIds: ['firstNest']
                                },
                                {
                                    content: "Nested Alts2", fragmentIds: ['secondNest']
                                },
                            ]
                        },
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-23');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
        describe('errorHandling-24', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-24', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true,
                            activationBoxes: [
                                { id: 'act1', startMessageID: 'msg1', endMessageID: 'msg3' },
                                { id: 'act2', startMessageID: 'msg2', endMessageID: 'msg3' }
                            ]
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        },
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'message', fromParticipantID: 'B', toParticipantID: 'A' },
                        { id: 'msg3', content: 'message', fromParticipantID: 'B', toParticipantID: 'A' },
                        { id: 'msg4', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },

                    ],
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-24');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(diagram.nodes.length).toBe(4);
                done();
            });
        });
        describe('errorHandling-25', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-25', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true,
                            showDestructionMarker: true,
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        },
                        {
                            id: "C",
                            content: "Kevin",
                            isActor: true
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'message', fromParticipantID: 'B', toParticipantID: 'C', type: UmlSequenceMessageType.Create },
                    ],
                    fragments: [
                        {
                            id: "childFrag",
                            type: UmlSequenceFragmentType.Optional,
                            conditions: [
                                {
                                    content: "Parent Condition", messageIds: []
                                }
                            ]
                        },
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-25');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
        describe('errorHandling-26', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let error: any;
            beforeAll((): void => {
                ele = createElement('div', { id: 'errorHandling-26', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        },
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                        { id: 'msg2', content: 'message', fromParticipantID: 'B', toParticipantID: 'A', type: UmlSequenceMessageType.Reply },
                    ],
                    fragments: [
                        {
                            id: 'loop',
                            type: UmlSequenceFragmentType.Loop,
                            conditions: [
                                { messageIds: ['msg1'] }
                            ]
                        }
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                try {
                    diagram.appendTo('#errorHandling-26');
                }
                catch (e) {
                    error = e;
                    debugger;
                }
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(error).toBe(undefined);
                done();
            });
        });
        describe('FootBox-1', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { id: 'FootBox-1', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                    ],
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                (diagram.model as UmlSequenceDiagram).hideFootBox = false;
                diagram.appendTo('#FootBox-1');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(diagram.nodes.length).toBe(4);
                done();
            });
        });
        describe('FootBox-2', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { id: 'FootBox-2', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: "A",
                            content: "Alice",
                            isActor: true
                        },
                        {
                            id: "B",
                            content: "Bob",
                            isActor: true,
                            showDestructionMarker: true
                        }
                    ],
                    messages: [
                        { id: 'msg1', content: 'message', fromParticipantID: 'A', toParticipantID: 'B' },
                    ],
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                (diagram.model as UmlSequenceDiagram).hideFootBox = false;
                diagram.appendTo('#FootBox-2');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('render', (done: Function) => {
                expect(diagram.nodes.length).toBe(3);
                done();
            });
        });
            describe('Mermaid to Sequence', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let mermaidData: string;
            beforeAll((): void => {
                ele = createElement('div', { id: 'mermaidSeqDiagram-1', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                mermaidData = `sequenceDiagram
                                participant Alice
                                participant Bob
                                alt Check Report
                                    Alice->>Bob: Hey Bob, do you have the report?
                                    activate Alice
                                    activate Bob
                                    Bob->>Alice: Not yet, I'm still working on it.
                                    deactivate Bob
                                    deactivate Alice
                                end
                                create participant Eve as Evaluator
                                Alice->>Eve: Can you assist Bob with that?
                                activate Eve
                                alt Assistance Workflow
                                    Eve->>Bob: Let's get this done together.
                                    activate Bob
                                    Bob->>Eve: Thanks for your help, Eve.
                                    deactivate Bob
                                else Deliver
                                    Eve->>Alice: The report is ready.
                                    Alice->>Bob: Great job, Bob!
                                    activate Bob
                                    Alice->>Eve: Thanks, Eve!
                                    deactivate Bob
                                end
                                deactivate Eve
                                create participant Dave as Developer
                                loop Code Review
                                    Bob->>Dave: We need to check the code.
                                    activate Dave
                                    Dave->>Bob: Sure, I'll review the code.
                                    opt Finalize Report
                                        create actor Carol as Customer
                                        Bob->>Carol: Report is finalized, sending it to you.
                                        activate Carol
                                        Carol->>Bob: Received, thank you.
                                        deactivate Carol
                                    end
                                end
                                destroy Dave
                                Alice->>Dave: Thanks for the review
                                deactivate Dave
                                Eve->>Alice: We're done here.
                                destroy Eve
                                Alice->>Eve: Let's proceed with closing steps.
                                alt Finalize Project
                                    Alice->>Bob: Shall we wrap up the project meeting?
                                    activate Bob
                                    Bob->>Alice: Yes, let's finalize it.
                                    deactivate Bob
                                end
                                destroy Bob
                                Bob->>Alice: I'm done with the project.
                                Alice->>Alice: Wrapping up!`;
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                });
                diagram.appendTo('#mermaidSeqDiagram-1');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('load mermaid data', (done: Function) => {
                diagram.loadDiagramFromMermaid(mermaidData)
                expect(diagram.connectors.length).toBe(24);
                expect(diagram.nodes.length).toBe(18);
                done();
            });
            it('save mermaid data', (done: Function) => {
                const mermaidText: string = diagram.saveDiagramAsMermaid()
                expect(mermaidText === mermaidData);
                done();
            });
        });
        describe('Sequence model to Mermaid', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { id: 'mermaidSeqDiagram-2', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        {
                            id: 'Alice', content: 'Alice', isActor: false, showDestructionMarker: false,
                            activationBoxes: [{ id: 'aliceAct', startMessageID: 'MSG1', endMessageID: 'MSG2' }]
                        },
                        {
                            id: 'Bob', content: 'Bob', isActor: false, showDestructionMarker: true,
                            activationBoxes: [
                                { id: 'act1', startMessageID: 'MSG1', endMessageID: 'MSG2' },
                                { id: 'act2', startMessageID: 'MSG4', endMessageID: 'MSG5' },
                                { id: 'act3', startMessageID: 'MSG7', endMessageID: 'MSG8' },
                                { id: 'act4', startMessageID: 'MSG16', endMessageID: 'MSG17' }
                            ]
                        },
                        {
                            id: 'Eve', content: 'Evaluator', isActor: false, showDestructionMarker: true,
                            activationBoxes: [{ id: 'act1', startMessageID: 'MSG3', endMessageID: 'MSG8' }]
                        },
                        {
                            id: 'Dave', content: 'Developer', isActor: false, showDestructionMarker: true,
                            activationBoxes: [{ id: 'act1', startMessageID: 'MSG9', endMessageID: 'MSG13' }]
                        },
                        { id: 'Carol', content: 'Customer', isActor: true, showDestructionMarker: false, }
                    ],
                    messages: [
                        { id: 'MSG1', content: "Hey Bob, do you have the report?", fromParticipantID: 'Alice', toParticipantID: 'Bob', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG2', content: "Not yet, I'm still working on it.", fromParticipantID: 'Bob', toParticipantID: 'Alice', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG3', content: "Can you assist Bob with that?", fromParticipantID: 'Alice', toParticipantID: 'Eve', type: UmlSequenceMessageType.Create },
                        { id: 'MSG4', content: "Let's get this done together.", fromParticipantID: 'Eve', toParticipantID: 'Bob', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG5', content: "Thanks for your help, Eve.", fromParticipantID: 'Bob', toParticipantID: 'Eve', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG6', content: "The report is ready.", fromParticipantID: 'Eve', toParticipantID: 'Alice', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG7', content: "Great job, Bob!", fromParticipantID: 'Alice', toParticipantID: 'Bob', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG8', content: "Thanks, Eve!", fromParticipantID: 'Alice', toParticipantID: 'Eve', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG9', content: "We need to check the code.", fromParticipantID: 'Bob', toParticipantID: 'Dave', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG10', content: "Sure, I'll review the code.", fromParticipantID: 'Dave', toParticipantID: 'Bob', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG11', content: "Report is finalized, sending it to you.", fromParticipantID: 'Bob', toParticipantID: 'Carol', type: UmlSequenceMessageType.Create },
                        { id: 'MSG12', content: "Received, thank you.", fromParticipantID: 'Carol', toParticipantID: 'Bob', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG13', content: "Thanks for the review", fromParticipantID: 'Alice', toParticipantID: 'Dave', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG14', content: "We're done here.", fromParticipantID: 'Eve', toParticipantID: 'Alice', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG15', content: "Let's proceed with closing steps.", fromParticipantID: 'Alice', toParticipantID: 'Eve', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG16', content: "Shall we wrap up the project meeting?", fromParticipantID: 'Alice', toParticipantID: 'Bob', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG17', content: "Yes, let's finalize it.", fromParticipantID: 'Bob', toParticipantID: 'Alice', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG18', content: "I'm done with the project.", fromParticipantID: 'Bob', toParticipantID: 'Alice', type: UmlSequenceMessageType.Synchronous },
                        { id: 'MSG19', content: "Wrapping up!", fromParticipantID: 'Alice', toParticipantID: 'Alice', type: UmlSequenceMessageType.Synchronous }
                    ],
                    fragments: [
                        {
                            id: 1,
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "Check Report",
                                    messageIds: ['MSG1', 'MSG2']
                                }
                            ]
                        },
                        {
                            id: 2,
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "Assistance Workflow",
                                    messageIds: ['MSG4', 'MSG5']
                                },
                                {
                                    content: "Deliver",
                                    messageIds: ['MSG6', 'MSG7', 'MSG8']
                                }
                            ]
                        },
                        {
                            id: 4,
                            type: UmlSequenceFragmentType.Optional,
                            conditions: [
                                {
                                    content: "Finalize Report",
                                    messageIds: ['MSG11', 'MSG12']
                                }
                            ]
                        },
                        {
                            id: 3,
                            type: UmlSequenceFragmentType.Loop,
                            conditions: [
                                {
                                    content: "Code Review",
                                    messageIds: ['MSG9', 'MSG10'],
                                    fragmentIds: ["4"]
                                }
                            ]
                        },
                        {
                            id: 5,
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                {
                                    content: "Finalize Project",
                                    messageIds: ['MSG16', 'MSG17']
                                }
                            ]
                        }
                    ]
                };
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                diagram.appendTo('#mermaidSeqDiagram-2');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('check mermaid data', (done: Function) => {
                const mermaidText: string = diagram.saveDiagramAsMermaid();
                const expectedMermaidData: string = 
`sequenceDiagram
    participant Alice as Alice
    participant Bob as Bob
    participant Dave as Developer
    alt Check Report
        Alice->>Bob: Hey Bob, do you have the report?
        activate Alice
        activate Bob
        Bob->>Alice: Not yet, I'm still working on it.
        deactivate Alice
        deactivate Bob
    end
    create participant Eve as Evaluator
    Alice-->Eve: Can you assist Bob with that?
    activate Eve
    alt Assistance Workflow
        Eve->>Bob: Let's get this done together.
        activate Bob
        Bob->>Eve: Thanks for your help, Eve.
        deactivate Bob
    else Deliver
        Eve->>Alice: The report is ready.
        Alice->>Bob: Great job, Bob!
        activate Bob
        Alice->>Eve: Thanks, Eve!
        deactivate Bob
        deactivate Eve
    end
    loop Code Review
        Bob->>Dave: We need to check the code.
        activate Dave
        Dave->>Bob: Sure, I'll review the code.
    end
    opt Finalize Report
        create actor Carol as Customer
        Bob-->Carol: Report is finalized, sending it to you.
        Carol->>Bob: Received, thank you.
    end
    Alice->>Dave: Thanks for the review
    deactivate Dave
    Eve->>Alice: We're done here.
    Alice->>Eve: Let's proceed with closing steps.
    alt Finalize Project
        Alice->>Bob: Shall we wrap up the project meeting?
        activate Bob
        Bob->>Alice: Yes, let's finalize it.
        deactivate Bob
    end
    Bob->>Alice: I'm done with the project.
    Alice->>Alice: Wrapping up!`;
                expect(mermaidText.trim() === expectedMermaidData.trim()).toBe(true);
                done();
            });
        });
        describe('Sequence Mermaid data-1', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { id: 'mermaidSeqDiagram-3', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                });
                diagram.appendTo('#mermaidSeqDiagram-3');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('check messages', (done: Function) => {
                const expectedMermaidData: string = 
`sequenceDiagram
    participant A
    participant B

    A->>B: Solid Arrow
    A-->>B: Dashed Arrow
    B<<->>A: Bidirectional
    B<<-->>A: Dashed Bidirectional
    A-)B: Open Arrow
    A--)B: Dashed Open Arrow
    A->B: Solid
    A-->B: Dashed`;
                diagram.loadDiagramFromMermaid(expectedMermaidData);
                expect(diagram.connectors.length).toBe(10);
                done();
            });
        });
        describe('Sequence Mermaid data-2', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { id: 'mermaidSeqDiagram-4', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                const model: UmlSequenceDiagramModel = {
                    participants: [
                        // id as string, content provided
                        { id: 'p1', content: 'User', isActor: true },
                        // isActor omitted
                        { id: 'p2', content: 'System' }
                    ],
                    messages: [
                        // type omitted -> should default to Synchronous
                        { id: 'm1', fromParticipantID: 'p1', toParticipantID: 'p2', content: 'Login()' },
                        { id: 'm2', fromParticipantID: 'p2', toParticipantID: 'p1', content: 'Success' },
                        { id: 'm3', fromParticipantID: 'p2', toParticipantID: 'p1', content: 'Failure' },
                        { id: 'm4', fromParticipantID: 'p1', toParticipantID: 'p2', content: 'Retry()' }
                    ],
                    fragments: [
                        {
                            id: 'AltFrag1',
                            type: UmlSequenceFragmentType.Alternative,
                            conditions: [
                                { content: 'if valid', messageIds: ['m2'] },
                                { content: 'else', messageIds: ['m3'] }
                            ]
                        },
                        {
                            id: 'optFrag1',
                            type: UmlSequenceFragmentType.Optional,
                            conditions: [
                                { content: 'user retries', messageIds: ['m4'] }
                            ]
                        },
                        {
                            id: 'loopFrag1',
                            type: UmlSequenceFragmentType.Loop,
                            conditions: [
                                { content: 'max 3 attempts', messageIds: ['m1'] }
                            ]
                        }
                    ]
                }
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                    model: model
                });
                diagram.appendTo('#mermaidSeqDiagram-4');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('check messages', (done: Function) => {
                const mermaidText: string = diagram.saveDiagramAsMermaid();
                const expectedMermaidData: string = 
`sequenceDiagram
    actor p1 as User
    participant p2 as System
    loop max 3 attempts
        p1->>p2: Login()
    end
    alt if valid
        p2->>p1: Success
    else else
        p2->>p1: Failure
    end
    opt user retries
        p1->>p2: Retry()
    end`;
                expect(mermaidText.trim() === expectedMermaidData.trim()).toBe(true);
                expect(diagram.nodes.length).toBe(5);
                done();
            });
        });
        describe('Sequence Mermaid data-3', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { id: 'mermaidSeqDiagram-5', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                });
                diagram.appendTo('#mermaidSeqDiagram-5');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('cover create destory messages', (done: Function) => {
                const mermaidData: string = 
`sequenceDiagram
    participant Alice
    participant Bob

    %% Comment before creation
    create participant Alice

    %% Another comment
    %% Yet another one
    destroy participant Bob

    %% Comment after destroy`;
                diagram.loadDiagramFromMermaid(mermaidData);
                expect(diagram.nodes.length).toBe(2);
                done();
            });
        });
        describe('Mermaid', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { id: 'mermaidSeqDiagram-6', styles: 'width:100%;height:800px;' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: '100%',
                    height: '800px',
                });
                diagram.appendTo('#mermaidSeqDiagram-6');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Activation undefined', (done: Function) => {
                const mermaidData: string = 
`sequenceDiagram
    participant A as Alice
    participant B
    participant C
    participant D
    participant E
    participant F
    activate A
    A->>B: Initiate Workflow
    activate B
    opt Validate Session
        B->>A: Check Session Validity
        A-->>B: Session Valid
        deactivate B
        activate C
        loop Iterate Over Items
            C->>D: Process Item
            activate D
            alt Check Item Status
                D-->>C: Status OK
                E->>D: Perform Detailed Analysis
                activate E
                D-->>E: Detailed Result
                deactivate E
                loop Post Analysis Procedures
                    D->>F: Request Additional Data
                    activate F
                    alt Data Available
                        F-->>D: Return Data
                    else Data Missing
                        F-->>D: Notify Unavailability
                    end
                    deactivate F
                end
            else
                D->>C: Report Failed Item
            end
            D-->>C: Item Processed
            deactivate D
        end
        C-->>A: Completed All Items
        deactivate C
    end
    A->>B: Finalize and Close
    activate B
    B-->>A: Confirmation Acknowledged
    deactivate B
    deactivate A
`;
                diagram.loadDiagramFromMermaid(mermaidData);
                expect(diagram.nodes.length).toBe(18);
                done();
            });
            it('message after participant destroyed', (done: Function) => {
                const mermaidData: string = 
`sequenceDiagram
    actor Alice
    participant Bob
    
    Alice ->> Bob: Hi Bob!
    Bob -->> Alice: Hello Alice!
    Alice ->> Bob: How are you?
    Bob -->> Alice: I'm good, thanks!
    Alice ->> Bob: What are you working on?
    Bob -->> Alice: Just coding a demo.
    destroy Alice
    Alice ->> Bob: Sounds interesting!
    destroy Bob
    Bob -->> Alice: It really is.
    Alice ->> Bob: Let's meet later.
    Bob -->> Alice: Sure, see you soon!

`;
                diagram.loadDiagramFromMermaid(mermaidData);
                expect(diagram.nodes.length).toBe(2);
                expect(diagram.connectors.length).toBe(12);
                done();
            });
            it('Empty message collection in 1st fragment condition', (done: Function) => {
                const mermaidData: string = 
`sequenceDiagram
    actor Alice
    participant Bob

    Alice ->> Bob: Hello Bob
    activate Alice
    Bob -->> Alice: Hi Alice
    Alice ->> Bob: How are you?
    activate Bob

    alt first

    else second
        Bob -->> Alice: I'm good, thanks
        Alice ->> Bob: Let's meet later
    end

    deactivate Bob
    deactivate Alice
    deactivate A
`;
                diagram.loadDiagramFromMermaid(mermaidData);
                expect(diagram.nodes.length).toBe(6);
                expect(diagram.connectors.length).toBe(8);
                done();
            });
            it('Empty message collection in 2nd fragment condition', (done: Function) => {
                const mermaidData: string = 
`sequenceDiagram
    actor Alice
    participant Bob

    Alice ->> Bob: Hello Bob
    activate Alice
    Bob -->> Alice: Hi Alice
    Alice ->> Bob: How are you?
    activate Bob

    alt first
        Bob -->> Alice: I'm good, thanks
        Alice ->> Bob: Let's meet later
    else second

    end

    deactivate Bob
    deactivate Alice
    deactivate A
`;
                diagram.loadDiagramFromMermaid(mermaidData);
                expect(diagram.nodes.length).toBe(6);
                expect(diagram.connectors.length).toBe(8);
                done();
            });
             it('overlapping activations', (done: Function) => {
                const mermaidData: string = 
`sequenceDiagram
    participant A as Alice
    participant B as Bob
    participant C as Charlie
    activate B
    A ->> B: Simple Message
    activate B
    A ->> B: Calling Method
    B ->> C: B calls C
    activate C
    C -->> B: Return Result
    deactivate C
    B ->> A: Response
    deactivate B
    A -->> C: Asynchronous Call
    deactivate B
    activate C
    C -->> A: Async Response
    deactivate C
    A ->> B: Another Call
    activate B
    B -->> A: Another Response
    deactivate B
`;
                diagram.loadDiagramFromMermaid(mermaidData);
                expect(diagram.nodes.length).toBe(8);
                expect(diagram.connectors.length).toBe(12);
                done();
            });
        });
    });
});
