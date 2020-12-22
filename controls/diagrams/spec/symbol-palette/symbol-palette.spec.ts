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
import { NodeConstraints, SelectorConstraints, PortVisibility, PortConstraints } from '../../src/diagram/enum/enum';
import { UndoRedo } from '../../src/diagram/objects/undo-redo'
import {
    SymbolPalette, SymbolInfo, PaletteModel,
} from '../../src/symbol-palette/index';
import  {profile , inMB, getMemoryProfile} from '../common.spec';

import { MouseEvents } from '../diagram/interaction/mouseevents.spec';
import { IElement, PointModel, TextElement, StackPanel, DiagramElement, randomId, UserHandleModel } from '../../src/diagram/index'; 
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
        let flowshapes: NodeModel[] = [{ id: 'start', dragSize:{width:300, height:300}, previewSize:{width:200, height:200} ,shape: { type: 'Flow', shape: 'Terminator' },pivot:{x:0,y:0} },
        { id: 'process', dragSize:{width:300, height:300}, previewSize:{width:200, height:200} , shape: { type: 'Flow', shape: 'Process' } },
        { id: 'decision', dragSize:{width:300, height:300}, previewSize:{width:200, height:200} , shape: { type: 'Flow', shape: 'Decision' } },
        { id: 'data', dragSize:{width:300, height:300}, previewSize:{width:200, height:200} , shape: { type: 'Flow', shape: 'Data' } },
        { id: 'end',  dragSize:{width:300, height:300}, previewSize:{width:200, height:200} ,shape: { type: 'Flow', shape: 'Terminator' } }];

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
            id: 'annot4', width: 100, height: 100,pivot:{x:0,y:0},
            shape: { type: 'Bpmn', shape: 'TextAnnotation', annotation: { angle: 280, length: 150, text: 'textAnnotation4' } }
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
            var handle: UserHandleModel[] = [ {
                name: 'clone',
                pathData:
                  'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,' +
                  '0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z ' +
                  'M68.5,72.5h-30V34.4h30V72.5z',
                visible: true,
                offset: 0,
                side: 'Bottom',
                margin: { top: 0, bottom: 0, left: 0, right: 0 }
              }]


            diagram = new Diagram({
                connectors: connectors, nodes: nodes, pageSettings: { background: { color: 'transparent' } },
                selectedItems: { constraints: SelectorConstraints.All, userHandles: handle },
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
        it('Mouse cursor does not placed on the node', (done: Function) => {
            debugger;
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
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
                console.log((arg.element as NodeModel).offsetX);
                console.log((arg.element as NodeModel).offsetY);
                expect((arg.element as NodeModel).offsetX === 400).toBe(true);
                expect((arg.element as NodeModel).offsetY === 400).toBe(true);
                done();
            }
            let events: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            events.mouseMoveEvent(diagramCanvas, 300+diagram.element.offsetLeft, 300+diagram.element.offsetTop, false, false);
            events.mouseMoveEvent(diagramCanvas, 400+diagram.element.offsetLeft, 400+diagram.element.offsetTop, false, false);
            events.mouseUpEvent(diagramCanvas, 400+diagram.element.offsetLeft, 400+diagram.element.offsetTop, false, false);
            expect(diagram.selectedItems.nodes[0].offsetX === 400).toBe(true);
            expect(diagram.selectedItems.nodes[0].offsetY === 400).toBe(true);
            diagram.undo();
            done();
        });
        it('Mouse cursor does not placed on the node -text annotation', (done: Function) => {
            debugger;
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
                let symbols: IElement = palette.symbolTable["annot4"];
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
                console.log((arg.element as NodeModel).offsetX);
                console.log((arg.element as NodeModel).offsetY);
                expect(Math.round((arg.element as NodeModel).offsetX) === 311||Math.round((arg.element as NodeModel).offsetX) === 311.5).toBe(true);
                expect(Math.round((arg.element as NodeModel).offsetY) === 311).toBe(true);
                expect((arg.element as NodeModel).id === diagram.currentSymbol.id).toBe(true);
                done();
            }
            let events: MouseEvents = new MouseEvents();
            debugger;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.mouseDownEvent(palette.element, 175, 350, false, false);
            events.mouseMoveEvent(palette.element, 100, 350, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            events.mouseMoveEvent(diagramCanvas, 300+diagram.element.offsetLeft, 300+diagram.element.offsetTop, false, false);
            events.mouseUpEvent(diagramCanvas, 300+diagram.element.offsetLeft, 300+diagram.element.offsetTop, false, false);
            expect(Math.round(diagram.selectedItems.nodes[0].offsetX) === 311).toBe(true);
            expect(Math.round(diagram.selectedItems.nodes[0].offsetY) === 311).toBe(true);
            diagram.undo();
            done();
        });
        it('Checking drag and drop', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
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
                expect((arg.element as NodeModel).width === 300).toBe(true);
                expect((arg.element as NodeModel).height === 300).toBe(true);
                expect((arg.element as NodeModel).id === diagram.currentSymbol.id).toBe(true);
                done();
            }
            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            expect(palette.selectedSymbols.wrapper.children[0].width === 199).toBe(true);
            expect(palette.selectedSymbols.wrapper.children[0].height === 199).toBe(true);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 300, 300, false, false);
            events.mouseMoveEvent(diagram.element, 400, 400, false, false);
            var ele = document.getElementById('diagram_SelectorElement')
            console.log('symbolpalette');
            console.log(ele);
            expect(ele.childElementCount===1).toBe(true);
            events.mouseUpEvent(diagram.element, 400, 400, false, false);
            expect(diagram.selectedItems.nodes[0].width === 300).toBe(true);
            expect(diagram.selectedItems.nodes[0].height === 300).toBe(true);
            expect(diagram.nodes.length).toBe(3);
            diagram.undo()
            expect(diagram.nodes.length).toBe(2);
            done();
        });
        it('drag and drop annotation node', (done: Function) => {
            debugger;
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
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
                let clonedElement: HTMLElement; let diagramElement: any;
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
                let clonedElement: HTMLElement; let diagramElement: any;
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
                let clonedElement: HTMLElement; let diagramElement: any;
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
                diagram.connectors[1].wrapper.offsetX == 154.5 || diagram.connectors[1].wrapper.offsetX === 304.5 ||
                diagram.connectors[1].wrapper.offsetX == 309 || Math.round(diagram.connectors[1].wrapper.offsetX) == 303 ||
                Math.round(diagram.connectors[1].wrapper.offsetX) == 304 || Math.round(diagram.connectors[1].wrapper.offsetX) == 348 || 
                Math.round(diagram.connectors[1].wrapper.offsetX) == 347 ||
                Math.round(diagram.connectors[1].wrapper.offsetX) == 300).toBe(true);
                expect(diagram.connectors[1].wrapper.offsetY >= 339 && diagram.connectors[1].wrapper.offsetY <= 340).toBe(true);
                done();
        });
        it('Checking dragging native node', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
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
                let clonedElement: HTMLElement; let diagramElement: any;
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
            done();
            // setTimeout(() => {
            //     expect(palette.palettes[0].expanded == false).toBe(true);
            //     expect(palette.palettes[palette.palettes.length - 1].expanded == true).toBe(true);
            //     done();
            // }, 300);

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
        it('Collapse Palette at run time', (done: Function) => {
            palette.palettes[0].expanded = false;
            palette.dataBind();
            expect(palette.palettes[0].expanded === false).toBe(true);
            done();
        });
        it('Expand Palette at run time', (done: Function) => {
            palette.palettes[0].expanded = true;
            palette.dataBind();
            expect(palette.palettes[0].expanded === true).toBe(true);
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
            
            setTimeout(function () {
                palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                    let clonedElement: HTMLElement; let diagramElement: any;
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
                expect(document.getElementById(targetNode.id+'_preview') === null).toBe(true);
                done();
            }, 1000);
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

    describe('Testing symbol palette drag stop on escape', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;

        let palettes: PaletteModel[] = [
            {
                id: 'basicShapes', expanded: true,
                title: 'Basic Shapes',
                symbols: [
                    {
                        id: 'symbol1', shape: { type: 'Basic', shape: 'Rectangle'}, height: 100, width: 100
                    }
                ]
            }
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPaletteEscape', styles: 'width:25%;height:500px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagramEscape', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);

            diagram = new Diagram({
                pageSettings: { background: { color: 'transparent' } },
                nodes: [
                    { id: 'node1', height: 100, width: 100, offsetX: 100, offsetY: 100, shape: { type: 'Basic', shape: 'Rectangle'}}
                ],
                width: '74%', height: '600px'
            });
            diagram.appendTo('#diagramEscape');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: palettes,
                expandMode: 'Multiple',
                enableAnimation: false, symbolHeight: 50, symbolWidth: 50,
                symbolPreview: { height: 100, width: 100 }
            });
            palette.appendTo('#symbolPaletteEscape');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });
        it('Checking retaining selection on dragging', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let target: ChildNode = document.elementFromPoint(position.x, position.y).childNodes[0];
                let symbols: IElement = palette.symbolTable['symbol1'];
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
            expect(diagram.nodes.length === 1).toBe(true);
            events.mouseDownEvent(palette.element, 45, 85, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 300, 300, false, false);
            events.mouseUpEvent(diagram.element, 300, 300, false, false);
            expect(diagram.nodes.length > 1).toBe(true);
            let previousSelectedObjectID: string = diagram.selectedItems.nodes[0].id;
            events.mouseDownEvent(palette.element, 45, 85, false, false);
            events.mouseDownEvent(palette.element, 45, 85, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            events.mouseMoveEvent(diagram.element, 150, 300, false, false);
            expect(diagram.previousSelectedObject !== null &&
                diagram.previousSelectedObject[0].id === previousSelectedObjectID).toBe(true);
            events.mouseUpEvent(diagram.element, 150, 300, false, false);
            done();
        });
        it('Checking Esc key pressing inside diagram', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let target: ChildNode = document.elementFromPoint(position.x, position.y).childNodes[0];
                let symbols: IElement = palette.symbolTable['symbol1'];
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
            events.mouseDownEvent(palette.element, 45, 85, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 200, 150, false, false);
            events.keyDownEvent(diagram.element, 'Escape');
            expect(document.getElementsByClassName('e-dragclone').length === 0).toBe(true);
            events.mouseUpEvent(diagram.element, 200, 150, false, false);
            done();
        });
        it('Checking Esc key pressing inside symbol palette', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let target: ChildNode = document.elementFromPoint(position.x, position.y).childNodes[0];
                let symbols: IElement = palette.symbolTable['symbol1'];
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
            events.mouseDownEvent(palette.element, 45, 85, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.keyDownEvent(document, 'Escape');
            expect(document.getElementsByClassName('e-dragclone').length === 0).toBe(true);
            events.mouseUpEvent(palette.element, 200, 200, false, false);
            done();
        });
  
    });
    describe('Testing symbol palette issue', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;

        let palettes: PaletteModel[] = [
            {
                id: 'basicShapes', expanded: true,
                title: 'Basic Shapes',
                symbols: [
                    {
                        id: 'symbol1', shape: { type: 'Basic', shape: 'Rectangle' }, height: 100, width: 100
                    }
                ]
            }
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPaletteEscape', styles: 'width:25%;height:500px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagramEscape', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);

            diagram = new Diagram({
                pageSettings: { background: { color: 'transparent' } },
                nodes: [
                    { id: 'node1', height: 100, width: 100, offsetX: 100, offsetY: 100, shape: { type: 'Basic', shape: 'Rectangle' } }
                ],
                width: '74%', height: '600px'
            });
            diagram.appendTo('#diagramEscape');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: palettes,
                expandMode: 'Multiple',
                enableAnimation: false, symbolHeight: 50, symbolWidth: 50,
                symbolPreview: { height: 100, width: 100 }
            });
            palette.appendTo('#symbolPaletteEscape');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });
        it('Checking retaining selection on dragging', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let target: ChildNode = document.elementFromPoint(position.x, position.y).childNodes[0];
                let symbols: IElement = palette.symbolTable['symbol1'];
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
            expect(diagram.pageSettings.margin.left >= 0).toBe(true);
            done();
        });
        it('Checking collection change event', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            diagram.collectionChange = (arg) => {
                arg.cancel = true;
                done();
            }
            done();
        });

    });

    describe('Testing symbol palette Zindex', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;

        let palettes: PaletteModel[] = [
            {
                id: 'basicShapes', expanded: true,
                title: 'Basic Shapes',
                symbols: [
                    {
                        id: 'symbol1', shape: { type: 'Basic', shape: 'Rectangle'}, height: 100, width: 100
                    }
                ]
            }
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPaletteOrder', styles: 'width:25%;height:500px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagramOrder', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);

            diagram = new Diagram({
                pageSettings: { background: { color: 'transparent' } },
                nodes: [
                    { id: 'node1', height: 100, width: 100, offsetX: 100, offsetY: 100, shape: { type: 'Basic', shape: 'Rectangle'}}
                ],
                width: '74%', height: '600px'
            });
            diagram.appendTo('#diagramOrder');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: palettes,
                expandMode: 'Multiple',
                enableAnimation: false, symbolHeight: 50, symbolWidth: 50,
                symbolPreview: { height: 100, width: 100 }
            });
            palette.appendTo('#symbolPaletteOrder');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });

        
        it('Checking zindex for symbol palette', (done: Function) => {
            
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let target: ChildNode = document.elementFromPoint(position.x, position.y).childNodes[0];
                let symbols: IElement = palette.symbolTable['symbol1'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };
            
            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 45, 85, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 300, 300, false, false);
            events.mouseUpEvent(diagram.element, 300, 300, false, false);
            expect(diagram.nodes[1].zIndex).toBe(1);
            done();
        });
    });

    describe('Node default connector default test cases', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;

        let palettes: PaletteModel[] = [
            {
                id: 'basicShapes', expanded: true,
                title: 'Basic Shapes',
                symbols: [
                    {
                        id: 'symbol1', shape: { type: 'Basic', shape: 'Rectangle' }, height: 100, width: 100
                    }
                ]
            }
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPaletteOrder', styles: 'width:25%;height:500px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagramOrder', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: '100%', height: '500px',


            });
            diagram.appendTo('#diagramOrder');
            function getFlowShapes(): NodeModel[] {

                let flowShapes: NodeModel[] = [
                    {
                        id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' },
                        ports: [{ id: 'port1', visibility: PortVisibility.Visible, offset: { x: 1, y: 0 } }, { id: 'port2', offset: { x: 0, y: 1 }, visibility: PortVisibility.Visible }],
                        style: { strokeWidth: 2 }, annotations: [{ id: 'dd', content: 'df' }]
                    },
                ];

                return flowShapes;
            }
            function getConnectors(): ConnectorModel[] {

                let connectorSymbols: ConnectorModel[] = [
                    {
                        id: 'Link1', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
                        targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 2 }
                    },
                    {
                        id: 'Link3', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },

                    },
                ];

                return connectorSymbols;
            }
            palette = new SymbolPalette({
                expandMode: 'Multiple',
                palettes: [
                    { id: 'flow', expanded: true, symbols: getFlowShapes(), title: 'Flow Shapes' },
                    { id: 'connectors', expanded: true, symbols: getConnectors(), title: 'Connectors' }
                ],
                width: '100%', height: '100%', symbolHeight: 50, symbolWidth: 50,
                ignoreSymbolsOnSearch: ['Terminator'],
                symbolPreview: { height: 100, width: 100 },
                enableSearch: true,
                connectorDefaults: {
                    type: 'Bezier', style: { strokeColor: 'red' }, targetDecorator: {
                        style: { fill: 'blue' },
                        pivot: { x: 0, y: 0.5 }
                    }
                },
                nodeDefaults: {
                    width: 200,
                    ports: [{ style: { fill: 'gray' }, constraints: PortConstraints.Drag }],
                    height: 200, style: { fill: 'red' }, annotations: [{ content: 'ss', style: { fill: 'red' } }]
                },
                symbolMargin: { left: 12, right: 12, top: 12, bottom: 12 },
                getSymbolInfo: (symbol: NodeModel): SymbolInfo => {
                    return { fit: true };
                }
            });
            palette.appendTo('#symbolPaletteOrder');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });


        it('Node default connector default test cases', (done: Function) => {
            
            var shape: NodeModel | ConnectorModel;;
            expect((palette.palettes[0].symbols[0].wrapper.children[0] as any).children[0].style.strokeWidth === 2
                && (palette.palettes[0].symbols[0].wrapper.children[0] as any).children[0].style.fill === 'red'
                && (palette.palettes[1].symbols[0].wrapper.children[0] as any).children[0].children[0].style.strokeColor === 'red'
                && (palette.palettes[1].symbols[0].wrapper.children[0] as any).children[0].children[2].style.fill === 'blue'
            ).toBe(true)
            shape = { id: 'newflow' + randomId(), shape: { type: 'Flow', shape: 'Process' } };
            palette.addPaletteItem('flow', shape);
            palette.dataBind();
            shape = { id: 'Link33', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 } }
            palette.addPaletteItem('flow', shape);
            palette.dataBind();
            expect((palette.palettes[0].symbols[1].wrapper.children[0] as any).children[0].style.fill === 'red'
                && (palette.palettes[0].symbols[2].wrapper.children[0] as any).children[0].children[0].style.strokeColor === 'red').toBe(true)
            done();
        });
        it('ignore search test case', (done: Function) => {
            palette.enableSearch = true;
            palette.dataBind();
            let element: HTMLElement = document.getElementById("textEnter");
            element.focus();
            (document.getElementById("textEnter") as HTMLInputElement).value = "ter";
            let eventName = "keyUp";
            palette[eventName]({ target: element });
            setTimeout(() => {
                expect(document.getElementById('SearchPalette').children[0].id === 'EmptyDiv').toBe(true);
                done();
            }, 500);

        });
    });
    describe('CR issue for render Highlighter', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;
        let flowshapes: NodeModel[] = [{ id: 'start', shape: { type: 'Flow', shape: 'Terminator' } },
        { id: 'process', shape: { type: 'Flow', shape: 'Process' } },
        { id: 'decision', shape: { type: 'Flow', shape: 'Decision' } },
        { id: 'data', shape: { type: 'Flow', shape: 'Data' } },
        { id: 'end', shape: { type: 'Flow', shape: 'Terminator' } }];


        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolpalette', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'nodea', maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                    offsetX: 50, offsetY: 300,
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
           

            diagram = new Diagram({
                nodes: nodes, pageSettings: { background: { color: 'transparent' } },
                selectedItems: { constraints: SelectorConstraints.All,
                 },
                width: '70%'
            });
            diagram.appendTo('#diagram');

            palette = new SymbolPalette({
                width: '25%', height: '500px',
                palettes: [
                    { id: 'flow', expanded: true, symbols: flowshapes, iconCss: '', title: 'Flow Shapes' },
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

       


        it('CR issue for render Highlighter', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
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
            let element = document.getElementById("diagram_diagramAdorner_svg")
            expect(element.childElementCount === 1).toBe(true);
            done();
        });


    });
    describe('Annotation interaction mouse leave ', () => {
        let palette: SymbolPalette;
        let ele: HTMLElement;
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div');
            ele.appendChild(createElement('div', { id: 'symbolpalette', styles: 'width:25%;float:left;' }));
            document.body.appendChild(ele);
            var palette = new SymbolPalette({
                expandMode: 'Multiple',
                palettes: [
                    {
                        id: 'flow', expanded: true, symbols: [
                            {
                                id: 'aggregate',
                                style: { fill: 'none' },
                                shape: {
                                    type: 'Native',
                                    content: "<g><path d=\"m450 60v437c0 8.402344-6.597656 15-15 15h-420c-8.402344 0-15-6.597656-15-15v-437l30-30h390zm0 0\" fill=\"#e0f4ff\"/><path d=\"m450 60v437c0 8.402344-6.597656 15-15 15h-210v-482h195zm0 0\" fill=\"#bbdcff\"/><path d=\"m375 120h-300c-8.402344 0-15 6.597656-15 15v61c0 8.402344 6.597656 15 15 15h300c8.402344 0 15-6.597656 15-15v-61c0-8.402344-6.597656-15-15-15zm0 0\" fill=\"#7fe881\"/><path d=\"m225 241h-150c-8.402344 0-15 6.597656-15 15v181c0 8.402344 6.597656 15 15 15h150c8.402344 0 15-6.597656 15-15v-181c0-8.402344-6.597656-15-15-15zm0 0\" fill=\"#bbdcff\"/><g fill=\"#9abadb\"><path d=\"m375 331h-90c-8.289062 0-15-6.710938-15-15v-60c0-8.289062 6.710938-15 15-15h90c8.289062 0 15 6.710938 15 15v60c0 8.289062-6.710938 15-15 15zm0 0\"/><path d=\"m375 452h-90c-8.289062 0-15-6.710938-15-15v-61c0-8.289062 6.710938-15 15-15h90c8.289062 0 15 6.710938 15 15v61c0 8.289062-6.710938 15-15 15zm0 0\"/><path d=\"m240 256v181c0 8.402344-6.597656 15-15 15v-211c8.402344 0 15 6.597656 15 15zm0 0\"/></g><path d=\"m390 135v61c0 8.402344-6.597656 15-15 15h-150v-91h150c8.402344 0 15 6.597656 15 15zm0 0\" fill=\"#5bc980\"/><path d=\"m450 15v45h-450v-45c0-8.402344 6.597656-15 15-15h420c8.402344 0 15 6.597656 15 15zm0 0\" fill=\"#61729b\"/><path d=\"m450 15v45h-225v-60h210c8.402344 0 15 6.597656 15 15zm0 0\" fill=\"#47568c\"/></g>"
                                },
                                width: 48,
                                height: 48,
                            }
                        ], title: 'Flow Shapes'
                    },
                ],
                width: '100%', height: '100%',
                symbolHeight: 80,
                symbolWidth: 95,
                getSymbolInfo: function () {
                    return {
                        description:  { text: "Aggregate"},
                        tooltip: "Aggregate",
                        fit: true,
                    };
                },
                symbolMargin: {
                    left: 3,
                    right: 3,
                    top: 5,
                    bottom: 5
                }
            });
            palette.appendTo('#symbolpalette');
        });

        afterAll((): void => {
            palette.destroy();
            ele.remove();
        });
        it('Symbol Description render in Palette', (done: Function) => {
            diagramCanvas=document.getElementById("aggregate_g");
            var textelement=diagramCanvas.getElementsByTagName("text")[0];
            expect(textelement.id != "undefined_text").toBe(true);
            done();
        });
    })
    describe('Adding groupnode into palette', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;
        function groupnode(){
            if (diagram.selectedItems.nodes.length > 0) {
                var nodes_1 = diagram.selectedItems.nodes[0];
                if (nodes_1.children) {
                    for (var i = 0; i < (nodes_1.children).length; i++) {
                        var child1 = diagram.getObject((nodes_1.children[i]));
                        palette.addPaletteItem('basic', child1, true);                      
                    };
                }
                palette.addPaletteItem('basic', nodes_1, false);
                palette.dataBind();
               
            }}
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPaletteOrder', styles: 'width:25%;height:500px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagramOrder', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 50, height: 50, offsetX: 100,
                    offsetY: 100,
                }, {
                    id: 'node2', width: 50, height: 50, offsetX: 200,
                    offsetY: 100
                },
                
                { id: 'group', children: ['node1', 'node2']}
            ];
            diagram = new Diagram({
                width: '800px', height: '500px', nodes: nodes
        
            });
            diagram.appendTo('#diagramOrder');
            function getBasicShapes(): NodeModel[] {
                let BasicShapes: NodeModel[] = [];
                return BasicShapes;
            }
            
            palette = new SymbolPalette({
                expandMode: 'Multiple',
                palettes: [
                    { id: 'basic', expanded: true, symbols: getBasicShapes(), title: 'Basic Shapes' },
                ],
                width: '200', height: '100%', symbolHeight: 50, symbolWidth: 50,
                symbolPreview: { height: 100, width: 100 },
               
            });
            palette.appendTo('#symbolPaletteOrder');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });

        it('Adding group node into palette test cases', (done: Function) => {  
            debugger          
            diagram.select([diagram.nodes[2]]);
            groupnode();
            expect((document.getElementById('basic').childNodes.length == 1)).toBe(true)
            done();
        });
        
    });
    describe('Cancel support for symbol palette ', () => {
        let symbolPalette: SymbolPalette
        let ele: HTMLElement;
        let clickedPalette: boolean;
        beforeAll((): void => {
            ele = createElement('div');
            ele.appendChild(createElement('div', { id: 'symbolPalette', styles: 'width:25%;float:left;' }));
            document.body.appendChild(ele);
            symbolPalette = new SymbolPalette ({
                palettes:  [
                    {
                        id: 'swimlaneShapes', expanded: true,
                        title: 'Swimlane Shapes',
                        symbols: [
                            {
                                id: 'stackCanvas1',
                                shape: {
                                    type: 'SwimLane',lanes: [
                                        {
                                            id: 'lane1',
                                            style: { fill: '#f5f5f5'},height: 60, width: 150,
                                                            header:{ width: 50, height: 50, style: {fill:'#C7D4DF'} },
                                        }
                                    ],
                                    orientation: 'Horizontal', isLane: true
                                },
                                height: 60,
                                width: 140,
                                style: { fill: '#f5f5f5'},
                                offsetX: 70,
                                offsetY: 30,
                            }
                        ]
                    }],
                symbolHeight: 50, symbolWidth: 50,
                symbolPreview: { width: 100, height: 100},
                expandMode: 'Multiple',
                height: '400px',
                width: '200px',
                paletteExpanding: function (args) 
                {
                    args.cancel = true;
                }
            });
            symbolPalette.appendTo('#symbolPalette');
        });
        afterAll((): void => {
            symbolPalette.destroy();
            ele.remove();
        });
        it('Cancel support while expand collapse', (done: Function) => {
            setTimeout(() => {
            var paletteHeader : any = document.getElementsByClassName('e-acrdn-header')
            paletteHeader[1].click();
            clickedPalette = symbolPalette.palettes[0].expanded;
            expect(clickedPalette === true).toBe(true);
            done();
            }, 100);
        });
    })
    describe(' Exception occurs while change allowDrag from false to true for symbol palette ', () => {
        let symbolPalette: SymbolPalette
        let ele: HTMLElement;
        let clickedPalette: boolean;
        beforeAll((): void => {
            ele = createElement('div');
            ele.appendChild(createElement('div', { id: 'symbolPalette', styles: 'width:25%;float:left;' }));
            document.body.appendChild(ele);
            let basicShapes: NodeModel[] = [ {
                id: 'node2', style: { fill: 'none' },
                annotations: [{ content: 'Start \n Text Editing' }],
                shape: {
                    type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">	<g transform="translate(1 1)">		<g>			<path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,1.791-6.827,1.28     C62.726,435.13,62.354,435.072,61.979,435.057z"/>			<path style="fill:#61443C;" d="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304     c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296     c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504     c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z"/>		</g>		<path style="fill:#8B685A;" d="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z"/>		<path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z"/>		<path style="fill:#9ACA5C;" d="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z"/>		<path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z"/>		<path style="fill:#9ACA5C;" d="M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z"/>	</g>	<g>		<path d="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/>		<path d="M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/>		<path d="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/>		<path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/>		<path d="M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z"/>		<path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z"/>		<path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z"/>		<path d="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/>		<path d="M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/>		<path d="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z"/>		<path d="M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/>		<path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/>		<path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/>		<path d="M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/>		<path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/>		<path d="M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/>		<path d="M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/>		<path d="M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/>		<path d="M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/>	</g></g>',
                }
            },
            {
                id: 'syncfusion', style: { fill: 'none'},
                shape: {
                    type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">' +
                    '<rect height="256" width="256" fill="#34353F"/>' +
                    '<path id="path1" transform="rotate(0,128,128) translate(59,61.2230899333954) scale(4.3125,4.3125)  " fill="#FFFFFF" d="M18.88501,23.042998L26.804993,23.042998 26.804993,30.969001 18.88501,30.969001z M9.4360352,23.042998L17.358032,23.042998 17.358032,30.969001 9.4360352,30.969001z M0.014038086,23.042998L7.9360352,23.042998 7.9360352,30.969001 0.014038086,30.969001z M18.871033,13.609001L26.791016,13.609001 26.791016,21.535994 18.871033,21.535994z M9.4219971,13.609001L17.342041,13.609001 17.342041,21.535994 9.4219971,21.535994z M0,13.609001L7.9219971,13.609001 7.9219971,21.535994 0,21.535994z M9.4219971,4.1859968L17.342041,4.1859968 17.342041,12.113998 9.4219971,12.113998z M0,4.1859968L7.9219971,4.1859968 7.9219971,12.113998 0,12.113998z M25.846008,0L32,5.2310026 26.773987,11.382995 20.619019,6.155998z"/>' +
                  '</g>'
                }
            },
            {
                id: 'network', style: { fill: 'none'},
                shape: {
                    type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">' +
                    '<rect height="256" width="256" fill="#34353F"/>' +
                    '<path id="path1" transform="rotate(0,128,128) translate(59.1078108549118,59) scale(4.3125,4.3125)  " fill="#FFFFFF" d="M12.12701,24.294998C12.75201,24.294998 13.258998,24.803009 13.258998,25.428009 13.258998,26.056 12.75201,26.563004 12.12701,26.563004 11.499019,26.563004 10.993007,26.056 10.993007,25.428009 10.993007,24.803009 11.499019,24.294998 12.12701,24.294998z M7.9750035,24.294998C8.6010101,24.294998 9.1090057,24.803009 9.1090057,25.428009 9.1090057,26.056 8.6010101,26.563004 7.9750035,26.563004 7.3480199,26.563004 6.8399942,26.056 6.8399942,25.428009 6.8399942,24.803009 7.3480199,24.294998 7.9750035,24.294998z M7.9750035,20.286011C8.6010101,20.286011 9.1090057,20.792999 9.1090057,21.419006 9.1090057,22.044006 8.6010101,22.552002 7.9750035,22.552002 7.3500035,22.552002 6.8420084,22.044006 6.8420084,21.419006 6.8420084,20.792999 7.3500035,20.286011 7.9750035,20.286011z M18.499994,19.317001C18.313013,19.317001,18.156,19.472,18.156,19.656006L18.156,27.01001C18.156,27.195007,18.313013,27.350006,18.499994,27.350006L29.521993,27.350006C29.707998,27.350006,29.865988,27.195007,29.865988,27.01001L29.865988,19.656006C29.865988,19.472,29.707998,19.317001,29.521993,19.317001z M17.243006,17.443008L30.778003,17.443008C31.425007,17.445007,31.947986,17.962006,31.950001,18.602997L31.950001,28.542007C31.947986,29.182999,31.425007,29.702011,30.778003,29.703003L25.654012,29.703003C25.511007,29.703003 25.399008,29.824997 25.413992,29.964996 25.430013,30.13501 25.452993,30.360001 25.477011,30.559998 25.506002,30.809998 25.727987,30.980011 25.976003,31.033997L27.756002,31.419006C27.907003,31.452011 28.015005,31.584 28.015005,31.738007 28.015005,31.883011 27.895986,32 27.74999,32L27.571005,32 20.450004,32 20.318016,32C20.171013,32 20.053001,31.883011 20.053001,31.738007 20.053001,31.585007 20.161003,31.452011 20.312004,31.419998L22.115989,31.033005C22.35601,30.98201 22.572014,30.815002 22.596,30.574005 22.616997,30.363007 22.636009,30.130997 22.648002,29.960007 22.658012,29.819 22.542015,29.70401 22.399986,29.70401L17.243006,29.703003C16.596002,29.702011,16.072992,29.182999,16.071008,28.542007L16.071008,18.602997C16.072992,17.962006,16.596002,17.445007,17.243006,17.443008z M7.9750035,16.133011C8.6020172,16.133011 9.1100128,16.641006 9.1100128,17.268005 9.1100128,17.893997 8.6020172,18.402008 7.9750035,18.402008 7.3489964,18.402008 6.8410013,17.893997 6.8410013,17.268005 6.8410013,16.641006 7.3489964,16.133011 7.9750035,16.133011z M24.027,13.762009C24.654014,13.762009 25.16201,14.270004 25.16201,14.895996 25.16201,15.522003 24.654014,16.029999 24.027,16.029999 23.400993,16.029999 22.892998,15.522003 22.892998,14.895996 22.892998,14.270004 23.400993,13.762009 24.027,13.762009z M24.027,9.6110077C24.653007,9.6110077 25.161003,10.119003 25.161003,10.74501 25.161003,11.37001 24.653007,11.878006 24.027,11.878006 23.402,11.878006 22.894005,11.37001 22.894005,10.74501 22.894005,10.119003 23.402,9.6110077 24.027,9.6110077z M24.027,5.6000061C24.654014,5.6000061 25.16201,6.1080017 25.16201,6.7350006 25.16201,7.3610077 24.654014,7.8690033 24.027,7.8690033 23.400993,7.8690033 22.892998,7.3610077 22.892998,6.7350006 22.892998,6.1080017 23.400993,5.6000061 24.027,5.6000061z M19.876001,5.6000061C20.503013,5.6000061 21.011009,6.1080017 21.011009,6.7350006 21.011009,7.3610077 20.503013,7.8690033 19.876001,7.8690033 19.249994,7.8690033 18.743006,7.3610077 18.743006,6.7350006 18.743006,6.1080017 19.249994,5.6000061 19.876001,5.6000061z M2.4290157,1.8740082C2.2420037,1.8740082,2.0850215,2.029007,2.0850215,2.2140045L2.0850215,9.5680084C2.0850215,9.753006,2.2420037,9.9069977,2.4290157,9.9069977L13.451014,9.9069977C13.637995,9.9069977,13.795008,9.753006,13.795008,9.5680084L13.795008,2.2140045C13.795008,2.029007,13.637995,1.8740082,13.451014,1.8740082z M1.1730042,0L14.706996,0C15.353999,0.0019989014,15.877009,0.51899719,15.878993,1.1600037L15.878993,11.100006C15.877009,11.740005,15.353999,12.26001,14.706996,12.26001L9.5830047,12.26001C9.4399994,12.26001 9.3290069,12.382004 9.3420074,12.52301 9.3600128,12.692001 9.3829925,12.917999 9.4060028,13.117004 9.4349945,13.367004 9.6570099,13.53801 9.9049957,13.591003L11.684994,13.975998C11.835994,14.009003 11.945003,14.141998 11.945003,14.294998 11.945003,14.440002 11.826015,14.557007 11.679012,14.557007L11.499996,14.557007 4.3789966,14.557007 4.2470081,14.557007C4.1000049,14.557007 3.9819935,14.440002 3.9819937,14.294998 3.9819935,14.141998 4.0899952,14.009003 4.2409961,13.977005L6.0450113,13.589996C6.2860086,13.539001 6.501005,13.373001 6.5249918,13.130997 6.5460184,12.921005 6.5650003,12.688004 6.5769937,12.516998 6.5870035,12.376999 6.4710062,12.262009 6.3290079,12.262009L1.1730042,12.26001C0.52499391,12.26001,0.0020143806,11.740005,0,11.100006L0,1.1600037C0.0020143806,0.51899719,0.52499391,0.0019989014,1.1730042,0z"/>' +
                  '</g>'
                }
            }];
            symbolPalette = new SymbolPalette({
                palettes: 
                    [
                        {
                            id: 'svg',
                            expanded: true,
                            symbols: basicShapes,
                            title: 'SVG Shapes',
                            iconCss: 'e-ddb-icons e-basic'
                        }
                    ],
                
                symbolHeight: 80, symbolWidth: 80,
                expandMode: 'Multiple',
                height: '500px',
                width: '100%',
                allowDrag: false
            });
            symbolPalette.appendTo('#symbolPalette');
            symbolPalette.allowDrag = true;
            symbolPalette.dataBind();
        });
        afterAll((): void => {
            symbolPalette.destroy();
            ele.remove();
        });
        it('Exception due to helper ', (done: Function) => {
            let draggable = (symbolPalette as any).draggable.helper
            expect(draggable !== undefined).toBe(true);
            done();
        });
    })
});
describe('Mouse cursor inside the preview shape', () => {
    let diagram: Diagram;
    let palette: SymbolPalette;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    let basicShapes: NodeModel[] = [
        { id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 }, previewSize: { width: 100, height: 100 } },
        { id: 'Ellipse', shape: { type: 'Basic', shape: 'Ellipse' }, style: { strokeWidth: 2 }, previewSize: { width: 100, height: 100 } },
        { id: 'Hexagon', shape: { type: 'Basic', shape: 'Hexagon' }, style: { strokeWidth: 2 } },
    ];
    let bpmnShapes: NodeModel[] = [{
        id: 'node2a', offsetX: 500, offsetY: 100, constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
        shape: { type: 'Bpmn', shape: 'DataObject', dataObject: { collection: false, type: 'None' } }
    },
    {
        id: 'task', offsetX: 300, offsetY: 100,
        shape: {
            type: 'Bpmn', shape: 'Activity',
            activity: { activity: 'SubProcess', subProcess: { type: 'Event' } }
        }
    }, {
        id: 'annot4', previewSize: { width: 100, height: 100 },
        shape: { type: 'Bpmn', shape: 'TextAnnotation', annotation: { angle: 280, length: 150, text: 'textAnnotation4' } }
    }];
    beforeAll((): void => {
        ele = createElement('div', { styles: 'width:100%;height:500px;' });
        ele.appendChild(createElement('div', { id: 'symbolpalettePreview1', styles: 'width:25%;float:left;' }));
        ele.appendChild(createElement('div', { id: 'diagramPreview1', styles: 'width:74%;height:500px;float:left;' }));
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: '1000px', height: '500px',
            pageSettings: {
                background: { color: 'transparent' }
            },
            scrollSettings: {
                canAutoScroll: false,
                scrollLimit: 'Diagram',
            }
        });
        diagram.appendTo('#diagramPreview1');
        palette = new SymbolPalette({
            expandMode: 'Multiple',
            symbolPreview: { height: 200, width: 200 },
            palettes: [
                { id: 'basic', expanded: true, symbols: basicShapes, title: 'Basic Shapes' },
                { id: 'bpmn', expanded: true, symbols: bpmnShapes, title: 'Bpmn Shapes' },
            ],
            width: '700px', height: '500px', symbolHeight: 50, symbolWidth: 50,
            getNodeDefaults: setPaletteNodeDefaults,
            symbolMargin: { left: 12, right: 12, top: 12, bottom: 12 },
        });
        palette.appendTo('#symbolpalettePreview1');
        function setPaletteNodeDefaults(node: NodeModel): void {
            {
                node.width = 50;
                node.height = 50;
            }
            node.style.strokeColor = '#3A3A3A';
        }
    });
    afterAll((): void => {
        diagram.destroy();
        palette.destroy();
        ele.remove();
    });
    it('Mouse cursor inside the preview shape- with palette and shape preview size', (done: Function) => {
        debugger;
        setTimeout(function () {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement;
                let symbols: IElement = palette.symbolTable['Ellipse'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };

            diagram.drop = (arg) => {
                console.log((arg.element as NodeModel).offsetX);
                console.log((arg.element as NodeModel).offsetY);
                expect((arg.element as NodeModel).offsetX === 350).toBe(true);
                expect((arg.element as NodeModel).offsetY === 930).toBe(true);
                done();
            }
            let events: MouseEvents = new MouseEvents();
            debugger;
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseUpEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, false, false);
            diagram.undo();
            expect(diagram.nodes.length === 0).toBe(true);
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            events.mouseMoveEvent(palette.element, 250, 250, false, false);
            events.mouseMoveEvent(palette.element, 300, 300, false, false);
            events.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop, false, false);
            events.mouseMoveEvent(diagramCanvas, 250 + diagram.element.offsetLeft, 250 + diagram.element.offsetTop, false, false);
            events.mouseMoveEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, false, false);
            events.mouseUpEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, false, false);
            expect(diagram.nodes[0].offsetX === 350).toBe(true);
            expect(diagram.nodes[0].offsetY === 930).toBe(true);
            diagram.undo();
            done();
        },
            1000);
    });
    it('Mouse cursor inside the preview shape- with palette and shape preview size-text Annotation', (done: Function) => {
        debugger;
        setTimeout(function () {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement;
                let symbols: IElement = palette.symbolTable['annot4'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };

            diagram.drop = (arg) => {
                console.log((arg.element as NodeModel).offsetX);
                console.log((arg.element as NodeModel).offsetY);
                expect((arg.element as NodeModel).offsetX === 361).toBe(true);
                expect((arg.element as NodeModel).offsetY === 937 || (arg.element as NodeModel).offsetY === 935).toBe(true);
                done();
            }
            let events: MouseEvents = new MouseEvents();
            debugger;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            events.mouseDownEvent(palette.element, 175, 350, false, false);
            events.mouseMoveEvent(palette.element, 100, 350, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            events.mouseMoveEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, false, false);
            events.mouseUpEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, false, false);
            expect(Math.round(diagram.selectedItems.nodes[0].offsetX) === 361).toBe(true);
            expect(Math.round(diagram.selectedItems.nodes[0].offsetY) === 937 || Math.round(diagram.selectedItems.nodes[0].offsetY) === 935).toBe(true);
            diagram.undo();
            done();
        },
            1000);
    });
    it('Mouse cursor inside the preview shape- with palette preview size alone', (done: Function) => {
        debugger;
        setTimeout(function () {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement;
                let symbols: IElement = palette.symbolTable['Ellipse'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };

            diagram.drop = (arg) => {
                console.log((arg.element as NodeModel).offsetX);
                console.log((arg.element as NodeModel).offsetY);
                expect((arg.element as NodeModel).offsetX === 350 || (arg.element as NodeModel).offsetX === 400).toBe(true);
                expect((arg.element as NodeModel).offsetY === 930 || (arg.element as NodeModel).offsetY === 980).toBe(true);
                done();
            }
            let events: MouseEvents = new MouseEvents();
            debugger;
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            palette.symbolPreview.width = undefined; palette.symbolPreview.height = undefined;
            palette.dataBind();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            events.mouseMoveEvent(palette.element, 250, 250, false, false);
            events.mouseMoveEvent(palette.element, 300, 300, false, false);
            events.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop, false, false);
            events.mouseMoveEvent(diagramCanvas, 250 + diagram.element.offsetLeft, 250 + diagram.element.offsetTop, false, false);
            events.mouseMoveEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, false, false);
            events.mouseUpEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, false, false);
            expect(diagram.nodes[0].offsetX === 350).toBe(true);
            expect(diagram.nodes[0].offsetY === 930).toBe(true);
            diagram.undo();
            palette.symbolPreview.width = 200; palette.symbolPreview.height = 200;
            palette.palettes[0].symbols[1].previewSize.width = undefined;
            palette.palettes[0].symbols[1].previewSize.height = undefined;
            palette.dataBind();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            events.mouseMoveEvent(palette.element, 250, 250, false, false);
            events.mouseMoveEvent(palette.element, 300, 300, false, false);
            events.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop, false, false);
            events.mouseMoveEvent(diagramCanvas, 250 + diagram.element.offsetLeft, 250 + diagram.element.offsetTop, false, false);
            events.mouseMoveEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, false, false);
            events.mouseUpEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, false, false);
            console.log(diagram.nodes[0].offsetX);
            console.log(diagram.nodes[0].offsetY);
            console.log(diagram.element.offsetTop);
            expect(diagram.nodes[0].offsetX === 400).toBe(true);
            expect(diagram.nodes[0].offsetY === 980).toBe(true);
            diagram.undo();
            palette.symbolPreview.width = 200; palette.symbolPreview.height = undefined;
            palette.palettes[0].symbols[1].previewSize.width = undefined;
            palette.palettes[0].symbols[1].previewSize.height = 100;
            palette.dataBind();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            events.mouseMoveEvent(palette.element, 250, 250, false, false);
            events.mouseMoveEvent(palette.element, 300, 300, false, false);
            events.mouseMoveEvent(diagramCanvas, 200 + diagram.element.offsetLeft, 200 + diagram.element.offsetTop, false, false);
            events.mouseMoveEvent(diagramCanvas, 250 + diagram.element.offsetLeft, 250 + diagram.element.offsetTop, false, false);
            events.mouseMoveEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, false, false);
            events.mouseUpEvent(diagramCanvas, 300 + diagram.element.offsetLeft, 300 + diagram.element.offsetTop, false, false);
            console.log(diagram.nodes[0].offsetX);
            console.log(diagram.nodes[0].offsetY);
            console.log(diagram.element.offsetTop);
            expect(diagram.nodes[0].offsetX === 400).toBe(true);
            expect(diagram.nodes[0].offsetY === 930).toBe(true);
            diagram.undo();
            done();
        },
            1000);
    });
});
