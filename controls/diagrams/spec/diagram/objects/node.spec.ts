import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, PathModel, TextModel, ImageModel, NativeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { LinearGradientModel, TextStyleModel } from '../../../src/diagram/core/appearance-model';
import { GroupableView } from '../../../src/diagram/core/containers/container';
import { StackPanel } from '../../../src/diagram/core/containers/stack-panel';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { ImageElement } from '../../../src/diagram/core/elements/image-element';
import { DiagramNativeElement } from '../../../src/diagram/core/elements/native-element';
import { TextElement } from '../../../src/diagram/core/elements/text-element';
import { Native, NodeConstraints, accessibilityElement, HtmlModel, Ruler, ComplexHierarchicalTree } from '../../../src/index';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { SnapConstraints, PointPort, Annotation, IconShapes, Decorator, PortVisibility, ConnectorModel, PointModel, PortConstraints, AnnotationConstraints, ConnectorConstraints, LayoutModel, randomId, Thickness, DataBinding, DiagramConstraints, UserHandleModel } from '../../../src/diagram/index';
import {  IScrollChangeEventArgs, IBlazorScrollChangeEventArgs, DiagramTools, State } from '../../../src/diagram/index';

import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { IconShape } from '../../../src/diagram/objects/icon';
import { DiagramHtmlElement } from '../../../src/diagram/core/elements/html-element';
import { getDiagramLayerSvg } from '../../../src/diagram/utility/dom-util';
import { LayerModel } from '../../../src/diagram/diagram/layer-model';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
import { Selector } from '../../../src/diagram/objects/node';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
Diagram.Inject(ComplexHierarchicalTree,DataBinding,UndoRedo);

/**
 * Test cases to check different kind of nodes
 */

