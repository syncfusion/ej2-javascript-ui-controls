/**
 * Simple symbol palette
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../src/diagram/diagram';
import { Path, Node } from '../../src/diagram/objects/node';

import { BpmnDiagrams } from '../../src/diagram/objects/bpmn';
import { Connector } from '../../src/diagram/objects/connector';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { NodeConstraints } from '../../src/diagram/enum/enum';
import { UndoRedo } from '../../src/diagram/objects/undo-redo'
import {
    SymbolPalette, SymbolInfo, PaletteModel,
} from '../../src/symbol-palette/index';

import { MouseEvents } from '../diagram/interaction/mouseevents.spec';
import { IElement, PointModel, TextElement, StackPanel, DiagramElement, randomId } from '../../src/diagram/index';
import { EJ2Instance } from '@syncfusion/ej2-navigations';
import { BpmnShapeModel, BpmnSubProcessModel } from "../../src/index";
Diagram.Inject(BpmnDiagrams);
SymbolPalette.Inject(BpmnDiagrams);
Diagram.Inject(UndoRedo);

describe('Symbol Palette', () => {
    describe('Testing symbol palette', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let flowshapes: NodeModel[] = [{ id: 'start', shape: { type: 'Flow', shape: 'Terminator' } },
        { id: 'process', shape: { type: 'Flow', shape: 'Process' } },
        { id: 'decision', shape: { type: 'Flow', shape: 'Decision' } },
        { id: 'data', shape: { type: 'Flow', shape: 'Data' } },
        { id: 'end', shape: { type: 'Flow', shape: 'Terminator' } }];

        let bpmnShapes: NodeModel[] = [{
            id: 'node2a', width: 100, height: 100, offsetX: 500, offsetY: 100, constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
            shape: { type: 'Bpmn', shape: 'DataObject', dataObject: { collection: false, type: 'None' } }
        },
        {
            id: 'task', width: 100, height: 100, offsetX: 300, offsetY: 100,
            shape: {
                type: 'Bpmn', shape: 'Activity',
                activity: { activity: 'SubProcess', subProcess: { type: 'Event' } }
            }
        }, {
            id: 'annot4', width: 100, height: 100,
            shape: { type: 'Bpmn', shape: 'TextAnnotation', annotation: { angle: 280, length: 150, text: 'textAnnotation4', } }
        }];

        let connectorSymbols: ConnectorModel[] = [{
            id: 'connector1a', type: 'Straight',
            sourcePoint: { x: 15, y: 15 }, targetPoint: { x: 20, y: 20 },
        }, {
            id: 'link2', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 }, type: 'Orthogonal',
            shape: {
                type: 'Bpmn',
                flow: 'Message',
                association: 'directional'
            }, style: {
                strokeDashArray: '2,2'
            },
            segments: [{ type: 'Orthogonal', length: 30, direction: 'Bottom' },
            { type: 'Orthogonal', length: 80, direction: 'Right' }]
        }];

        let connDecorators: ConnectorModel[] = [{
            id: 'connectordec1', type: 'Straight',
            sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
            style: { strokeColor: 'red' }
        },

        {
            id: 'connectordec2', type: 'Orthogonal',
            sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
        },
        {
            id: 'connectordec3', type: 'Bezier',
            sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
        }];

        let grids: NodeModel[] = [{
            id: 'grid', width: 100, height: 100
        }];

        let svgNodes: NodeModel[] = [{
            id: 'native', width: 100, height: 100, shape: {
                type: 'Native',
                content: '<g> ${id} <style xmlns=http://www.w3.org/2000/svg type=text/css>.st051{fill:#CBC4C9;}.st152{fill:#E5DCE1;}.st252{fill:#DBD5DA;}.st3552{fill:#69696B;}</style><g xmlns=http://www.w3.org/2000/svg>    <path class=st051 d=M2.8,37L18,44.3c5,2.4,10.8,2.3,15.6-0.3l13.6-7.3c1.7-0.9,2.3-5.6,1.9-7c0,0.1,0.1,0.3,0.1,0.4v-4.3   c0.1,1.6-0.8,3.1-2.3,3.7l0,0l-13.1-6.9c-5.5-2.9-12-2.9-17.5,0L3.2,29.8c-1.3-0.5-2.3-1.7-2.5-3.2v6.7 />    <path class=st152 d=M18.2,37.2l-15-7.3c-1.7-0.7-2.6-2.7-1.9-4.4c0.3-0.8,0.9-1.4,1.7-1.8l13.6-7.2c5.4-2.8,11.9-2.8,17.3,0   l13.2,7c1.7,0.8,2.5,2.9,1.7,4.6c-0.3,0.8-1,1.4-1.7,1.7L33.6,37C28.8,39.5,23.1,39.6,18.2,37.2z />    <path class=st252 d=M25.5,39.2c-2.7,0-5.3-0.6-7.7-1.8L2.6,30.1c-1.1-0.6-1.9-1.6-2.3-2.8l1-0.3C1.6,28,2.2,28.7,3,29.2l15.2,7.4   c4.8,2.3,10.5,2.2,15.2-0.3L47,29c0.9-0.5,1.6-1.4,1.8-2.4l1,0.1c-0.2,1.4-1.1,2.5-2.3,3.1l-13.7,7.3   C31.3,38.5,28.4,39.2,25.5,39.2z />    <path class=st3552 d=M26,46.1c-0.7,0-1.4,0-2.2-0.1c-2.3-0.3-4.6-1-6.8-2l-9.1-4.4L4.8,38H4.6c-1-0.4-1.9-1-2.7-1.8   c-0.7-0.8-1.2-1.8-1.5-2.8c-0.2-0.6-0.2-1.2-0.2-1.8V28l0,0c0,0,0-0.1,0-0.3c0.2-2.3,1.5-4.4,3.6-5.5l12.4-6.6c5.6-3,12.4-3,18-0.1   l13.3,7c1.5,1,2.4,2.7,2.3,4.5l-0.1,5.2c0,2.1-1.2,4-3.1,4.9L33,44.5C30.8,45.6,28.4,46.2,26,46.1z M25.2,14.3   c-3,0-5.9,0.7-8.6,2.1L4.2,23.1c-1.7,0.9-2.9,2.7-3,4.6c0,0.1,0,0.2,0,0.2v3.6c0,0.5,0.1,1,0.2,1.5C1.6,34,2,34.8,2.6,35.5   c0.7,0.7,1.5,1.2,2.4,1.6l0.2,0.1l3.2,1.5l9.1,4.4c2,1,4.2,1.6,6.5,1.9c2.9,0.4,5.9-0.1,8.6-1.4l13.7-7.3c1.5-0.8,2.5-2.3,2.5-4   l0.1-5.2c0.1-1.5-0.6-2.9-1.8-3.6l-13.3-7C31.1,15.1,28.2,14.3,25.2,14.3L25.2,14.3z />    <path class=st3552 d=M4,33.5c0,0.5-0.2,0.8-0.5,0.8S2.8,34,2.8,33.5s0.2-0.8,0.5-0.8S4,33,4,33.5z />    <path class=st3552 d=M7,35.1c0,0.5-0.2,0.8-0.5,0.8s-0.6-0.3-0.7-0.8s0.2-0.8,0.5-0.8S6.9,34.7,7,35.1z />    <path class=st3552 d=M9.9,36.7c0,0.5-0.2,0.8-0.5,0.8s-0.6-0.3-0.7-0.8s0.2-0.8,0.5-0.8S9.9,36.3,9.9,36.7z />    <path class=st3552 d=M17.6,40.2c0,0.6-0.3,1.1-0.7,1.1s-0.8-0.5-0.9-1.1s0.3-1.1,0.7-1.1S17.6,39.6,17.6,40.2z />    <path class=st3552 d=M32,15.2l0.4-12.7c0-0.6,0.5-1.1,1.1-1.1c0.2,0,0.3,0,0.5,0.1l0,0c0.4,0.2,0.6,0.5,0.6,0.9L35,16.5L32,15.2z /></g></g>',
                text: 'Element for Network Diagram'
            } as NodeModel
        }];

        let htmlNodes: NodeModel[] = [{
            id: 'html', width: 100, height: 100, shape: {
                type: 'HTML',
                content: '<div style="background:red;height:100%;width:100%;"><input type="button" value="{{:value}}" /></div>',
            } as NodeModel
        }];

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

        let getNodeTemplate: Function = (symbol: NodeModel) => {
            if (symbol.id.indexOf('grid') !== -1) {
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
        };

        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolpalette', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'nodea', maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                    offsetX: 200, offsetY: 200,
                    shape: {
                        type: 'Bpmn', shape: 'Activity', activity: {
                            activity: 'SubProcess',
                            subProcess: {
                                collapsed: false, type: 'Transaction',
                                //processes: ['start', 'end', 'nod1', 'nod']
                            } as BpmnSubProcessModel
                        },
                    },
                },
                {
                    id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                    constraints: NodeConstraints.PointerEvents | NodeConstraints.Select,
                    shape: {
                        type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366' +
                            'L558.9053,194.9966L540.3643,' +
                            '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z'
                    }, annotations: [{ content: 'Path Element' }]
                }
            ];
            let connectors: ConnectorModel[] = [{
                id: 'connector1', type: 'Straight', sourcePoint: { x: 100, y: 300 },
                targetPoint: { x: 200, y: 400 },
            }];

            diagram = new Diagram({
                connectors: connectors, nodes: nodes, pageSettings: { background: { color: 'transparent' } },
                width: '70%'
            });
            diagram.appendTo('#diagram');

            palette = new SymbolPalette({
                width: '25%', height: '500px',
                palettes: [
                    { id: 'flow', expanded: true, symbols: flowshapes, iconCss: '', title: 'Flow Shapes' },
                    { id: 'bpmn', expanded: true, symbols: bpmnShapes, iconCss: '', title: 'BPMN Shapes' },
                    { id: 'grids', expanded: true, symbols: grids, title: 'Grids' },
                    { id: 'native', expanded: true, symbols: svgNodes, title: 'Native Elements' },
                    { id: 'html', expanded: true, symbols: htmlNodes, iconCss: 'shapes', title: 'Html Elements' },
                    { id: 'connectors', expanded: true, height: 200, symbols: connectorSymbols, iconCss: '', title: 'Connectors' },
                    { id: 'decorators', expanded: true, symbols: connDecorators, iconCss: '', title: 'Connectors' },
                ], enableAnimation: false, enableSearch: true,
                symbolMargin: { top: 5, bottom: 5, left: 5, right: 5 }
            });
            palette.appendTo('#symbolpalette');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });

        it('Checking default palette rendering', (done: Function) => {
            setTimeout(() => {
                //just for coverage
                let events: MouseEvents = new MouseEvents();
                events.mouseDownEvent(palette.element, 75, 100, false, false);
                events.mouseMoveEvent(palette.element, 100, 100, false, false);
                events.mouseUpEvent(palette.element, 100, 100, false, false);
                palette.getPersistData();
                let start: HTMLElement = document.getElementById('start');
                expect(start.offsetWidth == 280 && start.offsetHeight == 110).toBe(true);
                done();
            }, 10);
        });

        it('Checking symbol size', (done: Function) => {
            palette.enableSearch = false;
            palette.dataBind();

            palette.symbolWidth = 80;
            palette.symbolHeight = 80;
            palette.getSymbolTemplate = (symbol: NodeModel): DiagramElement => {
                return getNodeTemplate(symbol);
            };
            palette.dataBind();
            setTimeout(() => {
                let start: HTMLElement = document.getElementById('start');
                expect(start.offsetWidth == 143 && start.offsetHeight == 143).toBe(true);
                done();

            }, 10);
        });

        it('Checking connectors', (done: Function) => {
            var decorator = palette.symbolTable['connectordec1'].wrapper.children[0].children[0].children[2];
            expect(decorator.offsetX == 71.245 && decorator.offsetY == 71.245).toBe(true);
            decorator = palette.symbolTable['connectordec2'].wrapper.children[0].children[0].children[2];
            expect(Math.round(decorator.offsetX) == 69 && decorator.offsetY == 68.5).toBe(true);
            decorator = palette.symbolTable['connectordec3'].wrapper.children[0].children[0].children[2];
            expect(Math.round(decorator.offsetX) == 69 && Math.round(decorator.offsetY) == 70).toBe(true);
            decorator = palette.symbolTable['connectordec1'].wrapper.children[0].children[0].children[0];
            expect(decorator.offsetX == 35.5 && decorator.offsetY == 35.5).toBe(true);
            decorator = palette.symbolTable['connectordec2'].wrapper.children[0].children[0].children[0];
            expect(decorator.offsetX == 35.5 && decorator.offsetY == 35.5).toBe(true);
            decorator = palette.symbolTable['connectordec3'].wrapper.children[0].children[0].children[0];
            expect(decorator.offsetX == 35.5 && decorator.offsetY == 35.5).toBe(true);
            done();
            decorator = palette.symbolTable['link2'].wrapper.children[0].children[0].children[0];
            expect(decorator.offsetX == 35.5 && decorator.offsetY == 35.5).toBe(true);
            done();
        });

        it('Checking custom size', (done: Function) => {
            palette.getSymbolInfo = (symbol: Node | Connector): SymbolInfo => {
                if (symbol.shape.type === 'Bpmn') {
                    return { width: 50, height: 50 };
                }
                if (symbol.id === 'decision' || symbol.id === 'start' || symbol.id === 'end') {
                    return { width: 100, height: 40 };
                }
                return { width: 75, height: 40 };
            };
            palette.dataBind();
            setTimeout(() => {
                let start: HTMLElement = document.getElementById('start');
                expect(start.offsetWidth == 143 && start.offsetHeight == 143).toBe(true);
                done();
            }, 10);
        });

        it('Checking description', (done: Function) => {
            palette.getSymbolInfo = (symbol: Node | Connector): SymbolInfo => {
                if (symbol['text'] !== undefined) {
                    return { width: 75, height: 40, description: { text: symbol['text'], overflow: 'Wrap' } };
                }
                if (symbol.shape.type === 'Bpmn') {
                    return { width: 50, height: 50, description: { text: symbol.shape['shape'] } };
                }
                if (symbol.id === 'decision' || symbol.id === 'start' || symbol.id === 'end') {
                    return { width: 100, height: 40, description: { text: symbol.shape['shape'] } };
                }
                return { width: 75, height: 40, description: { text: symbol.shape['shape'] } };
            };
            palette.dataBind();
            setTimeout(() => {
                let start: HTMLElement = document.getElementById('start');
                expect(start.offsetWidth == 143 && start.offsetHeight == 153).toBe(true);
                done();
            }, 10);
        });

        it('Checking fit option', (done: Function) => {
            palette.getSymbolInfo = (symbol: Node | Connector): SymbolInfo => {
                if (symbol.shape.type === 'Bpmn') {
                    return { width: 50, height: 50, description: { text: symbol.shape['shape'] } };
                }
                if (symbol.id === 'decision' || symbol.id === 'start' || symbol.id === 'end') {
                    return { width: 100, height: 40, fit: true, description: { text: symbol.shape['shape'] } };
                }
                return { width: 75, height: 40, fit: true, description: { text: symbol.shape['shape'] } };
            };
            palette.dataBind();
            let start: HTMLElement = document.getElementById('start');
            setTimeout(() => {
                expect(start.offsetWidth == 143 && start.offsetHeight == 153).toBe(true);
                done();
            }, 10);
        });


        it('Checking drag and drop', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let target = document.elementFromPoint(position.x, position.y).childNodes[0];
                let symbols: IElement = palette.symbolTable[target['id']];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };
            diagram.dragEnter = (arg) => {
                expect(arg.source instanceof SymbolPalette).toBe(true);
                done();
            }
            diagram.dragOver = (arg) => {
                expect(arg.diagram !== undefined).toBe(true);
                done();
            }
            diagram.drop = (arg) => {
                expect((arg.element as NodeModel).id === diagram.currentSymbol.id).toBe(true);
                done();
            }
            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 300, 300, false, false);
            events.mouseUpEvent(diagram.element, 300, 300, false, false);
            expect(diagram.nodes.length).toBe(3);
            diagram.undo()
            expect(diagram.nodes.length).toBe(2);
            done();
        });
        it('drag and drop annotation node', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let target = document.elementFromPoint(position.x, position.y).childNodes[0];
                let symbols: IElement = palette.symbolTable[target['id']];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };
            diagram.dragEnter = (arg) => {
                expect(arg.source instanceof SymbolPalette).toBe(true);
                done();
            }
            diagram.dragOver = (arg) => {
                expect(arg.diagram !== undefined).toBe(true);
                done();
            }
            diagram.drop = (arg) => {
                expect((arg.element as NodeModel).id === diagram.currentSymbol.id).toBe(true);
                done();
            }
            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 175, 350, false, false);
            events.mouseMoveEvent(palette.element, 100, 350, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 300, 300, false, false);
            events.mouseUpEvent(diagram.element, 300, 300, false, false);
            expect(diagram.nodes.length).toBe(3);
            diagram.undo();
            expect(diagram.nodes.length).toBe(2);
            diagram.redo(); diagram.undo();


            events.mouseDownEvent(palette.element, 75, 350, false, false);
            events.mouseMoveEvent(palette.element, 100, 350, false, false);
            events.mouseMoveEvent(palette.element, 300, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 300, 300, false, false);
            events.mouseUpEvent(diagram.element, 300, 300, false, false);

            events.mouseDownEvent(palette.element, 175, 350, false, false);
            events.mouseMoveEvent(palette.element, 100, 350, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 300, 300, false, false);
            events.mouseUpEvent(diagram.element, 300, 300, false, false);
            expect(diagram.nodes.length).toBe(4);
            diagram.undo();
            expect(diagram.nodes.length).toBe(3);
            diagram.redo(); diagram.undo();
            done();
        });
        it('drag and drop annotation processes', (done: Function) => {
            
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let target = document.elementFromPoint(position.x, position.y).childNodes[0];
                let symbols: IElement = palette.symbolTable[target['id']];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };
            diagram.dragEnter = (arg) => {
                expect(arg.source instanceof SymbolPalette).toBe(true);
                done();
            }
            diagram.dragOver = (arg) => {
                expect(arg.diagram !== undefined).toBe(true);
                done();
            }
            diagram.drop = (arg) => {
                expect((arg.element as NodeModel).id === diagram.currentSymbol.id).toBe(true);
                done();
            }

            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 50, 325, false, false);
            events.mouseMoveEvent(palette.element, 100, 350, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 400, 250, false, false);
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            events.mouseUpEvent(diagram.element, 400, 250, false, false);
            expect(diagram.nodes.length).toBe(4);

            diagram.undo()
            expect(diagram.nodes.length).toBe(3);
            done();
            diagram.add({
                id: 'annot2', width: 100, height: 100, shape: { shape: 'TextAnnotation', type: 'Bpmn', annotation: { text: 'textAnnotation2' } }
            });
            diagram.select([diagram.nameTable['annot2']]);
            diagram.copy();
            diagram.paste();
            diagram.undo();
            diagram.undo();
            expect(diagram.nodes.length).toBe(3);
            done();

        });
        it('Checking drag stop', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 150, 200, false, false);
            events.mouseMoveEvent(palette.element, 150, 300, false, false);
            events.mouseUpEvent(palette.element, 150, 300, false, false);
            done();
        });

        it('Checking moving symbol outside of diagram', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            diagram.dragLeave = (arg) => {
                expect(arg.diagram !== undefined).toBe(true);
                done();
            }
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            events.mouseMoveEvent(diagram.element, 300, 300, false, false);

            events.mouseMoveEvent(diagram.diagramCanvas, 350, 350, false, false);
            events.mouseLeaveEvent(diagram.diagramCanvas);
            events.mouseMoveEvent(palette.element, 150, 200, false, false);
            events.mouseUpEvent(palette.element, 150, 200, false, false);
            done();
        });

        it('Checking symbol preview size', (done: Function) => {
            palette.symbolPreview.width = 100;
            palette.symbolPreview.height = 100;
            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseUpEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length == 0).toBe(true);
            done();
        });

        it('Checking dragging Complex Shape', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let symbols: IElement = palette.symbolTable['task'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };
            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 500, 300, false, false);
            events.mouseUpEvent(diagram.element, 500, 300, false, false);
            expect(document.getElementsByClassName('e-dragclone').length == 0).toBe(true);
            expect(diagram.nodes.length).toBe(4);
            done();
        });

        it('Checking dragging connector', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let symbols: IElement = palette.symbolTable['connector1a'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };

            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 500, 300, false, false);
            events.mouseUpEvent(diagram.element, 500, 300, false, false);
            expect(diagram.connectors.length).toBe(2);
            expect(Math.round(diagram.connectors[1].wrapper.offsetX) == 180 || Math.round(diagram.connectors[1].wrapper.offsetX) == 176 ||
                diagram.connectors[1].wrapper.offsetX == 154.5 || diagram.connectors[1].wrapper.offsetX === 304.5||
                diagram.connectors[1].wrapper.offsetX == 309 || Math.round(diagram.connectors[1].wrapper.offsetX) == 303 ||
                Math.round(diagram.connectors[1].wrapper.offsetX) == 304 ||
                Math.round(diagram.connectors[1].wrapper.offsetX) == 300).toBe(true);
            expect(diagram.connectors[1].wrapper.offsetY >= 292 && diagram.connectors[1].wrapper.offsetY <= 293).toBe(true);
            done();
        });
        it('Checking dragging native node', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let symbols: IElement = palette.symbolTable['native'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;

            };

            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            let nativeElement = document.getElementById('native_content_native_element').childNodes[0];
            let element = nativeElement.childNodes[0];
            let string: string = element.textContent; string = string.slice(1, 7);
            expect(string == 'native').toBe(true);
            events.mouseMoveEvent(diagram.element, 500, 300, false, false);
            events.mouseUpEvent(diagram.element, 500, 300, false, false);
            expect(diagram.connectors.length).toBe(2);
            done();
        });
        it('Checking dragging html node', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let symbols: IElement = palette.symbolTable['html'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };

            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 500, 300, false, false);
            events.mouseUpEvent(diagram.element, 500, 300, false, false);
            done();
        });

        it('Checking highlights', (done: Function) => {
            let mouseDown: string = 'mouseDown';
            let mouseMove: string = 'mouseMove';
            let targetElement = document.getElementById('end_container');

            palette[mouseMove]({ target: targetElement, preventDefault: () => { } });
            targetElement = document.getElementById('start_container');
            palette[mouseMove]({ target: targetElement, preventDefault: () => { } });
            expect(targetElement.className === 'e-symbol-draggable e-symbol-hover').toBe(true);
            done();
        });

        it('Checking selection', (done: Function) => {
            let targetElement = document.getElementById('end_container');
            let mouseDown: string = 'mouseDown';
            let mouseMove: string = 'mouseMove';
            palette[mouseDown]({ target: targetElement, preventDefault: () => { } });
            palette[mouseMove]({ target: targetElement, preventDefault: () => { } });
            (new MouseEvents()).mouseUpEvent(palette.element, 500, 300, false, false);
            targetElement = document.getElementById('start_container');
            palette[mouseDown]({ target: targetElement, preventDefault: () => { } });
            palette[mouseMove]({ target: targetElement, preventDefault: () => { } });
            (new MouseEvents()).mouseUpEvent(palette.element, 500, 300, false, false);

            let symboleelem = document.querySelector('.e-symbolpalette .e-symbol-selected');
            let symboleelemstyle = getComputedStyle(symboleelem);
            expect(symboleelemstyle.backgroundColor === 'rgb(224, 224, 224)').toBe(true);
            done();
        });

        it('checking search palette items length', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            palette.enableSearch = true;
            palette.dataBind();
            let element: HTMLElement = document.getElementById("textEnter");
            element.focus();
            (document.getElementById("textEnter") as HTMLInputElement).value = "st";
            let eventName = "keyUp";
            palette[eventName]({ target: element });
            setTimeout(() => {
                expect(document.getElementById("SearchPalette").children.length === 1).toBe(true);
                done();
            }, 500);
        });

        it('checking no search palette', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            let element: HTMLElement = document.getElementById("textEnter");
            element.focus();
            (document.getElementById("textEnter") as HTMLInputElement).value = "";
            let eventName = "keyUp";
            palette[eventName]({ target: element });
            setTimeout(() => {
                expect(document.getElementById("SearchPalette") === null).toBe(true);
                done();
            }, 500);
        });

        it('checking search palette with no items', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            let element: HTMLElement = document.getElementById("textEnter");
            element.focus();
            (document.getElementById("textEnter") as HTMLInputElement).value = "sr";
            let eventName = "keyUp";
            palette[eventName]({ target: element });
            setTimeout(() => {
                expect(document.getElementById("SearchPalette").children[0].id == "EmptyDiv").toBe(true);
                done();
            }, 500);
        });

        it('checking search palette with no items on enter key', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            let element: HTMLElement = document.getElementById("textEnter");
            element.focus();
            (document.getElementById("textEnter") as HTMLInputElement).value = "sr";
            let eventName = "keyUp";
            palette[eventName]({ target: element, key: "Enter", keyCode: 13 });
            setTimeout(
                () => {
                    expect(document.getElementById("SearchPalette").children[0].id === "EmptyDiv").toBe(true);
                    done();
                },
                500);
        });

        it('checking search palette with no items on mouse up icons', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            let element: HTMLElement = document.getElementById("textEnter");
            element.focus();
            (document.getElementById("textEnter") as HTMLInputElement).value = "sr";
            let element1: HTMLElement = document.getElementById("iconSearch");
            events.mouseUpEvent(element1, 100, 100, null, null);
            expect(document.getElementById("SearchPalette") === null).toBe(true);
            done();
        });

        it('Show search palette', (done: Function) => {
            palette.enableSearch = true;
            palette.dataBind();
            expect(document.getElementById("symbolpalette_search").className === "e-input-group").toBe(true);
            expect(document.getElementsByClassName('e-search').length > 0);
            done();
        });

        it('Remove search palette', (done: Function) => {
            palette.enableSearch = false;
            palette.dataBind();
            expect(document.getElementById("symbolpalette_search") === null).toBe(true);
            done();
        });

        it('checking filter symbols in palette', (done: Function) => {
            palette.enableSearch = true;
            palette.dataBind();
            palette.filterSymbols = (symbol: NodeModel[] | ConnectorModel[]): NodeModel[] | ConnectorModel[] => {
                return null;
            };
            let events: MouseEvents = new MouseEvents();
            let element: HTMLElement = document.getElementById("textEnter");
            element.focus();
            (document.getElementById("textEnter") as HTMLInputElement).value = "st";
            let eventName = "keyUp";
            palette[eventName]({ target: element });
            setTimeout(() => {
                expect(document.getElementById("SearchPalette").children.length === 1).toBe(true);
                done();
            }, 500);
        });

        it('Changing the width and height of the palette', (done: Function) => {
            palette.width = '24%';
            palette.height = '540px';
            palette.dataBind();
            done();
        });

        it('Add Palette Item', (done: Function) => {
            palette.addPaletteItem('flow', { id: 'newflow', shape: { type: 'Flow', shape: 'Process' } });
            palette.dataBind();
            let cpalette: PaletteModel = palette.palettes[0];
            let element: HTMLElement = document.getElementById('newflow_container');
            expect(element !== null).toBe(true);
            done();
        });
        it('Remove Palette Item', (done: Function) => {
            let cpalette: PaletteModel = palette.palettes[0];
            palette.removePaletteItem('flow', cpalette.symbols[cpalette.symbols.length - 1].id);
            palette.dataBind();
            let element: HTMLElement = document.getElementById('newflow_container');
            expect(element === null).toBe(true);
            done();
        });
        it('Wrongly Add Palette Name', (done: Function) => {
            palette.addPaletteItem('flows', { id: 'newflow', shape: { type: 'Flow', shape: 'Process' } });
            palette.dataBind();
            done();
        });
        it('Wrongly Remove Palette Name', (done: Function) => {
            let cpalette: PaletteModel = palette.palettes[0];
            palette.removePaletteItem('flows', cpalette.symbols[cpalette.symbols.length - 1].id);
            palette.dataBind();
            done();
        });

        it('Checking custom size without size', (done: Function) => {
            palette.getSymbolInfo = (symbol: Node | Connector): SymbolInfo => {
                if (symbol.shape.type === 'Bpmn') {
                    return { width: 50, height: 50 };
                }
                if (symbol.id === 'decision' || symbol.id === 'start' || symbol.id === 'end') {
                    return { width: 100, height: 40 };
                }
                return null;
            };
            palette.dataBind();
            done();
        });
        it('Themes TestCases resize andd rotate', (done: Function) => {
            let resizeelem = document.querySelector('.e-diagram-resize-handle');
            let resizeelemstyle = getComputedStyle(resizeelem);
            expect(resizeelemstyle.fill === 'rgb(227, 22, 91)' || resizeelemstyle.fill === 'rgb(255, 64, 129)').toBe(true);
            let rotateelem = document.querySelector('.e-diagram-rotate-handle');
            let rotateelemstyle = getComputedStyle(rotateelem);
            expect(resizeelemstyle.fill === 'rgb(227, 22, 91)' || resizeelemstyle.fill === 'rgb(255, 64, 129)').toBe(true);
            done();
        })
        it('Themes TestCases for pivot and border', (done: Function) => {
            let pivotelem = document.querySelector('.e-diagram-pivot-line');
            let pivotelemstyle = getComputedStyle(pivotelem);
            expect(pivotelemstyle.stroke === 'rgb(227, 22, 91)' || pivotelemstyle.stroke === 'rgb(255, 64, 129)').toBe(true);
            let events: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.clickEvent(diagramCanvas, 450, 100);
            let borderelem = document.querySelector('.e-diagram-border');
            let borderelemstyle = getComputedStyle(borderelem);
            done();
        });
        it('Changing the expandMode at runtime', (done: Function) => {
            palette.expandMode = 'Single';
            palette.dataBind();
            setTimeout(() => {
                expect(palette.palettes[0].expanded == false).toBe(true);
                expect(palette.palettes[palette.palettes.length - 1].expanded == true).toBe(true);
                done();
            }, 300);

        });

        it('Changing the enableAnimation at runtime', (done: Function) => {
            palette.expandMode = 'Multiple';
            palette.enableAnimation = true;
            palette.dataBind();
            setTimeout(() => {
                expect(palette.palettes[0].expanded).toBe(true);
                done();
            }, 1000);
        });

        it('Expanding palette interactively', (done: Function) => {
            let accordion: string = 'accordionElement';
            palette.enableAnimation = false;
            palette.dataBind();
            setTimeout(() => {
                mouseEvents.clickEvent(palette[accordion].element, 100, 255);
                setTimeout(() => {
                    expect(palette.palettes[1].expanded).toBe(true);
                    done();
                }, 20);
            }, 10);
        });
        it('Checking custom size without size using string function', (done: Function) => {
            window['getSymbolInfo'] = function (symbol: Node | Connector): SymbolInfo {
                if (symbol.shape.type === 'Bpmn') {
                    return { width: 50, height: 50 };
                }
                if (symbol.id === 'decision' || symbol.id === 'start' || symbol.id === 'end') {
                    return { width: 100, height: 40 };
                }
                return null;
            }
            palette.getSymbolInfo = 'getSymbolInfo';
            palette.dataBind();

            done();
        });
        it('checking filter symbols in palette using string function', (done: Function) => {
            palette.enableSearch = true;
            palette.dataBind();
            window['filterSymbols'] = function (symbol: NodeModel[] | ConnectorModel[]): NodeModel[] | ConnectorModel[] {
                return null;
            }
            palette.filterSymbols = 'filterSymbols';
            let events: MouseEvents = new MouseEvents();
            let element: HTMLElement = document.getElementById("textEnter");
            element.focus();
            (document.getElementById("textEnter") as HTMLInputElement).value = "st";
            let eventName = "keyUp";
            palette[eventName]({ target: element });
            setTimeout(() => {
                expect(document.getElementById("SearchPalette").children.length === 1).toBe(true);
                done();
            }, 500);
        });
        it('Checking symbol size using string function', (done: Function) => {
            palette.enableSearch = false;
            palette.dataBind();

            palette.symbolWidth = 80;
            palette.symbolHeight = 80;
            window['getNodeTemplate'] = function (symbol: NodeModel): DiagramElement {
                return getNodeTemplate(symbol);
            }
            palette.getSymbolTemplate = 'getNodeTemplate';
            palette.dataBind();
            setTimeout(() => {
                let start: HTMLElement = document.getElementById('start');
                expect(start.offsetWidth == 143 && start.offsetHeight == 143).toBe(true);
                done();

            }, 10);
        });

        it('Checking review without symbolPreview width ', (done: Function) => {

            palette.symbolPreview.width = undefined;
            palette.dataBind();
            var events = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseUpEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length == 0).toBe(true);
            done();
        });
        it('Checking review without symbolPreview height ', (done: Function) => {
            palette.symbolPreview.width = 100;
            palette.symbolPreview.height = undefined;
            palette.dataBind();
            var events = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseUpEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length == 0).toBe(true);
            done();
        });

        it('Refresh palettes at runtime', (done: Function) => {
            palette.palettes = [
                {
                    id: 'BPMN', symbols: [
                        {
                            id: 'BPMNStart', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'None' } },
                        },
                        {
                            id: 'Intermediate', style: { strokeWidth: 2 }, shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Intermediate', trigger: 'None' } },
                        }
                    ], title: 'BPMN'
                }
            ];
            palette.dataBind()
            expect(palette.palettes.length === 1).toBe(true);
            done();
        });
    });
    describe('Testing symbol palette', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let flowshapes: NodeModel[] = [
            {
                id: 'node1', width: 5, height: 5, offsetX: 10,
                offsetY: 100,
            },
            {
                id: 'node2', width: 5, height: 5, offsetX: 20,
                offsetY: 20
            },
            { id: 'group', children: ['node1', 'node2'], }
        ];

        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolpaletteGroupIssue', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagramGroupIssue', styles: 'width:74%;height:500px;float:left;' }));
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
                            type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,' +
                                '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z'
                        },
                        annotations: [{ content: 'Path Element' }]
                    },
                    {
                        id: 'group', children: ['node12', 'node22'],
                        constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
                    },
                    {
                        id: 'node342', width: 100, height: 100, offsetX: 300, offsetY: 400,
                        shape: {
                            type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,' +
                                '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z'
                        },
                        annotations: [{ content: 'Path Element' }]
                    }
                ],
                width: '70%'
            });
            diagram.appendTo('#diagramGroupIssue');

            palette = new SymbolPalette({
                width: '25%', height: '500px',
                palettes: [
                    { id: 'flow', expanded: true, symbols: flowshapes, title: 'Flow Shapes' }
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
            palette.appendTo('#symbolpaletteGroupIssue');
            function setPaletteNodeDefaults(node: NodeModel): void {
                node.width = 50;
                node.height = 50;
            }
            let groupNodes: NodeModel[] = [];
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
            debugger
            setTimeout(function () {
                palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                    let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                    let position: PointModel = palette['getMousePosition'](e.sender);
                    let target = document.elementFromPoint(position.x, position.y).childNodes[0];
                    let symbols: IElement = palette.symbolTable[target['id']];
                    palette['selectedSymbols'] = symbols;
                    if (symbols !== undefined) {
                        clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                        clonedElement.setAttribute('paletteId', palette.element.id);
                    }
                    return clonedElement;
                };
                palette.getPersistData();
                let events = new MouseEvents();
                let element = (document.getElementById('group_container').getBoundingClientRect());;
                let targetNode: NodeModel = diagram.nodes[2];
                events.mouseDownEvent(palette.element, element.left + palette.element.offsetLeft, element.top + palette.element.offsetTop, false, false);
                events.mouseMoveEvent(palette.element, element.left + 40 + palette.element.offsetLeft, element.top + palette.element.offsetLeft, false, false);
                events.mouseMoveEvent(palette.element, element.left + 60, element.top, false, false);
                events.mouseMoveEvent(diagram.element, 400, 50, false, false);
                events.mouseMoveEvent(diagram.element, 400, 50 - diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, 400, 50 - 5 - diagram.element.offsetTop, false, false);
                events.mouseUpEvent(diagram.element, 400, 50 - 10 - diagram.element.offsetTop, false, false);
                expect(diagram.nodes.length === 4).toBe(true);
                done();
            }, 1000);
        });
    });
});