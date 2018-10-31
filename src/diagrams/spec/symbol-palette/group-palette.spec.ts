/**
 * Simple symbol palette
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../src/diagram/diagram';
import { Path } from '../../src/diagram/objects/node';

import { BpmnDiagrams } from '../../src/diagram/objects/bpmn';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { NodeConstraints } from '../../src/diagram/enum/enum';
import { UndoRedo } from '../../src/diagram/objects/undo-redo';
import {
    SymbolPalette
} from '../../src/symbol-palette/index';

import { MouseEvents } from '../diagram/interaction/mouseevents.spec';
import { PaletteModel, IElement, PointModel, PortVisibility, PortConstraints } from '../../src/index';
import { EJ2Instance } from '@syncfusion/ej2-navigations';
Diagram.Inject(BpmnDiagrams);
SymbolPalette.Inject(BpmnDiagrams);
Diagram.Inject(UndoRedo);

describe('Symbol Palette - Group', () => {
    describe('Testing symbol palette with group Symbols', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        let basicShapes: NodeModel[] = [
            { id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 } },
            { id: 'Ellipse', shape: { type: 'Basic', shape: 'Ellipse' }, style: { strokeWidth: 2 } },
            { id: 'group', children: ['Rectangle', 'Ellipse', 'id'] },
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPalette', styles: 'width:250px;height:550px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram', styles: 'width:500px;height:550px;float:right;' }));
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                    annotations: [{ content: 'Default Shape' }]
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
                width: '74%', height: '600px'
            });
            diagram.appendTo('#diagram');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: [
                    { id: 'basic', expanded: true, symbols: basicShapes, title: 'Basic Shapes' },
                ], enableAnimation: false, enableSearch: true, symbolHeight: 50, symbolWidth: 50,
                symbolMargin: { top: 12, bottom: 12, left: 12, right: 12 }
            });
            palette.appendTo('#symbolPalette');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });
        it('Checking default palette rendering with group Symbol', (done: Function) => {
            setTimeout(() => {
                let events: MouseEvents = new MouseEvents();
                events.mouseDownEvent(palette.element, 70, 125, false, false);
                events.mouseMoveEvent(palette.element, 150, 150, false, false);
                events.mouseUpEvent(palette.element, 150, 150, false, false);
                palette.getPersistData();
                let start: HTMLElement = document.getElementById('group');
                expect(start.offsetWidth == 55 && start.offsetHeight == 55).toBe(true);
                done();
            }, 10);
        });
        it('Checking drag and drop', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let symbols: IElement = palette.symbolTable['group'];
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
            };
            diagram.dragOver = (arg) => {
                expect(arg.diagram !== undefined).toBe(true);
                done();
            };
            diagram.drop = (arg) => {
                expect((arg.element as NodeModel).id === diagram.currentSymbol.id).toBe(true);
                done();
            };
            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 300, 300, false, false);
            events.mouseUpEvent(diagram.element, 300, 300, false, false);
            expect(diagram.nodes.length).toBe(5);
        });
        it('Remove Palette Item', (done: Function) => {
            let cpalette: PaletteModel = palette.palettes[0];
            palette.removePaletteItem('basic', cpalette.symbols[cpalette.symbols.length - 1].id);
            palette.dataBind();
            let element: HTMLElement = document.getElementById('newflow_container');
            expect(element === null).toBe(true);
            done();
        });
    });
    describe('Testing symbol palette with multi level group', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        let basicShapes: NodeModel[] = [
            { id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 }, offsetX: 25, offsetY: 25 },
            { id: 'Ellipse', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 }, offsetX: 75, offsetY: 75 },
            { id: 'group', children: ['Rectangle', 'Ellipse'] },
            { id: 'Hexagon', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 }, offsetX: 125, offsetY: 125 },
            { id: 'Hexagon2', shape: { type: 'Basic', shape: 'Hexagon' }, style: { strokeWidth: 2 }, offsetX: 50, offsetY: 50 },
            { id: 'group2', children: ['group', 'Hexagon'] },
            { id: 'group3', children: ['group2', 'Hexagon2'] },
            { id: 'Parallelogram', shape: { type: 'Basic', shape: 'Parallelogram' }, style: { strokeWidth: 2 } },
            { id: 'Triangle', shape: { type: 'Basic', shape: 'Triangle' }, style: { strokeWidth: 2 } },
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPalette', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                    annotations: [{ content: 'Default Shape' }]
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
                width: '74%', height: '600px'
            });
            diagram.appendTo('#diagram');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: [
                    { id: 'basic', expanded: true, symbols: basicShapes, title: 'Basic Shapes' },
                ], enableAnimation: false, enableSearch: true, symbolHeight: 50, symbolWidth: 50,
                getNodeDefaults: (node: NodeModel) => {
                    if (node.id === 'Terminator' || node.id === 'Process') {
                        node.width = 130;
                        node.height = 65;
                    } else {
                        node.width = 50;
                        node.height = 50;
                    }
                    node.ports = [
                        {
                            offset: { x: 0, y: 0.5 },
                            visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw
                        },
                        {
                            offset: { x: 0.5, y: 0 },
                            visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw
                        },
                        {
                            offset: { x: 1, y: 0.5 },
                            visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw
                        },
                        {
                            offset: { x: 0.5, y: 1 },
                            visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw
                        }
                    ];
                    node.style.strokeColor = '#3A3A3A';
                },
                symbolMargin: { top: 12, bottom: 12, left: 12, right: 12 },
                symbolPreview: { height: 100, width: 100 }
            });
            palette.appendTo('#symbolPalette');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });
        it('Checking default palette rendering with group Symbol with offset', (done: Function) => {
            setTimeout(() => {
                //just for coverage
                let events: MouseEvents = new MouseEvents();
                events.mouseDownEvent(palette.element, 70, 125, false, false);
                events.mouseMoveEvent(palette.element, 150, 150, false, false);
                events.mouseUpEvent(palette.element, 150, 150, false, false);
                palette.getPersistData();
                let start: HTMLElement = document.getElementById('group3');
                expect(start.offsetWidth == 55 && start.offsetHeight == 55).toBe(true);
                done();
            }, 10);
        });
        it('Checking drag and drop group Node', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let target = document.elementFromPoint(position.x, position.y).childNodes[0];
                let symbols: IElement = palette.symbolTable['group3'];
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
            expect(diagram.nodes.length).toBe(9);
            done();
        });
    });
    describe('Symbol Palette - group with path element', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        let basicShapes: NodeModel[] = [
            {
                id: 'SHAPE_BELL21',
                shape: {
                    type: 'Path',
                    data: 'M37.5,18.5h0a30,30,0,0,1,30,30v0a30,30,0,0,1-30,30h0a0,0,0,0,1,0,0v-60A0,0,0,0,1,37.5,18.5Z'
                },
                width: 30,
                height: 60,
                offsetX: 52.5,
                offsetY: 48.5
            }, {
                id: 'SHAPE_BELL31',
                shape: {
                    type: 'Path',
                    data: 'M 24 , 48.5 L 37, 48.5'
                },
                width: 13,
                height: 1,
                offsetX: 31,
                offsetY: 49
            },
            {
                id: 'SHAPE_BELL11',
                children: ['SHAPE_BELL21', 'SHAPE_BELL31']
            },
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPalette', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                    annotations: [{ content: 'Default Shape' }]
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
                width: '74%', height: '600px'
            });
            diagram.appendTo('#diagram');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: [
                    { id: 'basic', expanded: true, symbols: basicShapes, title: 'Basic Shapes' },
                ], enableAnimation: false, enableSearch: true, symbolHeight: 50, symbolWidth: 50,
                symbolMargin: { top: 12, bottom: 12, left: 12, right: 12 },
                symbolPreview: { height: 100, width: 100 }
            });
            palette.appendTo('#symbolPalette');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });
        it('Checking default palette rendering with group Symbol with offset', (done: Function) => {
            setTimeout(() => {
                //just for coverage
                let events: MouseEvents = new MouseEvents();
                events.mouseDownEvent(palette.element, 70, 125, false, false);
                events.mouseMoveEvent(palette.element, 150, 150, false, false);
                events.mouseUpEvent(palette.element, 150, 150, false, false);
                palette.getPersistData();
                let start: HTMLElement = document.getElementById('SHAPE_BELL11');
                expect(start.offsetWidth == 55 && start.offsetHeight == 55).toBe(true);
                done();
            }, 10);
        });
        it('Checking drag and drop group Path Node', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let target = document.elementFromPoint(position.x, position.y).childNodes[0];
                let symbols: IElement = palette.symbolTable['SHAPE_BELL11'];
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
            expect(document.getElementsByClassName('e-dragclone').length >= 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 300, 300, false, false);
            events.mouseUpEvent(diagram.element, 300, 300, false, false);
            expect(diagram.nodes.length).toBe(5);
            done();
        });
    });



    describe('Symbol Palette - group with html elements', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        let basicShapes: NodeModel[] = [
            {
                id: "textbox1",
                addInfo: {
                    "backgroundColor": "white", "isTimer": true, "fontColor": "black",
                    "borderColor": "black", "borderWidth": '1px', "fontSize": '12px', "height": "25px", "width": "100px", "textValue": "12", "marginBottom": '0px', "marginTop": '0px', "marginLeft": '0px', "marginRight": '0px'
                },
                width: 100, height: 30, offsetX: 40, offsetY: 40, shape: { type: 'HTML', content: '<div style="width:100%;height:100%;overflow:hidden"><input type="text" value=${addInfo.textValue} style="width:${addInfo.width};height:${addInfo.height};background-color:${addInfo.backgroundColor};font-size:${addInfo.fontSize};color:${addInfo.fontColor};border-color:${addInfo.borderColor};border-width:${addInfo.borderWidth};marginBottom: 0px; marginTop: 0px; marginLeft: 0px; marginRight: 0px;padding:0px" /></div>' }, style: { fill: "transparent", strokeColor: "transparent" }, annotations: []
            },
            {
                id: "button1", addInfo:
                    { "backgroundColor": "white", "fontColor": "black", "borderColor": "black", "borderWidth": '1px', "fontSize": '12px', "height": "25px", "width": "100px", "marginBottom": '0px', "marginTop": '0px', "marginLeft": '0px', "marginRight": '0px' },
                width: 100, height: 30, offsetX: 140, offsetY: 140, shape: { type: 'HTML', content: '<div style="width:100%;height:100%;overflow:hidden"><input type="button" value="button" style="width:${addInfo.width};height:${addInfo.height};background-color:${addInfo.backgroundColor};font-size:${addInfo.fontSize};color:${addInfo.fontColor};border-color:${addInfo.borderColor};border-width:${addInfo.borderWidth};marginBottom: 0px; marginTop: 0px; marginLeft: 0px; marginRight: 0px;padding:0px;text-align:left"/></div>' }, style: { fill: "transparent", strokeColor: "transparent" }, annotations: []
            },

            // Grouping node 1 and node 2 into a single group
            {
                id: 'group1',
                children: ['textbox1', 'button1']
            },
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPalette', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);

            diagram = new Diagram({
                pageSettings: { background: { color: 'transparent' } },
                width: '74%', height: '600px'
            });
            diagram.appendTo('#diagram');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: [
                    { id: 'basic', expanded: true, symbols: basicShapes, title: 'Basic Shapes' },
                ], enableAnimation: false, enableSearch: true, symbolHeight: 50, symbolWidth: 50,
                symbolMargin: { top: 12, bottom: 12, left: 12, right: 12 },
                symbolPreview: { height: 100, width: 100 }
            });
            palette.appendTo('#symbolPalette');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
        });
        it('Checking default palette rendering with group Symbol with html elements', (done: Function) => {
            setTimeout(() => {

                palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                    let clonedElement: HTMLElement; let diagramElement: EJ2Instance;
                    let position: PointModel = palette['getMousePosition'](e.sender);
                    let symbols: IElement = palette.symbolTable['group1'];
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
                };
                diagram.dragOver = (arg) => {
                    expect(arg.diagram !== undefined).toBe(true);
                    done();
                };
                diagram.drop = (arg) => {
                    expect((arg.element as NodeModel).id === diagram.currentSymbol.id).toBe(true);
                    done();
                };
                let events: MouseEvents = new MouseEvents();
                events.mouseDownEvent(palette.element, 25, 100, false, false);
                events.mouseMoveEvent(palette.element, 100, 100, false, false);
                events.mouseMoveEvent(palette.element, 200, 200, false, false);
                expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
                events.mouseMoveEvent(diagram.element, 300, 300, false, false);
                events.mouseUpEvent(diagram.element, 300, 300, false, false);
                expect(diagram.nodes.length).toBe(3);
            });
        });
    });
});