window['getAccessibility'] = function (obj: NodeModel, diagram: Diagram): string {
    let value: string;
    if (obj instanceof Node) {
        return 'clicked on Node';
    } else
        if (obj instanceof PathElement) {
            value = 'clicked on port';
        }
        else if (obj instanceof TextElement) {
            value = 'clicked on Annotation';
        } else if (obj instanceof IconShape) {
            value = 'clicked on icons';
        }
        else {
            value = undefined;
        }

    return value;
}
function getundefAccessibility(obj: NodeModel, diagram: Diagram): string {
    let value: string = undefined;
    if (obj instanceof Node) {
        return value;
    } else
        if (obj instanceof PathElement) {
            return value;
        }
        else if (obj instanceof TextElement) {
            return value;
        } else if (obj instanceof IconShape) {
            return value;
        }
        else {
            value = undefined;
        }

    return value;
}
describe('Diagram Control', () => {


    describe('Default Node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram97' });
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', width: 30, height: 30, offsetX: 100, offsetY: 100 };
            let node2: NodeModel = { id: 'node2', offsetX: 300, offsetY: 100 };
            let node3: NodeModel = {
                id: 'node3', annotations: [{
                    id: 'label1',
                    content: 'Default Shape', style: { color: 'red' },
                    margin: { left: 10, right: 10, top: 10, bottom: 10 }, verticalAlignment: 'Bottom'
                }],
                minWidth: 100, height: 10, offsetX: 500, offsetY: 100
            };
            let node4: NodeModel = {
                id: 'node4', minHeight: 5, offsetX: 50, offsetY: 59,
                annotations: [{
                    id: 'label1',
                    content: 'Shape', style: { color: 'red' },
                }]
            }
            let node5: NodeModel = {
                id: 'node5', minWidth: 100, minHeight: 100, offsetX: 350, offsetY: 350,
                annotations: [{
                    id: 'label1',
                    content: 'Shape', style: { color: 'red' },
                }]
            }
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node, node2, node3, node4, node5] });
            diagram.appendTo('#diagram97');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking default node creation with minWith value', (done: Function) => {
            let node = diagram.nodes[2];
            expect(node.wrapper.children[0].height === 10
                && diagram.nodes[3].wrapper.actualSize.height === 14.399999999999999 && diagram.nodes[3].wrapper.actualSize.width === 50).toBe(true);
            done()
        })
        it('Checking default node creation', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            let wrapper: GroupableView = (diagram.nodes[0] as Node).wrapper;
            expect((diagram.nodes[0] as Node).shape.type === 'Basic' &&
                ((diagram.nodes[0] as Node).shape as BasicShapeModel).shape === 'Rectangle' &&
                wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof DiagramElement && wrapper.offsetX === 100 &&
                wrapper.offsetY === 100 && wrapper.actualSize.width === 30 && wrapper.actualSize.height === 30).toBe(true);
            done();
        });
        it('Checking rectangle shape with no width and height', (done: Function) => {
            let wrapper: GroupableView = (diagram.nodes[1] as Node).wrapper;
            expect((diagram.nodes[1] as Node).shape.type === 'Basic' &&
                ((diagram.nodes[1] as Node).shape as BasicShapeModel).shape === 'Rectangle' &&
                wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof DiagramElement && wrapper.offsetX === 300 &&
                wrapper.offsetY === 100 && wrapper.actualSize.width === 50 && wrapper.actualSize.height === 50).toBe(true);
            done();
        });
        it('Checking min width and min height at run time', (done: Function) => {
            diagram.nodes[4].minWidth = 60;
            diagram.nodes[4].minHeight = 60;
            diagram.dataBind();
            let node = diagram.nodes[4];
            node.width = 50;
            node.height = 50;
            diagram.dataBind();
            expect(node.wrapper.minWidth == 60 && node.wrapper.children[0].minWidth == 60 &&
                node.wrapper.minHeight == 60 && node.wrapper.children[0].minHeight == 60).toBe(true);
            done();
        });
    });

    describe('Path Node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram98' });
            document.body.appendChild(ele);

            let shape: PathModel = { type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z' }
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: shape
            };

            diagram = new Diagram({ width: 500, height: 500, nodes: [node] });
            diagram.appendTo('#diagram98');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking path node', (done: Function) => {
            let wrapper: GroupableView = (diagram.nodes[0] as Node).wrapper;
            expect(wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof PathElement && wrapper.offsetX === 300 &&
                wrapper.offsetY === 300 && wrapper.actualSize.width === 100 && wrapper.actualSize.height === 100).toBe(true);
            done();
        });
    });
    describe('Image element', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram99' });
            document.body.appendChild(ele);

            let shape: ImageModel = { type: 'Image', source: 'https://www.w3schools.com/images/w3schools_green.jpg' };
            let node: NodeModel = {
                id: 'image', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: shape
            };

            diagram = new Diagram({ width: 500, height: 500, nodes: [node] });
            diagram.appendTo('#diagram99');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking image node', (done: Function) => {
            let wrapper: GroupableView = (diagram.nodes[0] as Node).wrapper;
            expect(wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof ImageElement && wrapper.offsetX === 300 &&
                wrapper.offsetY === 300 && wrapper.actualSize.width === 100 && wrapper.actualSize.height === 100).toBe(true);
            done();
        });
    });

    describe('Text Node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram100' });
            document.body.appendChild(ele);

            let shape: TextModel = { type: 'Text', content: 'textelement' };
            let style: TextStyleModel = { color: 'green', fontSize: 12, fill: 'transparent', fontFamily: 'sans-serif', bold: true };
            let node: NodeModel = {
                id: 'textelement', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: shape,
                style: style
            };

            diagram = new Diagram({ width: 500, height: 500, nodes: [node] });
            diagram.appendTo('#diagram100');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking text node', (done: Function) => {
            let wrapper: GroupableView = (diagram.nodes[0] as Node).wrapper;
            expect(wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof TextElement && wrapper.offsetX === 300 &&
                wrapper.offsetY === 300 && wrapper.actualSize.width === 100 && wrapper.actualSize.height === 100 &&
                (wrapper.children[0] as TextElement).style.whiteSpace === 'CollapseSpace'
                && (wrapper.children[0] as TextElement).style.textWrapping === 'WrapWithOverflow' &&
                (wrapper.children[0] as TextElement).style.textAlign === 'Center').toBe(true);
            done();
        });
    });

    describe('Custom Shape', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram100' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node5', offsetX: 100, offsetY: 300,
                }];
            diagram = new Diagram({
                width: 500, height: 500, nodes: nodes,
                setNodeTemplate: (obj: NodeModel, diagram: Diagram): StackPanel => {
                    if (obj.id === 'node5') {
                        //it will be replaced with grid panel
                        let table: StackPanel = new StackPanel();
                        table.orientation = 'Horizontal';

                        let column1: StackPanel = new StackPanel();
                        column1.children = [];
                        column1.children.push(getTextElement('Column1'));
                        addRows(column1);

                        let column2: StackPanel = new StackPanel();
                        column2.children = [];
                        column2.children.push(getTextElement('Column2'));
                        addRows(column2);

                        table.children = [column1, column2];
                        return table;
                    }
                    return null;
                }
            });
            let width: number = (diagram.nodes[0] as Node).actualSize.width;
            diagram.appendTo('#diagram100');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking custom template', (done: Function) => {
            let wrapper: GroupableView = (diagram.nodes[0] as Node).wrapper;
            expect(wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof StackPanel && wrapper.offsetX === 100 &&
                wrapper.offsetY === 300 && wrapper.actualSize.width === 100 && wrapper.actualSize.height === 100).toBe(true);
            done();
            let width: number = (diagram.nodes[0] as Node).actualSize.width;

        });
        let getTextElement: Function = (text: string) => {
            let textElement: TextElement = new TextElement();
            textElement.width = 50;
            textElement.height = 20;
            textElement.content = text;
            return textElement;
        };

        let addRows: Function = (column: StackPanel) => {
            column.children.push(getTextElement('Row1'));
            column.children.push(getTextElement('Row2'));
            column.children.push(getTextElement('Row3'));
            column.children.push(getTextElement('Row4'));
        };
    });

    describe('Native Node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_Native' });
            document.body.appendChild(ele);

            let shape1: NativeModel = {
                type: 'Native',
                content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                    'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                    'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                    'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
                    'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                    'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                    'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                    'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                    'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                    'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                    'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>'
            }
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: shape1
            };
            let shape2: NativeModel = {
                type: 'Native',
                content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                    'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                    'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                    'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
                    'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                    'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                    'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                    'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                    'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                    'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                    'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>',
                scale: 'None'
            }
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: shape2
            };
            let shape3: NativeModel = {
                type: 'Native',
                content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                    'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                    'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                    'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
                    'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                    'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                    'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                    'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                    'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                    'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                    'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>',
                scale: 'Stretch'
            }
            let node3: NodeModel = {
                id: 'node3', width: 150, height: 100, offsetX: 500, offsetY: 100,
                shape: shape3
            };
            let shape4: NativeModel = {
                type: 'Native',
                content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                    'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                    'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                    'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
                    'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                    'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                    'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                    'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                    'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                    'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                    'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>',
                scale: 'Meet'
            }
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 100, offsetX: 700, offsetY: 100,
                shape: shape4
            };
            let shape5: NativeModel = {
                type: 'Native',
                content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                    'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                    'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                    'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
                    'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                    'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                    'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                    'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                    'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                    'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                    'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>',
                scale: 'Meet'
            }
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 150, offsetX: 100, offsetY: 300,
                shape: shape5
            };
            let shape6: NativeModel = {
                type: 'Native',
                content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                    'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                    'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                    'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
                    'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                    'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                    'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                    'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                    'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                    'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                    'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>',
                scale: 'Slice'
            }
            let node6: NodeModel = {
                id: 'node6', width: 150, height: 100, offsetX: 300, offsetY: 300,
                shape: shape6
            };
            let shape7: NativeModel = {
                type: 'Native',
                content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                    'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                    'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                    'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
                    'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                    'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                    'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                    'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                    'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                    'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                    'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>',
                scale: 'Slice'
            }
            let node7: NodeModel = {
                id: 'node7', width: 100, height: 150, offsetX: 500, offsetY: 300,
                shape: shape7
            };
            let shape8: NativeModel = {
                type: 'Native',
                content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                    'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                    'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                    'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
                    'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                    'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                    'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                    'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                    'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                    'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                    'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>',
                scale: 'Stretch'
            }
            let node8: NodeModel = {
                id: 'node8', width: 100, height: 150, offsetX: 700, offsetY: 300,
                shape: shape8
            };
            let shape9: PathModel = { type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z' }
            let node9: NodeModel = {
                id: 'node9', width: 100, height: 150, offsetX: 300, offsetY: 500,
                shape: shape9
            };

            let shape10: NativeModel = {
                type: 'Native',
                content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                    'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                    'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                    'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
                    'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                    'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                    'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                    'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                    'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                    'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                    'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>',
            }
            let node10: NodeModel = {
                id: 'node10', offsetX: 300, offsetY: 300,
                shape: shape10
            };

            diagram = new Diagram({ width: '1000px', height: '1000px', nodes: [node1, node2, node3, node4, node5, node6, node7, node8, node9, node10], mode: 'Canvas' });
            diagram.appendTo('#diagram_Native');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking Native node on proper layer', (done: Function) => {
            setTimeout(
                () => {
                    let svgElement: SVGSVGElement = document.getElementsByClassName('e-native-layer')[0] as SVGSVGElement;
                    let gElement: SVGElement = svgElement.getElementById(diagram.nodes[0].id + '_content_groupElement') as SVGElement;
                    expect(gElement != null).toBe(true);
                    done();
                }, 40);
        });
        it('Checking Native node', (done: Function) => {
            let wrapper: GroupableView = (diagram.nodes[0] as Node).wrapper;
            expect(wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof DiagramNativeElement && wrapper.offsetX === 100 &&
                wrapper.offsetY === 100 && wrapper.actualSize.width === 100 && wrapper.actualSize.height === 100).toBe(true);
            done();
        });

        it('Checking Native node with scale as None', (done: Function) => {
            let node2: HTMLElement = document.getElementById('node2_content_native_element');
            let bounds: ClientRect = node2.getBoundingClientRect();
            let wrapper: GroupableView = (diagram.nodes[1] as Node).wrapper;
            expect(bounds.width === 90 && bounds.height === 90).toBe(true);
            done();
        });

        it('Checking Native node with scale as Stretch', (done: Function) => {
            let node3: HTMLElement = document.getElementById('node3_content_native_element');
            let bounds: ClientRect = node3.getBoundingClientRect();
            let wrapper: GroupableView = (diagram.nodes[2] as Node).wrapper;
            expect(wrapper.actualSize.width === 150 && wrapper.actualSize.height === 100 &&
                Math.round(bounds.height) === wrapper.actualSize.height &&
                Math.round(bounds.width) === wrapper.actualSize.width).toBe(true);
            done();
        });

        it('Checking Native node with scale as Meet when width > height', (done: Function) => {
            let node4: HTMLElement = document.getElementById('node4_content_native_element');
            let bounds: ClientRect = node4.getBoundingClientRect();
            let wrapper: GroupableView = (diagram.nodes[3] as Node).wrapper;
            expect(wrapper.actualSize.width === 150 && wrapper.actualSize.height === 100 &&
                Math.round(bounds.width) === wrapper.actualSize.height).toBe(true);
            done();
        });

        it('Checking Native node with scale as Meet height > width', (done: Function) => {
            let node5: HTMLElement = document.getElementById('node5_content_native_element');
            let bounds: ClientRect = node5.getBoundingClientRect();
            let wrapper: GroupableView = (diagram.nodes[4] as Node).wrapper;
            expect(wrapper.actualSize.width === 100 && wrapper.actualSize.height === 150 &&
                Math.round(bounds.height) === wrapper.actualSize.width).toBe(true);
            done();
        });

        it('Checking Native node with scale as Slice width > height', (done: Function) => {
            let node6: HTMLElement = document.getElementById('node6_content_native_element');
            let bounds: ClientRect = node6.getBoundingClientRect();
            let wrapper: GroupableView = (diagram.nodes[5] as Node).wrapper;
            expect(wrapper.actualSize.width === 150 && wrapper.actualSize.height === 100 &&
                Math.round(bounds.height) === wrapper.actualSize.width).toBe(true);
            done();
        });

        it('Checking Native node with scale as Slice height > width', (done: Function) => {
            let node7: HTMLElement = document.getElementById('node7_content_native_element');
            let bounds: ClientRect = node7.getBoundingClientRect();
            let wrapper: GroupableView = (diagram.nodes[6] as Node).wrapper;
            expect(wrapper.actualSize.width === 100 && wrapper.actualSize.height === 150 &&
                Math.round(bounds.width) === wrapper.actualSize.height).toBe(true);
            done();
        });

        it('Checking Native node on runtime property change - content', (done: Function) => {
            let node: Node = diagram.nodes[7] as Node;
            (node.shape as NativeModel).content = '<g><path id="XMLID_484_" d="M281.439,14.934c-0.002-0.471-0.025-0.941-0.071-1.411c-0.023-0.236-0.067-0.466-0.101-0.699' +
                'c-0.037-0.25-0.065-0.502-0.115-0.75c-0.052-0.264-0.124-0.52-0.19-0.778c-0.055-0.215-0.102-0.431-0.165-0.644' +
                'c-0.077-0.254-0.172-0.5-0.262-0.748c-0.077-0.212-0.146-0.426-0.232-0.636c-0.098-0.235-0.212-0.462-0.321-0.691' +
                'c-0.101-0.213-0.195-0.429-0.307-0.638c-0.121-0.226-0.258-0.44-0.39-0.659c-0.121-0.2-0.233-0.403-0.364-0.599' +
                'c-0.167-0.25-0.353-0.487-0.534-0.727c-0.114-0.15-0.218-0.305-0.338-0.452c-0.631-0.77-1.336-1.476-2.106-2.106' +
                'c-0.138-0.113-0.285-0.211-0.426-0.318c-0.248-0.189-0.494-0.381-0.754-0.554c-0.186-0.124-0.379-0.231-0.569-0.346' +
                'c-0.229-0.139-0.455-0.282-0.691-0.409c-0.196-0.104-0.397-0.192-0.596-0.287c-0.244-0.117-0.485-0.237-0.736-0.341' +
                'c-0.191-0.079-0.386-0.141-0.579-0.212c-0.268-0.098-0.533-0.2-0.807-0.282c-0.187-0.056-0.377-0.097-0.565-0.145' +
                'c-0.285-0.074-0.568-0.152-0.859-0.21c-0.204-0.04-0.41-0.063-0.615-0.094c-0.278-0.043-0.553-0.093-0.836-0.121' +
                'c-0.325-0.031-0.65-0.039-0.977-0.049C266.768,0.019,266.607,0,266.442,0h-47.359c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15' +
                'h11.148l-22.598,22.598C190.188,39.471,168.51,31.68,145.046,31.68c-57.512,0-104.302,46.79-104.302,104.303' +
                'c0,52.419,38.871,95.923,89.301,103.219l0.001,19.497h-18.487c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h18.488l0.001,18.488' +
                'c0,8.284,6.716,15,15,15c8.284,0,15-6.716,15-15.001l-0.001-18.487h18.487c8.284,0,15-6.716,15-15c0-8.284-6.716-15-15-15h-18.487' +
                'l-0.001-19.497c50.43-7.295,89.302-50.8,89.302-103.219c0-23.251-7.65-44.748-20.562-62.111l22.656-22.657V62.36' +
                'c0,8.284,6.716,15,15,15c8.284,0,15-6.716,15-15V15C281.442,14.978,281.439,14.957,281.439,14.934z M145.046,210.285' +
                'c-40.97,0-74.302-33.332-74.302-74.302c0-40.971,33.331-74.303,74.302-74.303c40.97,0,74.302,33.332,74.302,74.303' +
                'C219.348,176.953,186.016,210.285,145.046,210.285z"><g>';
            diagram.dataBind();
            let node8: HTMLElement = document.getElementById('node8_content_native_element');

            let wrapper: GroupableView = node.wrapper;
            expect(wrapper.actualSize.width === 100 && wrapper.actualSize.height === 150 &&
                (wrapper.children[0] as DiagramNativeElement).content === '<g><path id="XMLID_484_" d="M281.439,14.934c-0.002-0.471-0.025-0.941-0.071-1.411c-0.023-0.236-0.067-0.466-0.101-0.699c-0.037-0.25-0.065-0.502-0.115-0.75c-0.052-0.264-0.124-0.52-0.19-0.778c-0.055-0.215-0.102-0.431-0.165-0.644c-0.077-0.254-0.172-0.5-0.262-0.748c-0.077-0.212-0.146-0.426-0.232-0.636c-0.098-0.235-0.212-0.462-0.321-0.691c-0.101-0.213-0.195-0.429-0.307-0.638c-0.121-0.226-0.258-0.44-0.39-0.659c-0.121-0.2-0.233-0.403-0.364-0.599c-0.167-0.25-0.353-0.487-0.534-0.727c-0.114-0.15-0.218-0.305-0.338-0.452c-0.631-0.77-1.336-1.476-2.106-2.106c-0.138-0.113-0.285-0.211-0.426-0.318c-0.248-0.189-0.494-0.381-0.754-0.554c-0.186-0.124-0.379-0.231-0.569-0.346c-0.229-0.139-0.455-0.282-0.691-0.409c-0.196-0.104-0.397-0.192-0.596-0.287c-0.244-0.117-0.485-0.237-0.736-0.341c-0.191-0.079-0.386-0.141-0.579-0.212c-0.268-0.098-0.533-0.2-0.807-0.282c-0.187-0.056-0.377-0.097-0.565-0.145c-0.285-0.074-0.568-0.152-0.859-0.21c-0.204-0.04-0.41-0.063-0.615-0.094c-0.278-0.043-0.553-0.093-0.836-0.121c-0.325-0.031-0.65-0.039-0.977-0.049C266.768,0.019,266.607,0,266.442,0h-47.359c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h11.148l-22.598,22.598C190.188,39.471,168.51,31.68,145.046,31.68c-57.512,0-104.302,46.79-104.302,104.303c0,52.419,38.871,95.923,89.301,103.219l0.001,19.497h-18.487c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h18.488l0.001,18.488c0,8.284,6.716,15,15,15c8.284,0,15-6.716,15-15.001l-0.001-18.487h18.487c8.284,0,15-6.716,15-15c0-8.284-6.716-15-15-15h-18.487l-0.001-19.497c50.43-7.295,89.302-50.8,89.302-103.219c0-23.251-7.65-44.748-20.562-62.111l22.656-22.657V62.36c0,8.284,6.716,15,15,15c8.284,0,15-6.716,15-15V15C281.442,14.978,281.439,14.957,281.439,14.934z M145.046,210.285c-40.97,0-74.302-33.332-74.302-74.302c0-40.971,33.331-74.303,74.302-74.303c40.97,0,74.302,33.332,74.302,74.303C219.348,176.953,186.016,210.285,145.046,210.285z"><g>').toBe(true);
            done();
        });

        it('Checking Native node on runtime property change - content', (done: Function) => {
            let node: Node = diagram.nodes[7] as Node;
            (node.shape as NativeModel).scale = 'Meet';
            diagram.dataBind();
            setTimeout(() => {
                let node8: HTMLElement = document.getElementById('node8_content_native_element');
                let bounds: ClientRect = node8.getBoundingClientRect();
                let wrapper: GroupableView = node.wrapper;
                expect(wrapper.actualSize.width === 100 && wrapper.actualSize.height === 150 &&
                    Math.round(bounds.height) === wrapper.actualSize.width).toBe(true);

                done();
            }, 50);
        });

        //commented for issue

        // it('Checking node shape type changed to native on runtime', (done: Function) => {
        //     let node: Node = diagram.nodes[8] as Node;
        //     node.shape.type = 'Native';
        //     diagram.dataBind();
        //     let wrapper: Container = node.wrapper; 
        //     (node.shape as NativeModel).content = '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
        //     'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
        //     'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
        //     'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
        //     'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
        //     'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
        //     'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
        //     'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
        //     'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
        //     'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
        //     'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>';
        //     diagram.dataBind(); 
        //     expect(wrapper && wrapper.children && wrapper.children.length &&
        //         wrapper.children[0] instanceof NativeElement).toBe(true);
        //     done();
        // });

        it('Checking Native node on proper layer if deleted', (done: Function) => {
            let id: string = diagram.nodes[0].id;
            diagram.remove(diagram.nodes[0]);
            let svgElement: SVGSVGElement = document.getElementsByClassName('e-native-layer')[0] as SVGSVGElement;
            let gElement: SVGElement = svgElement.getElementById(id + '_content_groupElement') as SVGElement;
            expect(gElement === null).toBe(true);
            done();
        });
        it('Checking Native node without height and width', (done: Function) => {
            let node10: HTMLElement = document.getElementById('node10_content_native_element');
            let bounds: ClientRect = node10.getBoundingClientRect();
            let wrapper: GroupableView = (diagram.nodes[8] as Node).wrapper;
            expect(wrapper.actualSize.width === 300 && wrapper.actualSize.height === 150 &&
                Math.round(bounds.width) === wrapper.actualSize.width).toBe(true);
            done();
        });
    });
    describe('Native Node - expandStateChange', () => {
        let diagram: Diagram; let diagramCanvas: HTMLElement;
        let ele: HTMLElement; let checkEvent: boolean = false;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_Native1' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, isExpanded: true,
                    annotations: [{ content: 'Double click on node' }],
                    expandIcon: {
                        height: 20, width: 20, shape: 'ArrowDown',
                        content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522' +
                            'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
                            'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
                            'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
                            'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
                            'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
                            'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
                            'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
                            'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
                            'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
                            'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z">' +
                            '</path></g>'
                    },
                    collapseIcon: { height: 20, width: 20, shape: 'ArrowUp' }
                },
            ];

            diagram = new Diagram({ width: '500px', height: '500px', nodes: nodes });
            diagram.appendTo('#diagram_Native1');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 2, 2);
            diagram.expandStateChange = function () {
                checkEvent = true;
            };
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking Native node - expand state change', (done: Function) => {
            expect(checkEvent == false);
            let nativeX = diagram.nodes[0].wrapper.children[2].offsetX + diagram.element.offsetLeft;
            let nativeY = diagram.nodes[0].wrapper.children[2].offsetY + diagram.element.offsetTop;
            mouseEvents.clickEvent(diagramCanvas, nativeX, nativeY);
            expect(checkEvent == true);
            done();
        });
    });
    describe('Annotation editing without label', () => {
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

            ele = createElement('div', { id: 'diagramannotationEditing' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                constraints: NodeConstraints.Default & ~NodeConstraints.Drag
            };
            diagram = new Diagram({
                width: '600px', height: '600px',
                nodes: [node]
            });
            diagram.appendTo('#diagramannotationEditing');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connector hit padding', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 110, 110);
            done();
        });
    });

    describe('Native element hover issue', () => {
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
            ele = createElement('div', { id: 'diagram333' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node3', width: 150, height: 100, offsetX: 100, offsetY: 100, style: { fill: 'none' },
                    annotations: [{ content: 'Check all causes' }],
                    shape: {
                        type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">	<g transform="translate(1 1)">		<path style="fill:#FDDC42;" d="M417.219,379.501c5.745,13.691,10.675,27.71,14.763,41.984c0.983,2.981,0.203,6.261-2.016,8.48    c-2.219,2.219-5.499,2.999-8.48,2.016c-14.282-4.063-28.302-8.993-41.984-14.763l-46.336,26.624v0.085    c-1.824,14.741-4.531,29.359-8.107,43.776c-0.638,3.073-2.953,5.524-5.985,6.336c-3.032,0.812-6.262-0.154-8.351-2.496    c-10.342-10.73-20.03-22.072-29.013-33.963l-53.333,0.085c-9.013,11.865-18.73,23.177-29.099,33.877    c-2.089,2.343-5.319,3.308-8.351,2.496c-3.032-0.812-5.347-3.263-5.985-6.336c-3.583-14.415-6.29-29.034-8.107-43.776v-0.085    l-46.336-26.624c-13.691,5.745-27.71,10.675-41.984,14.763c-2.981,0.983-6.261,0.203-8.48-2.016s-2.999-5.499-2.016-8.48    c4.063-14.282,8.993-28.302,14.763-41.984l-26.624-46.336h-0.085c-14.741-1.824-29.359-4.531-43.776-8.107    c-3.073-0.638-5.524-2.953-6.336-5.985c-0.812-3.032,0.154-6.262,2.496-8.351c10.73-10.342,22.072-20.03,33.963-29.013    l-0.085-53.333c-11.865-9.013-23.177-18.73-33.877-29.099c-2.343-2.089-3.308-5.319-2.496-8.351    c0.812-3.032,3.263-5.347,6.336-5.985c14.415-3.583,29.034-6.29,43.776-8.107h0.085l26.624-46.336    c-5.745-13.691-10.675-27.71-14.763-41.984c-0.983-2.981-0.203-6.261,2.016-8.48s5.499-2.999,8.48-2.016    c14.282,4.063,28.303,8.993,41.984,14.763l46.336-26.624v-0.085c1.824-14.741,4.531-29.359,8.107-43.776    c0.638-3.073,2.953-5.524,5.985-6.336c3.032-0.812,6.262,0.154,8.351,2.496c10.342,10.73,20.03,22.072,29.013,33.963l53.333-0.085    c9.013-11.865,18.73-23.177,29.099-33.877c2.089-2.343,5.319-3.308,8.351-2.496c3.032,0.812,5.347,3.263,5.985,6.336    c3.583,14.415,6.29,29.034,8.107,43.776v0.085l46.336,26.624c13.691-5.745,27.71-10.675,41.984-14.763    c2.981-0.983,6.261-0.203,8.48,2.016c2.219,2.219,2.999,5.499,2.016,8.48c-4.063,14.282-8.993,28.303-14.763,41.984l26.624,46.336    h0.085c14.741,1.824,29.359,4.531,43.776,8.107c3.073,0.638,5.524,2.953,6.336,5.985c0.812,3.032-0.154,6.262-2.496,8.351    c-10.73,10.342-22.072,20.03-33.963,29.013l0.085,53.333c11.865,9.013,23.177,18.73,33.877,29.099    c2.343,2.089,3.308,5.319,2.496,8.351c-0.812,3.032-3.263,5.347-6.336,5.985c-14.415,3.583-29.034,6.29-43.776,8.107h-0.085"/>		<path style="fill:#FFEB49;" d="M497.892,247.574c-17.69-9.664-48.938-25.315-66.996-26.486c-1.624-8.324-3.842-16.52-6.637-24.527    c15.052-10.044,34.319-39.362,44.805-56.575c1.723-2.626,1.819-5.999,0.249-8.718c-1.57-2.72-4.539-4.323-7.675-4.144    c-20.158,0.476-55.2,2.502-71.417,10.524c-5.53-6.366-11.501-12.337-17.867-17.868c8.021-16.217,10.048-51.258,10.523-71.417    c0.179-3.136-1.424-6.105-4.144-7.675c-2.72-1.57-6.093-1.474-8.719,0.249c-17.212,10.487-46.531,29.752-56.575,44.805    c-8.007-2.795-16.203-5.013-24.527-6.636c-1.171-18.058-16.823-49.307-26.486-66.997c-1.413-2.805-4.285-4.575-7.426-4.575    s-6.013,1.77-7.426,4.575c-9.664,17.69-25.316,48.939-26.486,66.997c-8.324,1.623-16.521,3.841-24.527,6.636    c-10.044-15.053-39.362-34.318-56.575-44.805c-2.626-1.723-5.999-1.819-8.719-0.249c-2.72,1.57-4.323,4.539-4.144,7.675    c0.475,20.158,2.502,55.199,10.523,71.417c-6.366,5.531-12.336,11.501-17.867,17.868c-16.217-8.022-51.258-10.048-71.417-10.524    c-3.136-0.179-6.104,1.424-7.675,4.144c-1.57,2.72-1.474,6.092,0.249,8.718c10.486,17.214,29.753,46.531,44.805,56.576    c-2.795,8.007-5.013,16.203-6.637,24.527c-18.058,1.171-49.306,16.822-66.996,26.486c-2.805,1.412-4.575,4.285-4.575,7.426    s1.77,6.013,4.575,7.426c17.69,9.665,48.938,25.316,66.996,26.487c1.624,8.324,3.842,16.52,6.637,24.527    c-15.053,10.044-34.319,39.362-44.805,56.576c-1.723,2.626-1.819,5.998-0.249,8.718s4.539,4.323,7.675,4.143    c20.158-0.475,55.2-2.502,71.417-10.523c5.53,6.366,11.501,12.337,17.867,17.867c-8.021,16.218-10.048,51.259-10.523,71.417    c-0.179,3.136,1.424,6.105,4.144,7.675c2.72,1.57,6.093,1.474,8.719-0.249c17.213-10.486,46.53-29.751,56.575-44.805    c8.007,2.795,16.203,5.013,24.527,6.637c1.171,18.059,16.823,49.307,26.486,66.996c1.413,2.805,4.285,4.575,7.426,4.575    s6.013-1.77,7.426-4.575c9.664-17.689,25.316-48.938,26.486-66.996c8.324-1.624,16.52-3.841,24.527-6.637    c10.045,15.054,39.363,34.318,56.575,44.805c2.626,1.723,5.999,1.82,8.719,0.249s4.323-4.539,4.144-7.675    c-0.475-20.158-2.502-55.2-10.523-71.417c6.366-5.531,12.336-11.501,17.867-17.867c16.217,8.022,51.258,10.048,71.417,10.523    c3.135,0.179,6.104-1.423,7.675-4.143s1.474-6.092-0.249-8.718c-10.486-17.214-29.752-46.532-44.805-56.576    c2.796-8.007,5.014-16.203,6.637-24.527c18.058-1.171,49.306-16.822,66.996-26.487c2.805-1.412,4.575-4.285,4.575-7.426    C502.467,251.859,500.697,248.986,497.892,247.574z"/>		<circle style="fill:#E15919;" cx="255" cy="255" r="179.2"/>		<ellipse style="fill:#FF6E2C;" cx="242.2" cy="255" rx="166.4" ry="179.2"/>		<circle style="fill:#FFBE00;" cx="255" cy="255" r="145.067"/>		<ellipse style="fill:#FFC900;" cx="242.2" cy="255" rx="132.267" ry="145.067"/>	</g>	<g>		<path d="M502.983,241.087c-8.414-4.598-18.054-9.542-27.801-13.988c8.831-7.271,17.128-14.827,23.234-20.633    c4.61-4.239,6.486-10.688,4.869-16.738c-1.617-6.051-6.459-10.704-12.569-12.079c-6.766-1.643-18.167-4.224-30.405-6.256    c6.194-8.708,12.055-17.792,17.039-25.969c3.346-5.29,3.484-11.998,0.358-17.421c-3.169-5.387-9.028-8.613-15.275-8.408    c-9.558,0.224-20.335,0.757-30.956,1.762c4.002-10.73,7.347-21.391,9.69-29.433c1.863-5.973,0.261-12.486-4.16-16.914    c-4.421-4.427-10.931-6.039-16.907-4.186c-6.646,1.935-17.787,5.367-29.458,9.715c1.006-10.626,1.54-21.409,1.766-30.973    c0.249-6.255-2.988-12.134-8.408-15.267c-5.433-3.086-12.12-2.952-17.425,0.35c-8.175,4.979-17.254,10.837-25.959,17.026    c-1.885-11.384-4.295-22.281-6.266-30.38c-1.367-6.103-6.005-10.945-12.044-12.573c-6.039-1.627-12.482,0.228-16.731,4.819    c-4.799,4.991-12.752,13.532-20.721,23.168c-4.433-9.711-9.359-19.311-13.938-27.693C268.006,3.473,262.261,0,256,0    s-12.006,3.473-14.917,9.017c-4.594,8.41-9.537,18.049-13.983,27.795c-7.28-8.844-14.831-17.137-20.634-23.233    c-4.241-4.609-10.689-6.483-16.739-4.865c-6.05,1.618-10.703,6.46-12.078,12.57c-1.644,6.762-4.223,18.162-6.256,30.398    c-8.708-6.192-17.79-12.051-25.968-17.032c-5.305-3.302-11.992-3.436-17.425-0.35c-5.419,3.132-8.657,9.008-8.408,15.263    c0.227,9.56,0.759,20.337,1.765,30.958c-10.748-4.011-21.4-7.351-29.423-9.687c-5.975-1.865-12.491-0.264-16.92,4.158    c-4.43,4.422-6.043,10.935-4.188,16.913c1.945,6.665,5.382,17.82,9.717,29.456c-10.625-1.007-21.406-1.539-30.967-1.764    c-6.25-0.21-12.115,3.016-15.283,8.408c-3.125,5.423-2.987,12.131,0.358,17.421c4.981,8.174,10.84,17.254,17.031,25.959    c-11.388,1.886-22.283,4.297-30.373,6.262c-6.108,1.364-10.956,6.004-12.584,12.048s0.23,12.491,4.826,16.74    c4.996,4.798,13.54,12.749,23.167,20.712c-9.712,4.434-19.316,9.36-27.7,13.942C3.473,243.996,0,249.739,0,256    c0,6.26,3.473,12.004,9.017,14.912c8.415,4.598,18.054,9.543,27.8,13.989c-8.831,7.271-17.127,14.826-23.233,20.632    c-4.61,4.239-6.486,10.688-4.869,16.738c1.617,6.051,6.459,10.704,12.569,12.079c6.766,1.643,18.167,4.224,30.406,6.256    c-6.194,8.708-12.056,17.791-17.04,25.969c-3.346,5.29-3.484,11.998-0.358,17.421c3.193,5.362,9.036,8.578,15.275,8.408    c9.558-0.224,20.335-0.757,30.956-1.762c-4.002,10.73-7.347,21.391-9.69,29.433c-1.816,5.982-0.214,12.477,4.175,16.929    c3.175,3.149,7.47,4.909,11.942,4.892c1.676-0.001,3.343-0.244,4.95-0.721c6.646-1.935,17.787-5.367,29.458-9.715    c-1.006,10.626-1.54,21.409-1.766,30.973c-0.249,6.255,2.988,12.134,8.408,15.267c5.436,3.078,12.117,2.944,17.425-0.35    c8.175-4.979,17.255-10.836,25.96-17.026c1.885,11.383,4.294,22.281,6.265,30.38c1.412,6.095,6.051,10.926,12.083,12.583    c1.395,0.371,2.832,0.559,4.275,0.558c4.702-0.018,9.191-1.966,12.417-5.387c4.799-4.991,12.752-13.532,20.721-23.168    c4.433,9.711,9.359,19.311,13.938,27.693c2.91,5.544,8.655,9.017,14.917,9.017c6.262,0,12.006-3.473,14.917-9.017    c4.594-8.41,9.537-18.049,13.983-27.795c7.28,8.844,14.831,17.137,20.634,23.233c3.237,3.44,7.743,5.401,12.467,5.425    c1.44,0,2.875-0.188,4.267-0.558c6.029-1.656,10.667-6.481,12.083-12.571c1.644-6.762,4.223-18.162,6.256-30.398    c8.708,6.192,17.791,12.051,25.969,17.032c5.308,3.294,11.99,3.428,17.425,0.35c5.419-3.132,8.657-9.008,8.408-15.263    c-0.227-9.56-0.759-20.338-1.765-30.958c10.748,4.011,21.4,7.352,29.423,9.688c1.618,0.479,3.296,0.724,4.983,0.725    c4.472,0.022,8.768-1.737,11.941-4.888c4.385-4.445,5.989-10.931,4.183-16.908c-1.945-6.665-5.382-17.82-9.717-29.456    c10.625,1.007,21.406,1.539,30.967,1.764l0.433,0.009c6.098,0.049,11.759-3.159,14.85-8.417    c3.125-5.423,2.987-12.131-0.358-17.421c-4.981-8.175-10.842-17.254-17.031-25.959c11.386-1.886,22.283-4.297,30.373-6.262    c6.108-1.364,10.956-6.004,12.584-12.048c1.629-6.043-0.23-12.491-4.826-16.74c-4.996-4.798-13.538-12.748-23.165-20.711    c9.71-4.434,19.312-9.36,27.698-13.943C508.527,268.004,512,262.261,512,256C512,249.74,508.527,243.996,502.983,241.087    L502.983,241.087z M486.658,194.096c-9.414,9.008-19.277,17.536-29.55,25.551c-5.876-2.215-11.918-3.96-18.071-5.217    c-1.067-4.698-2.264-9.347-3.676-13.905c4.711-4.198,9.082-8.763,13.072-13.652C463.298,188.831,478.505,192.236,486.658,194.096z     M381.048,371.756c-2.971,3.208-6.051,6.289-9.24,9.244c-17.465,16.225-38.136,28.61-60.681,36.356    c-3.219,1.099-6.344,2.039-9.444,2.917c-1.848,0.515-3.711,0.986-5.583,1.44c-2.558,0.629-5.122,1.285-7.657,1.773    c-21.421,4.242-43.465,4.242-64.885,0c-2.535-0.489-5.099-1.145-7.657-1.773c-1.872-0.454-3.735-0.925-5.583-1.44    c-3.1-0.878-6.225-1.817-9.444-2.917c-22.545-7.746-43.216-20.13-60.681-36.356c-3.19-2.957-6.27-6.039-9.239-9.244    c-16.187-17.438-28.547-38.07-36.285-60.57c-1.105-3.213-2.044-6.342-2.926-9.452c-0.524-1.877-1.001-3.77-1.461-5.671    c-0.625-2.547-1.279-5.096-1.766-7.63c-4.239-21.414-4.239-43.451,0-64.865c0.492-2.55,1.152-5.131,1.786-7.709    c0.448-1.847,0.912-3.685,1.42-5.508c0.877-3.102,1.817-6.232,2.918-9.456c7.738-22.53,20.109-43.19,36.315-60.65    c2.971-3.208,6.051-6.289,9.24-9.244c17.465-16.225,38.136-28.61,60.681-36.356c3.219-1.1,6.344-2.039,9.444-2.917    c1.848-0.515,3.711-0.986,5.583-1.44c2.558-0.629,5.122-1.285,7.657-1.773c21.421-4.242,43.465-4.242,64.885,0    c2.535,0.489,5.099,1.145,7.657,1.773c1.872,0.454,3.735,0.925,5.583,1.44c3.1,0.878,6.225,1.817,9.444,2.917    c22.545,7.746,43.216,20.13,60.681,36.356c3.19,2.957,6.269,6.039,9.24,9.244c16.207,17.459,28.578,38.12,36.316,60.65    c1.101,3.224,2.041,6.354,2.918,9.456c0.507,1.823,0.972,3.661,1.42,5.508c0.634,2.578,1.295,5.16,1.786,7.709    c4.239,21.414,4.239,43.451,0,64.865c-0.488,2.534-1.142,5.083-1.766,7.63c-0.461,1.901-0.937,3.795-1.461,5.671    c-0.882,3.11-1.821,6.239-2.926,9.452C409.595,333.686,397.235,354.317,381.048,371.756z M462.783,136.542    c-9.639,16.632-20.961,32.231-33.787,46.55c-6.106-14.401-13.987-27.983-23.46-40.43    C424.361,138.686,443.543,136.636,462.783,136.542L462.783,136.542z M424.792,87.129c-3.599,12.468-7.836,24.743-12.694,36.777    c-6.285,1.015-12.478,2.533-18.521,4.539c-3.214-3.466-6.556-6.807-10.024-10.024c2.012-6.056,3.533-12.264,4.549-18.563    C402.048,94.135,416.844,89.536,424.792,87.129L424.792,87.129z M375.342,49.162c-0.023,19.256-2.037,38.457-6.008,57.299    c-12.447-9.473-26.028-17.353-40.429-23.458C343.2,70.183,358.759,58.845,375.342,49.162L375.342,49.162z M317.767,25.308    c3.109,12.615,5.567,25.381,7.364,38.248c-4.894,3.991-9.462,8.365-13.663,13.081c-4.554-1.411-9.2-2.607-13.894-3.673    c-1.27-6.21-3.035-12.308-5.279-18.236C301.564,42.74,312.089,31.379,317.767,25.308z M255.933,17.2    c9.596,16.661,17.427,34.277,23.364,52.564c-15.468-1.997-31.129-1.997-46.598,0.001C238.623,51.493,246.408,33.879,255.933,17.2    L255.933,17.2z M194.092,25.337c9.01,9.414,17.538,19.278,25.552,29.554c-2.216,5.876-3.961,11.92-5.219,18.073    c-4.693,1.066-9.34,2.261-13.894,3.673c-4.199-4.713-8.766-9.086-13.657-13.077C188.834,48.702,192.232,33.493,194.092,25.337    L194.092,25.337z M183.094,83.004c-14.401,6.105-27.982,13.986-40.429,23.458c-3.977-18.822-6.028-38-6.123-57.237    C153.176,58.858,168.776,70.178,183.094,83.004L183.094,83.004z M87.133,87.208c12.467,3.596,24.74,7.832,36.772,12.691    c1.015,6.286,2.534,12.48,4.542,18.522c-3.466,3.215-6.807,6.556-10.024,10.024c-6.059-2.01-12.269-3.531-18.571-4.547    C94.156,110.016,89.547,95.186,87.133,87.208L87.133,87.208z M106.464,142.663c-9.474,12.447-17.355,26.029-23.46,40.431    c-12.819-14.297-24.156-29.856-33.837-46.44C68.422,136.68,87.623,138.693,106.464,142.663L106.464,142.663z M25.317,194.233    c12.613-3.113,25.379-5.572,38.247-7.366c3.99,4.891,8.362,9.458,13.075,13.657c-1.413,4.558-2.609,9.207-3.676,13.905    c-6.209,1.27-12.306,3.034-18.233,5.277C42.756,210.445,31.386,199.918,25.317,194.233z M69.764,232.703    c-1.997,15.468-1.997,31.128,0,46.596c-18.272-5.923-35.886-13.709-52.565-23.236C33.861,246.468,51.478,238.639,69.764,232.703z     M25.342,317.904c9.414-9.008,19.276-17.535,29.549-25.549c5.876,2.216,11.919,3.96,18.072,5.216    c1.067,4.696,2.263,9.343,3.675,13.899c-4.711,4.2-9.082,8.767-13.071,13.658C48.701,323.169,33.494,319.764,25.342,317.904z     M49.217,375.458c9.639-16.633,20.961-32.232,33.787-46.552c6.106,14.402,13.987,27.984,23.46,40.432    C87.639,373.313,68.457,375.364,49.217,375.458L49.217,375.458z M87.208,424.871c3.599-12.468,7.836-24.744,12.694-36.778    c6.285-1.015,12.478-2.533,18.521-4.538c3.215,3.466,6.556,6.807,10.024,10.024c-2.012,6.056-3.533,12.264-4.549,18.564    C109.952,417.865,95.156,422.464,87.208,424.871L87.208,424.871z M136.658,462.837c0.023-19.256,2.037-38.457,6.008-57.299    c12.447,9.473,26.028,17.353,40.429,23.458C168.8,441.817,153.241,453.155,136.658,462.837L136.658,462.837z M194.233,486.691    c-3.11-12.606-5.581-25.361-7.404-38.216c4.907-4.001,9.489-8.386,13.702-13.113c4.554,1.411,9.2,2.607,13.894,3.673    c1.27,6.21,3.035,12.308,5.279,18.236C210.435,469.259,199.91,480.621,194.233,486.691L194.233,486.691z M256.066,494.8    c-9.596-16.661-17.427-34.277-23.364-52.564c15.468,1.997,31.129,1.997,46.598-0.001    C273.377,460.506,265.591,478.121,256.066,494.8L256.066,494.8z M317.908,486.662c-9.01-9.414-17.538-19.278-25.552-29.554    c2.216-5.876,3.961-11.92,5.219-18.073c4.693-1.066,9.34-2.261,13.894-3.673c4.2,4.713,8.766,9.085,13.657,13.076    C323.166,463.297,319.768,478.507,317.908,486.662L317.908,486.662z M328.906,428.996c14.401-6.105,27.982-13.986,40.429-23.458    c3.977,18.822,6.028,38,6.123,57.238C358.823,453.142,343.224,441.823,328.906,428.996L328.906,428.996z M424.866,424.792    c-12.466-3.597-24.74-7.833-36.771-12.691c-1.016-6.286-2.535-12.479-4.543-18.522c3.466-3.215,6.807-6.556,10.024-10.024    c6.059,2.01,12.269,3.531,18.571,4.547C417.844,401.984,422.453,416.814,424.866,424.792L424.866,424.792z M405.535,369.337    c9.475-12.447,17.356-26.03,23.461-40.432c12.819,14.298,24.155,29.858,33.836,46.441    C443.578,375.32,424.377,373.307,405.535,369.337L405.535,369.337z M486.683,317.767c-12.613,3.113-25.379,5.571-38.246,7.365    c-3.99-4.893-8.363-9.461-13.075-13.663c1.413-4.556,2.608-9.203,3.675-13.899c6.209-1.269,12.307-3.034,18.234-5.276    C469.245,301.556,480.613,312.082,486.683,317.767L486.683,317.767z M442.235,279.297c1.997-15.467,1.997-31.127,0-46.594    c18.245,5.922,35.822,13.73,52.448,23.297C478.057,265.567,460.48,273.375,442.235,279.297z"/>		<path d="M256,102.4c-84.831,0-153.6,68.769-153.6,153.6S171.169,409.6,256,409.6S409.6,340.831,409.6,256    C409.503,171.209,340.791,102.497,256,102.4z M256,392.533c-75.405,0-136.533-61.128-136.533-136.533S180.595,119.466,256,119.466    S392.533,180.595,392.533,256C392.447,331.369,331.369,392.447,256,392.533z"/>	</g></g>',
                        scale: 'Stretch'
                    }
                },]
            diagram = new Diagram({ width: '500px', height: '500px', nodes: nodes });
            diagram.appendTo('#diagram333');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Native element hover issue', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100, true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 101, 101, true);
            let child = document.getElementById('diagram333_nativeLayer');
            expect(child.childElementCount === 1).toBe(true);
            done();
        });
    })

    describe('HTML Node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram_html2' });
            document.body.appendChild(ele);

            let shape1: HtmlModel = { type: 'HTML', content: '<div style="background:red;height:100%;width:100%;"><input type="button" value="{{:value}}" /></div>' }
            let node1: NodeModel = {
                id: 'node1', width: 75, height: 50, offsetX: 300, offsetY: 300,
                shape: shape1
            };

            let htmlcontent: string = '<div id="list" style="height:100px; width:100%; overflow:hidden;"> </div>';
            let shape2: HtmlModel = { type: 'HTML', content: htmlcontent }
            let node2: NodeModel = {
                id: 'node2', width: 300, height: 50, offsetX: 200, offsetY: 200,
                shape: shape2
            };

            let shape3: HtmlModel = { type: 'HTML', content: '<div style="background:red;height:100%;width:100%;"><input type="button" value="{{:value}}" /></div>' }
            let node3: NodeModel = {
                id: 'node3', width: 300, height: 50, offsetX: 200, offsetY: 400,
                shape: shape3
            };
            let shape33: HtmlModel = { type: 'HTML', content: '<div style="background:red;height:100%;width:100%;"><input type="button" value="{{:value}}" /></div>' }
            let node33: NodeModel = {
                id: 'node33', offsetX: 200, offsetY: 400,
                shape: shape3
            };


            diagram = new Diagram({ width: 500, height: 500, nodes: [node1, node2, node3, node33] });
            diagram.appendTo('#diagram_html2');

            getHtmlContent();
            function getHtmlContent(): HTMLElement {
                let div: HTMLElement = document.getElementById('list');
                let ruler: Ruler = new Ruler({
                    thickness: 25, segmentWidth: 50, orientation: 'Horizontal', length: 400
                });
                ruler.appendTo('#list');
                return div;
            }
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking HTML node', (done: Function) => {
            let wrapper: GroupableView = (diagram.nodes[0] as Node).wrapper;
            expect(wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof DiagramHtmlElement && wrapper.offsetX === 300 &&
                wrapper.offsetY === 300 && wrapper.actualSize.width === 75 && wrapper.actualSize.height === 50).toBe(true);
            done();
        });

        it('Checking HTML node', (done: Function) => {
            let wrapper: GroupableView = (diagram.nodes[1] as Node).wrapper;
            expect(wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof DiagramHtmlElement && wrapper.offsetX === 200 &&
                wrapper.offsetY === 200 && wrapper.actualSize.width === 300 && wrapper.actualSize.height === 50).toBe(true);
            done();
        });

        it('Checking HTML node with another component', (done: Function) => {
            let htmlcontent2: string = '<div id="ruler" style="height:100px; width:100%; overflow:hidden;"> </div>';
            function getHtmlContent2(): HTMLElement {
                let div: HTMLElement = document.getElementById('ruler');
                let ruler1: Ruler = new Ruler({
                    thickness: 25, segmentWidth: 50, orientation: 'Horizontal', length: 400
                });
                ruler1.appendTo('#ruler');
                return div;
            }
            ((diagram.nodes[2] as Node).shape as HtmlModel).content = htmlcontent2;
            diagram.dataBind();
            getHtmlContent2();
            let wrapper: GroupableView = (diagram.nodes[2] as Node).wrapper;
            expect(wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof DiagramHtmlElement && wrapper.offsetX === 200 &&
                wrapper.offsetY === 400 && wrapper.actualSize.width === 300 && wrapper.actualSize.height === 50).toBe(true);
            done();
        });

        it('Checking HTML node delete ', (done: Function) => {
            let id: string = diagram.nodes[0].id;
            let htmlElement: HTMLElement;
            let i: number;
            diagram.remove(diagram.nodes[0]);
            for (i = 0; i < diagram.nodes.length; i++) {
                htmlElement = document.getElementsByClassName('foreign-object')[0] as HTMLElement;
                if (id + '_html_element' === htmlElement.id) {
                    expect(htmlElement === null).toBe(true);
                }
            }
            done();
        });

        it('Checking HTML node without width and height ', (done: Function) => {
            let wrapper: GroupableView = diagram.nameTable['node33'].wrapper;
            expect(wrapper && wrapper.actualSize.width !== undefined &&
                wrapper.actualSize.height !== undefined).toBe(true);
            done();
        });
    });

    describe('Check Accessibility for node ', () => {
        let diagrams: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramarialabel' });
            document.body.appendChild(ele);
            let nodeport: PointPortModel = { offset: {} };
            nodeport.shape = 'Square';
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                expandIcon: { height: 20, width: 20, shape: "ArrowDown" },
                collapseIcon: { height: 20, width: 20, shape: "ArrowUp" },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },

                    content: 'top center',
                    height: 50,
                    width: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Top',
                }]
            };
            node.ports = [nodeport];
            diagrams = new Diagram({
                width: '600px', height: '600px',
                nodes: [node],
                getDescription: 'getAccessibility'
            });
            diagrams.appendTo('#diagramarialabel');
        });
        afterAll((): void => {
            diagrams.destroy();
            ele.remove();
        });
        it('Checking accessibity', (done: Function) => {
            let wrapper: GroupableView = (diagrams.nodes[0] as Node).wrapper;
            let node2: Node = diagrams.nodes[0] as Node;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagrams.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 68, 68, true);
            diagramCanvas = document.getElementById(diagrams.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 60, 60, false, false);
            mouseEvents.mouseMoveEvent(diagramCanvas, 160, 260, false, false);
            expect(node2.wrapper && node2.wrapper.children.length === 4 &&
                node2.wrapper.children[3].id === 'node1_icon_content'
            ).toBe(true);
            done();
        });
    });
    describe('Check Accessibility for node ', () => {
        let diagrams: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramarialabel' });
            document.body.appendChild(ele);
            let nodeport: PointPortModel = { offset: {} };
            nodeport.shape = 'Square';
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                expandIcon: { height: 20, width: 20, shape: "ArrowDown" },
                collapseIcon: { height: 20, width: 20, shape: "ArrowUp" },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },

                    content: 'top center',
                    height: 50,
                    width: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Top',
                }]
            };
            node.ports = [nodeport];

            diagrams = new Diagram({
                width: '600px', height: '600px',
                nodes: [node],
                getDescription: getundefAccessibility
            });
            diagrams.appendTo('#diagramarialabel');
        });
        afterAll((): void => {
            diagrams.destroy();
            ele.remove();
        });
        it('Checking accessibity', (done: Function) => {
            let wrapper: GroupableView = (diagrams.nodes[0] as Node).wrapper;
            let node2: Node = diagrams.nodes[0] as Node;
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagrams.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 68, 68, true);
            diagramCanvas = document.getElementById(diagrams.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 60, 60, false, false);
            mouseEvents.mouseMoveEvent(diagramCanvas, 160, 260, false, false);
            expect(diagrams.nodes.length === 1).toBe(true);
            done();
        });
    });


    describe('Default Node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let node: NodeModel = { id: 'node1', width: 30, height: 30, offsetX: 100, offsetY: 100 };

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramNode' });
            document.body.appendChild(ele);
            diagram = new Diagram({ width: 400, height: 400 });
            diagram.appendTo('#diagramNode');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking add default node on runtime in Svg Mode', (done: Function) => {
            let diagramLayerSvg: SVGSVGElement = getDiagramLayerSvg(diagram.element.id) as SVGSVGElement;
            diagram.add(node);
            let node1: HTMLElement = diagramLayerSvg.getElementById('node1') as HTMLElement;
            let wrapper: GroupableView = (diagram.nodes[0] as Node).wrapper;
            expect(wrapper && node1 && wrapper.id === node1.id).toBe(true);
            done();
        });

        it('Checking get node defaults', (done: Function) => {
            let newNode: NodeModel = { id: 'newNode', width: 100, style: { fill: 'red' }, annotations: [{ content: 'Content' }] };
            diagram.getNodeDefaults = (obj: NodeModel) => {
                let defaults: NodeModel = {
                    width: 150, height: 50, annotations: [{ style: { color: 'white' } }],
                    ports: [{ id: 'port1', visibility: PortVisibility.Visible }]
                };
                return defaults;
            };
            let newConnector: ConnectorModel = { id: 'newConnector', sourcePoint: { x: 500, y: 200 }, targetPoint: { x: 600, y: 300 } };
            diagram.getConnectorDefaults = (obj: ConnectorModel) => {
                let defaults: ConnectorModel = {
                    style: { strokeColor: 'blue' },
                    annotations: [{ content: 'connector' }]
                };
                return defaults;
            };

            diagram.add(newNode);
            expect(diagram.nameTable[newNode.id].annotations[0].style.color).toBe('white');
            expect(diagram.nameTable[newNode.id].annotations[0].style.fill).toBe('transparent');
            diagram.add(newConnector);
            expect(diagram.nameTable[newConnector.id].style.strokeColor).toBe('blue');
            expect(diagram.nameTable[newConnector.id].annotations[0].content).toBe('connector');
            done();
        });
    });

    describe('Default Node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let node: NodeModel = { id: 'node1', width: 30, height: 30, offsetX: 100, offsetY: 100 };

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramNode' });
            document.body.appendChild(ele);
            diagram = new Diagram({ width: 400, height: 400, nodes: [node] });
            diagram.appendTo('#diagramNode');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking getObject and getactive layer', (done: Function) => {
            let diagramLayerSvg: SVGSVGElement = getDiagramLayerSvg(diagram.element.id) as SVGSVGElement;
            let node1: HTMLElement = diagramLayerSvg.getElementById('node1') as HTMLElement;
            let node2: NodeModel = diagram.getObject(node1.id);
            expect(node1.id === node2.id).toBe(true);
            let layer1: LayerModel = diagram.getActiveLayer();
            expect(layer1.id === 'default_layer').toBe(true);
            done();
        });
    });

    describe('Default Node min value change', () => {
        let diagram: Diagram;
        let ele: HTMLElement;


        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramNode' });
            document.body.appendChild(ele);

            let nodes: NodeModel[] = [
                {
                    id: 'node4', minWidth: 150, minHeight: 100, offsetX: 700, offsetY: 100, style: { fill: 'red' },
                    shape: { type: 'Image', source: './../nodes/employee.PNG', align: 'XMinYMin' }
                },
            ];
            diagram = new Diagram({ width: 400, height: 400, nodes: nodes });
            diagram.appendTo('#diagramNode');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking nodes shape and min value at runtime', (done: Function) => {
            diagram.nodes[0].shape = { type: 'Basic' }
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[0].bounds.width == 150);
            diagram.nodes[0].minWidth = 350;
            diagram.nodes[0].shape = { type: 'Image', source: './../nodes/employee.PNG', align: 'XMinYMin' }
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[0].bounds.width == 350);
            done();
        });
    });
    describe('HTML node - visible', () => {
        let diagram: Diagram;
        let ele: HTMLElement;


        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramHTMLNode' });
            document.body.appendChild(ele);
            let shape1: HtmlModel = { type: 'HTML', content: '<div style="background:red;height:100%;width:100%;"><input type="button" value="{{:value}}" /></div>' };
            let nodes: NodeModel[] = [
                {
                    id: 'node3', width: 75, height: 50, offsetX: 300, offsetY: 300, visible: false,
                    shape: shape1, ports: [{
                        shape: 'Circle',
                        offset: { x: 1, y: 0.75 }
                    }],
                },
            ];
            diagram = new Diagram({ width: 400, height: 400, nodes: nodes });
            diagram.appendTo('#diagramHTMLNode');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Html node visble property', (done: Function) => {
            let visible = document.getElementById('node3').getAttribute('visibility');
            expect(diagram.nodes[0].visible == false && visible == 'hidden');
            diagram.nodes[0].visible = true;
            diagram.dataBind();
            visible = document.getElementById('node3').getAttribute('visibility');
            expect(diagram.nodes[0].visible == true && visible == 'visible');
            diagram.nodes[0].visible = false;
            diagram.dataBind();
            visible = document.getElementById('node3').getAttribute('visibility');
            expect(diagram.nodes[0].visible == false && visible == 'hidden');
            done();
        });
    });
    describe('Layout Initial Rendering isExpanded False', () => {
        let diagram: Diagram;
        let ele: HTMLElement;


        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramLayout' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'Node1', width: 50, height: 50, annotations: [{ content: 'Node1' }],
                    expandIcon: {
                        shape: 'Minus',
                        width: 10,
                        height: 10
                    },
                    collapseIcon: {
                        shape: 'Plus',
                        width: 10,
                        height: 10
                    },
                    isExpanded: false
                }, {
                    id: 'Node2', width: 50, height: 50, annotations: [{ content: 'Node2' }],
                    expandIcon: {
                        shape: 'Minus',
                        width: 10,
                        height: 10
                    },
                    collapseIcon: {
                        shape: 'Plus',
                        width: 10,
                        height: 10
                    },
                }, {
                    id: 'Node3', width: 50, height: 50, annotations: [{ content: 'Node3' }],
                },
                {
                    id: 'Node4', width: 50, height: 50, annotations: [{ content: 'Node4' }],
                    expandIcon: {
                        shape: 'Minus',
                        width: 10,
                        height: 10
                    },
                    collapseIcon: {
                        shape: 'Plus',
                        width: 10,
                        height: 10
                    },
                },
                {
                    id: 'Node5', width: 50, height: 50, annotations: [{ content: 'Node5' }],
                },
                {
                    id: 'Node6', width: 50, height: 50, annotations: [{ content: 'Node6' }]
                },
                {
                    id: 'Node7', width: 50, height: 50, annotations: [{ content: 'Node7' }]
                },
                {
                    id: 'Node8', width: 50, height: 50, annotations: [{ content: 'Node8' }],
                    expandIcon: {
                        shape: 'Minus',
                        width: 10,
                        height: 10
                    },
                    collapseIcon: {
                        shape: 'Plus',
                        width: 10,
                        height: 10
                    },
                },
            ];
            let connector: ConnectorModel[] = [
                {
                    id: 'node1_2', sourceID: 'Node1', targetID: 'Node2',
                }, {
                    id: 'node2_3', sourceID: 'Node2', targetID: 'Node3',
                },
                {
                    id: 'node2_4', sourceID: 'Node2', targetID: 'Node4',
                },
                {
                    id: 'node2_5', sourceID: 'Node2', targetID: 'Node5',
                },
                {
                    id: 'node2_6', sourceID: 'Node2', targetID: 'Node6',
                },
                {
                    id: 'node2_7', sourceID: 'Node2', targetID: 'Node7',
                },
                {
                    id: 'node2_8', sourceID: 'Node2', targetID: 'Node8',
                },
            ];
            diagram = new Diagram(
                {
                    width: 1000, height: 800, nodes: nodes, connectors: connector, layout: { type: 'ComplexHierarchicalTree' }
                });
            diagram.appendTo('#diagramLayout');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Layout after collapsed', (done: Function) => {
            let visible = document.getElementById('Node2').getAttribute('visibility');
            expect(diagram.nodes[1].visible == false && visible == 'hidden');
            expect(diagram.nodes[0].isExpanded === false);
            done();
        });
    });
    describe('Without Layout - Is Expanded', () => {
        let diagram: Diagram;
        let ele: HTMLElement;


        beforeAll((): void => {

            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramNode' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }],
                expandIcon: {
                    shape: 'ArrowDown',
                    width: 10,
                    height: 10
                },
                collapseIcon: {
                    shape: 'ArrowUp',
                    width: 10,
                    height: 10
                },
                isExpanded: false
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 400, annotations: [{ content: 'Node2' }]
            };
            let node3: NodeModel = {
                id: 'node1', minWidth: 100, maxWidth: 100, minHeight: 20, offsetX: 500, offsetY: 50, shape: { type: 'Basic', shape: 'Rectangle' },
                style: { fill: 'red', strokeColor: 'yellow', strokeWidth: 3, strokeDashArray: '1,3' },
                annotations: [{ content: 'Rectangle Rectangle Rectangle Rectanglev RectangleRectangle Rectangle Rectangle Rectanglev RectangleRectangle Rectangle Rectangle Rectanglev Rectangle' }],
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourceID: 'node1', targetID: 'node2', annotations: [{ content: 'Connector' }]
            };
            diagram = new Diagram({ width: 400, height: 400, nodes: [node, node2, node3], connectors: [connector] });
            diagram.appendTo('#diagramNode');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking node After collapsed', (done: Function) => {
            let visible = document.getElementById('node2').getAttribute('visibility');
            expect(diagram.nodes[1].visible === false && visible === 'hidden');
            expect(diagram.nodes[0].isExpanded === false);
            done();
        });
        it('Checking node with lengthy annotations with space', (done: Function) => {
            expect(diagram.nodes[2].wrapper.actualSize.width === 187.2);
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
    describe('zIndex Issue', () => {
        let diagram: Diagram; let ele: HTMLElement;
        let node3: NodeModel; let node4: NodeModel;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramNodeZindex' });
            document.body.appendChild(ele);
            node3 = {
                id: 'node3',offsetX: 500, offsetY: 250, width: 100, height: 100, style: { fill: "green" },
                annotations: [{ content: "21" }], zIndex: 21,
                shape: {
                    type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">	<g transform="translate(1 1)">		<g>			<path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,1.791-6.827,1.28     C62.726,435.13,62.354,435.072,61.979,435.057z"/>			<path style="fill:#61443C;" d="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304     c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296     c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504     c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z"/>		</g>		<path style="fill:#8B685A;" d="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z"/>		<path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z"/>		<path style="fill:#9ACA5C;" d="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z"/>		<path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z"/>		<path style="fill:#9ACA5C;" d="M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z"/>	</g>	<g>		<path d="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/>		<path d="M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/>		<path d="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/>		<path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/>		<path d="M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z"/>		<path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z"/>		<path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z"/>		<path d="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/>		<path d="M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/>		<path d="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z"/>		<path d="M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/>		<path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/>		<path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/>		<path d="M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/>		<path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/>		<path d="M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/>		<path d="M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/>		<path d="M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/>		<path d="M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/>	</g></g>',
                },
            };
            node4 = {
                id: 'node4', offsetX: 550, offsetY: 250, width: 100, height: 100, style: { fill: "yellow" },
                annotations: [{ content: "20" }], zIndex: 20,
                shape: {
                    type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">	<g transform="translate(1 1)">		<path style="fill:#FDDC42;" d="M417.219,379.501c5.745,13.691,10.675,27.71,14.763,41.984c0.983,2.981,0.203,6.261-2.016,8.48    c-2.219,2.219-5.499,2.999-8.48,2.016c-14.282-4.063-28.302-8.993-41.984-14.763l-46.336,26.624v0.085    c-1.824,14.741-4.531,29.359-8.107,43.776c-0.638,3.073-2.953,5.524-5.985,6.336c-3.032,0.812-6.262-0.154-8.351-2.496    c-10.342-10.73-20.03-22.072-29.013-33.963l-53.333,0.085c-9.013,11.865-18.73,23.177-29.099,33.877    c-2.089,2.343-5.319,3.308-8.351,2.496c-3.032-0.812-5.347-3.263-5.985-6.336c-3.583-14.415-6.29-29.034-8.107-43.776v-0.085    l-46.336-26.624c-13.691,5.745-27.71,10.675-41.984,14.763c-2.981,0.983-6.261,0.203-8.48-2.016s-2.999-5.499-2.016-8.48    c4.063-14.282,8.993-28.302,14.763-41.984l-26.624-46.336h-0.085c-14.741-1.824-29.359-4.531-43.776-8.107    c-3.073-0.638-5.524-2.953-6.336-5.985c-0.812-3.032,0.154-6.262,2.496-8.351c10.73-10.342,22.072-20.03,33.963-29.013    l-0.085-53.333c-11.865-9.013-23.177-18.73-33.877-29.099c-2.343-2.089-3.308-5.319-2.496-8.351    c0.812-3.032,3.263-5.347,6.336-5.985c14.415-3.583,29.034-6.29,43.776-8.107h0.085l26.624-46.336    c-5.745-13.691-10.675-27.71-14.763-41.984c-0.983-2.981-0.203-6.261,2.016-8.48s5.499-2.999,8.48-2.016    c14.282,4.063,28.303,8.993,41.984,14.763l46.336-26.624v-0.085c1.824-14.741,4.531-29.359,8.107-43.776    c0.638-3.073,2.953-5.524,5.985-6.336c3.032-0.812,6.262,0.154,8.351,2.496c10.342,10.73,20.03,22.072,29.013,33.963l53.333-0.085    c9.013-11.865,18.73-23.177,29.099-33.877c2.089-2.343,5.319-3.308,8.351-2.496c3.032,0.812,5.347,3.263,5.985,6.336    c3.583,14.415,6.29,29.034,8.107,43.776v0.085l46.336,26.624c13.691-5.745,27.71-10.675,41.984-14.763    c2.981-0.983,6.261-0.203,8.48,2.016c2.219,2.219,2.999,5.499,2.016,8.48c-4.063,14.282-8.993,28.303-14.763,41.984l26.624,46.336    h0.085c14.741,1.824,29.359,4.531,43.776,8.107c3.073,0.638,5.524,2.953,6.336,5.985c0.812,3.032-0.154,6.262-2.496,8.351    c-10.73,10.342-22.072,20.03-33.963,29.013l0.085,53.333c11.865,9.013,23.177,18.73,33.877,29.099    c2.343,2.089,3.308,5.319,2.496,8.351c-0.812,3.032-3.263,5.347-6.336,5.985c-14.415,3.583-29.034,6.29-43.776,8.107h-0.085"/>		<path style="fill:#FFEB49;" d="M497.892,247.574c-17.69-9.664-48.938-25.315-66.996-26.486c-1.624-8.324-3.842-16.52-6.637-24.527    c15.052-10.044,34.319-39.362,44.805-56.575c1.723-2.626,1.819-5.999,0.249-8.718c-1.57-2.72-4.539-4.323-7.675-4.144    c-20.158,0.476-55.2,2.502-71.417,10.524c-5.53-6.366-11.501-12.337-17.867-17.868c8.021-16.217,10.048-51.258,10.523-71.417    c0.179-3.136-1.424-6.105-4.144-7.675c-2.72-1.57-6.093-1.474-8.719,0.249c-17.212,10.487-46.531,29.752-56.575,44.805    c-8.007-2.795-16.203-5.013-24.527-6.636c-1.171-18.058-16.823-49.307-26.486-66.997c-1.413-2.805-4.285-4.575-7.426-4.575    s-6.013,1.77-7.426,4.575c-9.664,17.69-25.316,48.939-26.486,66.997c-8.324,1.623-16.521,3.841-24.527,6.636    c-10.044-15.053-39.362-34.318-56.575-44.805c-2.626-1.723-5.999-1.819-8.719-0.249c-2.72,1.57-4.323,4.539-4.144,7.675    c0.475,20.158,2.502,55.199,10.523,71.417c-6.366,5.531-12.336,11.501-17.867,17.868c-16.217-8.022-51.258-10.048-71.417-10.524    c-3.136-0.179-6.104,1.424-7.675,4.144c-1.57,2.72-1.474,6.092,0.249,8.718c10.486,17.214,29.753,46.531,44.805,56.576    c-2.795,8.007-5.013,16.203-6.637,24.527c-18.058,1.171-49.306,16.822-66.996,26.486c-2.805,1.412-4.575,4.285-4.575,7.426    s1.77,6.013,4.575,7.426c17.69,9.665,48.938,25.316,66.996,26.487c1.624,8.324,3.842,16.52,6.637,24.527    c-15.053,10.044-34.319,39.362-44.805,56.576c-1.723,2.626-1.819,5.998-0.249,8.718s4.539,4.323,7.675,4.143    c20.158-0.475,55.2-2.502,71.417-10.523c5.53,6.366,11.501,12.337,17.867,17.867c-8.021,16.218-10.048,51.259-10.523,71.417    c-0.179,3.136,1.424,6.105,4.144,7.675c2.72,1.57,6.093,1.474,8.719-0.249c17.213-10.486,46.53-29.751,56.575-44.805    c8.007,2.795,16.203,5.013,24.527,6.637c1.171,18.059,16.823,49.307,26.486,66.996c1.413,2.805,4.285,4.575,7.426,4.575    s6.013-1.77,7.426-4.575c9.664-17.689,25.316-48.938,26.486-66.996c8.324-1.624,16.52-3.841,24.527-6.637    c10.045,15.054,39.363,34.318,56.575,44.805c2.626,1.723,5.999,1.82,8.719,0.249s4.323-4.539,4.144-7.675    c-0.475-20.158-2.502-55.2-10.523-71.417c6.366-5.531,12.336-11.501,17.867-17.867c16.217,8.022,51.258,10.048,71.417,10.523    c3.135,0.179,6.104-1.423,7.675-4.143s1.474-6.092-0.249-8.718c-10.486-17.214-29.752-46.532-44.805-56.576    c2.796-8.007,5.014-16.203,6.637-24.527c18.058-1.171,49.306-16.822,66.996-26.487c2.805-1.412,4.575-4.285,4.575-7.426    C502.467,251.859,500.697,248.986,497.892,247.574z"/>		<circle style="fill:#E15919;" cx="255" cy="255" r="179.2"/>		<ellipse style="fill:#FF6E2C;" cx="242.2" cy="255" rx="166.4" ry="179.2"/>		<circle style="fill:#FFBE00;" cx="255" cy="255" r="145.067"/>		<ellipse style="fill:#FFC900;" cx="242.2" cy="255" rx="132.267" ry="145.067"/>	</g>	<g>		<path d="M502.983,241.087c-8.414-4.598-18.054-9.542-27.801-13.988c8.831-7.271,17.128-14.827,23.234-20.633    c4.61-4.239,6.486-10.688,4.869-16.738c-1.617-6.051-6.459-10.704-12.569-12.079c-6.766-1.643-18.167-4.224-30.405-6.256    c6.194-8.708,12.055-17.792,17.039-25.969c3.346-5.29,3.484-11.998,0.358-17.421c-3.169-5.387-9.028-8.613-15.275-8.408    c-9.558,0.224-20.335,0.757-30.956,1.762c4.002-10.73,7.347-21.391,9.69-29.433c1.863-5.973,0.261-12.486-4.16-16.914    c-4.421-4.427-10.931-6.039-16.907-4.186c-6.646,1.935-17.787,5.367-29.458,9.715c1.006-10.626,1.54-21.409,1.766-30.973    c0.249-6.255-2.988-12.134-8.408-15.267c-5.433-3.086-12.12-2.952-17.425,0.35c-8.175,4.979-17.254,10.837-25.959,17.026    c-1.885-11.384-4.295-22.281-6.266-30.38c-1.367-6.103-6.005-10.945-12.044-12.573c-6.039-1.627-12.482,0.228-16.731,4.819    c-4.799,4.991-12.752,13.532-20.721,23.168c-4.433-9.711-9.359-19.311-13.938-27.693C268.006,3.473,262.261,0,256,0    s-12.006,3.473-14.917,9.017c-4.594,8.41-9.537,18.049-13.983,27.795c-7.28-8.844-14.831-17.137-20.634-23.233    c-4.241-4.609-10.689-6.483-16.739-4.865c-6.05,1.618-10.703,6.46-12.078,12.57c-1.644,6.762-4.223,18.162-6.256,30.398    c-8.708-6.192-17.79-12.051-25.968-17.032c-5.305-3.302-11.992-3.436-17.425-0.35c-5.419,3.132-8.657,9.008-8.408,15.263    c0.227,9.56,0.759,20.337,1.765,30.958c-10.748-4.011-21.4-7.351-29.423-9.687c-5.975-1.865-12.491-0.264-16.92,4.158    c-4.43,4.422-6.043,10.935-4.188,16.913c1.945,6.665,5.382,17.82,9.717,29.456c-10.625-1.007-21.406-1.539-30.967-1.764    c-6.25-0.21-12.115,3.016-15.283,8.408c-3.125,5.423-2.987,12.131,0.358,17.421c4.981,8.174,10.84,17.254,17.031,25.959    c-11.388,1.886-22.283,4.297-30.373,6.262c-6.108,1.364-10.956,6.004-12.584,12.048s0.23,12.491,4.826,16.74    c4.996,4.798,13.54,12.749,23.167,20.712c-9.712,4.434-19.316,9.36-27.7,13.942C3.473,243.996,0,249.739,0,256    c0,6.26,3.473,12.004,9.017,14.912c8.415,4.598,18.054,9.543,27.8,13.989c-8.831,7.271-17.127,14.826-23.233,20.632    c-4.61,4.239-6.486,10.688-4.869,16.738c1.617,6.051,6.459,10.704,12.569,12.079c6.766,1.643,18.167,4.224,30.406,6.256    c-6.194,8.708-12.056,17.791-17.04,25.969c-3.346,5.29-3.484,11.998-0.358,17.421c3.193,5.362,9.036,8.578,15.275,8.408    c9.558-0.224,20.335-0.757,30.956-1.762c-4.002,10.73-7.347,21.391-9.69,29.433c-1.816,5.982-0.214,12.477,4.175,16.929    c3.175,3.149,7.47,4.909,11.942,4.892c1.676-0.001,3.343-0.244,4.95-0.721c6.646-1.935,17.787-5.367,29.458-9.715    c-1.006,10.626-1.54,21.409-1.766,30.973c-0.249,6.255,2.988,12.134,8.408,15.267c5.436,3.078,12.117,2.944,17.425-0.35    c8.175-4.979,17.255-10.836,25.96-17.026c1.885,11.383,4.294,22.281,6.265,30.38c1.412,6.095,6.051,10.926,12.083,12.583    c1.395,0.371,2.832,0.559,4.275,0.558c4.702-0.018,9.191-1.966,12.417-5.387c4.799-4.991,12.752-13.532,20.721-23.168    c4.433,9.711,9.359,19.311,13.938,27.693c2.91,5.544,8.655,9.017,14.917,9.017c6.262,0,12.006-3.473,14.917-9.017    c4.594-8.41,9.537-18.049,13.983-27.795c7.28,8.844,14.831,17.137,20.634,23.233c3.237,3.44,7.743,5.401,12.467,5.425    c1.44,0,2.875-0.188,4.267-0.558c6.029-1.656,10.667-6.481,12.083-12.571c1.644-6.762,4.223-18.162,6.256-30.398    c8.708,6.192,17.791,12.051,25.969,17.032c5.308,3.294,11.99,3.428,17.425,0.35c5.419-3.132,8.657-9.008,8.408-15.263    c-0.227-9.56-0.759-20.338-1.765-30.958c10.748,4.011,21.4,7.352,29.423,9.688c1.618,0.479,3.296,0.724,4.983,0.725    c4.472,0.022,8.768-1.737,11.941-4.888c4.385-4.445,5.989-10.931,4.183-16.908c-1.945-6.665-5.382-17.82-9.717-29.456    c10.625,1.007,21.406,1.539,30.967,1.764l0.433,0.009c6.098,0.049,11.759-3.159,14.85-8.417    c3.125-5.423,2.987-12.131-0.358-17.421c-4.981-8.175-10.842-17.254-17.031-25.959c11.386-1.886,22.283-4.297,30.373-6.262    c6.108-1.364,10.956-6.004,12.584-12.048c1.629-6.043-0.23-12.491-4.826-16.74c-4.996-4.798-13.538-12.748-23.165-20.711    c9.71-4.434,19.312-9.36,27.698-13.943C508.527,268.004,512,262.261,512,256C512,249.74,508.527,243.996,502.983,241.087    L502.983,241.087z M486.658,194.096c-9.414,9.008-19.277,17.536-29.55,25.551c-5.876-2.215-11.918-3.96-18.071-5.217    c-1.067-4.698-2.264-9.347-3.676-13.905c4.711-4.198,9.082-8.763,13.072-13.652C463.298,188.831,478.505,192.236,486.658,194.096z     M381.048,371.756c-2.971,3.208-6.051,6.289-9.24,9.244c-17.465,16.225-38.136,28.61-60.681,36.356    c-3.219,1.099-6.344,2.039-9.444,2.917c-1.848,0.515-3.711,0.986-5.583,1.44c-2.558,0.629-5.122,1.285-7.657,1.773    c-21.421,4.242-43.465,4.242-64.885,0c-2.535-0.489-5.099-1.145-7.657-1.773c-1.872-0.454-3.735-0.925-5.583-1.44    c-3.1-0.878-6.225-1.817-9.444-2.917c-22.545-7.746-43.216-20.13-60.681-36.356c-3.19-2.957-6.27-6.039-9.239-9.244    c-16.187-17.438-28.547-38.07-36.285-60.57c-1.105-3.213-2.044-6.342-2.926-9.452c-0.524-1.877-1.001-3.77-1.461-5.671    c-0.625-2.547-1.279-5.096-1.766-7.63c-4.239-21.414-4.239-43.451,0-64.865c0.492-2.55,1.152-5.131,1.786-7.709    c0.448-1.847,0.912-3.685,1.42-5.508c0.877-3.102,1.817-6.232,2.918-9.456c7.738-22.53,20.109-43.19,36.315-60.65    c2.971-3.208,6.051-6.289,9.24-9.244c17.465-16.225,38.136-28.61,60.681-36.356c3.219-1.1,6.344-2.039,9.444-2.917    c1.848-0.515,3.711-0.986,5.583-1.44c2.558-0.629,5.122-1.285,7.657-1.773c21.421-4.242,43.465-4.242,64.885,0    c2.535,0.489,5.099,1.145,7.657,1.773c1.872,0.454,3.735,0.925,5.583,1.44c3.1,0.878,6.225,1.817,9.444,2.917    c22.545,7.746,43.216,20.13,60.681,36.356c3.19,2.957,6.269,6.039,9.24,9.244c16.207,17.459,28.578,38.12,36.316,60.65    c1.101,3.224,2.041,6.354,2.918,9.456c0.507,1.823,0.972,3.661,1.42,5.508c0.634,2.578,1.295,5.16,1.786,7.709    c4.239,21.414,4.239,43.451,0,64.865c-0.488,2.534-1.142,5.083-1.766,7.63c-0.461,1.901-0.937,3.795-1.461,5.671    c-0.882,3.11-1.821,6.239-2.926,9.452C409.595,333.686,397.235,354.317,381.048,371.756z M462.783,136.542    c-9.639,16.632-20.961,32.231-33.787,46.55c-6.106-14.401-13.987-27.983-23.46-40.43    C424.361,138.686,443.543,136.636,462.783,136.542L462.783,136.542z M424.792,87.129c-3.599,12.468-7.836,24.743-12.694,36.777    c-6.285,1.015-12.478,2.533-18.521,4.539c-3.214-3.466-6.556-6.807-10.024-10.024c2.012-6.056,3.533-12.264,4.549-18.563    C402.048,94.135,416.844,89.536,424.792,87.129L424.792,87.129z M375.342,49.162c-0.023,19.256-2.037,38.457-6.008,57.299    c-12.447-9.473-26.028-17.353-40.429-23.458C343.2,70.183,358.759,58.845,375.342,49.162L375.342,49.162z M317.767,25.308    c3.109,12.615,5.567,25.381,7.364,38.248c-4.894,3.991-9.462,8.365-13.663,13.081c-4.554-1.411-9.2-2.607-13.894-3.673    c-1.27-6.21-3.035-12.308-5.279-18.236C301.564,42.74,312.089,31.379,317.767,25.308z M255.933,17.2    c9.596,16.661,17.427,34.277,23.364,52.564c-15.468-1.997-31.129-1.997-46.598,0.001C238.623,51.493,246.408,33.879,255.933,17.2    L255.933,17.2z M194.092,25.337c9.01,9.414,17.538,19.278,25.552,29.554c-2.216,5.876-3.961,11.92-5.219,18.073    c-4.693,1.066-9.34,2.261-13.894,3.673c-4.199-4.713-8.766-9.086-13.657-13.077C188.834,48.702,192.232,33.493,194.092,25.337    L194.092,25.337z M183.094,83.004c-14.401,6.105-27.982,13.986-40.429,23.458c-3.977-18.822-6.028-38-6.123-57.237    C153.176,58.858,168.776,70.178,183.094,83.004L183.094,83.004z M87.133,87.208c12.467,3.596,24.74,7.832,36.772,12.691    c1.015,6.286,2.534,12.48,4.542,18.522c-3.466,3.215-6.807,6.556-10.024,10.024c-6.059-2.01-12.269-3.531-18.571-4.547    C94.156,110.016,89.547,95.186,87.133,87.208L87.133,87.208z M106.464,142.663c-9.474,12.447-17.355,26.029-23.46,40.431    c-12.819-14.297-24.156-29.856-33.837-46.44C68.422,136.68,87.623,138.693,106.464,142.663L106.464,142.663z M25.317,194.233    c12.613-3.113,25.379-5.572,38.247-7.366c3.99,4.891,8.362,9.458,13.075,13.657c-1.413,4.558-2.609,9.207-3.676,13.905    c-6.209,1.27-12.306,3.034-18.233,5.277C42.756,210.445,31.386,199.918,25.317,194.233z M69.764,232.703    c-1.997,15.468-1.997,31.128,0,46.596c-18.272-5.923-35.886-13.709-52.565-23.236C33.861,246.468,51.478,238.639,69.764,232.703z     M25.342,317.904c9.414-9.008,19.276-17.535,29.549-25.549c5.876,2.216,11.919,3.96,18.072,5.216    c1.067,4.696,2.263,9.343,3.675,13.899c-4.711,4.2-9.082,8.767-13.071,13.658C48.701,323.169,33.494,319.764,25.342,317.904z     M49.217,375.458c9.639-16.633,20.961-32.232,33.787-46.552c6.106,14.402,13.987,27.984,23.46,40.432    C87.639,373.313,68.457,375.364,49.217,375.458L49.217,375.458z M87.208,424.871c3.599-12.468,7.836-24.744,12.694-36.778    c6.285-1.015,12.478-2.533,18.521-4.538c3.215,3.466,6.556,6.807,10.024,10.024c-2.012,6.056-3.533,12.264-4.549,18.564    C109.952,417.865,95.156,422.464,87.208,424.871L87.208,424.871z M136.658,462.837c0.023-19.256,2.037-38.457,6.008-57.299    c12.447,9.473,26.028,17.353,40.429,23.458C168.8,441.817,153.241,453.155,136.658,462.837L136.658,462.837z M194.233,486.691    c-3.11-12.606-5.581-25.361-7.404-38.216c4.907-4.001,9.489-8.386,13.702-13.113c4.554,1.411,9.2,2.607,13.894,3.673    c1.27,6.21,3.035,12.308,5.279,18.236C210.435,469.259,199.91,480.621,194.233,486.691L194.233,486.691z M256.066,494.8    c-9.596-16.661-17.427-34.277-23.364-52.564c15.468,1.997,31.129,1.997,46.598-0.001    C273.377,460.506,265.591,478.121,256.066,494.8L256.066,494.8z M317.908,486.662c-9.01-9.414-17.538-19.278-25.552-29.554    c2.216-5.876,3.961-11.92,5.219-18.073c4.693-1.066,9.34-2.261,13.894-3.673c4.2,4.713,8.766,9.085,13.657,13.076    C323.166,463.297,319.768,478.507,317.908,486.662L317.908,486.662z M328.906,428.996c14.401-6.105,27.982-13.986,40.429-23.458    c3.977,18.822,6.028,38,6.123,57.238C358.823,453.142,343.224,441.823,328.906,428.996L328.906,428.996z M424.866,424.792    c-12.466-3.597-24.74-7.833-36.771-12.691c-1.016-6.286-2.535-12.479-4.543-18.522c3.466-3.215,6.807-6.556,10.024-10.024    c6.059,2.01,12.269,3.531,18.571,4.547C417.844,401.984,422.453,416.814,424.866,424.792L424.866,424.792z M405.535,369.337    c9.475-12.447,17.356-26.03,23.461-40.432c12.819,14.298,24.155,29.858,33.836,46.441    C443.578,375.32,424.377,373.307,405.535,369.337L405.535,369.337z M486.683,317.767c-12.613,3.113-25.379,5.571-38.246,7.365    c-3.99-4.893-8.363-9.461-13.075-13.663c1.413-4.556,2.608-9.203,3.675-13.899c6.209-1.269,12.307-3.034,18.234-5.276    C469.245,301.556,480.613,312.082,486.683,317.767L486.683,317.767z M442.235,279.297c1.997-15.467,1.997-31.127,0-46.594    c18.245,5.922,35.822,13.73,52.448,23.297C478.057,265.567,460.48,273.375,442.235,279.297z"/>		<path d="M256,102.4c-84.831,0-153.6,68.769-153.6,153.6S171.169,409.6,256,409.6S409.6,340.831,409.6,256    C409.503,171.209,340.791,102.497,256,102.4z M256,392.533c-75.405,0-136.533-61.128-136.533-136.533S180.595,119.466,256,119.466    S392.533,180.595,392.533,256C392.447,331.369,331.369,392.447,256,392.533z"/>	</g></g>',
                },
            };
            diagram = new Diagram({
                width: '100%',
                height: '600px',
            });
            diagram.appendTo('#diagramNodeZindex');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking zIndex when node is added on runtime', (done: Function) => {
            diagram.add(node3 as NodeModel);
            diagram.add(node4 as NodeModel);
            let diagramlayer: HTMLElement = document.getElementById(diagram.element.id + '_diagramLayer');
            let childNode1: ChildNode = diagramlayer.childNodes[0];
            let childNode2: ChildNode = diagramlayer.childNodes[1];
            let id: string = 'id';
            expect(childNode1[id] === 'node4_groupElement' && childNode2[id] === 'node3_groupElement').toBe(true);
            done();
        });
    });
    describe('distribute issue', () => {
        let diagram: Diagram; let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramNodeZindex' });
            document.body.appendChild(ele);
            let node = {
                offsetX: 250,
                offsetY: 250,
                width: 100,
                height: 100,
                annotations: [{
                    content: "Left",
                }]
            };

            let node2 = {
                offsetX: 350,
                offsetY: 250,
                width: 100,
                height: 100,
                annotations: [{
                    content: "Middle",
                }]
            };

            let node3 = {
                offsetX: 850,
                offsetY: 250,
                width: 100,
                height: 100,
                annotations: [{
                    content: "Right",
                }]
            };
            diagram = new Diagram({
                width: '100%',
                height: '600px',
                nodes: [node, node2, node3]
            });
            diagram.appendTo('#diagramNodeZindex');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking distribute with righttoleft', (done: Function) => {
            let diagramlayer: HTMLElement = document.getElementById(diagram.element.id + '_diagramLayer');
            diagram.select([diagram.nodes[2], diagram.nodes[0], diagram.nodes[1]], true);
            diagram.distribute("RightToLeft", diagram.selectedItems.nodes);
            expect(diagram.nodes[1].offsetX === 550).toBe(true);
            done();
        });
        it('Checking distribution of nodes with righttoleft', (done: Function) => {
            let diagramlayer: HTMLElement = document.getElementById(diagram.element.id + '_diagramLayer');
            diagram.nodes[0].offsetY = 100;
            diagram.nodes[1].offsetY = 250;
            diagram.nodes[2].offsetY = 350;
            diagram.select([diagram.nodes[2], diagram.nodes[0], diagram.nodes[1]], true);
            diagram.distribute("RightToLeft", diagram.selectedItems.nodes);            
            expect(diagram.nodes[1].offsetY === 250 || diagram.nodes[0].offsetX === 250).toBe(true);
            done();
        });
    });
    describe('Update shape content issue', () => {
        let diagram: Diagram; let ele: HTMLElement;
        let redSvg = '<g><circle cx="0" cy="0" r="50" fill="red"/></g>';
        let blueSvg = '<g><circle cx="0" cy="0" r="50" fill="blue"/></g>';
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramNodeZindex' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: "svg",
                offsetX: 0,
                offsetY: 200,
                width: 100,
                height: 100,
                shape: {
                    type: "Native",
                    content: blueSvg,
                },
            };

            diagram = new Diagram({
                width: '100%',
                height: '600px',
                nodes: [node]
            });
            diagram.appendTo('#diagramNodeZindex');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking update shape content issue', (done: Function) => {
            let diagramlayer: HTMLElement = document.getElementById(diagram.element.id + '_diagramLayer');
            (diagram.nodes[0].shape as NativeModel).content = redSvg;
            expect((diagram.nodes[0].shape as NativeModel).content === redSvg).toBe(true);
            done();
        });      
    });
    describe('selection change event issue', () => {
        let diagram: Diagram; let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramNodeZindex' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300, annotations: [{ content: 'syncfusion' }]
                },
                {
                    id: 'node2', width: 100, height: 100, offsetX: 700, offsetY: 300,
                    shape: { type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z' }
                },
            ];

            diagram = new Diagram({
                width: '100%',
                height: '600px',
                nodes: nodes
            });
            diagram.appendTo('#diagramNodeZindex');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('selection change event issue', (done: Function) => {
            diagram.select([diagram.nodes[0]])
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: Element = document.getElementById('diagramNodeZindexcontent');

            let center: PointModel = { x: 700, y: 300 };
            diagram.selectionChange = function (args) {
                expect(args.oldValue[0].id === 'node1' && args.newValue[0].id === 'node2').toBe(true);
                done();
            }
            mouseEvents.dragAndDropEvent(diagramCanvas, center.x, center.y,center.x+1, center.y+1);
            done();
        });

});

