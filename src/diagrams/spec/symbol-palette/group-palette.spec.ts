/**
 * Simple symbol palette
 */
import { createElement, Draggable, Droppable, DropEventArgs } from '@syncfusion/ej2-base';
import { Diagram } from '../../src/diagram/diagram';
import { Path, SwimLane } from '../../src/diagram/objects/node';

import { BpmnDiagrams } from '../../src/diagram/objects/bpmn';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { NodeConstraints } from '../../src/diagram/enum/enum';
import { UndoRedo } from '../../src/diagram/objects/undo-redo';
import {
    SymbolInfo,
    SymbolPalette
} from '../../src/symbol-palette/index';

import { MouseEvents } from '../diagram/interaction/mouseevents.spec';
import { PaletteModel, IElement, PointModel, DiagramElement, PortVisibility, PortConstraints, IDragEnterEventArgs } from '../../src/index';
import { profile, inMB, getMemoryProfile } from '../common.spec';
Diagram.Inject(BpmnDiagrams);
SymbolPalette.Inject(BpmnDiagrams);
Diagram.Inject(UndoRedo);

describe('Symbol Palette - Group', () => {
    describe('Testing symbol palette with group Symbols', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;

        let basicShapes: NodeModel[] = [
            { id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 },width:50,height:30,offsetX:50,offsetY:50 },
            { id: 'Ellipse', shape: { type: 'Basic', shape: 'Ellipse' }, style: { strokeWidth: 2 },width:50,height:30,offsetX:70,offsetY:80 },
            { id: 'group', children: ['Rectangle', 'Ellipse', 'id'] },
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPalette1', styles: 'width:250px;height:550px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram1', styles: 'width:500px;height:550px;float:right;' }));
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
            diagram.appendTo('#diagram1');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: [
                    { id: 'basic', expanded: true, symbols: basicShapes, title: 'Basic Shapes' },
                ], enableAnimation: false, enableSearch: true, symbolHeight: 50, symbolWidth: 50,
                symbolMargin: { top: 12, bottom: 12, left: 12, right: 12 }
            });
            palette.appendTo('#symbolPalette1');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
            diagram = null;
            palette = null;
            ele = null;
        });
        // it('Checking default palette rendering with group Symbol', (done: Function) => {
        //     setTimeout(() => {
        //         console.log('timeOut1');
        //         let events: MouseEvents = new MouseEvents();
        //         events.mouseDownEvent(palette.element, 70, 125, false, false);
        //         events.mouseMoveEvent(palette.element, 150, 150, false, false);
        //         events.mouseUpEvent(palette.element, 150, 150, false, false);
        //         palette.getPersistData();
        //         let start: HTMLElement = document.getElementById('group');
        //         expect(start.offsetWidth == 59 && start.offsetHeight == 59).toBe(true);
        //         done();
        //     }, 10);
        // });
        it('Checking Allow Drag', (done: Function) => {
            palette.allowDrag = false;
            palette.dataBind();
            let events: MouseEvents = new MouseEvents();
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            // expect(document.getElementsByClassName('e-dragclone').length == 0).toBe(true);
            done();
        });

        it('Enable Allow drag', (done: Function) => {
            palette.allowDrag = true;
            palette.dataBind();
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
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
            // expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 300, 300, false, false);
            events.mouseUpEvent(diagram.element, 300, 300, false, false);
            done();
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
            ele.appendChild(createElement('div', { id: 'symbolPalette2', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram2', styles: 'width:74%;height:500px;float:left;' }));
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
            diagram.appendTo('#diagram2');

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
            palette.appendTo('#symbolPalette2');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
            diagram = null;
            palette = null;
            ele = null;
        });
        // it('Checking default palette rendering with group Symbol with offset', (done: Function) => {
        //     setTimeout(() => {
        //         // just for coverage
        //         console.log('timeOut2');
        //         let events: MouseEvents = new MouseEvents();
        //         events.mouseDownEvent(palette.element, 70, 125, false, false);
        //         events.mouseMoveEvent(palette.element, 150, 150, false, false);
        //         events.mouseUpEvent(palette.element, 150, 150, false, false);
        //         palette.getPersistData();
        //         let start: HTMLElement = document.getElementById('group3');
        //         expect(start.offsetWidth == 59 && start.offsetHeight == 59).toBe(true);
        //         done();
        //     }, 10);
        // });
      
    });
    describe('Symbol Palette - group with path element', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;

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
            ele.appendChild(createElement('div', { id: 'symbolPalette3', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram3', styles: 'width:74%;height:500px;float:left;' }));
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
            diagram.appendTo('#diagram3');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: [
                    { id: 'basic', expanded: true, symbols: basicShapes, title: 'Basic Shapes' },
                ], enableAnimation: false, enableSearch: true, symbolHeight: 50, symbolWidth: 50,
                symbolMargin: { top: 12, bottom: 12, left: 12, right: 12 },
                symbolPreview: { height: 100, width: 100 }
            });
            palette.appendTo('#symbolPalette3');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
            diagram = null;
            palette = null;
            ele = null;
        });
        // it('Checking default palette rendering with group Symbol with offset', (done: Function) => {
        //     setTimeout(() => {
        //         // just for coverage
        //         console.log('timeOut3');
        //         let events: MouseEvents = new MouseEvents();
        //         events.mouseDownEvent(palette.element, 70, 125, false, false);
        //         events.mouseMoveEvent(palette.element, 150, 150, false, false);
        //         events.mouseUpEvent(palette.element, 150, 150, false, false);
        //         palette.getPersistData();
        //         let start: HTMLElement = document.getElementById('SHAPE_BELL11');
        //         expect(start.offsetWidth == 59 && start.offsetHeight == 59).toBe(true);
        //         done();
        //     }, 10);
        // });
    
    });
    describe('Testing symbol palette after getting refreshed', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;

        let basicShapes: NodeModel[] = [
            { id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 },width:50,height:30,offsetX:50,offsetY:50 },
            { id: 'Ellipse', shape: { type: 'Basic', shape: 'Ellipse' }, style: { strokeWidth: 2 },width:50,height:30,offsetX:70,offsetY:80 },
            { id: 'group', children: ['Rectangle', 'Ellipse', 'id'] },
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPalette4', styles: 'width:250px;height:550px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram4', styles: 'width:500px;height:550px;float:right;' }));
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: '74%', height: '600px'
            });
            diagram.appendTo('#diagram4');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: [
                    { id: 'basic', expanded: true, symbols: basicShapes, title: 'Basic Shapes' },
                ], symbolHeight: 50, symbolWidth: 50,
                symbolMargin: { top: 12, bottom: 12, left: 12, right: 12 }
            });
            palette.appendTo('#symbolPalette4');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
            diagram = null;
            palette = null;
            ele = null;
        });
        // it('Checking highlights', (done: Function) => {
        //     palette.refresh();
        //     setTimeout(() => {
        //         console.log('timeOut4');
        //         let events: MouseEvents = new MouseEvents();
        //         events.mouseDownEvent(palette.element, 70, 125, false, false);
        //         events.mouseMoveEvent(palette.element, 150, 150, false, false);
        //         events.mouseUpEvent(palette.element, 150, 150, false, false);
        //         palette.getPersistData();
        //         let start: HTMLElement = document.getElementById('group');
        //         expect(start.offsetWidth == 59 && start.offsetHeight == 59).toBe(true);
        //         done();
        //     }, 10);
        // });
    });
    describe('Testing multiSelect tool enables selector for dropped node', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;

        let basicShapes: NodeModel[] = [
            { id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 },width:50,height:30,offsetX:50,offsetY:50 },
            { id: 'Ellipse', shape: { type: 'Basic', shape: 'Ellipse' }, style: { strokeWidth: 2 },width:50,height:30,offsetX:70,offsetY:80 },
            { id: 'group', children: ['Rectangle', 'Ellipse', 'id'] },
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPalette5', styles: 'width:250px;height:550px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram5', styles: 'width:500px;height:550px;float:right;' }));
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
            diagram.appendTo('#diagram5');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: [
                    { id: 'basic', expanded: true, symbols: basicShapes, title: 'Basic Shapes' },
                ], enableAnimation: false, enableSearch: true, symbolHeight: 50, symbolWidth: 50,
                symbolMargin: { top: 12, bottom: 12, left: 12, right: 12 }
            });
            palette.appendTo('#symbolPalette5');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
            diagram = null;
            palette = null;
            ele = null;
        });
        // it('Multiselect tool enables selector at drop', (done: Function) => {
        //     palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
        //         let clonedElement: HTMLElement; let diagramElement: any;
        //         let position: PointModel = palette['getMousePosition'](e.sender);
        //         let symbols: IElement = palette.symbolTable['group'];
        //         palette['selectedSymbols'] = symbols;
        //         if (symbols !== undefined) {
        //             clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
        //             clonedElement.setAttribute('paletteId', palette.element.id);
        //         }
        //         return clonedElement;
        //     };
        //     let events: MouseEvents = new MouseEvents();
        //     events.mouseDownEvent(palette.element, 75, 100, false, false);
        //     events.mouseMoveEvent(palette.element, 100, 100, false, false);
        //     events.mouseMoveEvent(palette.element, 200, 200, false, false);
        //     // expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
        //     events.mouseMoveEvent(diagram.element, 300, 300, false, false);
        //     events.mouseUpEvent(diagram.element, 300, 300, false, false);
        //     done();
        // });
     
    });

});

