import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, PathModel, TextModel, ImageModel, NativeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { TextStyleModel } from '../../../src/diagram/core/appearance-model';
import { Container } from '../../../src/diagram/core/containers/container';
import { StackPanel } from '../../../src/diagram/core/containers/stack-panel';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { ImageElement } from '../../../src/diagram/core/elements/image-element';
import { DiagramNativeElement } from '../../../src/diagram/core/elements/native-element';
import { TextElement } from '../../../src/diagram/core/elements/text-element';
import { Native, NodeConstraints, accessibilityElement, HtmlModel, Ruler } from '../../../src/index';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { SnapConstraints, PointPort, Annotation, IconShapes, Decorator, PortVisibility, ConnectorModel } from '../../../src/diagram/index';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { IconShape } from '../../../src/diagram/objects/icon';
import { DiagramHtmlElement } from '../../../src/diagram/core/elements/html-element';
import { getDiagramLayerSvg } from '../../../src/diagram/utility/dom-util';
import { LayerModel } from '../../../src/diagram/diagram/layer-model';

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
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node, node2, node3, node4] });
            diagram.appendTo('#diagram97');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking default node creation with minWith value', (done: Function) => {
            let node = diagram.nodes[2];
            expect(node.wrapper.children[0].height === 10
                && diagram.nodes[3].wrapper.actualSize.height === 12 && diagram.nodes[3].wrapper.actualSize.width === 50).toBe(true);
            done()
        })
        it('Checking default node creation', (done: Function) => {
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            let wrapper: Container = (diagram.nodes[0] as Node).wrapper;
            expect((diagram.nodes[0] as Node).shape.type === 'Basic' &&
                ((diagram.nodes[0] as Node).shape as BasicShapeModel).shape === 'Rectangle' &&
                wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof DiagramElement && wrapper.offsetX === 100 &&
                wrapper.offsetY === 100 && wrapper.actualSize.width === 30 && wrapper.actualSize.height === 30).toBe(true);
            done();
        });
        it('Checking rectangle shape with no width and height', (done: Function) => {
            let wrapper: Container = (diagram.nodes[1] as Node).wrapper;
            expect((diagram.nodes[1] as Node).shape.type === 'Basic' &&
                ((diagram.nodes[1] as Node).shape as BasicShapeModel).shape === 'Rectangle' &&
                wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof DiagramElement && wrapper.offsetX === 300 &&
                wrapper.offsetY === 100 && wrapper.actualSize.width === 50 && wrapper.actualSize.height === 50).toBe(true);
            done();
        });
    });

    describe('Path Node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
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
            let wrapper: Container = (diagram.nodes[0] as Node).wrapper;
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
            let wrapper: Container = (diagram.nodes[0] as Node).wrapper;
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
            let wrapper: Container = (diagram.nodes[0] as Node).wrapper;
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
            let wrapper: Container = (diagram.nodes[0] as Node).wrapper;
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
            let wrapper: Container = (diagram.nodes[0] as Node).wrapper;
            expect(wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof DiagramNativeElement && wrapper.offsetX === 100 &&
                wrapper.offsetY === 100 && wrapper.actualSize.width === 100 && wrapper.actualSize.height === 100).toBe(true);
            done();
        });

        it('Checking Native node with scale as None', (done: Function) => {
            let node2: HTMLElement = document.getElementById('node2_content_native_element');
            let bounds: ClientRect = node2.getBoundingClientRect();
            let wrapper: Container = (diagram.nodes[1] as Node).wrapper;
            expect(bounds.width === 90 && bounds.height === 90).toBe(true);
            done();
        });

        it('Checking Native node with scale as Stretch', (done: Function) => {
            let node3: HTMLElement = document.getElementById('node3_content_native_element');
            let bounds: ClientRect = node3.getBoundingClientRect();
            let wrapper: Container = (diagram.nodes[2] as Node).wrapper;
            expect(wrapper.actualSize.width === 150 && wrapper.actualSize.height === 100 &&
                Math.round(bounds.height) === wrapper.actualSize.height &&
                Math.round(bounds.width) === wrapper.actualSize.width).toBe(true);
            done();
        });

        it('Checking Native node with scale as Meet when width > height', (done: Function) => {
            let node4: HTMLElement = document.getElementById('node4_content_native_element');
            let bounds: ClientRect = node4.getBoundingClientRect();
            let wrapper: Container = (diagram.nodes[3] as Node).wrapper;
            expect(wrapper.actualSize.width === 150 && wrapper.actualSize.height === 100 &&
                Math.round(bounds.width) === wrapper.actualSize.height).toBe(true);
            done();
        });

        it('Checking Native node with scale as Meet height > width', (done: Function) => {
            let node5: HTMLElement = document.getElementById('node5_content_native_element');
            let bounds: ClientRect = node5.getBoundingClientRect();
            let wrapper: Container = (diagram.nodes[4] as Node).wrapper;
            expect(wrapper.actualSize.width === 100 && wrapper.actualSize.height === 150 &&
                Math.round(bounds.height) === wrapper.actualSize.width).toBe(true);
            done();
        });

        it('Checking Native node with scale as Slice width > height', (done: Function) => {
            let node6: HTMLElement = document.getElementById('node6_content_native_element');
            let bounds: ClientRect = node6.getBoundingClientRect();
            let wrapper: Container = (diagram.nodes[5] as Node).wrapper;
            expect(wrapper.actualSize.width === 150 && wrapper.actualSize.height === 100 &&
                Math.round(bounds.height) === wrapper.actualSize.width).toBe(true);
            done();
        });

        it('Checking Native node with scale as Slice height > width', (done: Function) => {
            let node7: HTMLElement = document.getElementById('node7_content_native_element');
            let bounds: ClientRect = node7.getBoundingClientRect();
            let wrapper: Container = (diagram.nodes[6] as Node).wrapper;
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

            let wrapper: Container = node.wrapper;
            expect(wrapper.actualSize.width === 100 && wrapper.actualSize.height === 150 &&
                (wrapper.children[0] as DiagramNativeElement).content === '<g><path id="XMLID_484_" d="M281.439,14.934c-0.002-0.471-0.025-0.941-0.071-1.411c-0.023-0.236-0.067-0.466-0.101-0.699' +
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
                'C219.348,176.953,186.016,210.285,145.046,210.285z"><g>').toBe(true);
            done();
        });

        it('Checking Native node on runtime property change - content', (done: Function) => {
            let node: Node = diagram.nodes[7] as Node;
            (node.shape as NativeModel).scale = 'Meet';
            diagram.dataBind();
            setTimeout(() => {
                let node8: HTMLElement = document.getElementById('node8_content_native_element');
                let bounds: ClientRect = node8.getBoundingClientRect();
                let wrapper: Container = node.wrapper;
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
            let wrapper: Container = (diagram.nodes[8] as Node).wrapper;
            expect(wrapper.actualSize.width === 300 && wrapper.actualSize.height === 150 &&
                Math.round(bounds.width) === wrapper.actualSize.width).toBe(true);
            done();
        });
    });
    describe('Annotation editing without label', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {

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
            let wrapper: Container = (diagram.nodes[0] as Node).wrapper;
            expect(wrapper && wrapper.children && wrapper.children.length &&
                wrapper.children[0] instanceof DiagramHtmlElement && wrapper.offsetX === 300 &&
                wrapper.offsetY === 300 && wrapper.actualSize.width === 75 && wrapper.actualSize.height === 50).toBe(true);
            done();
        });

        it('Checking HTML node', (done: Function) => {
            let wrapper: Container = (diagram.nodes[1] as Node).wrapper;
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
            let wrapper: Container = (diagram.nodes[2] as Node).wrapper;
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
            let wrapper: Container = diagram.nameTable['node33'].wrapper;
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
            let wrapper: Container = (diagrams.nodes[0] as Node).wrapper;
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
            let wrapper: Container = (diagrams.nodes[0] as Node).wrapper;
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
            let wrapper: Container = (diagram.nodes[0] as Node).wrapper;
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
});