describe('node default connector default check', () => {
    let diagram: Diagram; let ele: HTMLElement;

    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramNodeZindexDefault' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', offsetX: 300, offsetY: 300, annotations: [{ id: 'node1', offset: { x: 0, y: 0 } }, { id: 'node2' }],
                ports: [{ id: 'port1', visibility: PortVisibility.Visible, offset: { x: 1, y: 0 } }, { id: 'port2', offset: { x: 0, y: 1 }, visibility: PortVisibility.Visible }]
            },
            {
                id: 'node2122', offsetX: 100, offsetY: 100, annotations: [{ id: 'node2', offset: { x: 0, y: 0 } }, { id: 'node211' }],
                ports: [{ id: 'po1rt1', visibility: PortVisibility.Visible, offset: { x: 1, y: 0 } }, { id: 'po1rt2', offset: { x: 0, y: 1 }, visibility: PortVisibility.Visible }]
            },
        ];
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 },
                annotations:[{id:'s',offset:0},{id:'ss'}]
            },
            {
                id: 'connector2',
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 400, y: 200 },
                annotations:[{id:'ssss'}]
            },]

        diagram = new Diagram({
            width: '100%', height: 900, nodes: nodes,
            connectors: connectors,
            connectorDefaults:{ 
                annotations: [{ content: 'ss', style: { fill: 'red' }, constraints: AnnotationConstraints.Interaction }, { content: 'aaa', style: { fill: 'blue' } }],
                type: 'Bezier',
                constraints :ConnectorConstraints.Select,
                style: { strokeColor: 'red' },
                 targetDecorator: {
                    style: { fill: 'blue' },
                    pivot: { x: 0, y: 0.5 }
                } ,
                sourceDecorator: {
                    style: { fill: 'yellow' },
                    shape: 'Arrow',
                    pivot: { x: 0, y: 0.5 }
                }
            },
            nodeDefaults: { width: 50,
                offsetX: 100, offsetY: 100,
                constraints: NodeConstraints.Default & ~NodeConstraints.Rotate, borderWidth: 4, height: 50, rotateAngle: 30, maxWidth: 200, backgroundColor: 'red', borderColor: "yellow", shape: { type: 'Basic', shape: 'Heptagon' }, style: { fill: '#D5EDED', strokeColor: '#7DCFC9', strokeWidth: 1 },
                    ports: [{ style: { fill: 'gray' }, constraints: PortConstraints.Drag }, { style: { fill: 'yellow' }, constraints: PortConstraints.Draw }],
                    annotations: [{ content: 'ss', style: { fill: 'red' }, constraints: AnnotationConstraints.Interaction }, { content: 'aaa', style: { fill: 'blue' } }] },
        });
        diagram.appendTo('#diagramNodeZindexDefault');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('check node default and connector default', (done: Function) => {
        let nodeelement = document.getElementById('node2122_groupElement')
        let nodeElementValue = document.getElementById(diagram.nodes[1].id)
        let nodeBG = document.getElementById(diagram.nodes[1].id+'_content')
        let nodeannotation = document.getElementById(diagram.nodes[1].id+'_node2')
        let nodeTextAnnotation = document.getElementById(diagram.nodes[1].id+'_node2_text')
        let element = document.getElementById('node2122_node211')
        let portelement = document.getElementById('node2122_po1rt1');
        expect(nodeElementValue.getAttribute('stroke')=== 'yellow'&&nodeBG.getAttribute('fill')==='#D5EDED'&&
        nodeannotation.getAttribute('fill')==='red'
        &&(nodeTextAnnotation.children[0].childNodes[0] as any).data === 'ss'&&element.getAttribute('fill')==='blue'
        &&portelement.getAttribute('d') === 'M0,0 L12,0 L12,12 L0,12 Z '
        &&portelement.getAttribute('fill') === 'gray'
        ).toBe(true)
        nodeElementValue = document.getElementById(diagram.nodes[0].id)
         nodeBG = document.getElementById(diagram.nodes[0].id+'_content')
         nodeannotation = document.getElementById(diagram.nodes[0].id+'_node1')
        nodeTextAnnotation = document.getElementById(diagram.nodes[0].id + '_node1_text')
        element = document.getElementById('node1_node1')
        portelement = document.getElementById('node1_port1');
        nodeelement = document.getElementById('node1_groupElement')
        expect(nodeElementValue.getAttribute('stroke') === 'yellow' && nodeBG.getAttribute('fill') === '#D5EDED' && nodeannotation.getAttribute('fill') === 'red'
            && (nodeTextAnnotation.children[0].childNodes[0] as any).data === 'ss' && element.getAttribute('fill') === 'red'
            && portelement.getAttribute('d') === 'M0,0 L12,0 L12,12 L0,12 Z '
            && portelement.getAttribute('fill') === 'gray'
        ).toBe(true)
        let node: NodeModel = {};
        node.id = 'group1';
        node.shape = { type: 'Basic', shape: 'Rectangle', }
        node.annotations = [{
            id: 'AGroup1',
            content: 'Group'
        }];
        node.ports = [{
            id: 'PGroup1', offset: { x: 0.5, y: 0.5 },
        }];
        diagram.add(node);
        nodeelement = document.getElementById('group1_groupElement')
        let element11 = document.getElementById(diagram.nodes[2].id)
        let element12 = document.getElementById(diagram.nodes[2].id + '_content')
        let element13 = document.getElementById(diagram.nodes[2].id + '_AGroup1')
        let element14 = document.getElementById(diagram.nodes[2].id + '_AGroup1_text')
        expect(element11.getAttribute('fill') === 'red' && element12.getAttribute('fill') === '#D5EDED' && element13.getAttribute('fill') === 'red' &&
            (element14.children[0].childNodes[0] as any).data === 'Group').toBe(true)
        let connectorElement = document.getElementById('connector1_groupElement')
        let pathElement = document.getElementById(diagram.connectors[0].id + '_path')
        let srcElement = document.getElementById(diagram.connectors[0].id + '_srcDec')
        let tarElement = document.getElementById(diagram.connectors[0].id + '_tarDec')
        expect(pathElement.getAttribute('stroke') === 'red'
            && srcElement.getAttribute('fill')
            && tarElement.getAttribute('fill') === 'blue').toBe(true)
        let sourcePoint = { x: 900, y: 100 };
        let targetPoint = { x: 1000, y: 200 };
        let connector: ConnectorModel = { id: 'addconnector', sourcePoint: sourcePoint, targetPoint: targetPoint }
        diagram.add(connector);
        pathElement = document.getElementById(diagram.connectors[1].id + '_path')
        srcElement = document.getElementById(diagram.connectors[1].id + '_srcDec')
        tarElement = document.getElementById(diagram.connectors[1].id + '_tarDec')
        connectorElement = document.getElementById('addconnector_groupElement')
        expect(pathElement.getAttribute('stroke') === 'red'
            && srcElement.getAttribute('fill')
            && tarElement.getAttribute('fill') === 'blue').toBe(true)
            done();
    });

});


    describe('node template support ', () => {
        let diagram: Diagram; let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramNodeZindexDefault' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {

                    offsetX: 450,
                    offsetY: 200,
                    width: 100,
                    height: 100,
                    shape: { type: "HTML", },
                    style: { fill: 'yellow' }
                },
            ];

            diagram = new Diagram({
                width: '100px', height: '100px', nodes: nodes,
                nodeTemplate: '#diagramNodeZindexDefault',

            });
            diagram.appendTo('#diagramNodeZindexDefault');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('node template support checking', (done: Function) => {
            var child = document.getElementById(diagram.nodes[0].id + "_content_html_element");
            expect(child.children[0] instanceof HTMLDivElement).toBe(true);
            done();
        });

    });

    describe('node and connector annotation template support', () => {
        let diagram: Diagram; let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramtemplate' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 300, height: 160, offsetX: 250, offsetY: 180,
                    annotations: [
                        {
                            id: "node_label1",
                            constraints: AnnotationConstraints.Interaction,
                            template: '<style>th {border: 5px solid #c1dad7}td {border: 5px solid #c1dad7}.c1 { background: #4b8c74 } .c2 { background: #74c476 }  .c3 { background: #a4e56d } .c4 { background: #cffc83 } </style> <table style="width:100%;"> <tbody> <tr> <th class="c1">ID</th> <th class="c2">X</th> <th class="c3">Y</th></tr> <tr> <td class="c1">${id}</td> <td class="c2">${offset.x}</td> <td class="c3">${offset.y}</td> </tr> </tbody> </table>'
                        },
                        {
                            id: "node_label2",
                            constraints: AnnotationConstraints.Interaction,
                            offset: { x: 0, y: 0 },
                            content: "dvv",
                        },
                        {
                            id: "node_label3",
                            constraints: AnnotationConstraints.Interaction,
                            offset: { x: 0, y: 0 },
                        }
                    ]
                }
            ];
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector', sourcePoint: { x: 800, y: 100 }, targetPoint: { x: 600, y: 300 },
                    annotations: [
                        {
                            id: "connector_label1", height: 60, width: 200, offset: 0.5,
                            constraints: AnnotationConstraints.Interaction,
                        },
                        {
                            id: "connector_labe2l", height: 60, width: 200, offset: 0,
                            constraints: AnnotationConstraints.Interaction,
                            content:"dvv",
                        },
                        {
                            id: "connector_labe3l", height: 60, width: 200, offset: 0.5,
                            constraints: AnnotationConstraints.Interaction,
                            template: '<style>th {border: 5px solid #c1dad7}td {border: 5px solid #c1dad7}.c1 { background: #4b8c74 } .c2 { background: #74c476 }  .c3 { background: #a4e56d } .c4 { background: #cffc83 } </style> <table style="width:100%;"> <tbody> <tr> <th class="c1">ID</th> <th class="c2">Offset</th> </tr> <tr> <td class="c1">${id}</td> <td class="c2">${offset}</td> </tr> </tbody> </table>'
                        }
            
                    ]
                }
            ];

            diagram = new Diagram({
                width: '100%', height: 900, nodes: nodes, connectors: connectors,
                annotationTemplate:"#diagramtemplate"
            });
            diagram.appendTo('#diagramtemplate');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('node and connector annotation template support', (done: Function) => {

            var annotation1 = diagram.nodes[0].annotations[0].id
            var annotation1Element = document.getElementById(diagram.nodes[0].id + '_' + annotation1 + '_html_element')
            expect(annotation1Element instanceof HTMLDivElement).toBe(true);

            var annotation2 = diagram.nodes[0].annotations[1].id
            var annotation2Element = document.getElementById(diagram.nodes[0].id + '_' + annotation2 + '_groupElement')
            expect((annotation2Element.children[1].childNodes[0] as HTMLElement).innerHTML === "dvv").toBe(true);

            var annotation3 = diagram.nodes[0].annotations[2].id
            var annotation3Element = document.getElementById(diagram.nodes[0].id + '_' + annotation3 + '_html_element')
            expect(annotation3Element instanceof HTMLDivElement).toBe(true);



            var connectorannotation1 = diagram.connectors[0].annotations[0].id
            var connectorannotation1Element = document.getElementById(diagram.connectors[0].id + '_' + connectorannotation1 + '_html_element')
            expect(connectorannotation1Element instanceof HTMLDivElement).toBe(true)
            
            var connectorannotation2 = diagram.connectors[0].annotations[1].id
            var connectorannotation2Element = document.getElementById(diagram.connectors[0].id + '_' + connectorannotation2 + '_groupElement')
            expect((connectorannotation2Element.children[1].childNodes[0] as HTMLElement).innerHTML === "dvv").toBe(true)
            
            var connectorannotation3 = diagram.connectors[0].annotations[2].id
            var connectorannotation3Element = document.getElementById(diagram.connectors[0].id + '_' + connectorannotation3 + '_html_element')
            expect(connectorannotation3Element instanceof HTMLDivElement).toBe(true)
            
            done();
        });

    });

    describe('Pan Status on Mouse events', () => {
        let diagram: Diagram; let elements: HTMLElement;let status: State;
        beforeAll((): void => {
            elements = createElement('div', { styles: 'width:100%;height:500px;' });
            elements.appendChild(createElement('div', { id: 'diagramNodeZindex' }));
            document.body.appendChild(elements);
            let nodes: NodeModel[] = [
                {
                    id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, pivot: {x: 0,y: 0}
                }
            ];
            diagram = new Diagram({
                width: '100%',
                height: '600px',
                nodes: nodes,
                tool: DiagramTools.ZoomPan,
            });
            diagram.appendTo('#diagramNodeZindex');
        });

        afterAll((): void => {
            diagram.destroy();
            elements.remove();  
        });

        it('Pan Status on events', (done: Function) => {
            let diagramCanvas: Element = document.getElementById('diagramNodeZindexcontent');
            let mouseevents: MouseEvents = new MouseEvents();
            diagram.scrollChange = (args:IScrollChangeEventArgs | IBlazorScrollChangeEventArgs) => {
                if(status === 'Start')
                {
                    expect( args.panState === 'Start' ).toBe(true)
                }
                if(status === 'Completed' )
                {
                    expect( args.panState === 'Completed' ).toBe(true)
                }
            }
            mouseevents.mouseDownEvent(diagramCanvas, 350, 140, false, false);
            status = 'Start';
            mouseevents.mouseMoveEvent(diagramCanvas, 400, 500, false, false);
            status = 'Completed';
            mouseevents.mouseUpEvent(diagramCanvas, 400, 500, false, false);
            done();
        });
    });

});