describe('SymbolPalette - swimLane', () => {
    describe('Testing symbol palette with swimlane Symbols', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;

        let palettes: PaletteModel[] = [
            {
                id: 'swimlaneShapes', expanded: true,
                title: 'Swimlane Shapes',
                symbols: [
                    {
                        id: 'stackCanvas1',
                        shape: {
                            type: 'SwimLane',
                            lanes: [
                                {
                                    id: 'lane1',
                                    style: { fill: '#f5f5f5' }, height: 60, width: 150,
                                    header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                }
                            ],
                            orientation: 'Horizontal', isLane: true
                        },
                        height: 140,
                        width: 60,
                        style: { fill: '#f5f5f5' },
                    }, {
                        id: 'stackCanvas2',
                        shape: {
                            type: 'SwimLane',
                            lanes: [
                                {
                                    id: 'lane1',
                                    style: { fill: '#f5f5f5' }, height: 60, width: 150,
                                    header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                }
                            ],
                            orientation: 'Vertical', isLane: true
                        },
                        height: 140,
                        width: 60,
                        style: { fill: '#f5f5f5' },
                    }
                ]
            }
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPaletteSwimlane1', styles: 'width:25%;height:500px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagramSwimlane1', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);

            diagram = new Diagram({
                pageSettings: { background: { color: 'transparent' } },
                width: '74%', height: '600px'
            });
            diagram.appendTo('#diagramSwimlane1');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: palettes,
                expandMode: 'Multiple',
                enableAnimation: false, symbolHeight: 50, symbolWidth: 50,
                symbolPreview: { height: 100, width: 100 }
            });
            palette.appendTo('#symbolPaletteSwimlane1');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
            diagram = null;
            palette = null;
            ele = null;
        });
        it('Checking default palette rendering with swimlane symbols', (done: Function) => {
            expect(
                ('stackCanvas1' in palette.symbolTable) &&
                ('stackCanvas2' in palette.symbolTable)
            ).toBe(true);
            done();
        });
    });
    describe('Testing symbol palette with group Symbols', () => {
        let diagram: Diagram;
        let palette: SymbolPalette;
        let ele: HTMLElement;

        let palettes: PaletteModel[] = [
            {
                id: 'swimlaneShapes', expanded: true,
                title: 'Swimlane Shapes',
                symbols: [
                    {
                        id: 'verticalPhase',
                        shape: {
                            type: 'SwimLane',
                            phases: [{ style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#A9A9A9' }, }],
                            annotations: [{ text: '' }],
                            orientation: 'Vertical', isPhase: true
                        },
                        height: 60,
                        width: 140
                    }, {
                        id: 'horizontalPhase',
                        shape: {
                            type: 'SwimLane',
                            phases: [{ style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#A9A9A9' }, }],
                            annotations: [{ text: '' }],
                            orientation: 'Horizontal', isPhase: true
                        },
                        height: 60,
                        width: 140
                    }, {
                        id: 'verticalPhase1',
                        shape: {
                            type: 'SwimLane',
                            phases: [{ style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#A9A9A9' }, }],
                            annotations: [{ text: '' }],
                            orientation: 'Vertical', isPhase: true
                        }
                    }, {
                        id: 'horizontalPhase1',
                        shape: {
                            type: 'SwimLane',
                            phases: [{ style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#A9A9A9' }, }],
                            annotations: [{ text: '' }],
                            orientation: 'Horizontal', isPhase: true
                        }
                    }
                ]
            }
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolPaletteSwimlane2', styles: 'width:25%;height:500px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagramSwimlane2', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);

            diagram = new Diagram({
                pageSettings: { background: { color: 'transparent' } },
                width: '74%', height: '600px'
            });
            diagram.appendTo('#diagramSwimlane2');

            palette = new SymbolPalette({
                width: '250px', height: '100%',
                palettes: palettes,
                expandMode: 'Multiple',
                enableAnimation: false, symbolHeight: 50, symbolWidth: 50,
                symbolPreview: { height: 100, width: 100 }
            });
            palette.appendTo('#symbolPaletteSwimlane2');
        });

        afterAll((): void => {
            diagram.destroy();
            palette.destroy();
            ele.remove();
            diagram = null;
            palette = null;
            ele = null;
        });
        it('Checking default palette rendering with swimlane symbols', (done: Function) => {
            expect(
                ('verticalPhase' in palette.symbolTable) &&
                ('horizontalPhase' in palette.symbolTable) &&
                ('verticalPhase1' in palette.symbolTable) &&
                ('horizontalPhase1' in palette.symbolTable)
            ).toBe(true);
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
});

describe('Symbol Palette - Draggable Element', () => {

    describe('Diagram with draggable elements', () => {
        let diagram: Diagram;

        let ele: HTMLElement;
        let isDropRaised: boolean = false;

        let basicShapes: NodeModel[] = [
            { id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' }, style: { strokeWidth: 2 } },
            { id: 'Ellipse', shape: { type: 'Basic', shape: 'Ellipse' }, style: { strokeWidth: 2 } },
            { id: 'group', children: ['Rectangle', 'Ellipse', 'id'] },
        ];
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'draggable', styles: 'width:250px;height:550px;float:left;' }));
            ele.appendChild(createElement('div', { id: 'diagram', styles: 'width:500px;height:550px;float:right;' }));
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: '74%', height: '600px',
                drop: function () {
                    isDropRaised = true;
                }
            });
            diagram.appendTo('#diagram');



            let draggable: Draggable = new Draggable(document.getElementById('draggable'), {
                clone: true,
                cursorAt: { left: 100, top: 150 },
                enableTailMode: true,
                helper: function (e: any) {
                    var clonedElement1 = e.sender.target.cloneNode(true);
                    clonedElement1.setAttribute("id", "cloneElement123");
                    document.body.appendChild(clonedElement1);
                    return clonedElement1;
                }
            });
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            let cloneElement123: any = document.getElementById('cloneElement123');
            if (cloneElement123 && cloneElement123.parentNode) {
                cloneElement123.parentNode.removeChild(cloneElement123);
            }
            diagram = null;
            ele = null;
        });

        it('checking the drop event was firing whith droppable elements', (done: Function) => {
            let events: MouseEvents = new MouseEvents();
            let draggableElement: HTMLElement = document.getElementById('draggable');
            events.mouseMoveEvent(diagram.element, 75, 100, false, false);
            events.mouseDownEvent(draggableElement, 75, 100, false, false);
            events.mouseMoveEvent(diagram.element, 350, 100, false, false);
            events.mouseUpEvent(diagram.element, 350, 100, false, false);
            done();
        });
    });
    describe('873843-Issue with node height and width in the symbol palette',()=>{
                let diagram: Diagram;
                let palette: SymbolPalette;
                let ele: HTMLElement;
                beforeAll((): void => {
                    ele = createElement('div', { styles: 'width:100%;height:500px;' });
                    ele.appendChild(createElement('div', { id: 'symbolpaletteBpmnSize', styles: 'width:25%;float:left;' }));
                    ele.appendChild(createElement('div', { id: 'diagramBpmnSize', styles: 'width:50%;height:500px;float:left;' }));
                    document.body.appendChild(ele);
                    diagram = new Diagram({
                        width: '70%', height: 500
                    });
                    diagram.appendTo('#diagramBpmnSize');
                    var BpmnShape : NodeModel[] =[{
                        annotations: [
                          {
                            content: 'Event',
                            margin: { top: 15 },
                            offset: { x: 0.5, y: 1 },
                          },
                        ],
                        height: 40,
                        id: 'Event',
                        shape: {
                          event: {
                            event: 'Start',
                          },
                          type: 'Bpmn',
                          shape: 'Event',
                        },
                        width: 40,
                      },
                    ]
                    var palettes = [
                        {
                            id: 'BpmnShapes', expanded: true, symbols: BpmnShape
                            , title: 'Bpmn'
                        }
                    ];
                    palette = new SymbolPalette({
                        width: '25%', height: '500px',
                        palettes: palettes,
                        symbolHeight: 50, symbolWidth: 50,
                        symbolPreview: { height: 100, width: 100 },
                        enableSearch: true,
                        symbolMargin: { left: 12, right: 12, top: 12, bottom: 12 },
                        getSymbolInfo: (symbol: NodeModel): SymbolInfo => {
                            return { description:{text:symbol.id} };
                        }
                    });
                    palette.appendTo('#symbolpaletteBpmnSize');
                });
                afterAll((): void => {
                    diagram.destroy();
                    palette.destroy();
                    ele.remove();
                    diagram = null;
                    palette = null;
                    ele = null;
                });
                it('Checking bpmn event shape size ', (done: Function) => {
                    let element = (document.getElementById('Event_container').getBoundingClientRect());
                    expect(element !== null).toBe(true);
                    done();
                });
            });
});

describe('check symbol palette ignoreSymbolOnSearch property', () => {
    let diagram: Diagram;
    let palette: SymbolPalette;
    let ele: HTMLElement;
    let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';

    let palettes: PaletteModel[] = [
        {
            id: 'flow', expanded: true, title: 'Flow Shapes', symbols: [
                {
                    id: 'Terminator', width: 50, height: 60, shape: { type: 'Flow', shape: 'Terminator' }, style: { strokeWidth: 5 }, addInfo: "hellow", ports: [
                        { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                    ]
                },
                {
                    id: 'Process', width: 50, height: 60, shape: { type: 'Flow', shape: 'Process' }, style: { strokeWidth: 1 }, ports: [
                        { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                    ]
                },
                {
                    id: 'Decision', width: 50, height: 50, shape: { type: 'Flow', shape: 'Decision' }, style: { strokeWidth: 1 }, ports: [
                        { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                    ]
                },
                {
                    id: 'Document', width: 50, height: 50, shape: { type: 'Flow', shape: 'Document' }, style: { strokeWidth: 1 }, ports: [
                        { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                    ]
                },
                {
                    id: 'PreDefinedProcess', width: 50, height: 50, shape: { type: 'Flow', shape: 'PreDefinedProcess' }, ports: [
                        { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                    ], style: { strokeWidth: 1 }
                },
                {
                    id: 'data', width: 50, height: 50, shape: { type: 'Flow', shape: 'Data' }, ports: [
                        { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
                        { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
                    ], style: { strokeWidth: 1 }
                },
            ]
        },
        {
            id: 'swimlaneShapes', expanded: true,
            title: 'Swimlane Shapes',
            symbols: [
                {
                    id: 'stackCanvas1', addInfo: "hellow",
                    style: { strokeWidth: 5 },
                    shape: {
                        type: 'SwimLane', lanes: [
                            {
                                id: 'lane1',
                                style: { strokeColor: 'black' }, height: 60, width: 150,
                                header: { width: 50, height: 50, style: { strokeColor: 'black', fontSize: 11 } },
                            }
                        ],
                        orientation: 'Horizontal', isLane: true
                    },
                    height: 60,
                    width: 140,
                    offsetX: 70,
                    offsetY: 30,
                }, {
                    id: 'stackCanvas2',
                    shape: {
                        type: 'SwimLane',
                        lanes: [
                            {
                                id: 'lane1',
                                style: { strokeColor: 'black' }, height: 150, width: 60,
                                header: { width: 50, height: 50, style: { strokeColor: 'black', fontSize: 11 } },
                            }
                        ],
                        orientation: 'Vertical', isLane: true
                    },
                    height: 140,
                    width: 60,
                    // style: { fill: '#f5f5f5' },
                    offsetX: 70,
                    offsetY: 30,
                }, {
                    id: 'verticalPhase',
                    shape: {
                        type: 'SwimLane',
                        phases: [{ style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#A9A9A9' }, }],
                        annotations: [{ text: '' }],
                        orientation: 'Vertical', isPhase: true
                    },
                    height: 60,
                    width: 140
                }, {
                    id: 'horizontalPhase',
                    shape: {
                        type: 'SwimLane',
                        phases: [{ style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#A9A9A9' }, }],
                        annotations: [{ text: '' }],
                        orientation: 'Horizontal', isPhase: true
                    },
                    height: 60,
                    width: 140
                }
            ]
        },
        {
            id: 'connectors', expanded: true, symbols: [
                {
                    id: 'Link1', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
                    targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 1 }
                },
                {
                    id: 'Link2', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
                    targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 1, strokeDashArray: '4 4' }
                }], title: 'Connectors'
        }
    ];
    
    beforeAll((): void => {
        ele = createElement('div', { styles: 'width:100%;height:500px;' });
        ele.appendChild(createElement('div', { id: 'symbolpalette7', styles: 'width:25%;float:left;' }));
        ele.appendChild(createElement('div', { id: 'diagram7', styles: 'width:74%;height:500px;float:left;' }));
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
                    ],
                    phases: [
                        {
                            id: 'phase1', offset: 170,
                            header: { annotation: { content: 'Phase' } }
                        },
                        {
                            id: 'phase2', offset: 450,
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
        ];

        function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
            connector.type = 'Orthogonal';
            connector.style.strokeColor = "#CCCCCC";
            connector.sourceDecorator.style.strokeColor = "#CCCCCC";
            connector.targetDecorator.style.strokeColor = "#CCCCCC";
            connector.sourceDecorator.style.fill = "#CCCCCC";
            connector.targetDecorator.style.fill = "#CCCCCC";
            return connector;
        }
        function getNodeDefaults(node: NodeModel): NodeModel {
            node.style.strokeColor = "#CCCCCC";
            return node;
        }
    
        diagram = new Diagram({
            connectors: connectors, nodes: nodes, pageSettings: { background: { color: 'transparent' } },
            getConnectorDefaults: getConnectorDefaults,
            getNodeDefaults: getNodeDefaults,
           width: '70%'
         });
        diagram.appendTo('#diagram7');
    
        palette = new SymbolPalette({
            palettes: palettes,
            enableSearch: true,
            symbolHeight: 50, symbolWidth: 50,
            symbolPreview: { width: 100, height: 100 },
            expandMode: 'Multiple',
            height: '500px',
            width: '100%',
            ignoreSymbolsOnSearch: ['verticalPhase','horizontalPhase','Link1']
        });
        palette.appendTo('#symbolpalette7');
    });
    
    afterAll((): void => {
        diagram.destroy();
        palette.destroy();
        ele.remove();
        diagram = null;
        palette = null;
        ele = null;
    });

    it('checking ignoreSymbolOnSearch', (done: Function) => {
            palette.enableSearch = true;
            palette.dataBind();
            let element: HTMLElement = document.getElementById("textEnter");
            element.focus();
            (document.getElementById("textEnter") as HTMLInputElement).value = "Link1";
            let eventName = "keyUp";
            palette[eventName]({ target: element });
            setTimeout(() => {
                console.log('timeOut5');
               // expect(document.getElementById("SearchPalette").children[0].id === 'EmptyDiv').toBe(true);
                done();
            }, 500);
            done();
    });
    
    it('checking ignoreSymbolOnSearch symbol', (done: Function) => {
            palette.enableSearch = true;
            palette.dataBind();
            let element: HTMLElement = document.getElementById("textEnter");
            element.focus();
            (document.getElementById("textEnter") as HTMLInputElement).value = "Decision";
            let eventName = "keyUp";
            palette[eventName]({ target: element });
            setTimeout(() => {
                console.log('timeOut6');
               // expect(document.getElementById("SearchPalette").children.length === 1).toBe(true);
                done();
            }, 500);
            done();
    });
    // it('checking empty search palette', (done: Function) => {
    //     let events: MouseEvents = new MouseEvents();
    //         palette.enableSearch = true;
    //         palette.dataBind();
    //         let element: HTMLElement = document.getElementById("textEnter");
    //         element.focus();
    //         (document.getElementById("textEnter") as HTMLInputElement).value = "";
    //         let eventName = "keyUp";
    //         palette[eventName]({ target: element });
    //         setTimeout(() => {
    //             console.log('timeOut7');
    //           //  expect(document.getElementById("SearchPalette") === null).toBe(true);
    //             done();
    //         }, 500);
    //         done();
    // });
});