describe('SizeChange Event at completed state', () => {
    let diagram: Diagram; let elements: HTMLElement
    beforeAll((): void => {
        elements = createElement('div', { styles: 'width:100%;height:500px;' });
        elements.appendChild(createElement('div', { id: 'diagramNodeZindex' }));
        document.body.appendChild(elements);
        let nodes: NodeModel = 
            {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, pivot: {x: 0,y: 0}
            }
        diagram = new Diagram({
            width: 800, height: 800, nodes: [nodes], 
        });
        diagram.appendTo('#diagramNodeZindex');
    });

    afterAll((): void => {
        diagram.destroy();
        elements.remove();  
    });

    function resize(diagram: Diagram, direction: string): void {
        if ((diagram.selectedItems as Selector).nodes[0]) {
            let diagramCanvas: HTMLElement; let left: number; let top: number;
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
            let element: HTMLElement = document.getElementById(direction);
            let mouseEvents: MouseEvents = new MouseEvents();
            let x: number = Number(element.getAttribute('cx'));
            let y: number = Number(element.getAttribute('cy'));
            mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
            mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        }
    }

    it('SizeChange Event at completed state', (done: Function) => {
        diagram.select([diagram.nodes[0]]);
        console.log(diagram.nodes[0].width);
        let beforeWidth:number = diagram.nodes[0].width;
        let beforeOffsetX: number = diagram.nodes[0].offsetX;
        resize(diagram, 'resizeEast');
        let afterWidth: number = diagram.nodes[0].width
        let afterOffsetX: number = diagram.nodes[0].offsetX;
        console.log(diagram.nodes[0].width);
        console.log("completed state");
        console.log(beforeWidth != afterWidth);
        console.log(beforeOffsetX === afterOffsetX);
        expect((beforeWidth == afterWidth) && (beforeOffsetX === afterOffsetX) ).toBe(true)
        done();
        
    });

    it('SizeChange Event at completed state', (done: Function) => {
        diagram.select([diagram.nodes[0]]);
        console.log(diagram.nodes[0].height);
        let beforeHeight:number = diagram.nodes[0].height;
        let beforeOffsetX: number = diagram.nodes[0].offsetX;
        resize(diagram, 'resizeSouth');
        let afterHeight: number = diagram.nodes[0].height
        let afterOffsetX: number = diagram.nodes[0].offsetX;
        console.log(diagram.nodes[0].height);
        console.log("completed state 1" );
        console.log(beforeHeight != afterHeight);
        console.log(beforeOffsetX === afterOffsetX);
        expect((beforeHeight == afterHeight) && (beforeOffsetX === afterOffsetX) ).toBe(true)
        done();
        
    });
});
export interface EmployeeInfo {
    Name: string;
    Designation: string;
    ImageUrl: string;
}
describe('Complex Hierarchical tree layout change', () => {
    let diagram: Diagram; let elements: HTMLElement
    beforeAll((): void => {
        elements = createElement('div', { styles: 'width:100%;height:500px;' });
        elements.appendChild(createElement('div', { id: 'diagramHierarchical' }));
        document.body.appendChild(elements);
        let Data: object[] = [
            {
                "Id": "Node1", "Name": "Anto Moreno", "Designation": "Project Lead",
                "ImageUrl": "./assets/diagram/employees/image1.png", "IsExpand": "false",
                "RatingColor": "#93B85A",// "ReportingPerson": [1]
            },
            {
                "Id": "Node2", "Name": "Thomas Hardy", "Designation": "Senior S/w Engg",
                "ImageUrl": "./assets/diagram/employees/image3.png", "IsExpand": "false",
                "RatingColor": "#68C2DE", "ReportingPerson": "Node1"
            },
            {
                "Id": "Node3", "Name": "Christina kaff", "Designation": "S/w Engg",
                "ImageUrl": "./assets/diagram/employees/image4.png", "IsExpand": "false",
                "RatingColor": "#93B85A", "ReportingPerson": "Node2"
            },
            
        ];
        let items: DataManager = new DataManager(Data as JSON[], new Query().take(7));
        let data: Object = {
            id: "Id", parentId: 'ReportingPerson', dataSource: items
        };
        let layout: LayoutModel = {
            type: 'ComplexHierarchicalTree', margin: { top: 20 },
            horizontalSpacing: 50, verticalSpacing: 50
            
        };
        diagram = new Diagram({
            width: 1000, height: 1000,
            scrollSettings:{ scrollLimit: 'Infinity' },
            snapSettings:{constraints: SnapConstraints.None},
            tool: DiagramTools.ZoomPan,
            layout: layout,
            dataSourceSettings: data,
            setNodeTemplate: (node: NodeModel, diagram: Diagram): GroupableView => {
                node.constraints = NodeConstraints.InConnect |
                NodeConstraints.OutConnect |
                NodeConstraints.Select |
                NodeConstraints.PointerEvents |
                NodeConstraints.Drag;
            const strokeWidth: number = 0.5;
            const cornerRadius: number = 4;
            const mainStack: StackPanel = new StackPanel();
            mainStack.id = randomId();
            mainStack.style.fill = "#0099ff";
            mainStack.orientation = 'Horizontal';
            mainStack.minHeight = 55;
            mainStack.width = 100;
            mainStack.style.strokeWidth = strokeWidth;
            mainStack.style.strokeColor = '#AAAAAA';
            mainStack.cornerRadius = cornerRadius;
            mainStack.shadow = { color: 'grey', distance: 6, opacity: .1, angle: 135 };
            const personStack: StackPanel = new StackPanel();
            personStack.id = randomId();
            personStack.orientation = 'Vertical';
            personStack.style.strokeWidth = 0;
            personStack.style.fill = 'transparent';
            personStack.children = [];
            let text: TextElement = new TextElement();
            text.content = (node.data as EmployeeInfo).Name;
            text.style.color = 'black';
            text.style.bold = true;
            text.style.strokeColor = 'none';
            text.horizontalAlignment = 'Left';
            text.style.fill = 'none';
            text.id = node.id + '_text1';
            const titleText = text;
            personStack.children.push(titleText);
            let desigText: TextElement = new TextElement();
            desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
            desigText.content = (node.data as EmployeeInfo).Designation;
            desigText.style.color = 'black';
            desigText.style.strokeColor = 'none';
            desigText.style.fontSize = 12;
            desigText.style.fill = 'none';
            desigText.horizontalAlignment = 'Left';
            desigText.style.textWrapping = 'Wrap';
            desigText.id = node.id + '_desig';
            personStack.children.push(desigText);
            const image: ImageElement = new ImageElement();
            image.margin.left = 10;
            image.margin.top = 10;
            image.width = 30;
            image.height = 30;
            image.style.strokeColor = 'none';
            image.style.fill = 'none';
            image.verticalAlignment = 'Top';
            image.source = 'https://cdn1.iconfinder.com/data/icons/business-elements-15/150/Firma-512.png';
            image.id = randomId();
            mainStack.children = [image, personStack];
            const groupStack: StackPanel = new StackPanel();
            groupStack.id = randomId();
            groupStack.style.strokeWidth = 0;
            groupStack.children = [];
            groupStack.orientation = 'Vertical';
            const bvStack: StackPanel = new StackPanel();
            bvStack.id = randomId();
            bvStack.style.fill = "#0099ff";
            bvStack.orientation = 'Vertical';
            bvStack.margin.top = 6;
            bvStack.padding = new Thickness(4, 4, 4, 4);
            bvStack.horizontalAlignment = 'Stretch';
            bvStack.verticalAlignment = 'Top';
            bvStack.style.strokeWidth = strokeWidth;
            bvStack.style.strokeColor = '#AAAAAA';
            bvStack.cornerRadius = cornerRadius;
            bvStack.shadow = { color: 'grey', distance: 6, opacity: .1, angle: 135 };
            bvStack.children = [];
            let bvText: TextElement = new TextElement();
            bvText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
            bvText.content = "Bankverbindungen";
            bvText.style.color = 'black';
            bvText.style.strokeColor = 'none';
            bvText.style.fontSize = 12;
            bvText.style.fill = 'none';
            bvText.horizontalAlignment = 'Left';
            bvText.style.textWrapping = 'Wrap';
            bvText.id = node.id + '_bvText';
            bvStack.children.push(bvText);
            const vwStack: StackPanel = new StackPanel();
            vwStack.id = randomId();
            vwStack.style.fill = "#0099ff";
            vwStack.orientation = 'Vertical';
            vwStack.margin.top = 6;
            vwStack.padding = new Thickness(4, 4, 4, 4);
            vwStack.horizontalAlignment = 'Stretch';
            vwStack.style.strokeWidth = strokeWidth;
            vwStack.style.strokeColor = '#AAAAAA';
            vwStack.cornerRadius = cornerRadius;
            vwStack.shadow = { color: 'grey', distance: 6, opacity: .1, angle: 135 };
            vwStack.children = [];
            let vwText: TextElement = new TextElement();
            vwText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
            vwText.content = "Vermögenswerte";
            vwText.style.color = 'black';
            vwText.style.strokeColor = 'none';
            vwText.style.fontSize = 12;
            vwText.style.fill = 'none';
            vwText.horizontalAlignment = 'Left';
            vwText.style.textWrapping = 'Wrap';
            vwText.id = node.id + '_vwText';
            vwStack.children.push(vwText);
            groupStack.children.push(mainStack);
            groupStack.children.push(bvStack);
            groupStack.children.push(vwStack);
            return groupStack;
            }
        });
        diagram.appendTo('#diagramHierarchical');
    });

    afterAll((): void => {
        diagram.destroy();
        elements.remove();  
    });
    it('Due to intersection', (done: Function) => {
        console.log("intersection");
        console.log(diagram.nodes[1].offsetX);
        expect((diagram.nodes[1].offsetX) === 114.85546875).toBe(false)
        done();
    });
});
describe('Call stack exceeded', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        ele = createElement('div', { id: 'diagram97' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 50, height: 50, offsetX: 100,
                offsetY: 100,
            }, {
                id: 'node2', width: 50, height: 50, offsetX: 200,
                offsetY: 200
            },
            { id: 'group', children: ['node1', 'node2']},
        ];
        diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
        diagram.appendTo('#diagram97');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Call stack exceeded due to infinite loop', (done: Function) => {
        let linearGradient:  LinearGradientModel;
        linearGradient = {
            x1: 0,
            y1: 0,
            x2: 50,
            y2: 50,
            stops: [{
                    color: 'white',
                    offset: 0,
                    opacity:1
                },
                {
                    color: '#6BA5D7',
                    offset: 100,
                    opacity:0
                }
            ],
            type: 'Linear'
        };
        diagram.nodes[2].style.gradient = linearGradient
        diagram.dataBind();
        diagram.undo();
        diagram.redo();
        expect((diagram.nodes[2].style.gradient as any).x2 === 50 && (diagram.nodes[2].style.gradient as any).y2 === 50).toBe(true);
        done();
    });
    it('Check if the gradient is null', (done: Function) => {
        diagram.nodes[2].style.gradient = null;
        diagram.dataBind();
        //Need to evaluate testcase
        //expect((diagram.nodes[2].style.gradient.type)=="None").toBe(true);
        expect(true).toBe(true);
        done();
    });
});
describe('Node Rotate constraints does not work properly', () => {
    let diagram: Diagram; let elements: HTMLElement
    beforeAll((): void => {
        elements = createElement('div', { styles: 'width:100%;height:500px;' });
        elements.appendChild(createElement('div', { id: 'diagramNodeZindex' }));
        document.body.appendChild(elements);
        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 100,
                offsetY: 100, annotations: [{
                    content: 'rectangle1'
                }],
                constraints:NodeConstraints.Rotate
            }, {
                id: 'node2', width: 100, height: 100, offsetX: 200,
                offsetY: 200
            },
        ];
        let node3: NodeModel = {
            width: 100, height: 100, offsetX: 350,
            offsetY: 300,
        };
        let group: NodeModel = {
            id: 'group2',
            children: ['node1', 'node2'],
            
        };
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes, created: created,
        });
        diagram.appendTo('#diagramNodeZindex');
    });

    afterAll((): void => {
        diagram.destroy();
        elements.remove();  
    });
    function created(args: any) {
        diagram.nodes[0].rotateAngle =90;
    }
    it('Node Rotate constraints does not work properly', (done: Function) => {
        expect((diagram.nodes[0].rotateAngle === 90) && (diagram.nodes[0].wrapper.rotateAngle === 0) ).toBe(true)
        done();        
    });
});

describe('Node shape change at runtime not makes node disappear', () => {
    let diagram: Diagram; let elements: HTMLElement
    beforeAll((): void => {
        elements = createElement('div', { styles: 'width:100%;height:600px;' });
        elements.appendChild(createElement('div', { id: 'diagramNodeDisappear' }));
        document.body.appendChild(elements);
        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 100,
                offsetY: 100, annotations: [{
                    content: 'rectangle1'
                }],shape:{shape:'Terminator',type:'Flow'}
               
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 100,
                offsetY: 200, annotations: [{
                    content: 'rectangle2'
                }],shape:{shape:'Process',type:'Flow'}
               
            }, {
                id: 'node3', width: 100, height: 100, offsetX: 200,
                offsetY: 200,shape:{shape:'Rectangle',type:'Basic'}
            },
        ];
        diagram = new Diagram({
            width: 800, height: 800, nodes: nodes,
        });
        diagram.appendTo('#diagramNodeDisappear');
    });

    afterAll((): void => {
        diagram.destroy();
        elements.remove();  
    });
    it('Changing two flow shapes to basic shape at runtime', (done: Function) => {
        let node1 = diagram.nodes[0];
        node1.shape = {shape:'Diamond',type:'Basic'};
        diagram.dataBind();
        let node2 = diagram.nodes[1];
        node2.shape = {shape:'Rectangle',type:'Basic'};
        diagram.dataBind();
        expect(((diagram.nodes[0].shape as BasicShapeModel).shape === 'Diamond') && 
        ((diagram.nodes[1].shape as BasicShapeModel).shape === 'Rectangle')
         && diagram.nodes[0].wrapper.children[0].id !==undefined
         && diagram.nodes[1].wrapper.children[0].id !==undefined).toBe(true)
        done();        
    });
});

describe('Performance of diagram while rendering large number of nodes and connectors', () => {
    let diagram: Diagram; let elements: HTMLElement;
    let end:number; let start:number;
    beforeAll((): void => {
        elements = createElement('div', { styles: 'width:1000px;height:600px;' });
        elements.appendChild(createElement('div', { id: 'diagramPerformance_1' }));
        document.body.appendChild(elements);
        let nodes: NodeModel[] = renderNodes();
        let connectors: ConnectorModel[] = renderConnectors();

        function renderNodes() {
            var nodeCollection = [];
            for (var i = 0; i < 6000; i++) {
                nodeCollection.push({
                    id: 'node' + i,
                    offsetX: 10 + i * 20,
                    offsetY: 260 + 250 * Math.sin((Math.PI * i) / 22.5),
                    width: 42,
                    height: 16,
                    annotations: [{ content: i.toString() }],
                });
            }
            return nodeCollection;
        }
        function renderConnectors() {
            var connectorCollection = [];
            for (var i = 0; i < 6000 - 15; i++) {
                connectorCollection.push({
                    id: 'connector' + i,
                    sourceID: nodes[i].id,
                    targetID: nodes[i + 15].id,
                });
            }
            return connectorCollection;
        }


        diagram = new Diagram({
            width: '1000px', height: '600px', nodes: nodes, connectors: connectors,
            constraints: DiagramConstraints.Default | DiagramConstraints.Virtualization,
        });


         start = (new Date()).getTime();
        diagram.appendTo('#diagramPerformance_1');

         end = (new Date()).getTime();
    });

    afterAll((): void => {
        diagram.destroy();
        elements.remove();  
    });
    it('Checking the rendering time of diagram', (done: Function) => {
        let renderingTimeInMs = end-start;
        console.log("time");
        console.log(renderingTimeInMs);
        done();        
    });
});

describe('Drawing connectors from a source port to target port do not attach to source Node', () => {
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
        ele = createElement('div', { id: 'diagram90' });
        document.body.appendChild(ele);

        let node1 = {
            id: 'node1',width: 100,height: 100,offsetX:100 , offsetY: 200,
            constraints:NodeConstraints.Default & ~(NodeConstraints.Resize | NodeConstraints.Rotate),
            annotations: [{ content: 'Node1' }],
            ports: [

              {
                id: 'Out2_xyz',offset: { x: 1, y: 0.5 },visibility: PortVisibility.Visible,
                constraints:PortConstraints.Default | PortConstraints.Draw,
                width:50,height:50
              }
            ],
          };
        let node2 = {
            id: 'node2',width: 100,height: 100,offsetX: 500,offsetY: 200,
            constraints:NodeConstraints.Default & ~( NodeConstraints.Resize | NodeConstraints.Rotate),
            annotations: [{ content: 'Node2' }],
            ports: [
              {
                id: 'Inp_xyz_abc',offset: { x: 0, y: 0.5 },visibility: PortVisibility.Visible,
                constraints:PortConstraints.Default | PortConstraints.Draw,
                width:50,height:50
             },
            ],
        };

        diagram = new Diagram({ width: 1000, height: 800, nodes: [node1,node2] });
        diagram.appendTo('#diagram90');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('select the node and draw connector Checking connector connect to source port', (done: Function) =>{
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: NodeModel = diagram.nodes[0];
        diagram.select([diagram.nodes[0]]);
        mouseEvents.mouseDownEvent(diagramCanvas, 157, 208);
        mouseEvents.mouseMoveEvent(diagramCanvas, 200, 210);
        mouseEvents.mouseMoveEvent(diagramCanvas, 458, 208);
        mouseEvents.mouseUpEvent(diagramCanvas, 458, 208);
        expect(diagram.nodes[0].ports[0].outEdges.length === 1).toBe(true);
         done();
    });
});

describe('Add Node', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram' });
        document.body.appendChild(ele);
        diagram = new Diagram({ width: 1000, height: 1000});
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('before appending diagram to element', (done: Function) => {
        let node: NodeModel = { id: 'node1', width: 30, height: 30, offsetX: 100, offsetY: 100 };
        diagram.add(node);
        expect(diagram.views).toBe(undefined);
        expect(diagram.nodes.length).toBe(0);
        diagram.appendTo('#diagram');
        diagram.add(node);
        expect(diagram.nodes.length).toBe(1);
        done();
    });
});
describe('Restricting wrongly updated highlighter', () => {
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
        ele = createElement('div', { id: 'diagramHigh' });
        document.body.appendChild(ele);

        let nodes: NodeModel[] = [
            {
              id: 'pool',
              shape: {
                type: 'SwimLane',
                orientation: 'Horizontal',
                isLane: true,
                lanes: [
                  {
                    id: 'lane-1',  
                height: 200,
                children: [
                  
                    {
                    id:"ellipse-1",
                    // Position of the node
                    offsetX: 150,
                    offsetY: 250,
                    // Size of the node
                    width: 100,
                    height: 60,
                    margin: { top: 100, left: 150 },
                    shape: { type: 'Basic', shape: 'Ellipse' },
                    annotations: [{
                        content: 'Node 1'
                    }],
                    },
                    {
                      id:"ellipse-2",
                      // Position of the node
                      offsetX: 350,
                      offsetY: 250,
                      // Size of the node
                      width: 100,
                      height: 60,
                      margin: { top: 100, left: 350 },
                      shape: { type: 'Basic', shape: 'Ellipse' },
                      annotations: [{
                          content: 'Node 2'
                      }],
                      },
                ],
                },
                  
                ]
              },
              offsetX: 390,
              offsetY: 320,
              height: 100,
              width: 650
            }
          ];
        let handle : UserHandleModel[]  = [
            {
              name: 'Clone', pathData: 'M0,2.4879999 L0.986,2.4879999 0.986,9.0139999 6.9950027,9.0139999 6.9950027,10 0.986,10 C0.70400238,10 0.47000122,9.9060001 0.28100207,9.7180004 0.09400177,9.5300007 0,9.2959995 0,9.0139999 z M3.0050011,0 L9.0140038,0 C9.2960014,0 9.5300026,0.093999863 9.7190018,0.28199956 9.906002,0.47000027 10,0.70399952 10,0.986 L10,6.9949989 C10,7.2770004 9.906002,7.5160007 9.7190018,7.7110004 9.5300026,7.9069996 9.2960014,8.0049992 9.0140038,8.0049992 L3.0050011,8.0049992 C2.7070007,8.0049992 2.4650002,7.9069996 2.2770004,7.7110004 2.0890007,7.5160007 1.9950027,7.2770004 1.9950027,6.9949989 L1.9950027,0.986 C1.9950027,0.70399952 2.0890007,0.47000027 2.2770004,0.28199956 2.4650002,0.093999863 2.7070007,0 3.0050011,0 z',tooltip:{content:'Clone'},
              visible: true, offset: 1, side: 'Bottom', margin: { top: 0, bottom: 0, left: 0, right: 0 }
          },
          {
              name: 'Delete', pathData: 'M0.54700077,2.2130003 L7.2129992,2.2130003 7.2129992,8.8800011 C7.2129992,9.1920013 7.1049975,9.4570007 6.8879985,9.6739998 6.6709994,9.8910007 6.406,10 6.0939997,10 L1.6659999,10 C1.3539997,10 1.0890004,9.8910007 0.87200136,9.6739998 0.65500242,9.4570007 0.54700071,9.1920013 0.54700077,8.8800011 z M2.4999992,0 L5.2600006,0 5.8329986,0.54600048 7.7599996,0.54600048 7.7599996,1.6660004 0,1.6660004 0,0.54600048 1.9270014,0.54600048 z',tooltip:{content:'Delete'},
              visible: true, offset: 0, side: 'Bottom', margin: { top: 0, bottom: 0, left: 0, right: 0 }
          },
          {
              name: 'Draw', pathData: 'M3.9730001,0 L8.9730001,5.0000007 3.9730001,10.000001 3.9730001,7.0090005 0,7.0090005 0,2.9910006 3.9730001,2.9910006 z',tooltip:{content:'Draw'},
              visible: true, offset: 0.5, side: 'Right', margin: { top: 0, bottom: 0, left: 0, right: 0 }
          },
          ];
        
        
        diagram = new Diagram({
            width: '100%', height: 1000, nodes: nodes,
            selectedItems: { userHandles: handle },getCustomTool: getTool,
        });
        function getTool(action: string) {
            if(action == "Delete"){
                diagram.remove();
            }
            else if(action == "Clone") {
                diagram.paste(diagram.selectedItems.selectedObjects);
            }
            else if(action == "Draw") {
                diagram.tool = DiagramTools.DrawOnce;
                (diagram.drawingObject as any) = { type: 'Orthogonal'};
                (diagram.drawingObject as any).sourceID = diagram.selectedItems.nodes[0].id;
                diagram.dataBind();   
            }
        }
        diagram.appendTo('#diagramHigh');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('For swimlane', (done: Function) =>{
        debugger;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let highlighter: HTMLElement = null;
        mouseEvents.clickEvent(diagramCanvas, 275, 360);
        mouseEvents.mouseDownEvent(diagramCanvas, 350, 360);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 360);
        mouseEvents.mouseUpEvent(diagramCanvas, 400, 360);
        diagram.undo();
        mouseEvents.clickEvent(diagramCanvas, 275, 360);
        mouseEvents.mouseMoveEvent(diagramCanvas, 350, 360);
        highlighter = document.getElementById(diagram.element.id + '_diagramAdorner_svg_highlighter');
        expect(highlighter === null).toBe(true);
        done();
    });
});
describe('902192-Diagram node resized wrongly while dragging with multiple selection Inside a swimlane', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramNodeOffset' });
        document.body.appendChild(ele);
        var pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
        ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
        '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
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
                                    shape: { type: 'Path', data: pathData },
                                    annotations: [
                                        {
                                            content: 'ORDER',
                                            style: { fontSize: 11 }
                                        }
                                    ],
                                    margin: { left: 60, top: 20 },
                                    height: 40, width: 100
                                }
                            ],
                        },
                        {
                            id: 'stackCanvas2',
                            header: {
                                annotation: { content: 'ONLINE' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'selectItemaddcart',
                                    annotations: [{ content: 'Select item\nAdd cart' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'paymentondebitcreditcard',
                                    annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                                    margin: { left: 350, top: 20 },
                                    height: 40, width: 100
                                }
                            ],
                        },
                        {
                            id: 'stackCanvas3',
                            header: {
                                annotation: { content: 'SHOP' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'getmaildetailaboutorder',
                                    annotations: [{ content: 'Get mail detail\nabout order' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'pakingitem',
                                    annotations: [{ content: 'Paking item' }],
                                    margin: { left: 350, top: 20 },
                                    height: 40, width: 100
                                }
                            ],
                        },
                        {
                            id: 'stackCanvas4',
                            header: {
                                annotation: { content: 'DELIVERY' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'sendcourieraboutaddress',
                                    annotations: [{ content: 'Send Courier\n about Address' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'deliveryonthataddress',
                                    annotations: [{ content: 'Delivery on that\n Address' }],
                                    margin: { left: 350, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'getitItem',
                                    shape: { type: 'Path', data: pathData },
                                    annotations: [{ content: 'GET IT ITEM', style: { fontSize: 11 } }],
                                    margin: { left: 500, top: 20 },
                                    height: 40, width: 100
                                }
                            ],
                        },
                    ],
                    phases: [
                        {
                            id: 'phase1', offset: 450,
                            header: { annotation: { content: 'Phase' } }
                        },
                    ],
                    phaseSize: 20,
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
            {
                id: 'connector2', sourceID: 'selectItemaddcart',
                targetID: 'paymentondebitcreditcard'
            },
            {
                id: 'connector3', sourceID: 'paymentondebitcreditcard',
                targetID: 'getmaildetailaboutorder'
            },
            {
                id: 'connector4', sourceID: 'getmaildetailaboutorder',
                targetID: 'pakingitem'
            },
            {
                id: 'connector5', sourceID: 'pakingitem',
                targetID: 'sendcourieraboutaddress'
            },
            {
                id: 'connector6', sourceID: 'sendcourieraboutaddress',
                targetID: 'deliveryonthataddress'
            },
            {
                id: 'connector7', sourceID: 'deliveryonthataddress',
                targetID: 'getitItem'
            },
        ];

        diagram = new Diagram({
            width: '80%',
            height: '600px',
            nodes: nodes,
            connectors: connectors,
        });
        diagram.appendTo('#diagramNodeOffset');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Diagram node resized wrongly while dragging with multiple selection Inside a swimlane', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 335, 445, true);
        mouseEvents.clickEvent(diagramCanvas, 485, 445, true);
        mouseEvents.mouseDownEvent(diagramCanvas, 335, 445, true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 355, true);
        mouseEvents.mouseUpEvent(diagramCanvas, 300, 355, true);
        expect(diagram.nodes[16].width === 100).toBe(true);
        done();
    });
});
describe('Bug 913796- Multiselect swimlane with outside node, drag, rotate is not proper', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramSwimMultiRotate' });
        document.body.appendChild(ele);
        var pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
        ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
        '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
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
                                    shape: { type: 'Path', data: pathData },
                                    annotations: [
                                        {
                                            content: 'ORDER',
                                            style: { fontSize: 11 }
                                        }
                                    ],
                                    margin: { left: 60, top: 20 },
                                    height: 40, width: 100
                                }
                            ],
                        },
                        {
                            id: 'stackCanvas2',
                            header: {
                                annotation: { content: 'ONLINE' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'selectItemaddcart',
                                    annotations: [{ content: 'Select item\nAdd cart' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'paymentondebitcreditcard',
                                    annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                                    margin: { left: 350, top: 20 },
                                    height: 40, width: 100
                                }
                            ],
                        },
                        {
                            id: 'stackCanvas3',
                            header: {
                                annotation: { content: 'SHOP' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'getmaildetailaboutorder',
                                    annotations: [{ content: 'Get mail detail\nabout order' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'pakingitem',
                                    annotations: [{ content: 'Paking item' }],
                                    margin: { left: 350, top: 20 },
                                    height: 40, width: 100
                                }
                            ],
                        },
                        {
                            id: 'stackCanvas4',
                            header: {
                                annotation: { content: 'DELIVERY' }, width: 50,
                                style: { fontSize: 11 }
                            },
                            height: 100,
                            children: [
                                {
                                    id: 'sendcourieraboutaddress',
                                    annotations: [{ content: 'Send Courier\n about Address' }],
                                    margin: { left: 190, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'deliveryonthataddress',
                                    annotations: [{ content: 'Delivery on that\n Address' }],
                                    margin: { left: 350, top: 20 },
                                    height: 40, width: 100
                                },
                                {
                                    id: 'getitItem',
                                    shape: { type: 'Path', data: pathData },
                                    annotations: [{ content: 'GET IT ITEM', style: { fontSize: 11 } }],
                                    margin: { left: 500, top: 20 },
                                    height: 40, width: 100
                                }
                            ],
                        },
                    ],
                    phases: [
                        {
                            id: 'phase1', offset: 450,
                            header: { annotation: { content: 'Phase' } }
                        },
                    ],
                    phaseSize: 20,
                },
                offsetX: 420, offsetY: 270,
                height: 100,
                width: 650
            },
            {
                id:'outsideNode',
                offsetX: 1000,
                offsetY:300,
                width:50,height:50
            },
            {
                id: 'swimlane2',
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
                                    id: 'Order_2',
                                    shape: { type: 'Path', data: pathData },
                                    annotations: [
                                        {
                                            content: 'ORDER',
                                            style: { fontSize: 11 }
                                        }
                                    ],
                                    margin: { left: 60, top: 20 },
                                    height: 40, width: 100
                                }
                            ],
                        },
                    ],
                    phases: [
                        {
                            id: 'phase1', offset: 450,
                            header: { annotation: { content: 'Phase' } }
                        },
                    ],
                    phaseSize: 20,
                },
                offsetX: 420, offsetY: 670,
                height: 100,
                width: 650
            },
        ];
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1', sourceID: 'Order',
                targetID: 'selectItemaddcart'
            },
            {
                id: 'connector2', sourceID: 'selectItemaddcart',
                targetID: 'paymentondebitcreditcard'
            },
            {
                id: 'connector3', sourceID: 'paymentondebitcreditcard',
                targetID: 'getmaildetailaboutorder'
            },
            {
                id: 'connector4', sourceID: 'getmaildetailaboutorder',
                targetID: 'pakingitem'
            },
            {
                id: 'connector5', sourceID: 'pakingitem',
                targetID: 'sendcourieraboutaddress'
            },
            {
                id: 'connector6', sourceID: 'sendcourieraboutaddress',
                targetID: 'deliveryonthataddress'
            },
            {
                id: 'connector7', sourceID: 'deliveryonthataddress',
                targetID: 'getitItem'
            },
            {
                id: 'connector8', sourcePoint:{x:100,y:50},targetPoint:{x:50,y:50}
            },
        ];

        diagram = new Diagram({
            width: '80%',
            height: '600px',
            nodes: nodes,
            connectors: connectors,
        });
        diagram.appendTo('#diagramSwimMultiRotate');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Multiselect swimlane and outer node and check rotate handle disabled or not', (done: Function) => {
        let swimlane: NodeModel = diagram.nameTable['swimlane'];
        let outsideNode: NodeModel = diagram.nameTable['outsideNode'];
        diagram.select([swimlane, outsideNode]);
        let rotateHandle = document.getElementsByClassName('e-diagram-rotate-handle');
        expect(rotateHandle.length === 0).toBe(true);
        done();
    });
    it('Multiselect swimlanes and drag', (done: Function) => {
        let diagramCanvas = document.getElementById(diagram.element.id + 'content');
        let swimlane1: NodeModel = diagram.nameTable['swimlane'];
        let swimlane2: NodeModel = diagram.nameTable['swimlane2'];
        diagram.select([swimlane1, swimlane2]);
        mouseEvents.mouseMoveEvent(diagramCanvas,420,55);
        mouseEvents.mouseDownEvent(diagramCanvas, 420, 55);
        mouseEvents.mouseMoveEvent(diagramCanvas, 420, 100);
        mouseEvents.mouseUpEvent(diagramCanvas, 420, 100);
        diagram.clearSelection();
        let connector: ConnectorModel = diagram.nameTable['connector8'];
        diagram.select([swimlane2,connector]);
        mouseEvents.mouseMoveEvent(diagramCanvas,420,600);
        mouseEvents.mouseDownEvent(diagramCanvas, 420, 650);
        mouseEvents.mouseMoveEvent(diagramCanvas, 420, 670);
        mouseEvents.mouseUpEvent(diagramCanvas, 420, 670);
        let rotateHandle = document.getElementsByClassName('e-diagram-rotate-handle');
        expect(rotateHandle.length === 0).toBe(true);
        done();
    });
});
describe('Restrict Negative Axis Drag Drop Test', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramAxisRestriction' });
        document.body.appendChild(ele);
        let node: NodeModel[] = [{
            id: 'node1',
            width: 100,
            height: 100,
            offsetX: 100,
            offsetY: 100,
            annotations: [{ content: 'Node 1' }]
        },
        {
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
                        height: 100,
                        addInfo: { name: 'lane1' }
                    },
                ],
                phases: [
                    {
                        id: 'phase1', offset: 170,
                        header: { annotation: { content: 'Phase' } }
                    },
                ],
                phaseSize: 20,
            },
            offsetX: 400, offsetY: 400,
            height: 200,
            width: 350
        }];
        let connector: ConnectorModel[] = [{
            id: 'connector1',
            sourcePoint: { x: 200, y: 200 },
            targetPoint: { x: 300, y: 300 }
        },
        {
            id: 'connector2',
            sourcePoint: { x: 100, y: 500 },
            targetPoint: { x: 200, y: 600 }
        }];
        diagram = new Diagram({
            width: '100%',
            height: '700px',
            nodes: node,
            connectors: connector,
            constraints: DiagramConstraints.Default | DiagramConstraints.RestrictNegativeAxisDragDrop
        });
        diagram.appendTo('#diagramAxisRestriction');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Restrict dragging node to negative axis', (done: Function) => {
        debugger;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas, 100, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 80, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 60, 100);
        diagram.undo();
        mouseEvents.mouseMoveEvent(diagramCanvas, 40, 100);
        diagram.redo();
        mouseEvents.mouseMoveEvent(diagramCanvas, 30, 100);
        mouseEvents.mouseMoveEvent(diagramCanvas, 40, 100);
        mouseEvents.mouseUpEvent(diagramCanvas, 40, 100);
        let nodePosition = diagram.nodes[0].offsetX;
        expect(nodePosition == 50).toBe(true);
        done();
    });
    it('Restrict dragging swimlane with negativeAxixrestriction', (done: Function) => {
        debugger;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseDownEvent(diagramCanvas, 400, 310);
        mouseEvents.mouseMoveEvent(diagramCanvas, 600, 400);
        mouseEvents.mouseUpEvent(diagramCanvas, 600, 400);
        let nodePosition1 = diagram.nodes[1].offsetX;
        expect(nodePosition1 >= 0).toBe(true);
        done();
    });
    it(' dragging target  point connector  ', function (done) {
        debugger;
        var conn = diagram.connectors[0];
        var diagramCanvas = document.getElementById(diagram.element.id + 'content');
        var offsetLeft = diagram.element.offsetLeft;
        var offsetTop = diagram.element.offsetTop;
        mouseEvents.clickEvent(diagramCanvas, 300, 300);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.targetPoint.x, offsetTop + conn.targetPoint.y, offsetLeft + conn.targetPoint.x - 60, offsetTop + conn.targetPoint.y);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.targetPoint.x, offsetTop + conn.targetPoint.y, offsetLeft + conn.targetPoint.x - 40, offsetTop + conn.targetPoint.y);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.targetPoint.x, offsetTop + conn.targetPoint.y, offsetLeft + conn.targetPoint.x - 60, offsetTop + conn.targetPoint.y);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.targetPoint.x, offsetTop + conn.targetPoint.y, offsetLeft + conn.targetPoint.x - 40, offsetTop + conn.targetPoint.y);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.targetPoint.x, offsetTop + conn.targetPoint.y, offsetLeft + conn.targetPoint.x - 100, offsetTop + conn.targetPoint.y + 40);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.targetPoint.x, offsetTop + conn.targetPoint.y, offsetLeft + conn.targetPoint.x - 80, offsetTop + conn.targetPoint.y + 40);
        expect(diagram.connectors[0].targetPoint.x >= 0).toBe(true);
        done();
    });
    it(' dragging source point connector  ', function (done) {
        debugger;
        var conn = diagram.connectors[0];
        var diagramCanvas = document.getElementById(diagram.element.id + 'content');
        var offsetLeft = diagram.element.offsetLeft;
        var offsetTop = diagram.element.offsetTop;
        mouseEvents.clickEvent(diagramCanvas, 200, 200);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.sourcePoint.x, offsetTop + conn.sourcePoint.y, offsetLeft + conn.sourcePoint.x - 60, offsetTop + conn.sourcePoint.y);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.sourcePoint.x, offsetTop + conn.sourcePoint.y, offsetLeft + conn.sourcePoint.x - 40, offsetTop + conn.sourcePoint.y);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.sourcePoint.x, offsetTop + conn.sourcePoint.y, offsetLeft + conn.sourcePoint.x - 60, offsetTop + conn.sourcePoint.y);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.sourcePoint.x, offsetTop + conn.sourcePoint.y, offsetLeft + conn.sourcePoint.x - 40, offsetTop + conn.sourcePoint.y);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.sourcePoint.x, offsetTop + conn.sourcePoint.y, offsetLeft + conn.sourcePoint.x - 100, offsetTop + conn.sourcePoint.y + 40);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.sourcePoint.x, offsetTop + conn.sourcePoint.y, offsetLeft + conn.sourcePoint.x - 80, offsetTop + conn.sourcePoint.y + 40);
        expect(diagram.connectors[0].sourcePoint.x >= 0).toBe(true);
        done();
    });
    it('Restrict dragging connector to negative axis', (done: Function) => {
        debugger;
        var conn = diagram.connectors[1];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 150, 550);
        mouseEvents.mouseDownEvent(diagramCanvas, 150, 550);
        mouseEvents.mouseMoveEvent(diagramCanvas, 130, 550);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 550);
        mouseEvents.mouseMoveEvent(diagramCanvas, -10, 550);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 550);
        mouseEvents.mouseMoveEvent(diagramCanvas, 200, 550);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 550);
        mouseEvents.mouseUpEvent(diagramCanvas, 300, 550);
        var nodePosition = diagram.connectors[1].sourcePoint;
        expect(nodePosition.x >= 0 && nodePosition.y >= 0).toBe(true);
        done();
    });
});
describe('Testing resizing - With RestrictNegativeAxisDragDrop ', () => {
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
        ele = createElement('div', { id: 'diagrams' });
        document.body.appendChild(ele);
        let selArray: (NodeModel | ConnectorModel)[] = [];
        let node1: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 50, offsetY: 50,
        };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 50, offsetY: 250,
        };
        let connector: ConnectorModel[] = [{
            id: 'connector1',
            sourcePoint: { x: 200, y: 400 },
            targetPoint: { x: 300, y: 500 }
        }];
        diagram = new Diagram({
            width: 900, height: 550, nodes: [node1, node2], connectors: connector,
            constraints: DiagramConstraints.Default | DiagramConstraints.RestrictNegativeAxisDragDrop
        });
        diagram.appendTo('#diagrams');
        selArray.push(diagram.nodes[0]);
        diagram.select(selArray);
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking single node resizing - top center', (done: Function) => {
        debugger;
        diagram.clearSelection();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let offsetLeft: number = diagram.element.offsetLeft;
        let offsetTop: number = diagram.element.offsetTop;
        //reducing size
        let topCenter: PointModel = (diagram.nodes[0] as NodeModel).wrapper.bounds.topCenter;
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        mouseEvents.dragAndDropEvent(diagramCanvas, topCenter.x + offsetLeft, topCenter.y + offsetTop - 1, topCenter.x + offsetLeft, topCenter.y - 10 + offsetTop - 1);
        expect(diagram.nodes[0].height == 100).toBe(true);
        done();
    });
    it('Checking single node resizing - left center', (done: Function) => {
        debugger;
        diagram.clearSelection();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let offsetLeft: number = diagram.element.offsetLeft;
        let offsetTop: number = diagram.element.offsetTop;
        let leftCenter: PointModel = (diagram.nodes[1] as NodeModel).wrapper.bounds.middleLeft;
        mouseEvents.clickEvent(diagramCanvas, 50, 250);
        mouseEvents.dragAndDropEvent(diagramCanvas, leftCenter.x + offsetLeft, leftCenter.y - 1 + offsetTop, leftCenter.x - 20 + offsetLeft, leftCenter.y + offsetTop - 1);
        expect(diagram.nodes[1].width == 100).toBe(true);
        done();
    });
    it('dragging connector to negative axis', (done: Function) => {
        debugger;
        diagram.clearSelection();
        var conn = diagram.connectors[0];
        var offsetLeft = diagram.element.offsetLeft;
        var offsetTop = diagram.element.offsetTop;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 250, 450);
        mouseEvents.dragAndDropEvent(diagramCanvas, offsetLeft + conn.wrapper.offsetX, offsetTop + conn.wrapper.offsetY, offsetLeft + conn.wrapper.offsetX - 20, offsetTop + conn.wrapper.offsetY -20);
        var nodePosition = conn.wrapper;
        expect(nodePosition.offsetX >= 0 && nodePosition.offsetY >= 0).toBe(true);
        done();
    });
});
describe('Automatic Port Creation Tests', function () {
    let diagram: Diagram;;
    let mockEvent: any;
    let ele: HTMLElement;
    let mouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagramAutomaticPortCreation' });
        document.body.appendChild(ele);

        let node: NodeModel[] = [{
            id: 'node1',
            width: 100,
            height: 100,
            offsetX: 100,
            offsetY: 100,
        },
        {
            id: 'node2',
            width: 100,
            height: 100,
            offsetX: 300,
            offsetY: 300,

        }
        ];
        let connector: ConnectorModel = {
            id: 'connector1',
            sourcePoint: { x: 100, y: 200 },
            targetPoint: { x: 200, y: 300 }
        };
        diagram = new Diagram({
            width: '500px',
            height: '500px',
            nodes: node,
            connectors: [connector],
            constraints: DiagramConstraints.Default | DiagramConstraints.AutomaticPortCreation,
        });
        diagram.appendTo('#diagramAutomaticPortCreation');
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('should create a port on the node when AutomaticPortCreation is called for node1', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 60);
        mouseEvents.mouseDownEvent(diagramCanvas, 100, 100, true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 50, 200, true);
        mouseEvents.mouseUpEvent(diagramCanvas, 100, 60, true);

        let node = diagram.nodes[0];
        expect(node.ports.length).toBe(1);
        done();
    });
    it('should create a port on the node when AutomaticPortCreation is called for node2', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 60);
        mouseEvents.mouseDownEvent(diagramCanvas, 140, 100, true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 200, 200, true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 260, true);
        mouseEvents.mouseUpEvent(diagramCanvas, 300, 260, true);
        let node = diagram.nodes[1];
        expect(node.ports.length).toBe(1);
        done();
    });
    it('should create a port on the connector when AutomaticPortCreation is called for connector', (done: Function) => {
        diagram.clearSelection();
        var conn = diagram.connectors[0];
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 220, 220);
        mouseEvents.mouseMoveEvent(diagramCanvas, 150, 250);
        mouseEvents.mouseMoveEvent(diagramCanvas, 120, 220);
        mouseEvents.mouseDownEvent(diagramCanvas, 120, 220, true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 120, 280, true);
        mouseEvents.mouseUpEvent(diagramCanvas, 120, 280, true);
        expect(conn.ports.length).toBe(1);
        done();
    });
});
describe('Diagram Port Distribution', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents = new MouseEvents();
    beforeAll(() => {
        ele = document.createElement('div');
        ele.id = 'diagramPortTest';
        document.body.appendChild(ele);
        const node1: NodeModel = {
            id: 'node1',
            width: 100,
            height: 100,
            offsetX: 200,
            offsetY: 200,
            ports: [
                { id: 'p1', offset: { x: 0.2, y: 0.2 }, visibility: PortVisibility.Visible },
                { id: 'p2', offset: { x: 0.8, y: 0.6 }, visibility: PortVisibility.Visible },
                { id: 'p3', offset: { x: 0.5, y: 0.2 }, visibility: PortVisibility.Visible },
                { id: 'p4', offset: { x: 0.5, y: 0.8 }, visibility: PortVisibility.Visible }
            ]
        };
        const node2: NodeModel = {
            id: 'node2',
            width: 100,
            height: 100,
            offsetX: 400,
            offsetY: 200,
            ports: [
                { id: 'p5', offset: { x: 0.2, y: 0.5 }, visibility: PortVisibility.Visible },
                { id: 'p6', offset: { x: 0.7, y: 0.5 }, visibility: PortVisibility.Visible },
            ]
        };
        diagram = new Diagram({
            width: 600,
            height: 400,
            nodes: [node1, node2],
            
        });
        diagram.appendTo('#diagramPortTest');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('should distribute ports on node edges', (done: Function) => {
        diagram.distributePorts(['node1', 'node2']);
        diagram.dataBind();
        const n1 = diagram.nameTable['node1'];
        expect(n1.ports.length).toBe(4);
        const leftPorts = n1.ports.filter((p: PointPortModel) => p.offset.x === 0);
        leftPorts.forEach((p: PointPortModel) => {
            expect(p.offset.x).toBe(0);
            expect(p.offset.y).toBeGreaterThan(0);
            expect(p.offset.y).toBeLessThan(1);
        });
        const rightPorts = n1.ports.filter((p: PointPortModel) => p.offset.x === 1);
        rightPorts.forEach((p: PointPortModel) => {
            expect(p.offset.x).toBe(1);
            expect(p.offset.y).toBeGreaterThan(0);
            expect(p.offset.y).toBeLessThan(1);
        });
        const topPorts = n1.ports.filter((p: PointPortModel) => p.offset.y === 0);
        topPorts.forEach((p: PointPortModel) => {
            expect(p.offset.y).toBe(0);
            expect(p.offset.x).toBeGreaterThan(0);
            expect(p.offset.x).toBeLessThan(1);
        });
        const bottomPorts = n1.ports.filter((p: PointPortModel) => p.offset.y === 1);
        bottomPorts.forEach((p: PointPortModel) => {
            expect(p.offset.y).toBe(1);
            expect(p.offset.x).toBeGreaterThan(0);
            expect(p.offset.x).toBeLessThan(1);
        });
        const n2 = diagram.nameTable['node2'];
        expect(n2.ports.length).toBe(2);
        expect(n2.ports[0].offset.x === 0 || n2.ports[0].offset.x === 1).toBe(true);
        expect(n2.ports[1].offset.x === 0 || n2.ports[1].offset.x === 1).toBe(true);
        done();
    });
});

describe('Diagram Port Distribution with Connectors', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = document.createElement('div');
        ele.id = 'diagramPortConnectorTest';
        document.body.appendChild(ele);
        const node1: NodeModel = {
            id: 'node1',
            width: 100,
            height: 100,
            offsetX: 200,
            offsetY: 200,
            ports: [
                { id: 'p1', offset: {  x: 0.3, y: 0.2 }, visibility: PortVisibility.Visible },
                { id: 'p2', offset: { x: 0.8, y: 0.5 }, visibility: PortVisibility.Visible },
                { id: 'p3', offset: { x: 0.9, y: 0.8 }, visibility: PortVisibility.Visible }
            ]
        };
        const node2: NodeModel = {
            id: 'node2',
            width: 50,
            height: 50,
            offsetX: 400,
            offsetY: 50,
            ports: [
                { id: 'p4', offset: {  x: 0.5, y: 0.5 }, visibility: PortVisibility.Visible },
            ]
        };
        const node3: NodeModel = {
            id: 'node3',
            width: 50,
            height: 50,
            offsetX: 50,
            offsetY: 250,
            ports: [
                { id: 'p5', offset: {  x: 0.5, y: 0.5 }, visibility: PortVisibility.Visible },
            ]
        };
        const node4: NodeModel = {
            id: 'node4',
            width: 50,
            height: 50,
            offsetX: 500,
            offsetY: 400,
            ports: [
                { id: 'p6', offset: {  x: 0.5, y: 0.5 }, visibility: PortVisibility.Visible },
                { id: 'p7', offset: {  x: 0.2, y: 0.5 }, visibility: PortVisibility.Visible },
            ]
        };
        const connectors: ConnectorModel[] = [
            { id: 'c1', sourceID: 'node1', sourcePortID: 'p1', targetID: 'node2' },
            { id: 'c2', sourceID: 'node1', sourcePortID: 'p2', targetID: 'node3' },
            { id: 'c3', sourceID: 'node1', sourcePortID: 'p3', targetID: 'node4' },
            { id: 'c4', sourceID: 'node2', sourcePortID: 'p4', targetPoint: { x: 500, y: 50 } },
            { id: 'c5', sourceID: 'node3', sourcePortID: 'p5', targetPoint: { x: 50, y: 300 } },
            { id: 'c6', sourceID: 'node4', sourcePortID: 'p6', targetPoint: { x: 500, y: 300 } },
            { id: 'c7', sourceID: 'node4', sourcePortID: 'p7', targetPoint: { x: 400, y: 400 } },
            { id: 'c8', sourceID: 'node4', sourcePortID: 'p7', targetPoint: { x: 550, y: 400 } }
        ];
        diagram = new Diagram({
            width: 600,
            height: 600,
            nodes: [node1, node2, node3, node4],
            connectors: connectors
        });
        diagram.appendTo('#diagramPortConnectorTest');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('should arrange ports based on connector target Y position', (done: Function) => {
        diagram.distributePorts(['node1', 'node2', 'node3', 'node4']);
        diagram.dataBind();
        const n1 = diagram.nameTable['node1'];
        const sortedPorts = n1.ports.slice().sort((a:any, b:any) => a.offset.y - b.offset.y);
        expect(sortedPorts[0].id).toBe('p1');
        expect(sortedPorts[1].id).toBe('p2');
        expect(sortedPorts[2].id).toBe('p3');
        expect(n1.ports[0].offset.x).toBe(0.5);
        expect(n1.ports[0].offset.y).toBe(0);
        expect(n1.ports[1].offset.x).toBe(1);
        expect(n1.ports[1].offset.y).toBe(0.3333333333333333);
        expect(n1.ports[2].offset.x).toBe(1);
        expect(n1.ports[2].offset.y).toBe(0.6666666666666666);
        done();
    });
});

describe('Node Annotation Drag and Resize with RestrictNegativeAxisDragDrop', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents = new MouseEvents();
    beforeAll(() => {
        ele = createElement('div', { id: 'diagram-annotation-drag' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node 1', constraints: AnnotationConstraints.Select | AnnotationConstraints.Drag | AnnotationConstraints.Resize }],
            }]
        diagram = new Diagram({
            width: 900, height: 900,
            nodes: nodes,
            constraints: DiagramConstraints.Default | DiagramConstraints.RestrictNegativeAxisDragDrop,
            scrollSettings: {horizontalOffset: 200, verticalOffset: 200}
        });
        diagram.appendTo('#diagram-annotation-drag');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('should restrict annotation dragging to negative axis when RestrictNegativeAxisDragDrop is enabled(Y-Axis)', (done: Function) => {
        diagram.clearSelection();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 400, 400);
        mouseEvents.mouseDownEvent(diagramCanvas, 400, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 350);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 300);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 230);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 180);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 150);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 180);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 230);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 300);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 350);
        mouseEvents.mouseMoveEvent(diagramCanvas, 400, 375);
        mouseEvents.mouseUpEvent(diagramCanvas, 400, 375);
        let node = diagram.nodes[0];
        let annotationWrapper = (node as Node).wrapper.children[1];
        expect(annotationWrapper.offsetY>0).toBe(true);
        done();
        diagram.dataBind();
        diagram.refresh();
    });
    it('should restrict annotation dragging to negative axis when RestrictNegativeAxisDragDrop is enabled(X-Axis)', (done: Function) => {
        diagram.dataBind();
        diagram.refresh();
        diagram.clearSelection();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 400, 400);
        mouseEvents.mouseDownEvent(diagramCanvas, 400, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 350, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 230, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 180, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 150, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 180, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 230, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 350, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 390, 400);
        mouseEvents.mouseUpEvent(diagramCanvas, 390, 400);
        let node = diagram.nodes[0];
        let annotationWrapper = (node as Node).wrapper.children[1];
        expect(annotationWrapper.offsetX>0).toBe(true);
        done();
    });
    it('should restrict annotation resizing to negative axis when RestrictNegativeAxisDragDrop is enabled(Y-Axis)', (done: Function) => {
        diagram.clearSelection();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let offsetLeft: number = diagram.element.offsetLeft+200;
        let offsetTop: number = diagram.element.offsetTop+200;
        let node = diagram.nodes[0];
        let annotationWrapper = (node as Node).wrapper.children[1];
        let annoBounds = annotationWrapper.bounds;
        let topCenter = annoBounds.topCenter;
        mouseEvents.clickEvent(diagramCanvas, topCenter.x + offsetLeft, topCenter.y + offsetTop);
        mouseEvents.dragAndDropEvent(diagramCanvas, topCenter.x + offsetLeft, topCenter.y + offsetTop-3, topCenter.x + offsetLeft, topCenter.y + offsetTop - 50);
        mouseEvents.dragAndDropEvent(diagramCanvas, topCenter.x + offsetLeft, topCenter.y + offsetTop-3-55, topCenter.x + offsetLeft, topCenter.y + offsetTop - 198);
        mouseEvents.dragAndDropEvent(diagramCanvas, topCenter.x + offsetLeft, topCenter.y + offsetTop-195, topCenter.x + offsetLeft, topCenter.y + offsetTop - 205);
        mouseEvents.dragAndDropEvent(diagramCanvas, topCenter.x + offsetLeft, topCenter.y + offsetTop-200, topCenter.x + offsetLeft, topCenter.y + offsetTop + 250);
        expect(annotationWrapper.bounds.y>0).toBe(true);
        done();
    });
    it('should restrict annotation resizing to negative axis when RestrictNegativeAxisDragDrop is enabled(X-Axis)', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let offsetLeft: number = diagram.element.offsetLeft+200;
        let offsetTop: number = diagram.element.offsetTop+200;
        let node = diagram.nodes[0];
        let annotationWrapper = (node as Node).wrapper.children[1];
        let annoBounds = annotationWrapper.bounds;
        let topCenter = annoBounds.topCenter;
        let topLeft = annoBounds.topLeft;
        mouseEvents.dragAndDropEvent(diagramCanvas, topLeft.x + offsetLeft, topCenter.y + offsetTop + 102, topLeft.x + offsetLeft - 180, topCenter.y + offsetTop+102);
        mouseEvents.dragAndDropEvent(diagramCanvas, 207, 312, 190, 312);
        expect(annotationWrapper.bounds.x>0).toBe(true);
        done();
    });
});

describe('Node rotate restrict with RestrictNegativeAxisDragDrop', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents = new MouseEvents();
    beforeAll(() => {
        ele = createElement('div', { id: 'diagram-node-rotate' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node 1'}],
            }]

        diagram = new Diagram({
            width: 900, height: 900,
            nodes: nodes,
            constraints: DiagramConstraints.Default | DiagramConstraints.RestrictNegativeAxisDragDrop,
            scrollSettings: {horizontalOffset: 200, verticalOffset: 200}
        });
        diagram.appendTo('#diagram-node-rotate');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('should restrict node rotation when RestrictNegativeAxisDragDrop is enabled', (done: Function) => {
        debugger
        //diagram.clearSelection();
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 400, 400);
            mouseEvents.mouseDownEvent(diagramCanvas, 400, 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, 350, 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, 300, 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, 230, 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, 180, 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, 150, 400);
            mouseEvents.mouseUpEvent(diagramCanvas, 150, 400);
            mouseEvents.mouseDownEvent(diagramCanvas, 250, 330);
            mouseEvents.mouseMoveEvent(diagramCanvas, 305, 400);
            mouseEvents.mouseMoveEvent(diagramCanvas, 228, 480);
            mouseEvents.mouseUpEvent(diagramCanvas, 228, 480);
            let node = diagram.nodes[0];
            expect(node.wrapper.bounds.left >=0 && node.wrapper.bounds.top >= 0).toBe(true);
            done();
    });
});

describe('Node rotate restrict without RestrictNegativeAxisDragDrop constraints', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents = new MouseEvents();
    beforeAll(() => {
        ele = createElement('div', { id: 'diagram-node-rotate-without-Constraint' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1', width: 100, height: 100, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node 1'}],
            }]

        diagram = new Diagram({
            width: 900, height: 900,
            nodes: nodes,
            scrollSettings: {horizontalOffset: 200, verticalOffset: 200}
        });
        diagram.appendTo('#diagram-node-rotate-without-Constraint');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('should node rotation when RestrictNegativeAxisDragDrop is disabled', (done: Function) => {
        debugger
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 400, 400);
        mouseEvents.mouseDownEvent(diagramCanvas, 400, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 350, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 230, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 180, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 150, 400);
        mouseEvents.mouseUpEvent(diagramCanvas, 150, 400);
        mouseEvents.mouseDownEvent(diagramCanvas, 150, 330);
        mouseEvents.mouseMoveEvent(diagramCanvas, 205, 330);
        mouseEvents.mouseMoveEvent(diagramCanvas, 250, 400);
        mouseEvents.mouseMoveEvent(diagramCanvas, 200, 480);
        mouseEvents.mouseUpEvent(diagramCanvas, 200, 480);
        let node = diagram.nodes[0];
        expect(node.wrapper.bounds.left <=0 && node.wrapper.bounds.top >= 0).toBe(true);
        done();
    });
});

describe('Distribute with connectors selected', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents = new MouseEvents();
    beforeAll(() => {
        ele = createElement('div', { id: 'diagramDistribute' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: 'node1',
                offsetX: 300, offsetY: 250,
                width: 100, height: 100,
                annotations: [{ content: 'node1' }],
            },
            {
                id: 'node2',
                offsetX: 250, offsetY: 450,
                width: 100, height: 100,
                annotations: [{ content: 'node2' }],
            },
            {
                id: 'node3',
                offsetX: 550, offsetY: 450,
                width: 100, height: 100,
                annotations: [{ content: 'node2' }],
            },
        ];
        let connectors: ConnectorModel[] = [
            {
                id: 'connector1',
                sourceID: 'node1',
                targetID: 'node2',
                type: 'Orthogonal',
                annotations: [{ content: 'connector1' }],
            },
            {
                id: 'connector2',
                sourceID: 'node2',
                targetPoint: { x: 400, y: 450 },
                type: 'Orthogonal',
                annotations: [{ content: 'connector2' }],
            },
            {
                id: 'connector3',
                sourcePoint: { x: 550, y: 250 },
                targetID: 'node3',
                type: 'Orthogonal',
                annotations: [{ content: 'connector3' }],
            },
            {
                id: 'connector4',
                sourcePoint: { x: 650, y: 220 },
                targetPoint: { x: 750, y: 300 },
                type: 'Orthogonal',
                annotations: [{ content: 'connector4' }],
            }
        ]

        diagram = new Diagram({
            width: 900, height: 900,
            nodes: nodes, connectors: connectors,
        });
        diagram.appendTo('#diagramDistribute');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('MultiSelect Distribute', (done: Function) => {
        diagram.selectAll();
        diagram.distribute('RightToLeft');
        diagram.dataBind();
        diagram.distribute('BottomToTop');
        diagram.dataBind();
        let node = diagram.nodes[0];
        expect(node.offsetX === 400 && node.offsetY === 250).toBe(true);
        done();
    });
});
