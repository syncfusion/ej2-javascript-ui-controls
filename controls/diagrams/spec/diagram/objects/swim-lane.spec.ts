/**
 * Test cases for swimlane
 */

import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { GridPanel, RowDefinition, ColumnDefinition } from '../../../src/diagram/core/containers/grid';
import { Margin } from '../../../src/diagram/core/appearance';
import { NodeModel, SwimLaneModel, SelectorModel } from '../../../src/diagram/objects/node-model';
import { Node, Html } from '../../../src/diagram/objects/node';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { Selector } from '../../../src/diagram/objects/node';
import { Container } from '../../../src/diagram/core/containers/container';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { PhaseModel, LaneModel } from '../../../src/diagram/objects/node-model';
import { SymbolPalette, SymbolInfo, PaletteModel, } from '../../../src/symbol-palette/index'; 
import { IElement, PointModel, NodeConstraints, LineRouting, Connector, DiagramConstraints, AnnotationConstraints, CommandHandler, DiagramEventHandler, UserHandleModel, ISelectionChangeEventArgs, ScrollSettingsModel, SnapSettingsModel, LayoutModel, BpmnSequenceFlows, SnapConstraints, SelectorConstraints } from '../../../src/diagram/index';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { Annotation } from '../../../src/diagram/objects/annotation';
import { ShapeStyleModel } from '../../../src/diagram/core/appearance-model';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(UndoRedo, LineRouting);

function getIntermediatePoints(Points: PointModel[], value: string): string {
    let output: string = 'expect(';
    for (let i = 0; i < Points.length; i++) {
        output += value + '.intermediatePoints[' + i + '].x ==' + Points[i].x +
            '&&' + value + '.intermediatePoints[' + i + '].y ==' + Points[i].y + '&&';
    }
    output += ').toBe(true);';
    return output;
}

let palette: SymbolPalette;

function paletteInitalize(id: string) {
    let clonedElement: HTMLElement;
    palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
        let diagramElement: any;
        let position: PointModel = palette['getMousePosition'](e.sender);
        let symbols: IElement = palette.symbolTable[id];
        palette['selectedSymbols'] = symbols;
        if (symbols !== undefined) {
            clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
            clonedElement.setAttribute('paletteId', palette.element.id);
        }
        return clonedElement;
    };
    return clonedElement;
}

function drag(diagram: Diagram) {
    let diagramCanvas: HTMLElement; let left: number; let top: number;
    diagramCanvas = document.getElementById(diagram.element.id + 'content');
    left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
    let mouseEvents: MouseEvents = new MouseEvents();
    if ((diagram.selectedItems as Selector).nodes.length) {
        let container: Container = diagram.selectedItems.wrapper;
        let centerX = container.offsetX;
        let centerY = container.offsetY;
        mouseEvents.mouseDownEvent(diagramCanvas, centerX + diagram.element.offsetLeft, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, centerX + diagram.element.offsetLeft + 20, centerY + diagram.element.offsetTop + 20);
    }
}

function resize(diagram: Diagram, direction: string): void {
    if ((diagram.selectedItems as Selector).nodes.length) {
        let diagramCanvas: HTMLElement; let left: number; let top: number;
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        left = diagram.element.offsetLeft; top = diagram.element.offsetTop;
        let element: HTMLElement = document.getElementById('borderRect');
        let mouseEvents: MouseEvents = new MouseEvents();
        let x: number; let y: number;
        switch (direction) {
            case 'resizeSouth':
                x = Number(element.getAttribute('x')) + Number(element.getAttribute('width')) / 2;
                y = Number(element.getAttribute('y')) + Number(element.getAttribute('height'));
                break;
            case 'resizeEast':
                x = Number(element.getAttribute('x')) + Number(element.getAttribute('width'));
                y = Number(element.getAttribute('y')) + Number(element.getAttribute('height')) / 2;
                break;
            case 'resizeNorth':
                x = Number(element.getAttribute('x')) + Number(element.getAttribute('width')) / 2;
                y = Number(element.getAttribute('y'));
                break;
            case 'resizeWest':
                x = Number(element.getAttribute('x'));
                y = Number(element.getAttribute('y')) + Number(element.getAttribute('height')) / 2;
                break;
        }
        mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
        mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
        mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
    }
}

describe('Diagram Control', () => {
    describe('Horizontal Swimlane', () => {
        let diagram: Diagram;
        let mouseEvents: MouseEvents = new MouseEvents();
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane1' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', offsetX: 600, offsetY: 250, width: 700, height: 400,
                    shape: {
                        type: 'SwimLane', orientation: 'Horizontal',
                        header: {
                            annotation: { content: 'Header', style: { fill: 'gray' }, constraints: AnnotationConstraints.ReadOnly },
                            phases:
                                [
                                    { header: { annotation: { content: 'phase1' } }, style: { fill: 'blue', opacity: .5 }, offset: 300 },
                                    { header: { annotation: { content: 'phase1' } }, style: { fill: 'blue', opacity: .5 }, width: 300 }],
                            lanes: [
                                {
                                    id: 'lane1',
                                    children: [{
                                        id: 'node111',
                                        width: 50, height: 50,
                                        margin: { left: 520, top: 20 }
                                    }
                                        , {
                                        id: 'nodeabh',
                                        width: 50, height: 50,
                                        margin: { left: 50, top: 20 }
                                    }],
                                    style: { fill: 'red', opacity: .4 }, height: 100, header: { annotation: { content: 'lane1' } }
                                },
                                {
                                    id: 'lane2', height: 100,
                                    children: [{
                                        id: 'node11d1',
                                        width: 50, height: 50,
                                        margin: { left: 520, top: 20 }
                                    }
                                        , {
                                        id: 'nodeadbh',
                                        width: 50, height: 50,
                                        margin: { left: 50, top: 20 }
                                    }
                                    ],
                                    style: { fill: 'red', opacity: .4 }, header: { annotation: { content: 'lane1', style: { fill: 'red' } } }
                                }
                            ]
                        }
                    }
                }
            ];
            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane1');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Horizontal swimlane rendering with header, phase and lane', (done: Function) => {
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 250).toBe(true);
            done();
        });

    });
    describe('Horizontal Swimlane without header', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane11' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', offsetX: 600, offsetY: 250,
                    shape: {
                        type: 'SwimLane', orientation: 'Horizontal',
                        phases: [{ header: { annotation: {content: 'phase1'}  as Annotation }, style: { fill: 'blue', opacity: .5 }, offset: 300 },
                        { headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, width: 300 }],
                        lanes: [
                            {
                                id: 'lane1',
                                children: [{
                                    id: 'node111',
                                    width: 50, height: 50,
                                    margin: { left: 520, top: 20 }
                                }
                                    , {
                                    id: 'nodeabh',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 20 }
                                }],
                                style: { fill: 'red', opacity: .4 }, height: 100, headers: [{ content: 'lane1' }]
                            },
                            {
                                id: 'lane2', height: 100,
                                children: [{
                                    id: 'node11d1',
                                    width: 50, height: 50,
                                    margin: { left: 520, top: 20 }
                                }
                                    , {
                                    id: 'nodeadbh',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 20 }
                                }
                                ],
                                style: { fill: 'red', opacity: .4 }, headers: [{ content: 'lane1', style: { fill: 'red' } }]
                            }
                        ]
                    }
                },
            ];
            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane11');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Horizontal swimlane rendering with phase and lane', (done: Function) => {
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 250).toBe(true);
            done();
        });

        it('Checking remove Lane at runtime', (done: Function) => {
            var lane = (diagram.nodes[0].shape as SwimLaneModel).lanes[0];
            diagram.removeLane(diagram.nameTable['node1'], lane);
            expect((diagram.nameTable['node1'].shape as SwimLaneModel).lanes.length === 1).toBe(true);
            done();
        });
        
        it('Checking remove phase at runtime', (done: Function) => {
            var lane = (diagram.nodes[0].shape as SwimLaneModel).phases[0];
            diagram.removePhase(diagram.nameTable['node1'], lane);
            expect((diagram.nameTable['node1'].shape as SwimLaneModel).phases.length === 1).toBe(true);
            done();
        });




    });
    describe('Vertical Swimlane', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane2' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 700, height: 400, offsetX: 600, offsetY: 250,
                    shape: {
                        type: 'SwimLane', orientation: 'Vertical',
                        header: { annotation: { content: 'Header' } as Annotation, style: { fill: 'gray' } },
                        phases: [{ header: { annotation: { content: 'phase1' } as Annotation }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 300 },
                        { header: { annotation: { content: 'phase2' } as Annotation }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 100 }],
                        lanes: [
                            {
                                id: 'lane1',
                                children: [{
                                    id: 'node111',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'node113rr',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, height: 100, header: { annotation: { content: 'lane1' } as Annotation }
                            },
                            {
                                id: 'lane2', height: 100,
                                children: [{
                                    id: 'abc',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'efg',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 },header: { annotation: { content: 'lane1' }  as Annotation, style: { fill: 'red' } }
                            }]
                    }
                },
            ];

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane2');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking vertical swimlane rendering with header, phase and lane', (done: Function) => {
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 250).toBe(true);
            done();
        });
        it('Checking vertical swimlane index', (done: Function) => {
            diagram.select([diagram.nameTable['node1lane10']])
            diagram.remove();
            diagram.select([diagram.nameTable['node1lane20']])
            expect(diagram.selectedItems.nodes.length===1).toBe(true);
            done();
        });

    });
    describe('Vertical Swimlane without header', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane21' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 700, height: 400, offsetX: 600, offsetY: 250,
                    shape: {
                        type: 'SwimLane', orientation: 'Vertical',
                        phases: [{ headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 300 },
                        { headers: { content: 'phase2' }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 100 }],
                        lanes: [
                            {
                                id: 'lane1',
                                children: [{
                                    id: 'node111',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'node113rr',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, height: 100, headers: [{ content: 'lane1' }]
                            },
                            {
                                id: 'lane2', height: 100,
                                children: [{
                                    id: 'abc',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'efg',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, headers: [{ content: 'lane1', style: { fill: 'red' } }]
                            }]
                    }
                },
            ];

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane21');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking vertical swimlane rendering with phase and lane', (done: Function) => {
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 250).toBe(true);
            done();
        });

    });
    describe('Swimlane Sample', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane26' });
            document.body.appendChild(ele);

            let pathData: string = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';

            let darkColor: string = '#C7D4DF';
            let lightColor: string = '#f5f5f5';
            let nodes: NodeModel[] = [
                {
                    //creating the swimlane and set its type as swimlane
                    id: 'swimlane',
                    shape: {
                        orientation: 'Horizontal',
                        type: 'SwimLane',
                        //initialize swimlane header
                        header: {
                            annotation: { content: 'ONLINE PURCHASE STATUS' },
                            height: 50, style: { fill: darkColor, fontSize: 11 },
                        },
                        lanes: [
                            //initialize the lanes
                            {
                                id: 'stackCanvas1',
                                //set the header properties
                                header: {
                                    annotation: { content: 'CUSTOMER' }, width: 50,
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor },
                                height: 120,
                                //initialize the lane children
                                children: [
                                    {
                                        id: 'Order',
                                        shape: { type: 'Bpmn', shape: 'TextAnnotation' },
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
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor }, height: 120,
                                children: [
                                    {
                                        id: 'selectItemaddcart',
                                        annotations: [{ content: 'Select item\nAdd cart' }],
                                        margin: { left: 210, top: 20 },
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
                        //creating the phases of the swimlane
                        phases: [
                            //set the properties of the phase
                            {
                                id: 'phase1', offset: 200,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },
                            {
                                id: 'phase2', offset: 500,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 350, offsetY: 290,
                    height: 360, width: 650
                },
            ];
            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane26');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Change node position to other grid cell', (done: Function) => {
            setTimeout(function () {
                let node = document.getElementById('Order');
                let bounds1 = node.getBoundingClientRect();
                let x1 = bounds1.left + bounds1.width / 2;
                let y1 = bounds1.top + bounds1.height / 2;

                let id = (diagram.nodes[0].wrapper.children[0] as GridPanel).rows[3].cells[1].children[0].id
                let target = document.getElementById(id);
                let bounds = target.getBoundingClientRect();

                let x = bounds.left + bounds.width / 2;
                let y = bounds.top + bounds.height / 2;

                mouseEvents.clickEvent(diagramCanvas, x1 + diagram.element.offsetLeft, y1 + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, x1 + diagram.element.offsetLeft + 10, y1 + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x1 + diagram.element.offsetLeft + 20, y1 + diagram.element.offsetTop + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 30, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                node = document.getElementById('Order');
                bounds = node.getBoundingClientRect();
                expect(diagram.nameTable["Order"].parentId == "swimlanestackCanvas21").toBe(true);
                done();
            }, 1000);
        });
    });

    describe('Vertical Swimlane without phase', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane22' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 700, height: 400, offsetX: 600, offsetY: 250,
                    shape: {
                        type: 'SwimLane', orientation: 'Vertical',
                        header: { annotation: { content: 'Header' }, style: { fill: 'gray' } },
                        lanes: [
                            {
                                id: 'lane1',
                                children: [{
                                    id: 'node111',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'node113rr',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, height: 100, headers: [{ content: 'lane1' }]
                            },
                            {
                                id: 'lane2', height: 100,
                                children: [{
                                    id: 'abc',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'efg',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, headers: [{ content: 'lane1', style: { fill: 'red' } }]
                            }]
                    }
                },
            ];

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane22');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking vertical swimlane rendering with header and lane', (done: Function) => {
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 250).toBe(true);
            done();
        });

    });
    describe('Vertical Swimlane without header and phase', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane23' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 700, height: 400, offsetX: 600, offsetY: 250,
                    shape: {
                        type: 'SwimLane', orientation: 'Vertical',
                        header: { annotation: { content: 'Header' }, style: { fill: 'gray' } },
                        lanes: [
                            {
                                id: 'lane1',
                                children: [{
                                    id: 'node111',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'node113rr',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, height: 100, header: { annotation: { content: 'lane1' } }
                            },
                            {
                                id: 'lane2', height: 100,
                                children: [{
                                    id: 'abc',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'efg',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, header: { annotation: { content: 'lane1' }, style: { fill: 'red' } }
                            }]
                    }
                },
            ];

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane23');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking vertical swimlane rendering with lane', (done: Function) => {
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 250).toBe(true);
            done();
        });

    });

    describe('Horziontal Swimlane Selection when resizing - resizeEast', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane24' });
            document.body.appendChild(ele);

            let pathData: string = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';

            let darkColor: string = '#C7D4DF';
            let lightColor: string = '#f5f5f5';

            let nodes: NodeModel[] = [
                {
                    //creating the swimlane and set its type as swimlane
                    id: 'swimlane',
                    shape: {
                        orientation: 'Horizontal',
                        type: 'SwimLane',
                        //initialize swimlane header
                        header: {
                            annotation: { content: 'ONLINE PURCHASE STATUS' },
                            height: 50, style: { fill: darkColor, fontSize: 11 },
                        },
                        lanes: [
                            //initialize the lanes
                            {
                                id: 'stackCanvas1',
                                //set the header properties
                                header: {
                                    annotation: { content: 'CUSTOMER' }, width: 50,
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor },
                                height: 120,
                            },
                        ],
                        //creating the phases of the swimlane
                        phases: [
                            //set the properties of the phase
                            {
                                id: 'phase1', offset: 200,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },

                        ],
                        phaseSize: 20,
                    },
                    offsetX: 350, offsetY: 300,
                    height: 200, width: 300
                },
            ];

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane24');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking horizontal swimlane resizing', (done: Function) => {
            setTimeout(function () {
                let id = (diagram.nodes[0].wrapper.children[0] as GridPanel).rows[2].cells[0].children[0].id
                diagram.select([diagram.nodes[0]]);
                let x = 500; let y = 325.5;
                console.log(document.getElementById(id).getAttribute('width'));
                expect(document.getElementById(id).getAttribute('width') == '300').toBe(true);
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                console.log(document.getElementById(id).getAttribute('width'));
                expect(document.getElementById(id).getAttribute('width') == '320').toBe(true);
                done();
            }, 1000);
        });

    });

    describe('Horziontal Swimlane Selection when resizing - resizeSouth', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane25' });
            document.body.appendChild(ele);

            let pathData: string = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';

            let darkColor: string = '#C7D4DF';
            let lightColor: string = '#f5f5f5';

            let nodes: NodeModel[] = [
                {
                    //creating the swimlane and set its type as swimlane
                    id: 'swimlane',
                    shape: {
                        orientation: 'Horizontal',
                        type: 'SwimLane',
                        //initialize swimlane header
                        header: {
                            annotation: { content: 'ONLINE PURCHASE STATUS' },
                            height: 50, style: { fill: darkColor, fontSize: 11 },
                        },
                        lanes: [
                            //initialize the lanes
                            {
                                id: 'stackCanvas1',
                                //set the header properties
                                header: {
                                    annotation: { content: 'CUSTOMER' }, width: 50,
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor },
                                height: 120,
                            },
                        ],
                        //creating the phases of the swimlane
                        phases: [
                            //set the properties of the phase
                            {
                                id: 'phase1', offset: 200,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },

                        ],
                        phaseSize: 20,
                    },
                    offsetX: 350, offsetY: 300,
                    height: 200, width: 300
                },
            ];

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane25');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking horizontal swimlane resizing', (done: Function) => {
            setTimeout(function () {
                let id = (diagram.nodes[0].wrapper.children[0] as GridPanel).rows[2].cells[0].children[0].id
                diagram.select([diagram.nodes[0]]);
                let x = 300; let y = 390;
                expect(document.getElementById(id).getAttribute('height') == '130').toBe(true);
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                expect(document.getElementById(id).getAttribute('height') == '150').toBe(true);
                done();
            }, 1000);
        });

    });

    describe('Swimlane Sample', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane26' });
            document.body.appendChild(ele);

            let pathData: string = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';

            let darkColor: string = '#C7D4DF';
            let lightColor: string = '#f5f5f5';
            let nodes: NodeModel[] = [
                {
                    //creating the swimlane and set its type as swimlane
                    id: 'swimlane',
                    shape: {
                        orientation: 'Horizontal',
                        type: 'SwimLane',
                        //initialize swimlane header
                        header: {
                            annotation: { content: 'ONLINE PURCHASE STATUS' },
                            height: 50, style: { fill: darkColor, fontSize: 11 },
                        },
                        lanes: [
                            //initialize the lanes
                            {
                                id: 'stackCanvas1',
                                //set the header properties
                                header: {
                                    annotation: { content: 'CUSTOMER' }, width: 50,
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor },
                                height: 120,
                                //initialize the lane children
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
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor }, height: 120,
                                children: [
                                    {
                                        id: 'selectItemaddcart',
                                        annotations: [{ content: 'Select item\nAdd cart' }],
                                        margin: { left: 210, top: 20 },
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
                        //creating the phases of the swimlane
                        phases: [
                            //set the properties of the phase
                            {
                                id: 'phase1', offset: 200,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },
                            {
                                id: 'phase2', offset: 500,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 350, offsetY: 290,
                    height: 360, width: 650
                },
            ];

            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1', sourceID: 'Order', type: 'Orthogonal',
                    targetID: 'selectItemaddcart'
                },
                {
                    id: 'connector2', sourceID: 'selectItemaddcart', type: 'Orthogonal',
                    targetID: 'paymentondebitcreditcard'
                }
            ]

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes, connectors: connectors });
            diagram.appendTo('#diagramSwimlane26');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking swimlane selection and swimlane dragging', (done: Function) => {
            setTimeout(function () {
                let swimlaneElement = document.getElementById('swimlane');
                let bounds = swimlaneElement.getBoundingClientRect();
                let node = diagram.nameTable["swimlane"];
                expect(node.offsetX == 350 && node.offsetY == 290).toBe(true);
                mouseEvents.clickEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft, bounds.top + diagram.element.offsetTop);

                mouseEvents.mouseDownEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 10, bounds.top + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 20, bounds.top + diagram.element.offsetTop + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 30, bounds.top + diagram.element.offsetTop + 20);
                mouseEvents.mouseUpEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 30, bounds.top + diagram.element.offsetTop + 20);

                expect(node.offsetX == 370 && node.offsetY == 310).toBe(true);
                done();
            }, 1000);
        });

        it('Checking bounds updation when child nodes drag inside the phase and lane', (done: Function) => {
            setTimeout(function () {
                let node = document.getElementById('Order');
                let bounds = node.getBoundingClientRect();
                mouseEvents.clickEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft, bounds.top + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 10, bounds.top + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 20, bounds.top + diagram.element.offsetTop + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 30, bounds.top + diagram.element.offsetTop + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 30, bounds.top + diagram.element.offsetTop + 30);
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 40, bounds.top + diagram.element.offsetTop + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 80, bounds.top + diagram.element.offsetTop + 70);
                mouseEvents.mouseUpEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 50, bounds.top + diagram.element.offsetTop + 50);
                let swimlane = diagram.nameTable["swimlane"];
                expect(swimlane.offsetX == 402.5 && swimlane.offsetY == 330 && swimlane.shape.phases[0].offset == 265).toBe(true)
                done();
            }, 1000);
        });

        it('Checking lane interchanged', (done: Function) => {
            setTimeout(function () {
                let target = document.getElementById('Order');
                let bounds1 = target.getBoundingClientRect();
                let x1 = bounds1.left + bounds1.width / 2;
                let y1 = bounds1.top + bounds1.height / 2;

                let id = (diagram.nodes[0].wrapper.children[0] as GridPanel).rows[3].cells[1].children[0].id
                let node = document.getElementById(id);
                let bounds = node.getBoundingClientRect();

                let x = bounds.left + bounds.width / 2;
                let y = bounds.top + bounds.height / 2;

                mouseEvents.clickEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft + 10, y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x1 + diagram.element.offsetLeft + 30, y1 + diagram.element.offsetTop + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x1 + diagram.element.offsetLeft, y1 + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, x1 + diagram.element.offsetLeft, y1 + diagram.element.offsetTop);

                bounds = node.getBoundingClientRect();
                expect(diagram.nameTable["swimlanestackCanvas21"].rowIndex == 3).toBe(true);
                done();
            }, 1000);
        });

        it('Change node position to other grid cell', (done: Function) => {
            setTimeout(function () {
                let node = document.getElementById('Order');
                let bounds1 = node.getBoundingClientRect();
                let x1 = bounds1.left + bounds1.width / 2;
                let y1 = bounds1.top + bounds1.height / 2;

                let id = (diagram.nodes[0].wrapper.children[0] as GridPanel).rows[3].cells[1].children[0].id
                let target = document.getElementById(id);
                let bounds = target.getBoundingClientRect();

                let x = bounds.left + bounds.width / 2;
                let y = bounds.top + bounds.height / 2;

                mouseEvents.clickEvent(diagramCanvas, x1 + diagram.element.offsetLeft, y1 + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, x1 + diagram.element.offsetLeft + 10, y1 + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, x1 + diagram.element.offsetLeft + 20, y1 + diagram.element.offsetTop + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 30, y + diagram.element.offsetTop + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                node = document.getElementById('Order');
                bounds = node.getBoundingClientRect();
                expect(diagram.nameTable["Order"].parentId == "swimlanestackCanvas21").toBe(true);
                done();
            }, 1000);
        });

        it('Resize to less than min width', (done: Function) => {

            diagram.select([diagram.nodes[0]]);
            let target = document.getElementById('swimlane');
            let bounds1 = target.getBoundingClientRect();
            let x1 = bounds1.left + bounds1.width;
            let y1 = bounds1.top + bounds1.height / 2;
            mouseEvents.mouseDownEvent(diagramCanvas, x1 + diagram.element.offsetLeft, y1 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x1 + diagram.element.offsetLeft - 20, y1 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x1 + diagram.element.offsetLeft - 40, y1 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x1 + diagram.element.offsetLeft - 80, y1 + diagram.element.offsetTop);
            mouseEvents.mouseUpEvent(diagramCanvas, x1 + diagram.element.offsetLeft - 80, y1 + diagram.element.offsetTop);
            target = document.getElementById('swimlane');
            bounds1 = target.getBoundingClientRect();
            expect(diagram.nameTable["swimlane"].shape.phases[1].offset == 635).toBe(true);
            done();
        });

        it('Resize to less than min height', (done: Function) => {

            diagram.select([diagram.nodes[0]]);
            let target = document.getElementById('swimlane');
            let bounds1 = target.getBoundingClientRect();
            let x1 = bounds1.left + bounds1.width / 2;
            let y1 = bounds1.top + bounds1.height;
            mouseEvents.mouseDownEvent(diagramCanvas, x1 + diagram.element.offsetLeft, y1 + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x1 + diagram.element.offsetLeft, y1 + diagram.element.offsetTop - 20);
            mouseEvents.mouseMoveEvent(diagramCanvas, x1 + diagram.element.offsetLeft, y1 + diagram.element.offsetTop - 40);
            mouseEvents.mouseMoveEvent(diagramCanvas, x1 + diagram.element.offsetLeft, y1 + diagram.element.offsetTop - 80);
            mouseEvents.mouseUpEvent(diagramCanvas, x1 + diagram.element.offsetLeft, y1 + diagram.element.offsetTop - 80);
            target = document.getElementById('swimlane');
            bounds1 = target.getBoundingClientRect();
            expect(bounds1.height == 360).toBe(true);
            done();
        });


    });

    describe('Swimlane - Text editing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane27' });
            document.body.appendChild(ele);

            let pathData: string = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';

            let darkColor: string = '#C7D4DF';
            let lightColor: string = '#f5f5f5';
            let nodes: NodeModel[] = [
                {
                    //creating the swimlane and set its type as swimlane
                    id: 'swimlane',
                    shape: {
                        orientation: 'Horizontal',
                        type: 'SwimLane',
                        //initialize swimlane header
                        header: {
                            annotation: {
                                content: 'ONLINE PURCHASE STATUS',
                                style: { fill: 'black', color: 'white' }
                            },
                            height: 50, style: { fill: darkColor, fontSize: 11 },
                        },
                        lanes: [
                            //initialize the lanes
                            {
                                id: 'stackCanvas1',
                                //set the header properties
                                header: {
                                    annotation: { content: 'CUSTOMER' }, width: 50,
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor },
                                height: 120,
                                //initialize the lane children
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
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor }, height: 120,
                                children: [
                                    {
                                        id: 'selectItemaddcart',
                                        annotations: [{ content: 'Select item\nAdd cart' }],
                                        margin: { left: 210, top: 20 },
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
                        //creating the phases of the swimlane
                        phases: [
                            //set the properties of the phase
                            {
                                id: 'phase1', offset: 200,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },
                            {
                                id: 'phase2', offset: 500,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 350, offsetY: 290,
                    height: 360, width: 650
                },
            ];

            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1', sourceID: 'Order', type: 'Orthogonal',
                    targetID: 'selectItemaddcart'
                },
                {
                    id: 'connector2', sourceID: 'selectItemaddcart', type: 'Orthogonal',
                    targetID: 'paymentondebitcreditcard'
                }
            ]

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes, connectors: connectors });
            diagram.appendTo('#diagramSwimlane27');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Change header text ', (done: Function) => {

            setTimeout(function () {
                let swimlaneElement = document.getElementById('swimlane');
                let bounds = swimlaneElement.getBoundingClientRect();
                mouseEvents.clickEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 100, bounds.top + diagram.element.offsetTop);
                mouseEvents.dblclickEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 100, bounds.top + diagram.element.offsetTop);
                (document.getElementById(diagram.element.id + '_editBox') as HTMLInputElement).value = "newAnnotation";
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
                expect((diagram.nodes[0].shape as SwimLaneModel).header.annotation.content == "newAnnotation").toBe(true);
                done();
            }, 1000);
        });
        it('Header text style ', (done: Function) => {
            expect((diagram.nodes[0].shape as SwimLaneModel).header.annotation.style.fill == "black").toBe(true);
            done();
        });
        it('Change lane header text ', (done: Function) => {

            let id = ((diagram.nodes[0].wrapper.children[0] as GridPanel).rows[2].cells[0].children[0] as GridPanel).children[1].id
            let lane = document.getElementById(id);
            let bounds = lane.getBoundingClientRect();
            mouseEvents.clickEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 3, bounds.top + diagram.element.offsetTop + 20);
            mouseEvents.dblclickEvent(diagramCanvas, bounds.left + diagram.element.offsetLeft + 3, bounds.top + diagram.element.offsetTop + 20);
            (document.getElementById(diagram.element.id + '_editBox') as HTMLInputElement).value = "newAnnotation1";
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            expect((diagram.nodes[0].shape as SwimLaneModel).lanes[0].header.annotation.content == "newAnnotation1").toBe(true);
            done();
        });
    });

    describe('Swimlane Sample', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane28' });
            document.body.appendChild(ele);

            let pathData: string = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';

            let darkColor: string = '#C7D4DF';
            let lightColor: string = '#f5f5f5';
            let nodes: NodeModel[] = [
                {
                    //creating the swimlane and set its type as swimlane
                    id: 'swimlane',
                    shape: {
                        orientation: 'Horizontal',
                        type: 'SwimLane',
                        //initialize swimlane header
                        header: {
                            annotation: { content: 'ONLINE PURCHASE STATUS' },
                            height: 50, style: { fill: darkColor, fontSize: 11 },
                        },
                        lanes: [
                            //initialize the lanes
                            {
                                id: 'stackCanvas1',
                                //set the header properties
                                header: {
                                    annotation: { content: 'CUSTOMER' }, width: 50,
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor },
                                height: 120,
                                //initialize the lane children
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
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor }, height: 120,
                                children: [
                                    {
                                        id: 'selectItemaddcart',
                                        annotations: [{ content: 'Select item\nAdd cart' }],
                                        margin: { left: 210, top: 20 },
                                        height: 40, width: 100
                                    },
                                    {
                                        id: 'paymentondebitcreditcard',
                                        annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                                        margin: { left: 410, top: 20 },
                                        height: 40, width: 100
                                    }
                                ],
                            },
                        ],
                        //creating the phases of the swimlane
                        phases: [
                            //set the properties of the phase
                            {
                                id: 'phase1', offset: 200,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },
                            {
                                id: 'phase2', offset: 500,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 350, offsetY: 290,
                    height: 360, width: 650
                },
            ];

            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1', sourceID: 'Order', type: 'Orthogonal',
                    targetID: 'selectItemaddcart'
                },
                {
                    id: 'connector2', sourceID: 'selectItemaddcart', type: 'Orthogonal',
                    targetID: 'paymentondebitcreditcard'
                }
            ]

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes, connectors: connectors });
            diagram.appendTo('#diagramSwimlane28');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Checking add phase', (done: Function) => {

            setTimeout(function () {
                let phases: PhaseModel = {
                    id: 'phase154', offset: 200,
                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                    header: { annotation: { content: 'Phase' } }
                } as PhaseModel;

                diagram.addPhases(diagram.nodes[0], [phases]);
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == 3).toBe(true);
                done();
            }, 1000);
        });

    });

    describe('Swimlane Sample', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane29' });
            document.body.appendChild(ele);

            let pathData: string = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';

            let darkColor: string = '#C7D4DF';
            let lightColor: string = '#f5f5f5';
            let nodes: NodeModel[] = [
                {
                    //creating the swimlane and set its type as swimlane
                    id: 'swimlane',
                    shape: {
                        orientation: 'Horizontal',
                        type: 'SwimLane',
                        //initialize swimlane header
                        header: {
                            annotation: { content: 'ONLINE PURCHASE STATUS' },
                            height: 50, style: { fill: darkColor, fontSize: 11 },
                        },
                        lanes: [
                            //initialize the lanes
                            {
                                id: 'stackCanvas1',
                                //set the header properties
                                header: {
                                    annotation: { content: 'CUSTOMER' }, width: 50,
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor },
                                height: 120,
                                //initialize the lane children
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
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor }, height: 120,
                                children: [
                                    {
                                        id: 'selectItemaddcart',
                                        annotations: [{ content: 'Select item\nAdd cart' }],
                                        margin: { left: 210, top: 20 },
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
                        //creating the phases of the swimlane
                        phases: [
                            //set the properties of the phase
                            {
                                id: 'phase1', offset: 200,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },
                            {
                                id: 'phase2', offset: 500,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } }
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 350, offsetY: 290,
                    height: 360, width: 650
                },
            ];

            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1', sourceID: 'Order', type: 'Orthogonal',
                    targetID: 'selectItemaddcart'
                },
                {
                    id: 'connector2', sourceID: 'selectItemaddcart', type: 'Orthogonal',
                    targetID: 'paymentondebitcreditcard'
                }
            ]

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes, connectors: connectors });
            diagram.appendTo('#diagramSwimlane29');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Checking add Lane to swimlane', (done: Function) => {

            setTimeout(function () {


                let darkColor: string = '#C7D4DF';
                let lightColor: string = '#f5f5f5';
                let lane: LaneModel = {
                    id: 'stackCanvas33',
                    header: {
                        width: 50, annotation: { content: 'vcds' },
                        style: { fill: darkColor }
                    },
                    style: { fill: lightColor }, height: 120,
                } as LaneModel;

                diagram.addLanes(diagram.nodes[0], [lane] as LaneModel[]);
                let laneElement = document.getElementById('stackCanvas330');
                expect(laneElement !== undefined).toBe(true);
                done();
            }, 1000);
        });

        it('Code coverage for add lane and phase', (done: Function) => {
            let darkColor: string = '#C7D4DF';
            let lightColor: string = '#f5f5f5';
            let lane: LaneModel = {
                id: 'stackCanvas33',
                header: {
                    width: 50, annotation: { content: 'vcds' },
                    style: { fill: darkColor }
                },
                style: { fill: lightColor }, height: 120,
            } as LaneModel;

            diagram.addLanes(diagram.nodes[1], [lane] as LaneModel[]);

            let phases: PhaseModel = {
                id: 'phase154', offset: 200,
                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                header: { annotation: { content: 'Phase' } }
            } as PhaseModel;

            diagram.addPhases(diagram.nodes[1], [phases]);
            done();
        });

        it('Checking Collection Change Event for adding lanes', (done: Function) => {
            let event: string = '';
            diagram.collectionChange = function (args) {
                event += 'CollectionChange';
                let obj: NodeModel = args.element as NodeModel;
                if (obj instanceof Node) {
                    console.log('Event: collectionChange', "id: [" + obj.id + "]", "parentId: [" + args.parentId + "]");
                }
            }
            let darkColor: string = '#C7D4DF';
            let lightColor: string = '#f5f5f5';
            let lane: LaneModel = {
                id: 'stackCanvas35',
                header: {
                    width: 50, annotation: { content: 'data' },
                    style: { fill: darkColor }
                },
                style: { fill: lightColor }, height: 120,
            } as LaneModel;

            diagram.addLanes(diagram.nodes[0], [lane] as LaneModel[]);
            expect(event == 'CollectionChangeCollectionChange').toBe(true);
            done();
        });
    });
    describe('Swimlane Sample', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane29' });
            document.body.appendChild(ele);
            let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
            let darkColor = '#C7D4DF';
            let lightColor = '#f5f5f5';
            let nodes: NodeModel[] = [
                {
                    id: 'swimlane',
                    shape: {
                        type: 'SwimLane',
                        header: {
                            annotation: { content: 'ONLINE PURCHASE STATUS' },
                            height: 50, style: { fill: darkColor, fontSize: 11 },
                            orientation: 'Horizontal',
                        },
                        lanes: [
                            {
                                id: 'stackCanvas1',
                                header: {
                                    annotation: { content: 'CUSTOMER' }, width: 50,
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor },
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
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor }, height: 100,
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
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor },
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
                                    style: { fill: darkColor, fontSize: 11 }
                                },
                                style: { fill: lightColor },
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
                                id: 'phase1', offset: 170,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase1' } }
                            },
                            {
                                id: 'phase2', offset: 450,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase2' } }
                            },
                        ],
                        phaseSize: 10,
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
            function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                connector.type = 'Orthogonal'
                return connector;
            }

            diagram = new Diagram({
                width: '100%',
                height: '800px',
                nodes: nodes,
                connectors: connectors,
                getConnectorDefaults: getConnectorDefaults,
            });
            diagram.appendTo('#diagramSwimlane29');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Content Property Changes', (done: Function) => {

            let swimlanenode = diagram.nodes[0];
            (swimlanenode.shape as SwimLaneModel).lanes[0].header.annotation.content = 'aaaa';
            diagram.dataBind();
            let grid = (swimlanenode.wrapper.children[0] as GridPanel);
            let id = (grid.rows[2].cells[0].children[0] as GridPanel).children[1].id;
            let child = document.getElementById(id + '_groupElement');
            let temp = child.children[2];
            expect((temp.children[1].childNodes[0] as HTMLElement).innerHTML == 'aaaa').toBe(true);
            done();
            (swimlanenode.shape as SwimLaneModel).phases[0].header.annotation.content = 'bbbb';
            diagram.dataBind();
            id = grid.rows[1].cells[0].children[0].id;
            child = document.getElementById(id + '_groupElement');
            temp = child.children[2];
            expect((temp.children[1].childNodes[0] as HTMLElement).innerHTML == 'bbbb').toBe(true);
            (swimlanenode.shape as SwimLaneModel).lanes[0].children[0].annotations[0].content = 'abcd';
            diagram.dataBind();
            id = (grid.rows[2].cells[0].children[0] as GridPanel).children[2].id;
            child = document.getElementById(id + '_groupElement');
            expect((child.childNodes[2].childNodes[1].childNodes[0] as HTMLElement).innerHTML == 'abcd').toBe(true);
            done();
        });

        it('delete and save and load', (done: Function) => {
            let length = diagram.nodes.length;
            let savedata = diagram.saveDiagram();
            diagram.dataBind();
            diagram.remove(diagram.nodes[0]);
            diagram.dataBind();
            expect(diagram.nodes.length == 0).toBe(true);
            diagram.loadDiagram(savedata);
            expect(diagram.nodes.length == length).toBe(true);
            done();
        });
    });
    describe('Swimlane interaction', () => {
        describe('Horizontal Orientation', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'symbolpalette1', styles: 'width:25%;float:left;' }));
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram1', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);
                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                                orientation: 'Horizontal',
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, height: 100,
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                    id: 'phase1', offset: 170,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 450,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
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
                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }

                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    connectors: connectors,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram1');

                palette = new SymbolPalette({
                    width: '25%', height: '500px',
                    palettes: [
                        {
                            id: 'flow', expanded: true, symbols: [
                                { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' }, style: { strokeWidth: 1 } },
                                { id: 'Process', shape: { type: 'Flow', shape: 'Process' }, style: { strokeWidth: 1 } },
                                { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' }, style: { strokeWidth: 1 } },
                                { id: 'Document', shape: { type: 'Flow', shape: 'Document' }, style: { strokeWidth: 1 } }], title: 'Flow Shapes'
                        },
                        {
                            id: 'swimlaneShapes', expanded: true,
                            title: 'Swimlane Shapes',
                            symbols: [
                                {
                                    id: 'stackCanvas1',
                                    shape: {
                                        type: 'SwimLane', lanes: [
                                            {
                                                id: 'lane1',
                                                style: { fill: '#f5f5f5' }, height: 60, width: 150,
                                                header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                            }
                                        ],
                                        orientation: 'Horizontal', isLane: true
                                    },
                                    height: 60,
                                    width: 140,
                                    style: { fill: '#f5f5f5' },
                                    offsetX: 70,
                                    offsetY: 30,
                                }, {
                                    id: 'stackCanvas2',
                                    shape: {
                                        type: 'SwimLane',
                                        lanes: [
                                            {
                                                id: 'lane1',
                                                style: { fill: '#f5f5f5' }, height: 150, width: 60,
                                                header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                            }
                                        ],
                                        orientation: 'Vertical', isLane: true
                                    },
                                    height: 140,
                                    width: 60,
                                    style: { fill: '#f5f5f5' },
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
                    ], symbolHeight: 50, symbolWidth: 50,
                    symbolPreview: { width: 100, height: 100 },
                    expandMode: 'Multiple',
                });
                palette.appendTo('#symbolpalette1');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Selection - Swimlane', (done: Function) => {
                setTimeout(function () {
                    let swimlane = diagram.nodes[0];
                    mouseEvents.mouseDownEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);
                    mouseEvents.mouseUpEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);
                    expect(diagram.selectedItems.nodes[0].id == 'swimlane').toBe(true);
                }, 30);
                done();
            });

            it('Selection - phase', (done: Function) => {
                let phase = diagram.nameTable["swimlanephase1_header"];
                mouseEvents.mouseDownEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header').toBe(true);
                expect(diagram.selectedItems.wrapper.bounds.x == 85 && diagram.selectedItems.wrapper.bounds.y == 85 &&
                    diagram.selectedItems.wrapper.bounds.width == 190 && diagram.selectedItems.wrapper.bounds.height == 420).toBe(true);
                done();
            });
            it('Drag - swimlane', (done: Function) => {
                diagram.clearSelection();
                diagram.select([diagram.nodes[0]]);
                let swimlane = diagram.nodes[0];
                undoOffsetX = swimlane.wrapper.offsetX; undoOffsetY = swimlane.wrapper.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);
                mouseEvents.mouseMoveEvent(diagramCanvas, swimlane.wrapper.bounds.x + 30 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 15);
                mouseEvents.mouseMoveEvent(diagramCanvas, swimlane.wrapper.bounds.x + 40 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 25);
                mouseEvents.mouseMoveEvent(diagramCanvas, swimlane.wrapper.bounds.x + 50 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 35);
                mouseEvents.mouseUpEvent(diagramCanvas, swimlane.wrapper.bounds.x + 50 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 35);
                expect(diagram.nodes[0].offsetX == 445 && diagram.nodes[0].offsetY == 295).toBe(true);
                redoOffsetX = swimlane.wrapper.offsetX; redoOffsetY = swimlane.wrapper.offsetY;
                done();
            });

            it('Drag - Phase', (done: Function) => {
                diagram.clearSelection();
                let phase = diagram.nameTable["swimlanephase1_header"];
                mouseEvents.mouseDownEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, phase.wrapper.bounds.x + 30 + diagram.element.offsetLeft, phase.wrapper.bounds.y + diagram.element.offsetTop + 15);
                mouseEvents.mouseMoveEvent(diagramCanvas, phase.wrapper.bounds.x + 40 + diagram.element.offsetLeft, phase.wrapper.bounds.y + diagram.element.offsetTop + 25);
                mouseEvents.mouseMoveEvent(diagramCanvas, phase.wrapper.bounds.x + 50 + diagram.element.offsetLeft, phase.wrapper.bounds.y + diagram.element.offsetTop + 35);
                mouseEvents.mouseUpEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header').toBe(true);
                expect(diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 110 &&
                    diagram.selectedItems.wrapper.bounds.width == 190 && diagram.selectedItems.wrapper.bounds.height == 420).toBe(true);
                done();
            });
            it('Drag - Lane', (done: Function) => {
                diagram.clearSelection();
                let lane = diagram.nameTable["swimlanestackCanvas11"];
                mouseEvents.mouseDownEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, lane.wrapper.bounds.x + 30 + diagram.element.offsetLeft, lane.wrapper.bounds.y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, lane.wrapper.bounds.x + 40 + diagram.element.offsetLeft, lane.wrapper.bounds.y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, lane.wrapper.bounds.x + 50 + diagram.element.offsetLeft, lane.wrapper.bounds.y + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas11').toBe(true);
                expect(diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 130 &&
                    diagram.selectedItems.wrapper.bounds.width == 670 && diagram.selectedItems.wrapper.bounds.height == 100).toBe(true);
                done();
            });
            it('Resize East - Swimlane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                undoOffsetX = swimlane.wrapper.offsetX; undoOffsetY = swimlane.wrapper.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);
                mouseEvents.mouseUpEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);

                expect(diagram.selectedItems.nodes[0].id == 'swimlane').toBe(true);
                expect(diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 60 &&
                    diagram.selectedItems.wrapper.bounds.width == 670 && diagram.selectedItems.wrapper.bounds.height == 470).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + diagram.selectedItems.wrapper.bounds.width + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height / 2) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 20, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 40, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 70, y);
                mouseEvents.mouseUpEvent(diagramCanvas, x + 70, y);
                redoOffsetX = swimlane.wrapper.offsetX; redoOffsetY = swimlane.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase2_header').toBe(true);
                expect(diagram.selectedItems.wrapper.bounds.x == 300 && diagram.selectedItems.wrapper.bounds.y == 110 &&
                    diagram.selectedItems.wrapper.bounds.width == 560 && diagram.selectedItems.wrapper.bounds.height == 420).toBe(true);
                done();
            });
            it('Undo action after resize the swimlane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                diagram.undo();
                expect(swimlane.wrapper.offsetX == undoOffsetX && swimlane.wrapper.offsetY == undoOffsetY).toBe(true);
                diagram.redo();
                expect(swimlane.wrapper.offsetX == redoOffsetX && swimlane.wrapper.offsetY == redoOffsetY).toBe(true);
                done();
            });
            it('Resize South - Swimlane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                undoOffsetX = swimlane.wrapper.offsetX; undoOffsetY = swimlane.wrapper.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);
                mouseEvents.mouseUpEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);

                expect(diagram.selectedItems.nodes[0].id == 'swimlane').toBe(true);
                expect(diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 60 &&
                    diagram.selectedItems.wrapper.bounds.width == 750 && diagram.selectedItems.wrapper.bounds.height == 470).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + (diagram.selectedItems.wrapper.bounds.width / 2) + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 70);
                mouseEvents.mouseUpEvent(diagramCanvas, x, y + 70);
                redoOffsetX = swimlane.wrapper.offsetX; redoOffsetY = swimlane.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas41').toBe(true);
                expect(diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 430 &&
                    diagram.selectedItems.wrapper.bounds.width == 750 && diagram.selectedItems.wrapper.bounds.height == 170).toBe(true);
                done();
            });
            it('Resize East - Lane', (done: Function) => {
                let lane = diagram.nameTable["swimlanestackCanvas11"];
                undoOffsetX = lane.wrapper.offsetX; undoOffsetY = lane.wrapper.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas11' && diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 130 &&
                    diagram.selectedItems.wrapper.bounds.width == 750 && diagram.selectedItems.wrapper.bounds.height == 100).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + diagram.selectedItems.wrapper.bounds.width + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height / 2) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 20, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 40, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 70, y);
                mouseEvents.mouseUpEvent(diagramCanvas, x + 70, y);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase2_header' && diagram.selectedItems.wrapper.bounds.x == 300 && diagram.selectedItems.wrapper.bounds.y == 110 &&
                    diagram.selectedItems.wrapper.bounds.width == 640 && diagram.selectedItems.wrapper.bounds.height == 490).toBe(true);
                redoOffsetX = lane.wrapper.offsetX; redoOffsetY = lane.wrapper.offsetY;
                done();
            });
            it('Undo, redo action after lane resizing east direction', (done: Function) => {
                let swimlane = diagram.nameTable["swimlanestackCanvas11"];
                diagram.undo();
                expect(swimlane.wrapper.offsetX == undoOffsetX && swimlane.wrapper.offsetY == undoOffsetY).toBe(true);
                diagram.redo();
                expect(swimlane.wrapper.offsetX == redoOffsetX && swimlane.wrapper.offsetY == redoOffsetY).toBe(true);
                done();
            });
            it('Resize East - Phase', (done: Function) => {
                let phase = diagram.nameTable["swimlanephase1_header"];
                mouseEvents.mouseDownEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                undoOffsetX = phase.wrapper.offsetX; undoOffsetY = phase.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header' && diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 110
                    && diagram.selectedItems.wrapper.bounds.width == 190 && diagram.selectedItems.wrapper.bounds.height == 490).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + diagram.selectedItems.wrapper.bounds.width + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height / 2) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 20, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 40, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 70, y);
                mouseEvents.mouseUpEvent(diagramCanvas, x + 70, y);
                redoOffsetX = phase.wrapper.offsetX; redoOffsetY = phase.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header' && diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 110 &&
                    diagram.selectedItems.wrapper.bounds.width == 270 && diagram.selectedItems.wrapper.bounds.height == 490).toBe(true);
                done();
            });
            it('Undo, redo action after phase resizing east direction', (done: Function) => {
                let swimlane = diagram.nameTable["swimlanephase1_header"];
                diagram.undo();
                expect(swimlane.wrapper.offsetX == undoOffsetX && swimlane.wrapper.offsetY == undoOffsetY).toBe(true);
                diagram.redo();
                expect(swimlane.wrapper.offsetX == redoOffsetX && swimlane.wrapper.offsetY == redoOffsetY).toBe(true);
                done();
            });
            it('Resize South - Phase', (done: Function) => {
                let phase = diagram.nameTable["swimlanephase1_header"];
                undoOffsetX = phase.wrapper.offsetX; undoOffsetY = phase.wrapper.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header' && diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 110 &&
                    diagram.selectedItems.wrapper.bounds.width == 270 && diagram.selectedItems.wrapper.bounds.height == 490).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + (diagram.selectedItems.wrapper.bounds.width / 2) + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 70);
                mouseEvents.mouseUpEvent(diagramCanvas, x, y + 70);
                redoOffsetX = phase.wrapper.offsetX; redoOffsetY = phase.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas41' && diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 430 &&
                    diagram.selectedItems.wrapper.bounds.width == 910 && diagram.selectedItems.wrapper.bounds.height == 250).toBe(true);
                done();
            });
            it('Undo, redo action after phase resizing south direction', (done: Function) => {
                let swimlane = diagram.nameTable["swimlanephase1_header"];
                diagram.undo();
                expect(swimlane.wrapper.offsetX == undoOffsetX && swimlane.wrapper.offsetY == undoOffsetY).toBe(true);
                diagram.redo();
                expect(swimlane.wrapper.offsetX == redoOffsetX && swimlane.wrapper.offsetY == redoOffsetY).toBe(true);
                done();
            });
            it('Drag and drop node from one lane to another lane', (done: Function) => {
                let node = diagram.nameTable["Order"];
                let targetNode = diagram.nameTable["swimlanestackCanvas20"];
                let sourcePointX = node.wrapper.offsetX + diagram.element.offsetLeft;
                let sourcePointY = node.wrapper.offsetY + diagram.element.offsetTop;
                let targetPointX = targetNode.wrapper.offsetX + diagram.element.offsetLeft;
                let targetPointY = targetNode.wrapper.offsetY + diagram.element.offsetTop;
                expect(diagram.nameTable["Order"].parentId == 'swimlanestackCanvas10').toBe(true);
                mouseEvents.mouseDownEvent(diagramCanvas, sourcePointX, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY - 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY);
                mouseEvents.mouseUpEvent(diagramCanvas, targetPointX, targetPointY);
                expect(diagram.nameTable["Order"].parentId == 'swimlanestackCanvas20').toBe(true);
                done();
            });
            it('Undo, redo action after change the node from one lane to another', (done: Function) => {
                let node = diagram.nameTable["Order"];
                diagram.undo();
                expect((node as Node).parentId == 'swimlanestackCanvas10').toBe(true);
                diagram.redo();
                expect((node as Node).parentId == 'swimlanestackCanvas20').toBe(true);
                done();
            });
            it('Drag - node(Check update lane bounds South direction)', (done: Function) => {

                let node = diagram.nameTable["Order"];
                let targetNode = diagram.nameTable["swimlanestackCanvas20"];
                let sourcePointX = node.wrapper.offsetX + diagram.element.offsetLeft;
                let sourcePointY = node.wrapper.offsetY + diagram.element.offsetTop;
                let targetPointX = targetNode.wrapper.offsetX + diagram.element.offsetLeft;
                let targetPointY = targetNode.wrapper.offsetY + (targetNode.wrapper.height / 2) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, sourcePointX, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, targetPointY - 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, targetPointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, targetPointY - 5);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, targetPointY - 15);
                mouseEvents.mouseUpEvent(diagramCanvas, sourcePointX, targetPointY - 15);
                expect(node.offsetX == 250 && node.offsetY == 310).toBe(true);
                let lane = Number(document.getElementById('swimlanestackCanvas20').getAttribute('height'));
                expect(lane > 100).toBe(true);
                done();
            });

            it('Drag - node(Check update lane bounds East direction)', (done: Function) => {

                let node = diagram.nameTable["Order"];
                let targetNode = diagram.nameTable["swimlanestackCanvas20"];
                let sourcePointX = node.wrapper.offsetX + diagram.element.offsetLeft;
                let sourcePointY = node.wrapper.offsetY + diagram.element.offsetTop;
                let targetPointX = targetNode.wrapper.offsetX + (targetNode.wrapper.width / 2) + diagram.element.offsetLeft;
                let targetPointY = targetNode.wrapper.offsetY + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, sourcePointX, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX + 20, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX + 40, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX - 20, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX - 5, sourcePointY);
                mouseEvents.mouseUpEvent(diagramCanvas, targetPointX - 5, sourcePointY);
                expect((node.offsetX == 370 || node.offsetX == 380) && node.offsetY == 310).toBe(true);
                let lane = Number(document.getElementById('swimlanestackCanvas20').getAttribute('width'));
                expect(lane === 330 || lane === 340).toBe(true);
                done();
            });

            it('Lane copy, paste with node', (done: Function) => {
                expect(diagram.nodes.length == 24).toBe(true);
                let targetNode = diagram.nameTable["swimlanestackCanvas20"];
                diagram.select([targetNode]);
                diagram.copy();
                diagram.paste();
                diagram.paste();
                expect(diagram.nodes.length == 44).toBe(true);
                expect(diagram.nodes.length > 0).toBe(true);
                done();
            });

            it('Undo redo action after paste the lane', (done: Function) => {
                diagram.undo();
                diagram.undo();
                expect(diagram.nodes.length == 24).toBe(true);
                diagram.redo();
                diagram.redo();
                expect(diagram.nodes.length == 44).toBe(true);
                diagram.undo();
                diagram.undo();
                expect(diagram.nodes.length == 24).toBe(true);
                done();
            });

            it('Swimlane copy, paste with node', (done: Function) => {
                expect(diagram.nodes.length == 24).toBe(true);
                let targetNode = diagram.nameTable["swimlane"];
                diagram.select([targetNode]);
                diagram.copy();
                diagram.paste();
                diagram.paste();
                expect(diagram.nodes.length == 72).toBe(true);
                expect(diagram.nodes.length > 0).toBe(true);
                done();
            });

            it('Undo redo action after paste the lane', (done: Function) => {
                expect(diagram.nodes.length == 72).toBe(true);
                diagram.undo();
                diagram.undo();
                expect(diagram.nodes.length == 24).toBe(true);
                diagram.redo();
                diagram.redo();
                expect(diagram.nodes.length == 72).toBe(true);
                diagram.undo();
                diagram.undo();
                expect(diagram.nodes.length == 24).toBe(true);
                done();
            });

            it('Drag and drop the node from palette to lane', (done: Function) => {
                palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                    let clonedElement: HTMLElement; let diagramElement: any;
                    let position: PointModel = palette['getMousePosition'](e.sender);
                    let symbols: IElement = palette.symbolTable['Terminator'];
                    palette['selectedSymbols'] = symbols;
                    if (symbols !== undefined) {
                        clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                        clonedElement.setAttribute('paletteId', palette.element.id);
                    }
                    return clonedElement;
                };
                let events: MouseEvents = new MouseEvents();
                let ele = document.getElementById("Terminator_container");
                let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
                let startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
                let startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;
                events.mouseDownEvent(palette.element, 75, 100, false, false);
                events.mouseMoveEvent(palette.element, 100, 100, false, false);
                events.mouseMoveEvent(palette.element, 200, 200, false, false);
                expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
                events.mouseMoveEvent(diagram.element, 500, 300, false, false);
                events.mouseMoveEvent(diagram.element, 500, 305, false, false);
                events.mouseMoveEvent(diagram.element, 500, 310, false, false);
                events.mouseUpEvent(diagram.element, 500, 300, false, false);
                done();
            });
            it('Drag and drop the node from palette to lane and ensure single selection', (done: Function) => {
                palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                    let clonedElement: HTMLElement; let diagramElement: any;
                    let position: PointModel = palette['getMousePosition'](e.sender);
                    let symbols: IElement = palette.symbolTable['Terminator'];
                    palette['selectedSymbols'] = symbols;
                    if (symbols !== undefined) {
                        clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                        clonedElement.setAttribute('paletteId', palette.element.id);
                    }
                    return clonedElement;
                };
                let events: MouseEvents = new MouseEvents();
                let ele = document.getElementById("Terminator_container");
                let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
                let startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
                let startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;
                diagram.select([diagram.nodes[diagram.nodes.length - 1]]);
                events.mouseDownEvent(palette.element, 75, 100, false, false);
                events.mouseMoveEvent(palette.element, 100, 100, false, false);
                events.mouseMoveEvent(palette.element, 200, 200, false, false);
                events.mouseMoveEvent(diagram.element, 500, 300, false, false);
                events.mouseMoveEvent(diagram.element, 500, 305, false, false);
                events.mouseMoveEvent(diagram.element, 500, 310, false, false);
                events.mouseUpEvent(diagram.element, 500, 300, false, false);
                expect(diagram.selectedItems.nodes.length === 1).toBe(true);
                done();
            });
            it('Drag and drop the node from palette to diagram and then diagram to lane', (done: Function) => {
                palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                    let clonedElement: HTMLElement; let diagramElement: any;
                    let position: PointModel = palette['getMousePosition'](e.sender);
                    let symbols: IElement = palette.symbolTable['Terminator'];
                    palette['selectedSymbols'] = symbols;
                    if (symbols !== undefined) {
                        clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                        clonedElement.setAttribute('paletteId', palette.element.id);
                    }
                    return clonedElement;
                };
                let events: MouseEvents = new MouseEvents();
                let ele = document.getElementById("Terminator_container");

                let targetElement = diagram.nameTable["swimlanestackCanvas20"];
                let targetOffsetX = targetElement.wrapper.offsetX;
                let targetOffsetY = targetElement.wrapper.offsetY;

                let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
                let startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
                let startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;
                events.mouseDownEvent(palette.element, 75, 100, false, false);
                events.mouseMoveEvent(palette.element, 100, 100, false, false);
                events.mouseMoveEvent(palette.element, 200, 200, false, false);
                expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
                events.mouseMoveEvent(diagram.element, 50 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, 55 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, 60 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop, false, false);
                events.mouseUpEvent(diagram.element, 60 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop, false, false);

                events.mouseDownEvent(diagram.element, 100 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, 100 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + 10 + diagram.element.offsetLeft, targetOffsetY + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + diagram.element.offsetTop, false, false);
                events.mouseUpEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + diagram.element.offsetTop, false, false);
                done();
            });
            it('delete - lane', (done: Function) => {
                let lane = diagram.nameTable["swimlanestackCanvas31"];
                let swimlane = diagram.nameTable[(lane as Node).parentId];
                expect((swimlane.shape as SwimLaneModel).lanes.length == 4).toBe(true);
                diagram.remove(lane);
                expect((swimlane.shape as SwimLaneModel).lanes.length == 3).toBe(true);
                done();
            });
            it('Undo, redo action after deleting the lane', (done: Function) => {
                let swimlane = diagram.nameTable["swimlane"];
                expect((swimlane.shape as SwimLaneModel).lanes.length == 3).toBe(true);
                diagram.undo();
                expect((swimlane.shape as SwimLaneModel).lanes.length == 4).toBe(true);
                diagram.redo();
                expect((swimlane.shape as SwimLaneModel).lanes.length == 3).toBe(true);
                done();
            });
            it('delete - phase', (done: Function) => {
                let phase = diagram.nameTable["swimlanephase2_header"];
                let swimlane = diagram.nameTable[(phase as Node).parentId];
                expect((swimlane.shape as SwimLaneModel).phases.length == 2).toBe(true);
                diagram.remove(phase);
                expect((swimlane.shape as SwimLaneModel).phases.length == 1).toBe(true);
                done();
            });
            it('Undo, redo action after deleting the phase', (done: Function) => {
                let swimlane = diagram.nameTable["swimlane"];
                expect((swimlane.shape as SwimLaneModel).phases.length == 1).toBe(true);
                diagram.undo();
                expect((swimlane.shape as SwimLaneModel).phases.length == 2).toBe(true);
                diagram.redo();
                expect((swimlane.shape as SwimLaneModel).phases.length == 1).toBe(true);
                done();
            });
            it('delete - swimlane', (done: Function) => {
                let swimlane = diagram.nameTable["swimlane"];
                expect(diagram.nodes.length > 0).toBe(true);
                diagram.remove(swimlane);
                expect(diagram.nodes.length == 0).toBe(true);
                done();
            });
        });
        describe('Vertical Orientation', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'symbolpalette3', styles: 'width:25%;float:left;' }));
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram3', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);
                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            orientation: 'Vertical',
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    width: 140,
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
                                            margin: { left: 60, top: 60 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                                {
                                    id: 'stackCanvas2',
                                    header: {
                                        annotation: { content: 'ONLINE' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 120,
                                    children: [
                                        {
                                            id: 'selectItemaddcart',
                                            annotations: [{ content: 'Select item\nAdd cart' }],
                                            margin: { left: 200, top: 60 },
                                            height: 40, width: 100
                                        },
                                        {
                                            id: 'paymentondebitcreditcard',
                                            annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                                            margin: { left: 200, top: 250 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                                {
                                    id: 'stackCanvas3',
                                    header: {
                                        annotation: { content: 'SHOP' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 50,
                                },
                                {
                                    id: 'stackCanvas4',
                                    header: {
                                        annotation: { content: 'DELIVERY' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 50,
                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 200,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 400,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 350, offsetY: 290,
                        height: 360, width: 400
                    },
                ];
                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }

                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram3');

                palette = new SymbolPalette({
                    width: '25%', height: '500px',
                    palettes: [
                        {
                            id: 'flow', expanded: true, symbols: [
                                { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' }, style: { strokeWidth: 1 } },
                                { id: 'Process', shape: { type: 'Flow', shape: 'Process' }, style: { strokeWidth: 1 } },
                                { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' }, style: { strokeWidth: 1 } },
                                { id: 'Document', shape: { type: 'Flow', shape: 'Document' }, style: { strokeWidth: 1 } }], title: 'Flow Shapes'
                        },
                        {
                            id: 'swimlaneShapes', expanded: true,
                            title: 'Swimlane Shapes',
                            symbols: [
                                {
                                    id: 'stackCanvas1',
                                    shape: {
                                        type: 'SwimLane', lanes: [
                                            {
                                                id: 'lane1',
                                                style: { fill: '#f5f5f5' }, height: 60, width: 150,
                                                header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                            }
                                        ],
                                        orientation: 'Horizontal', isLane: true
                                    },
                                    height: 60,
                                    width: 140,
                                    style: { fill: '#f5f5f5' },
                                    offsetX: 70,
                                    offsetY: 30,
                                }, {
                                    id: 'stackCanvas2',
                                    shape: {
                                        type: 'SwimLane',
                                        lanes: [
                                            {
                                                id: 'lane1',
                                                style: { fill: '#f5f5f5' }, height: 150, width: 60,
                                                header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                            }
                                        ],
                                        orientation: 'Vertical', isLane: true
                                    },
                                    height: 140,
                                    width: 60,
                                    style: { fill: '#f5f5f5' },
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
                    ], symbolHeight: 50, symbolWidth: 50,
                    symbolPreview: { width: 100, height: 100 },
                    expandMode: 'Multiple',
                });
                palette.appendTo('#symbolpalette3');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Selection - Swimlane', (done: Function) => {
                setTimeout(function () {
                    let swimlane = diagram.nodes[0];
                    mouseEvents.mouseDownEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);
                    mouseEvents.mouseUpEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);
                    expect(diagram.selectedItems.nodes[0].id == 'swimlane').toBe(true);
                }, 30);
                done();
            });

            it('Selection - phase', (done: Function) => {
                let phase = diagram.nameTable["swimlanephase1_header"];
                mouseEvents.mouseDownEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header' &&
                    diagram.selectedItems.wrapper.bounds.x == 30 &&
                    diagram.selectedItems.wrapper.bounds.y == 115 &&
                    diagram.selectedItems.wrapper.bounds.width == 640 &&
                    diagram.selectedItems.wrapper.bounds.height == 200).toBe(true);
                done();
            });
            it('Selection - Lane', (done: Function) => {
                let lane = diagram.nameTable["swimlanestackCanvas11"];
                mouseEvents.mouseDownEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas11' &&
                    diagram.selectedItems.wrapper.bounds.x == 50 &&
                    diagram.selectedItems.wrapper.bounds.y == 115 &&
                    diagram.selectedItems.wrapper.bounds.width == 180 &&
                    diagram.selectedItems.wrapper.bounds.height == 400).toBe(true);
                done();
            });
            it('Drag - swimlane', (done: Function) => {
                diagram.clearSelection();
                diagram.select([diagram.nodes[0]]);
                let swimlane = diagram.nodes[0];
                undoOffsetX = swimlane.wrapper.offsetX; undoOffsetY = swimlane.wrapper.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);
                mouseEvents.mouseMoveEvent(diagramCanvas, swimlane.wrapper.bounds.x + 30 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 15);
                mouseEvents.mouseMoveEvent(diagramCanvas, swimlane.wrapper.bounds.x + 40 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 25);
                mouseEvents.mouseMoveEvent(diagramCanvas, swimlane.wrapper.bounds.x + 50 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 35);
                mouseEvents.mouseUpEvent(diagramCanvas, swimlane.wrapper.bounds.x + 50 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 35);
                let node = diagram.nodes[0];
                expect(node.offsetX == 380 && node.offsetY == 315).toBe(true);
                redoOffsetX = swimlane.wrapper.offsetX; redoOffsetY = swimlane.wrapper.offsetY;
                done();
            });
            it('Drag - Phase', (done: Function) => {
                diagram.clearSelection();
                let phase = diagram.nameTable["swimlanephase1_header"];
                mouseEvents.mouseDownEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, phase.wrapper.bounds.x + 30 + diagram.element.offsetLeft, phase.wrapper.bounds.y + diagram.element.offsetTop + 15);
                mouseEvents.mouseMoveEvent(diagramCanvas, phase.wrapper.bounds.x + 40 + diagram.element.offsetLeft, phase.wrapper.bounds.y + diagram.element.offsetTop + 25);
                mouseEvents.mouseMoveEvent(diagramCanvas, phase.wrapper.bounds.x + 50 + diagram.element.offsetLeft, phase.wrapper.bounds.y + diagram.element.offsetTop + 35);
                mouseEvents.mouseUpEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header' &&
                    diagram.selectedItems.wrapper.bounds.x == 60 &&
                    diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 640 &&
                    diagram.selectedItems.wrapper.bounds.height == 200).toBe(true);
                done();
            });
            it('Drag - Lane', (done: Function) => {
                diagram.clearSelection();
                let lane = diagram.nameTable["swimlanestackCanvas11"];
                mouseEvents.mouseDownEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, lane.wrapper.bounds.x + 30 + diagram.element.offsetLeft, lane.wrapper.bounds.y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, lane.wrapper.bounds.x + 40 + diagram.element.offsetLeft, lane.wrapper.bounds.y + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, lane.wrapper.bounds.x + 50 + diagram.element.offsetLeft, lane.wrapper.bounds.y + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas11' &&
                    diagram.selectedItems.wrapper.bounds.x == 80 &&
                    diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 180 &&
                    diagram.selectedItems.wrapper.bounds.height == 400).toBe(true);
                done();
            });
            it('Resize East - Swimlane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                undoOffsetX = swimlane.wrapper.offsetX; undoOffsetY = swimlane.wrapper.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);
                mouseEvents.mouseUpEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);

                expect(diagram.selectedItems.nodes[0].id == 'swimlane' &&
                    diagram.selectedItems.wrapper.bounds.x == 60 && diagram.selectedItems.wrapper.bounds.y == 90 &&
                    diagram.selectedItems.wrapper.bounds.width == 640 && diagram.selectedItems.wrapper.bounds.height == 450).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + diagram.selectedItems.wrapper.bounds.width + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height / 2) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 20, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 40, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 70, y);
                mouseEvents.mouseUpEvent(diagramCanvas, x + 70, y);
                redoOffsetX = swimlane.wrapper.offsetX; redoOffsetY = swimlane.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas40' &&
                    diagram.selectedItems.wrapper.bounds.x == 630 &&
                    diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 140 &&
                    diagram.selectedItems.wrapper.bounds.height == 400).toBe(true);
                done();
            });
            it('Undo action after resize the swimlane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                diagram.undo();
                expect(swimlane.wrapper.offsetX == undoOffsetX && swimlane.wrapper.offsetY == undoOffsetY).toBe(true);
                diagram.redo();
                expect(swimlane.wrapper.offsetX == redoOffsetX && swimlane.wrapper.offsetY == redoOffsetY).toBe(true);
                done();
            });
            it('Resize South - Swimlane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                undoOffsetX = swimlane.wrapper.offsetX; undoOffsetY = swimlane.wrapper.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);
                mouseEvents.mouseUpEvent(diagramCanvas, swimlane.wrapper.bounds.x + 20 + diagram.element.offsetLeft, swimlane.wrapper.bounds.y + diagram.element.offsetTop + 5);

                expect(diagram.selectedItems.nodes[0].id == 'swimlane' &&
                    diagram.selectedItems.wrapper.bounds.x == 60 &&
                    diagram.selectedItems.wrapper.bounds.y == 90 &&
                    diagram.selectedItems.wrapper.bounds.width == 710 &&
                    diagram.selectedItems.wrapper.bounds.height == 450).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + (diagram.selectedItems.wrapper.bounds.width / 2) + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 70);
                mouseEvents.mouseUpEvent(diagramCanvas, x, y + 70);
                redoOffsetX = swimlane.wrapper.offsetX; redoOffsetY = swimlane.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase2_header' &&
                    diagram.selectedItems.wrapper.bounds.x == 60 &&
                    diagram.selectedItems.wrapper.bounds.y == 340 &&
                    diagram.selectedItems.wrapper.bounds.width == 710 &&
                    diagram.selectedItems.wrapper.bounds.height == 280).toBe(true);
                done();
            });
            it('Resize East - Lane', (done: Function) => {
                let lane = diagram.nameTable["swimlanestackCanvas11"];
                undoOffsetX = lane.wrapper.offsetX; undoOffsetY = lane.wrapper.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas11' && diagram.selectedItems.wrapper.bounds.x == 80 &&
                    diagram.selectedItems.wrapper.bounds.y == 140 && diagram.selectedItems.wrapper.bounds.width == 180 &&
                    diagram.selectedItems.wrapper.bounds.height == 480).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + diagram.selectedItems.wrapper.bounds.width + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height / 2) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 20, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 40, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 70, y);
                mouseEvents.mouseUpEvent(diagramCanvas, x + 70, y);
                redoOffsetX = lane.wrapper.offsetX; redoOffsetY = lane.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas11' && diagram.selectedItems.wrapper.bounds.x == 80 && diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 260 && diagram.selectedItems.wrapper.bounds.height == 480).toBe(true);
                done();
            });
            it('Undo, redo action after lane resizing east direction', (done: Function) => {
                let swimlane = diagram.nameTable["swimlanestackCanvas11"];
                diagram.undo();
                expect(swimlane.wrapper.offsetX == undoOffsetX && swimlane.wrapper.offsetY == undoOffsetY).toBe(true);
                diagram.redo();
                expect(swimlane.wrapper.offsetX == redoOffsetX && swimlane.wrapper.offsetY == redoOffsetY).toBe(true);
                done();
            });
            it('Resize South - lane', (done: Function) => {
                let lane = diagram.nameTable["swimlanestackCanvas11"];
                mouseEvents.mouseDownEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);
                undoOffsetX = lane.wrapper.offsetX; undoOffsetY = lane.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas11' && diagram.selectedItems.wrapper.bounds.x == 80 && diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 260 && diagram.selectedItems.wrapper.bounds.height == 480).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + (diagram.selectedItems.wrapper.bounds.width / 2) + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 70);
                mouseEvents.mouseUpEvent(diagramCanvas, x, y + 70);
                redoOffsetX = lane.wrapper.offsetX; redoOffsetY = lane.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase2_header' &&
                    diagram.selectedItems.wrapper.bounds.x == 60 && diagram.selectedItems.wrapper.bounds.y == 340 &&
                    diagram.selectedItems.wrapper.bounds.width == 790 && diagram.selectedItems.wrapper.bounds.height == 360).toBe(true);
                done();
            });
            it('Undo, redo action after lane resizing south direction', (done: Function) => {
                let swimlane = diagram.nameTable["swimlanestackCanvas11"];
                diagram.undo();
                expect(swimlane.wrapper.offsetX == undoOffsetX && swimlane.wrapper.offsetY == undoOffsetY).toBe(true);
                diagram.redo();
                expect(swimlane.wrapper.offsetX == redoOffsetX && swimlane.wrapper.offsetY == redoOffsetY).toBe(true);
                done();
            });
            it('Resize East - Phase', (done: Function) => {
                let phase = diagram.nameTable["swimlanephase1_header"];
                mouseEvents.mouseDownEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                undoOffsetX = phase.wrapper.offsetX; undoOffsetY = phase.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header' && diagram.selectedItems.wrapper.bounds.x == 60 && diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 790 && diagram.selectedItems.wrapper.bounds.height == 200).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + diagram.selectedItems.wrapper.bounds.width + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height / 2) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 20, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 40, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 70, y);
                mouseEvents.mouseUpEvent(diagramCanvas, x + 70, y);
                redoOffsetX = phase.wrapper.offsetX; redoOffsetY = phase.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas40' && diagram.selectedItems.wrapper.bounds.x == 710 && diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 210 && diagram.selectedItems.wrapper.bounds.height == 560).toBe(true);
                done();
            });
            it('Undo, redo action after phase resizing east direction', (done: Function) => {
                let swimlane = diagram.nameTable["swimlanephase1_header"];
                diagram.undo();
                expect(swimlane.wrapper.offsetX == undoOffsetX && swimlane.wrapper.offsetY == undoOffsetY).toBe(true);
                diagram.redo();
                expect(swimlane.wrapper.offsetX == redoOffsetX && swimlane.wrapper.offsetY == redoOffsetY).toBe(true);
                done();
            });
            it('Resize South - Phase', (done: Function) => {
                let phase = diagram.nameTable["swimlanephase1_header"];
                undoOffsetX = phase.wrapper.offsetX; undoOffsetY = phase.wrapper.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header' && diagram.selectedItems.wrapper.bounds.x == 60 && diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 860 && diagram.selectedItems.wrapper.bounds.height == 200).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + (diagram.selectedItems.wrapper.bounds.width / 2) + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 70);
                mouseEvents.mouseUpEvent(diagramCanvas, x, y + 70);
                redoOffsetX = phase.wrapper.offsetX; redoOffsetY = phase.wrapper.offsetY;

                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header' && diagram.selectedItems.wrapper.bounds.x == 60 && diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 860 && diagram.selectedItems.wrapper.bounds.height == 280).toBe(true);
                done();
            });
            it('Undo, redo action after phase resizing south direction', (done: Function) => {
                let swimlane = diagram.nameTable["swimlanephase1_header"];
                diagram.undo();
                expect(swimlane.wrapper.offsetX == undoOffsetX && swimlane.wrapper.offsetY == undoOffsetY).toBe(true);
                diagram.redo();
                expect(swimlane.wrapper.offsetX == redoOffsetX && swimlane.wrapper.offsetY == redoOffsetY).toBe(true);
                done();
            });
            it('Drag and drop node from one lane to another lane', (done: Function) => {
                let node = diagram.nameTable["Order"];
                let targetNode = diagram.nameTable["swimlanestackCanvas20"];
                let sourcePointX = node.wrapper.offsetX + diagram.element.offsetLeft;
                let sourcePointY = node.wrapper.offsetY + diagram.element.offsetTop;
                let targetPointX = targetNode.wrapper.offsetX + diagram.element.offsetLeft;
                let targetPointY = targetNode.wrapper.offsetY + diagram.element.offsetTop;
                expect(diagram.nameTable["Order"].parentId == 'swimlanestackCanvas10').toBe(true);
                mouseEvents.mouseDownEvent(diagramCanvas, sourcePointX, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY - 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY);
                mouseEvents.mouseUpEvent(diagramCanvas, targetPointX, targetPointY);
                expect(diagram.nameTable["Order"].parentId == 'swimlanestackCanvas20').toBe(true);
                done();
            });
            it('Undo, redo action after change the node from one lane to another', (done: Function) => {
                let node = diagram.nameTable["Order"];
                diagram.undo();
                expect((node as Node).parentId == 'swimlanestackCanvas10').toBe(true);
                diagram.redo();
                expect((node as Node).parentId == 'swimlanestackCanvas20').toBe(true);
                done();
            });
            it('Drag - node(Check update lane bounds South direction)', (done: Function) => {

                let node = diagram.nameTable["Order"];
                let targetNode = diagram.nameTable["swimlanestackCanvas20"];
                let sourcePointX = node.wrapper.offsetX + diagram.element.offsetLeft;
                let sourcePointY = node.wrapper.offsetY + diagram.element.offsetTop;
                let targetPointX = targetNode.wrapper.offsetX + diagram.element.offsetLeft;
                let targetPointY = targetNode.wrapper.offsetY + (targetNode.wrapper.height / 2) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, sourcePointX, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, targetPointY - 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, targetPointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, targetPointY - 15);
                mouseEvents.mouseUpEvent(diagramCanvas, sourcePointX, targetPointY - 15);

                expect(node.wrapper.offsetX == 510 && node.wrapper.offsetY == 400).toBe(true);
                let lane = Number(document.getElementById('swimlanestackCanvas20').getAttribute('height'));

                done();
            });

            it('Lane copy, paste with node', (done: Function) => {
                expect(diagram.nodes.length == 19).toBe(true);
                let targetNode = diagram.nameTable["swimlanestackCanvas20"];
                diagram.select([targetNode]);
                diagram.copy();
                diagram.paste();
                diagram.paste();
                expect(diagram.nodes.length > 0).toBe(true);
                done();
            });

            it('Undo redo action after paste the lane', (done: Function) => {
                diagram.undo();
                diagram.undo();
                expect(diagram.nodes.length == 19).toBe(true);
                diagram.redo();
                diagram.redo();
                diagram.undo();
                diagram.undo();
                expect(diagram.nodes.length == 19).toBe(true);
                done();
            });

            it('Swimlane copy, paste with node', (done: Function) => {
                expect(diagram.nodes.length == 19).toBe(true);
                let targetNode = diagram.nameTable["swimlane"];
                diagram.select([targetNode]);
                diagram.copy();
                diagram.paste();
                diagram.paste();
                expect(diagram.nodes.length == 57).toBe(true);
                expect(diagram.nodes.length > 0).toBe(true);
                done();
            });

            it('Undo redo action after paste the lane', (done: Function) => {
                diagram.undo();
                diagram.undo();
                expect(diagram.nodes.length == 19).toBe(true);
                diagram.redo();
                diagram.redo();
                expect(diagram.nodes.length == 57).toBe(true);
                diagram.undo();
                diagram.undo();
                expect(diagram.nodes.length == 19).toBe(true);
                done();
            });


            it('Drag - node(Check update lane bounds East direction)', (done: Function) => {

                let node = diagram.nameTable["Order"];
                let targetNode = diagram.nameTable["swimlanestackCanvas20"];
                let sourcePointX = node.wrapper.offsetX + diagram.element.offsetLeft;
                let sourcePointY = node.wrapper.offsetY + diagram.element.offsetTop;
                let targetPointX = targetNode.wrapper.offsetX + (targetNode.wrapper.width / 2) + diagram.element.offsetLeft;
                let targetPointY = targetNode.wrapper.offsetY + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, sourcePointX, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX + 20, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX + 40, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX - 20, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, sourcePointY);
                mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX - 5, sourcePointY);
                mouseEvents.mouseUpEvent(diagramCanvas, targetPointX - 5, sourcePointY);

                expect(node.wrapper.offsetX == 655 && node.wrapper.offsetY == 400).toBe(true);
                let lane = Number(document.getElementById('swimlanestackCanvas20').getAttribute('width'));
                expect(lane === 385).toBe(true);
                done();
            });
            it('Drag and drop the node from palette to lane', (done: Function) => {
                palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                    let clonedElement: HTMLElement; let diagramElement: any;
                    let position: PointModel = palette['getMousePosition'](e.sender);
                    let symbols: IElement = palette.symbolTable['Terminator'];
                    palette['selectedSymbols'] = symbols;
                    if (symbols !== undefined) {
                        clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                        clonedElement.setAttribute('paletteId', palette.element.id);
                    }
                    return clonedElement;
                };

                let events: MouseEvents = new MouseEvents();
                let ele = document.getElementById("Terminator_container");
                let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
                let startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
                let startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;
                events.mouseDownEvent(palette.element, 75, 100, false, false);
                events.mouseMoveEvent(palette.element, 100, 100, false, false);
                events.mouseMoveEvent(palette.element, 200, 200, false, false);
                expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
                events.mouseMoveEvent(diagram.element, 500, 300, false, false);
                events.mouseMoveEvent(diagram.element, 500, 305, false, false);
                events.mouseMoveEvent(diagram.element, 500, 310, false, false);
                events.mouseUpEvent(diagram.element, 500, 300, false, false);
                done();
            });

            it('Drag and drop the node from palette to diagram and then diagram to lane', (done: Function) => {
                palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                    let clonedElement: HTMLElement; let diagramElement: any;
                    let position: PointModel = palette['getMousePosition'](e.sender);
                    let symbols: IElement = palette.symbolTable['Terminator'];
                    palette['selectedSymbols'] = symbols;
                    if (symbols !== undefined) {
                        clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                        clonedElement.setAttribute('paletteId', palette.element.id);
                    }
                    return clonedElement;
                };
                let events: MouseEvents = new MouseEvents();
                let ele = document.getElementById("Terminator_container");

                let targetElement = diagram.nameTable["swimlanestackCanvas20"];
                let targetOffsetX = targetElement.wrapper.offsetX;
                let targetOffsetY = targetElement.wrapper.offsetY;

                let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
                let startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
                let startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;

                events.mouseDownEvent(palette.element, 75, 100, false, false);
                events.mouseMoveEvent(palette.element, 100, 100, false, false);
                events.mouseMoveEvent(palette.element, 200, 200, false, false);
                expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
                events.mouseMoveEvent(diagram.element, 50 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, 55 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, 60 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop, false, false);
                events.mouseUpEvent(diagram.element, 60 + diagram.element.offsetLeft, 50 + diagram.element.offsetTop, false, false);

                events.mouseDownEvent(diagram.element, 100 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, 100 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + 10 + diagram.element.offsetLeft, targetOffsetY + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + diagram.element.offsetTop, false, false);
                events.mouseUpEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + diagram.element.offsetTop, false, false);
                done();
            });

            it('annotation alignment while Resize South - lane ', (done: Function) => {

                diagram.nameTable["swimlanestackCanvas2_0_header"].annotations[0].content = 'a as asd asdf asdfg g the alws g';
                diagram.dataBind();
                let lane = diagram.nameTable["swimlanestackCanvas11"];
                mouseEvents.mouseDownEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);
                undoOffsetX = lane.wrapper.offsetX; undoOffsetY = lane.wrapper.offsetY;
                let x = diagram.selectedItems.wrapper.bounds.x + (diagram.selectedItems.wrapper.bounds.width / 2) + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 70);
                mouseEvents.mouseUpEvent(diagramCanvas, x, y + 70);
                redoOffsetX = lane.wrapper.offsetX; redoOffsetY = lane.wrapper.offsetY;
                expect(diagram.nameTable["swimlanestackCanvas2_0_header"].wrapper.children[1].childNodes.length === 1).toBe(true);
                done();
            });
            it('delete - phase', (done: Function) => {
                let phase = diagram.nameTable["swimlanephase2_header"];
                let swimlane = diagram.nameTable[(phase as Node).parentId];
                expect((swimlane.shape as SwimLaneModel).phases.length == 2).toBe(true);
                diagram.remove(phase);
                expect((swimlane.shape as SwimLaneModel).phases.length == 1).toBe(true);
                done();
            });
            it('Undo, redo action after deleting the phase', (done: Function) => {
                let swimlane = diagram.nameTable["swimlane"];
                expect((swimlane.shape as SwimLaneModel).phases.length == 1).toBe(true);
                diagram.undo();
                expect((swimlane.shape as SwimLaneModel).phases.length == 2).toBe(true);
                diagram.redo();
                expect((swimlane.shape as SwimLaneModel).phases.length == 1).toBe(true);
                done();
            });
            it('delete - swimlane', (done: Function) => {
                let swimlane = diagram.nameTable["swimlane"];
                expect(diagram.nodes.length > 0).toBe(true);
                diagram.remove(swimlane);
                expect(diagram.nodes.length == 0).toBe(true);
                done();
            });
            it('clear - collection', (done: Function) => {
                diagram.undo();
                expect(diagram.nodes.length > 0).toBe(true);
                diagram.clear();
                var x=100, y=200;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 70);
                mouseEvents.mouseUpEvent(diagramCanvas, x, y + 70);
                expect(diagram['eventHandler']['hoverElement'] === null).toBe(true);
                done();
            });


        });
    });
    describe('Swimlane interaction - 2', () => {
        describe('Horizontal Orientation', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram10', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);
                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                                orientation: 'Horizontal',
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, height: 100,
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                    id: 'phase1', offset: 170,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 450,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
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
                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }

                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    connectors: connectors,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram10');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Cannot change the lane - lane interchange', (done: Function) => {
                let node = diagram.nameTable["swimlanestackCanvas11"];
                let target = diagram.nameTable["swimlanestackCanvas20"];
                let rowIndex = diagram.nameTable["swimlanestackCanvas10"].rowIndex;
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop + 30);
                mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 20);
                mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 20);
                expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == rowIndex).toBe(true);
                done();
            });
        });
        describe('Vertical Orientation', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram30', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);
                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            orientation: 'Vertical',
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    width: 140,
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
                                            margin: { left: 60, top: 60 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                                {
                                    id: 'stackCanvas2',
                                    header: {
                                        annotation: { content: 'ONLINE' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 120,
                                    children: [
                                        {
                                            id: 'selectItemaddcart',
                                            annotations: [{ content: 'Select item\nAdd cart' }],
                                            margin: { left: 200, top: 60 },
                                            height: 40, width: 100
                                        },
                                        {
                                            id: 'paymentondebitcreditcard',
                                            annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                                            margin: { left: 200, top: 250 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 200,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 400,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 350, offsetY: 290,
                        height: 360, width: 400
                    },
                ];
                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }

                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram30');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Code coverage - Lane interchange', (done: Function) => {
                let node = diagram.nameTable["swimlanestackCanvas11"];
                let target = diagram.nameTable["swimlanestackCanvas21"];
                let colIndex = diagram.nameTable["swimlanestackCanvas11"].columnIndex;
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 40, node.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                expect(diagram.nameTable["swimlanestackCanvas11"].columnIndex == colIndex).toBe(true);
                done();
            });
            it('Remove first lane with children', (done: Function) => {
                let node = diagram.nameTable["swimlanestackCanvas11"];
                let swimlane = diagram.nameTable["swimlane"];
                expect(swimlane.shape.lanes.length == 2).toBe(true);
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                diagram.remove();
                swimlane = diagram.nameTable["swimlane"];
                expect(swimlane.shape.lanes.length == 1).toBe(true);
                done();
            });
            it('Undo, redo action After Remove first lane with children', (done: Function) => {
                let swimlane = diagram.nameTable["swimlane"];
                expect(swimlane.shape.lanes.length == 1).toBe(true);
                diagram.undo();
                expect(swimlane.shape.lanes.length == 2).toBe(true);
                diagram.redo();
                expect(swimlane.shape.lanes.length == 1).toBe(true);
                done();
            });
        });
    });
    describe('Swimlane rendering, interaction using symbol palatte', () => {
        describe('Horizontal Orientation', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'symbolpalette2', styles: 'width:25%;float:left;' }));
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram2', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);
                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }

                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram2');

                palette = new SymbolPalette({
                    width: '25%', height: '500px',
                    palettes: [
                        {
                            id: 'flow', expanded: true, symbols: [
                                { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' }, style: { strokeWidth: 1 } },
                                { id: 'Process', shape: { type: 'Flow', shape: 'Process' }, style: { strokeWidth: 1 } },
                                { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' }, style: { strokeWidth: 1 } },
                                { id: 'Document', shape: { type: 'Flow', shape: 'Document' }, style: { strokeWidth: 1 } }], title: 'Flow Shapes'
                        },
                        {
                            id: 'swimlaneShapes', expanded: true,
                            title: 'Swimlane Shapes',
                            symbols: [
                                {
                                    id: 'stackCanvas1',addInfo:'add',
                                    shape: {
                                        type: 'SwimLane', lanes: [
                                            {
                                                id: 'lane1',
                                                style: { fill: '#f5f5f5' }, height: 60, width: 150,
                                                header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                            }
                                        ],
                                        orientation: 'Horizontal', isLane: true
                                    },
                                    height: 60,
                                    width: 140,
                                    style: { fill: '#f5f5f5' },
                                    offsetX: 70,
                                    offsetY: 30,
                                }, {
                                    id: 'stackCanvas2',
                                    shape: {
                                        type: 'SwimLane',
                                        lanes: [
                                            {
                                                id: 'lane1',
                                                style: { fill: '#f5f5f5' }, height: 150, width: 60,
                                                header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                            }
                                        ],
                                        orientation: 'Vertical', isLane: true
                                    },
                                    height: 140,
                                    width: 60,
                                    style: { fill: '#f5f5f5' },
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
                    ], symbolHeight: 50, symbolWidth: 50,
                    symbolPreview: { width: 100, height: 100 },
                    expandMode: 'Multiple',
                });
                palette.appendTo('#symbolpalette2');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Add Swimlane using symbol palette', (done: Function) => {
                setTimeout(() => {
                    paletteInitalize('stackCanvas1');
                    let events: MouseEvents = new MouseEvents();
                    let ele = document.getElementById("stackCanvas1_container");

                    let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
                    let startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
                    let startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;

                    events.mouseDownEvent(palette.element, startPointX, startPointY, false, false);
                    events.mouseMoveEvent(palette.element, startPointX + 50, startPointY, false, false);
                    events.mouseMoveEvent(palette.element, startPointX + 100, startPointY, false, false);
                    expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
                    events.mouseMoveEvent(diagram.element, 100 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop, false, false);
                    events.mouseMoveEvent(diagram.element, 105 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop, false, false);
                    events.mouseMoveEvent(diagram.element, 120 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop, false, false);
                    events.mouseUpEvent(diagram.element, 120 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop, false, false);
                    expect(diagram.nodes.length > 0).toBe(true);
                    expect(diagram.nodes[0].addInfo === "add").toBe(true);
                    done();
                }, 10);
            });
            it('undo, redo action after add swimlane', (done: Function) => {
                expect(diagram.nodes.length > 0).toBe(true);
                diagram.undo();
                expect(diagram.nodes.length == 0).toBe(true);
                diagram.redo();
                expect(diagram.nodes.length > 0).toBe(true);
                done();
            });
            it('Add lane to swimalne using symbol palette', (done: Function) => {
                paletteInitalize('stackCanvas1');
                let events: MouseEvents = new MouseEvents();
                let ele = document.getElementById("stackCanvas1_container");
                let diagramDiv = document.getElementById("SwimlaneDiagram2_diagramLayer");
                let laneId: string = diagramDiv.children[0].children[1].children[3].children[1].children[0].id;

                let targetElement = diagram.nameTable[laneId];
                let targetOffsetX = targetElement.wrapper.offsetX;
                let targetOffsetY = targetElement.wrapper.offsetY;

                let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
                let startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
                let startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;
                expect((diagram.nodes[0].shape as SwimLaneModel).lanes.length == 1).toBe(true);
                events.mouseDownEvent(palette.element, startPointX, startPointY, false, false);
                events.mouseMoveEvent(palette.element, startPointX + 50, startPointY, false, false);
                events.mouseMoveEvent(palette.element, startPointX + 100, startPointY, false, false);
                expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft + 10, targetOffsetY + 10 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + 20 + diagram.element.offsetTop, false, false);
                events.mouseUpEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + 10 + diagram.element.offsetTop, false, false);
                expect(diagram.nodes.length > 0).toBe(true);
                expect((diagram.nodes[0].shape as SwimLaneModel).lanes.length == 2).toBe(true);
                done();
            });
            it('undo, redo action after add lane in swimlane', (done: Function) => {
                expect((diagram.nodes[0].shape as SwimLaneModel).lanes.length == 2).toBe(true);
                diagram.undo();
                expect((diagram.nodes[0].shape as SwimLaneModel).lanes.length == 1).toBe(true);
                diagram.redo();
                expect((diagram.nodes[0].shape as SwimLaneModel).lanes.length == 2).toBe(true);
                done();
            });
            it('Add phase in swimalne using symbol palette', (done: Function) => {
                paletteInitalize('verticalPhase');
                let events: MouseEvents = new MouseEvents();
                let ele = document.getElementById("verticalPhase_container");
                let swimlane = diagram.nodes[0];
                let laneId: string = (swimlane.shape as SwimLaneModel).lanes[0].id;
                let targetElement = diagram.nameTable[swimlane.id + laneId + '0'];
                let targetOffsetX = targetElement.wrapper.offsetX;
                let targetOffsetY = targetElement.wrapper.offsetY;
                let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
                let startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
                let startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == 1).toBe(true);
                events.mouseDownEvent(palette.element, startPointX, startPointY, false, false);
                events.mouseMoveEvent(palette.element, startPointX + 50, startPointY, false, false);
                events.mouseMoveEvent(palette.element, startPointX + 100, startPointY, false, false);
                expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft + 10, targetOffsetY + 10 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + 20 + diagram.element.offsetTop, false, false);
                events.mouseUpEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + 10 + diagram.element.offsetTop, false, false);
                expect(diagram.nodes.length > 0).toBe(true);
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == 2).toBe(true);
                done();
            });
            it('undo, redo action after add phase in swimlane', (done: Function) => {
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == 2).toBe(true);
                diagram.undo();
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == 1).toBe(true);
                diagram.redo();
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == 2).toBe(true);
                done();
            });
            it('Copy, paste the swimlane', (done: Function) => {
                debugger
                expect(diagram.nodes.length == 10).toBe(true);
                let swimlane = diagram.nodes[0];
                diagram.select([swimlane]);
                diagram.copy();
                diagram.paste();
                diagram.paste();
                expect(diagram.nodes.length == 30).toBe(true);
                done();
            });

            it('Undo, redo after Copy, paste the swimlane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 10).toBe(true);
                diagram.redo(); diagram.redo();
                expect(diagram.nodes.length == 30).toBe(true);
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 10).toBe(true);
                done();
            });

            it('Copy, paste the lane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                let laneId: string = (swimlane.shape as SwimLaneModel).lanes[0].id;
                let targetElement = diagram.nameTable[swimlane.id + laneId + '0'];
                diagram.select([targetElement]);
                expect(diagram.nodes.length == 10).toBe(true);
                diagram.copy();
                diagram.paste();
                diagram.paste();
                expect(diagram.nodes.length == 24).toBe(true);
                done();
            });
            it('Undo, redo after Copy, paste the lane', (done: Function) => {
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 10).toBe(true);
                diagram.redo(); diagram.redo();
                expect(diagram.nodes.length == 24).toBe(true);
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 10).toBe(true);
                done();
            });

            it('Cut, paste the lane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                let laneId: string = (swimlane.shape as SwimLaneModel).lanes[0].id;
                let targetElement = diagram.nameTable[swimlane.id + laneId + '0'];
                diagram.select([targetElement]);
                diagram.cut();
                diagram.paste();
                diagram.paste();
                expect(diagram.nodes.length == 21).toBe(true);
                done();
            });

            it('Undo, redo after cut, paste the lane', (done: Function) => {
                expect(diagram.nodes.length == 21).toBe(true);
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 7).toBe(true);
                diagram.redo(); diagram.redo();
                expect(diagram.nodes.length == 21).toBe(true);
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 7).toBe(true);
                done();
            });

            it('Remove swimlane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                diagram.remove(swimlane);
                expect(diagram.nodes.length == 0).toBe(true);
                done();
            });
            it('undo, redo action after remove swimlane', (done: Function) => {
                expect(diagram.nodes.length == 0).toBe(true);
                diagram.undo();
                expect(diagram.nodes.length > 0).toBe(true);
                diagram.redo();
                expect(diagram.nodes.length == 0).toBe(true);
                done();
            });
            it('Save and load', (done: Function) => {
                let data = diagram.saveDiagram();
                diagram.loadDiagram(data);
                done();
            });

        });
        describe('Vertical Orientation', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'symbolpalette4', styles: 'width:25%;float:left;' }));
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram4', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);
                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }

                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram4');

                palette = new SymbolPalette({
                    width: '25%', height: '500px',
                    palettes: [
                        {
                            id: 'flow', expanded: true, symbols: [
                                { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' }, style: { strokeWidth: 1 } },
                                { id: 'Process', shape: { type: 'Flow', shape: 'Process' }, style: { strokeWidth: 1 } },
                                { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' }, style: { strokeWidth: 1 } },
                                { id: 'Document', shape: { type: 'Flow', shape: 'Document' }, style: { strokeWidth: 1 } }], title: 'Flow Shapes'
                        },
                        {
                            id: 'swimlaneShapes', expanded: true,
                            title: 'Swimlane Shapes',
                            symbols: [
                                {
                                    id: 'stackCanvas1',
                                    shape: {
                                        type: 'SwimLane', lanes: [
                                            {
                                                id: 'lane1',
                                                style: { fill: '#f5f5f5' }, height: 60, width: 150,
                                                header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                            }
                                        ],
                                        orientation: 'Horizontal', isLane: true
                                    },
                                    height: 60,
                                    width: 140,
                                    style: { fill: '#f5f5f5' },
                                    offsetX: 70,
                                    offsetY: 30,
                                }, {
                                    id: 'stackCanvas2',
                                    shape: {
                                        type: 'SwimLane',
                                        lanes: [
                                            {
                                                id: 'lane1',
                                                style: { fill: '#f5f5f5' }, height: 150, width: 60,
                                                header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                            }
                                        ],
                                        orientation: 'Vertical', isLane: true
                                    },
                                    height: 140,
                                    width: 60,
                                    style: { fill: '#f5f5f5' },
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
                    ], symbolHeight: 50, symbolWidth: 50,
                    symbolPreview: { width: 100, height: 100 },
                    expandMode: 'Multiple',
                });
                palette.appendTo('#symbolpalette4');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Add Swimlane using symbol palette', (done: Function) => {

                setTimeout(() => {
                    paletteInitalize('stackCanvas2');
                    let events: MouseEvents = new MouseEvents();
                    let ele = document.getElementById("stackCanvas2_container");

                    let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
                    let startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
                    let startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;

                    events.mouseDownEvent(palette.element, startPointX, startPointY, false, false);
                    events.mouseMoveEvent(palette.element, startPointX + 50, startPointY, false, false);
                    events.mouseMoveEvent(palette.element, startPointX + 100, startPointY, false, false);
                    expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
                    events.mouseMoveEvent(diagram.element, 100 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop, false, false);
                    events.mouseMoveEvent(diagram.element, 105 + diagram.element.offsetLeft, 100 + diagram.element.offsetTop, false, false);
                    events.mouseMoveEvent(diagram.element, 120 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop, false, false);
                    events.mouseUpEvent(diagram.element, 120 + diagram.element.offsetLeft, 150 + diagram.element.offsetTop, false, false);
                    expect(diagram.nodes.length > 0).toBe(true);
                    done();
                }, 10);
            });
            it('undo, redo action after add swimlane', (done: Function) => {
                expect(diagram.nodes.length > 0).toBe(true);
                diagram.undo();
                expect(diagram.nodes.length == 0).toBe(true);
                diagram.redo();
                expect(diagram.nodes.length > 0).toBe(true);
                done();
            });
            it('Add lane to swimalne using symbol palette', (done: Function) => {
                paletteInitalize('stackCanvas2');
                let events: MouseEvents = new MouseEvents();
                let ele = document.getElementById("stackCanvas2_container");
                let diagramDiv = document.getElementById("SwimlaneDiagram2_diagramLayer");
                let swimlane = diagram.nodes[0];
                let laneId: string = (swimlane.shape as SwimLaneModel).lanes[0].id;
                let targetElement = diagram.nameTable[swimlane.id + laneId + '0'];
                let targetOffsetX = targetElement.wrapper.offsetX;
                let targetOffsetY = targetElement.wrapper.offsetY;

                let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
                let startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
                let startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;
                expect((diagram.nodes[0].shape as SwimLaneModel).lanes.length == 1).toBe(true);
                events.mouseDownEvent(palette.element, startPointX, startPointY, false, false);
                events.mouseMoveEvent(palette.element, startPointX + 50, startPointY, false, false);
                events.mouseMoveEvent(palette.element, startPointX + 100, startPointY, false, false);
                expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft + 10, targetOffsetY + 10 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + 20 + diagram.element.offsetTop, false, false);
                events.mouseUpEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + 10 + diagram.element.offsetTop, false, false);
                expect(diagram.nodes.length > 0).toBe(true);
                expect((diagram.nodes[0].shape as SwimLaneModel).lanes.length == 2).toBe(true);
                done();
            });
            it('undo, redo action after add lane in swimlane', (done: Function) => {
                expect((diagram.nodes[0].shape as SwimLaneModel).lanes.length == 2).toBe(true);
                diagram.undo();
                expect((diagram.nodes[0].shape as SwimLaneModel).lanes.length == 1).toBe(true);
                diagram.redo();
                expect((diagram.nodes[0].shape as SwimLaneModel).lanes.length == 2).toBe(true);
                done();
            });
            it('Add phase in swimalne using symbol palette', (done: Function) => {
                paletteInitalize('horizontalPhase');
                let events: MouseEvents = new MouseEvents();
                let ele = document.getElementById("horizontalPhase_container");
                let swimlane = diagram.nodes[0];
                let laneId: string = (swimlane.shape as SwimLaneModel).lanes[0].id;
                let targetElement = diagram.nameTable[swimlane.id + laneId + '0'];
                let targetOffsetX = targetElement.wrapper.offsetX;
                let targetOffsetY = targetElement.wrapper.offsetY;
                let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
                let startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
                let startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == 1).toBe(true);
                events.mouseDownEvent(palette.element, startPointX, startPointY, false, false);
                events.mouseMoveEvent(palette.element, startPointX + 50, startPointY, false, false);
                events.mouseMoveEvent(palette.element, startPointX + 100, startPointY, false, false);
                expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft + 10, targetOffsetY + 10 + diagram.element.offsetTop, false, false);
                events.mouseMoveEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + 20 + diagram.element.offsetTop, false, false);
                events.mouseUpEvent(diagram.element, targetOffsetX + diagram.element.offsetLeft, targetOffsetY + 10 + diagram.element.offsetTop, false, false);
                expect(diagram.nodes.length > 0).toBe(true);
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == 2).toBe(true);
                done();
            });
            it('undo, redo action after add phase in swimlane', (done: Function) => {
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == 2).toBe(true);
                diagram.undo();
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == 1).toBe(true);
                diagram.redo();
                expect((diagram.nodes[0].shape as SwimLaneModel).phases.length == 2).toBe(true);
                done();
            });
            it('Copy, paste the swimlane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                diagram.select([swimlane]);
                diagram.copy();
                diagram.paste();
                diagram.paste();
                expect(diagram.nodes.length == 30).toBe(true);
                done();
            });

            it('Undo, redo after Copy, paste the swimlane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                expect(diagram.nodes.length == 30).toBe(true);
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 10).toBe(true);
                diagram.redo(); diagram.redo();
                expect(diagram.nodes.length == 30).toBe(true);
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 10).toBe(true);
                done();
            });

            it('Copy, paste the lane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                let laneId: string = (swimlane.shape as SwimLaneModel).lanes[0].id;
                let targetElement = diagram.nameTable[swimlane.id + laneId + '0'];
                diagram.select([targetElement]);
                diagram.copy();
                diagram.paste();
                diagram.paste();
                expect(diagram.nodes.length == 24).toBe(true);
                done();
            });
            it('Undo, redo after Copy, paste the lane', (done: Function) => {
                expect(diagram.nodes.length == 24).toBe(true);
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 10).toBe(true);
                diagram.redo(); diagram.redo();
                expect(diagram.nodes.length == 24).toBe(true);
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 10).toBe(true);
                done();
            });

            it('Cut, paste the lane', (done: Function) => {
                let swimlane = diagram.nodes[0];
                let laneId: string = (swimlane.shape as SwimLaneModel).lanes[0].id;
                let targetElement = diagram.nameTable[swimlane.id + laneId + '0'];
                diagram.select([targetElement]);
                diagram.cut();
                diagram.paste();
                diagram.paste();
                expect(diagram.nodes.length == 21).toBe(true);
                done();
            });

            it('Undo, redo after cut, paste the lane', (done: Function) => {
                expect(diagram.nodes.length == 21).toBe(true);
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 7).toBe(true);
                diagram.redo(); diagram.redo();
                expect(diagram.nodes.length == 21).toBe(true);
                diagram.undo(); diagram.undo();
                expect(diagram.nodes.length == 7).toBe(true);
                done();
            });

        });
    });
    describe('Swimlane - Lane interchange', () => {
        describe('Horizontal swimlane', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram5', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);

                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                                orientation: 'Horizontal',
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, height: 100,
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                    id: 'phase1', offset: 170,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 450,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 420, offsetY: 270,
                        height: 100,
                        width: 650
                    },
                ];
                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram5');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Change last lane to first lane - 1', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas40"];
                    let target = diagram.nameTable["swimlanestackCanvas10"];

                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);

                    done();
                }, 300);
            });
            it('Change last lane to first lane - 2', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas30"];
                    let target = diagram.nameTable["swimlanestackCanvas40"];

                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);

                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);
                    done();
                }, 300);
            });
            it('Change last lane to first lane - 3', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas20"];
                    let target = diagram.nameTable["swimlanestackCanvas30"];

                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);
                    done();
                }, 300);
            });
        });
        describe('Horizontal swimlane', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram50', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);

                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                                orientation: 'Horizontal',
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    height: 100,
                                },
                                {
                                    id: 'stackCanvas2',
                                    header: {
                                        annotation: { content: 'ONLINE' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, height: 100,
                                },
                                {
                                    id: 'stackCanvas3',
                                    header: {
                                        annotation: { content: 'SHOP' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    height: 100,
                                },
                                {
                                    id: 'stackCanvas4',
                                    header: {
                                        annotation: { content: 'DELIVERY' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    height: 100,
                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 170,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 450,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 420, offsetY: 270,
                        height: 100,
                        width: 650
                    },
                ];
                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram50');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Change first lane to last lane - 1', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas11"];
                    let target = diagram.nameTable["swimlanestackCanvas41"];

                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop + 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 10);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 15);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 15);

                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 5 &&
                        diagram.nameTable["swimlanestackCanvas20"].rowIndex == 2 &&
                        diagram.nameTable["swimlanestackCanvas30"].rowIndex == 3 &&
                        diagram.nameTable["swimlanestackCanvas40"].rowIndex == 4).toBe(true);
                    done();
                }, 300);
            });
            it('Change first lane to last lane - 2', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas20"];
                    let target = diagram.nameTable["swimlanestackCanvas10"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop + 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 10);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 15);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 15);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 3).toBe(true);

                    done();
                }, 300);
            });
            it('Change first lane to last lane - 3', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas30"];
                    let target = diagram.nameTable["swimlanestackCanvas20"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop + 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 10);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 15);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 15);

                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 2).toBe(true);
                    done();
                }, 300);
            });
            it('Change first lane to last lane - 4', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas40"];
                    let target = diagram.nameTable["swimlanestackCanvas30"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop + 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 10);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 15);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop + 15);

                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 5).toBe(true);
                    done();
                }, 300);
            });
            it('Check Undo, redo action - after interchange the lane', function (done) {
                diagram.undo();

                expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 2).toBe(true);
                diagram.undo();

                expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 3).toBe(true);
                diagram.redo();

                expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 2).toBe(true);
                diagram.redo();

                expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 5).toBe(true);
                done();
            });
        });
        describe('Vertical swimlane', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram5', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);

                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            orientation: 'Vertical',
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLI' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    width: 140,
                                },
                                {
                                    id: 'stackCanvas2',
                                    header: {
                                        annotation: { content: 'ONLINE' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 170,
                                },
                                {
                                    id: 'stackCanvas3',
                                    header: {
                                        annotation: { content: 'SHOP' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 120,

                                },
                                {
                                    id: 'stackCanvas4',
                                    header: {
                                        annotation: { content: 'DELIVERY' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 200,

                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 200,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 400,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 350, offsetY: 290,
                        height: 360,
                    },
                ];
                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram5');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Change last lane to first lane - 1', function (done) {
                setTimeout(function () {
                    let node = diagram.nameTable["swimlanestackCanvas40"];
                    let target = diagram.nameTable["swimlanestackCanvas10"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 1).toBe(true);

                    done();
                }, 300);
            });
            it('Change last lane to first lane - 2', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas30"];
                    let target = diagram.nameTable["swimlanestackCanvas40"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 2).toBe(true);

                    done();
                }, 300);
            });
            it('Change last lane to first lane - 3', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas20"];
                    let target = diagram.nameTable["swimlanestackCanvas30"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 10, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 10, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 &&
                        diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 &&
                        diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 &&
                        diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 &&
                        diagram.nameTable["swimlanestackCanvas10"].columnIndex == 4 &&
                        diagram.nameTable["swimlanestackCanvas20"].columnIndex == 1 &&
                        diagram.nameTable["swimlanestackCanvas30"].columnIndex == 2 &&
                        diagram.nameTable["swimlanestackCanvas40"].columnIndex == 3).toBe(true);

                    done();
                }, 300);
            });
            it('Change last lane to first lane - 4', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas11"];
                    let target = diagram.nameTable["swimlanestackCanvas21"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 5, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 5, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 &&
                        diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 &&
                        diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 &&
                        diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 &&
                        diagram.nameTable["swimlanestackCanvas10"].columnIndex == 1 &&
                        diagram.nameTable["swimlanestackCanvas20"].columnIndex == 2 &&
                        diagram.nameTable["swimlanestackCanvas30"].columnIndex == 3 &&
                        diagram.nameTable["swimlanestackCanvas40"].columnIndex == 4).toBe(true);

                    done();
                }, 300);
            });
            it('Change first lane to last lane - 1', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas11"];
                    let target = diagram.nameTable["swimlanestackCanvas41"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 5, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 5, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 3).toBe(true);

                    done();
                }, 300);
            });
            it('Change first lane to last lane - 2', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas20"];
                    let target = diagram.nameTable["swimlanestackCanvas10"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 2).toBe(true);

                    done();
                }, 300);
            });
            it('Change first lane to last lane - 3', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas30"];
                    let target = diagram.nameTable["swimlanestackCanvas20"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 1).toBe(true);

                    done();
                }, 300);
            });
            it('Change first lane to last lane - 4', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas40"];
                    let target = diagram.nameTable["swimlanestackCanvas30"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 4).toBe(true);

                    done();
                }, 300);
            });
            it('Check Undo, redo action - after interchange the lane', function (done) {
                diagram.undo();
                expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 1).toBe(true);
                diagram.undo();
                expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 2).toBe(true);
                diagram.redo();
                expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 1).toBe(true);
                diagram.redo();
                expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 1 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 4).toBe(true);
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
            });
        });
        describe('Vertical Orientation', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram50', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);

                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            orientation: 'Vertical',
                            type: 'SwimLane',
                            header: {
                                id: 'header',
                                annotation: { content: 'ONLI' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    width: 140,
                                },
                                {
                                    id: 'stackCanvas2',
                                    header: {
                                        annotation: { content: 'ONLINE' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 170,
                                },
                                {
                                    id: 'stackCanvas3',
                                    header: {
                                        annotation: { content: 'SHOP' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 120,

                                },
                                {
                                    id: 'stackCanvas4',
                                    header: {
                                        annotation: { content: 'DELIVERY' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 200,

                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 200,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 400,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 0,
                        },
                        offsetX: 350, offsetY: 290,
                        height: 360,
                    },
                ];
                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram50');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Change last lane to first lane - 1', function (done) {
                setTimeout(function () {
                    let node = diagram.nameTable["swimlanestackCanvas40"];
                    let target = diagram.nameTable["swimlanestackCanvas10"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);
                    let grid = diagram.nodes[0].wrapper.children[0] as GridPanel;
                    expect(grid.rows[0].cells[0].children[0].actualSize.width === 630).toBe(true);
                    done();
                }, 300);
            });
        });
    });
    describe('Padding', () => {
        describe('Horizontal swimlane', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram51', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);

                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                                orientation: 'Horizontal',
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                        },
                                        {
                                            id: 'selectItemaddcart',
                                            annotations: [{ content: 'Select item\nAdd cart' }],
                                            margin: { left: 170, top: 10 },
                                            height: 40, width: 100
                                        },
                                    ],
                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 170,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 450,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 420, offsetY: 270,
                        height: 100,
                        width: 650
                    },
                ];
                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram51');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Drag children and check the lane width cannot change based on padding', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["Order"];
                    let target = diagram.nameTable["swimlanestackCanvas10"];
                    let previousWidth = target.wrapper.actualSize.width;

                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 10, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 15, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 15, node.wrapper.offsetY + diagram.element.offsetTop);

                    let width = diagram.nameTable["swimlanestackCanvas10"].wrapper.actualSize.width;
                    expect(width == previousWidth).toBe(true);

                    done();
                }, 300);
            });
            it('Drag children and check the lane width change based on padding', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["Order"];
                    let target = diagram.nameTable["swimlanestackCanvas10"];
                    let previousWidth = target.wrapper.actualSize.width;

                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 10, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 20, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 25, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 25, node.wrapper.offsetY + diagram.element.offsetTop);

                    let width = diagram.nameTable["swimlanestackCanvas10"].wrapper.actualSize.width;
                    expect(width > previousWidth).toBe(true);

                    done();
                }, 300);
            });
            it('Drag and drop children and check the lane width change based on padding', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["Order"];
                    let target = diagram.nameTable["swimlanestackCanvas11"];
                    let bounds = target.wrapper.bounds.right - (node.wrapper.actualSize.width / 2);
                    let previousWidth = target.wrapper.actualSize.width;

                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 10, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, bounds + diagram.element.offsetLeft + 10, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, bounds + diagram.element.offsetLeft + 15, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, bounds + diagram.element.offsetLeft + 15, node.wrapper.offsetY + diagram.element.offsetTop);

                    let width = diagram.nameTable["swimlanestackCanvas11"].wrapper.actualSize.width;
                    expect(width > previousWidth).toBe(true);

                    done();
                }, 300);
            });
            it('Resize children and check the lane width change based on padding', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["Order"];
                    let target = diagram.nameTable["swimlanestackCanvas11"];
                    let bounds = target.wrapper.bounds.bottom;
                    let previousWidth = target.wrapper.actualSize.height;

                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, (node.wrapper.offsetY + node.wrapper.actualSize.height / 2) + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, (node.wrapper.offsetY + node.wrapper.actualSize.height / 2) + 20 + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 10, bounds + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 10, bounds + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 15, bounds + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 15, bounds + diagram.element.offsetTop);

                    let width = diagram.nameTable["swimlanestackCanvas11"].wrapper.actualSize.height;
                    expect(width > previousWidth).toBe(true);

                    done();
                }, 300);
            });
            it('Delete lane', function (done) {
                setTimeout(function () {
                    let node = diagram.nameTable["swimlanestackCanvas10"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    diagram.remove(node);
                    expect(diagram.nodes.length == 0).toBe(true);
                    done();
                }, 300);
            });
        });
        describe('Horizontal swimlane', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram52', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);

                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                                orientation: 'Horizontal',
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    height: 100,
                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 170,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 250,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase3', offset: 300,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 420, offsetY: 270,
                        height: 100,
                        width: 650
                    },
                ];
                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram52');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Remove last phase', function (done) {
                let swimlane = diagram.nameTable['swimlane'];
                let phase = diagram.nameTable["swimlanephase3_header"];
                diagram.select([phase]);
                expect(swimlane.shape.phases.length === 3).toBe(true);
                diagram.remove();
                expect(swimlane.shape.phases.length === 2).toBe(true);
                done();
            });
            it('Undo redo after Remove last phase', function (done) {
                let swimlane = diagram.nameTable['swimlane'];
                expect(swimlane.shape.phases.length === 2).toBe(true);
                diagram.undo();
                expect(swimlane.shape.phases.length === 3).toBe(true);
                diagram.redo();
                expect(swimlane.shape.phases.length === 2).toBe(true);
                done();
            });
        });
        describe('Vertical swimlane', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram53', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);

                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            orientation: 'Vertical',
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLI' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    width: 140,
                                    children: [
                                        {
                                            id: 'paymentondebitcreditcard',
                                            annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                                            margin: { left: 10, top: 200 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 100,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 200,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase3', offset: 300,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 350, offsetY: 290,
                        height: 360, width: 650
                    },
                ];
                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram53');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Remove last phase', function (done) {
                let swimlane = diagram.nameTable['swimlane'];
                let phase = diagram.nameTable["swimlanephase3_header"];
                diagram.select([phase]);
                expect(swimlane.shape.phases.length === 3).toBe(true);
                diagram.remove();
                expect(swimlane.shape.phases.length === 2).toBe(true);
                done();
            });
            it('Undo redo after Remove last phase', function (done) {
                let swimlane = diagram.nameTable['swimlane'];
                expect(swimlane.shape.phases.length === 2).toBe(true);
                diagram.undo();
                expect(swimlane.shape.phases.length === 3).toBe(true);
                diagram.redo();
                expect(swimlane.shape.phases.length === 2).toBe(true);
                done();
            });
        });
    });
    describe('Swimlane - Keyboard Commands', () => {
        describe('Horizontal swimlane', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram5', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);

                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fontSize: 11 },
                                orientation: 'Horizontal',
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    height: 100,
                                }
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 170,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 450,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 420, offsetY: 270,
                        height: 100,
                        width: 650
                    },
                ];
                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram5');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Header Text Editing - keyboard commands', function (done) {
                setTimeout(function () {
                    let node = diagram.nameTable["swimlane"];
                    diagram.select([node]);
                    mouseEvents.keyDownEvent(diagramCanvas, 'F2');
                    let editBox = document.getElementById(diagram.element.id + '_editBox');
                    expect(editBox != undefined).toBe(true);
                    mouseEvents.keyDownEvent(diagramCanvas, 'Escape');
                    editBox = document.getElementById(diagram.element.id + '_editBox');
                    expect(editBox == undefined).toBe(true);
                    done();
                }, 300);
            });
            it('Lane Header Text Editing - keyboard commands', function (done) {
                setTimeout(function () {
                    let node = diagram.nameTable["swimlanestackCanvas10"];
                    diagram.select([node]);
                    mouseEvents.keyDownEvent(diagramCanvas, 'F2');
                    let editBox = document.getElementById(diagram.element.id + '_editBox');
                    expect(editBox != undefined).toBe(true);
                    mouseEvents.keyDownEvent(diagramCanvas, 'Escape');
                    editBox = document.getElementById(diagram.element.id + '_editBox');
                    expect(editBox == undefined).toBe(true);
                    done();
                }, 300);
            });
        });
    });
    describe('Property Change - swimlane', () => {
        describe('Horizontal Orientation', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents(); let grid: GridPanel; let previous: number;
            let current: number;
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram3000', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);
                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
                                height: 50, style: { fontSize: 11 },
                                orientation: 'Horizontal',
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
                                    id: 'phase1', offset: 170,
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 450,
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 420, offsetY: 270,
                        height: 100,
                        width: 650
                    },
                ];
                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }

                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram3000');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
                grid = diagram.nodes[0].wrapper.children[0] as GridPanel;
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('PhaseSize 0', function (done) {

                (diagram.nodes[0].shape as SwimLaneModel).phaseSize = 0;
                previous = grid.rowDefinitions().length;

                diagram.dataBind();
                current = grid.rowDefinitions().length;

                expect(current === previous - 1).toBe(true);
                done();
            });
            it('PhaseSize is greater than 0', function (done) {
                previous = grid.rowDefinitions().length;
                (diagram.nodes[0].shape as SwimLaneModel).phaseSize = 10;
                diagram.dataBind();
                current = grid.rowDefinitions().length;

                expect(current === previous + 1).toBe(true);
                expect(grid.rowDefinitions()[1].height === 10).toBe(true);
                done();
            });
            it('Change the phaseSize to 20', function (done) {
                previous = grid.rowDefinitions()[1].height;
                (diagram.nodes[0].shape as SwimLaneModel).phaseSize = 20;
                diagram.dataBind();
                current = grid.rowDefinitions()[1].height;
                expect(previous === 10 && current === 20).toBe(true);
                done();
            });
            it('Change the lane width', function (done) {
                (diagram.nodes[0].shape as SwimLaneModel).lanes[0].height = 200;
                diagram.dataBind();
                let lane1 = document.getElementById('swimlanestackCanvas10').getAttribute('height');
                expect(lane1 === '200').toBe(true);
                (diagram.nodes[0].shape as SwimLaneModel).lanes[0].height = 170;
                diagram.dataBind();
                lane1 = document.getElementById('swimlanestackCanvas10').getAttribute('height');
                expect(lane1 === '170').toBe(true);
                done();
            });
            it('Change the phase offset', function (done) {
                (diagram.nodes[0].shape as SwimLaneModel).phases[0].offset = 250;
                diagram.dataBind();
                let phase = document.getElementById('swimlanestackCanvas10').getAttribute('width');
                expect(phase === '250').toBe(true);
                (diagram.nodes[0].shape as SwimLaneModel).phases[0].offset = 200;
                diagram.dataBind();
                phase = document.getElementById('swimlanestackCanvas10').getAttribute('width');
                expect(phase === '200').toBe(true);
                done();
            });

            it('Moving nodes out of view - negative', (done: Function) => {
                let diagramCanvas: HTMLElement;
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                (diagram.nodes[0].shape as SwimLaneModel).lanes[0].height = 1200;
                diagram.dataBind();
                let lane1 = document.getElementById('swimlanestackCanvas10').getAttribute('height');
                expect(lane1 === '1200').toBe(true);
                setTimeout(function () {
                    let mouseEvents: MouseEvents = new MouseEvents();
                    let node = document.getElementById('Order');
                    let bounds1 = node.getBoundingClientRect();
                    let x1 = bounds1.left + bounds1.width / 2;
                    let y1 = bounds1.top + bounds1.height / 2;

                    let id = (diagram.nodes[0].wrapper.children[0] as GridPanel).rows[0].cells[0].children[0].id
                    let target = document.getElementById(id);
                    let bounds = target.getBoundingClientRect();

                    let x = bounds.left + bounds.width / 2;
                    let y = bounds.top + bounds.height / 2;

                    mouseEvents.clickEvent(diagramCanvas, x1 + diagram.element.offsetLeft, y1 + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, x1 + diagram.element.offsetLeft + 10, y1 + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, x1 + diagram.element.offsetLeft + 20, y1 + diagram.element.offsetTop + 20);
                    mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 30, y + diagram.element.offsetTop + 20);
                    mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
                    node = document.getElementById('Order');
                    bounds = node.getBoundingClientRect();
                    expect(diagram.nodes[0].wrapper.bounds.y == -510).toBe(true);
                    done();
                }, 1000);
            });
        });
        describe('Vertical Orientation', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents(); let grid: GridPanel; let previous: number;
            let current: number;
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram300', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);
                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane', orientation: "Vertical",
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 25, style: { fill: darkColor, fontSize: 11 },
                                orientation: 'Vertical',
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, height: 25,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    width: 150,
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
                                            margin: { left: 20, top: 50 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                                {
                                    id: 'stackCanvas2',
                                    header: {
                                        annotation: { content: 'ONLINE' }, height: 25,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 150,
                                    children: [
                                        {
                                            id: 'selectItemaddcart',
                                            annotations: [{ content: 'Select item\nAdd cart' }],
                                            margin: { left: 20, top: 150 },
                                            height: 40, width: 100
                                        },
                                        {
                                            id: 'paymentondebitcreditcard',
                                            annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                                            margin: { left: 20, top: 220 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                                {
                                    id: 'stackCanvas3',
                                    header: {
                                        annotation: { content: 'SHOP' }, height: 25,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    width: 150,
                                    children: [
                                        {
                                            id: 'getmaildetailaboutorder',
                                            annotations: [{ content: 'Get mail detail\nabout order' }],
                                            margin: { left: 20, top: 150 },
                                            height: 40, width: 100
                                        },
                                        {
                                            id: 'pakingitem',
                                            annotations: [{ content: 'Paking item' }],
                                            margin: { left: 20, top: 220 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                                {
                                    header: {
                                        annotation: { content: 'DELIVERY' }, height: 25,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    width: 150,
                                    children: [
                                        {
                                            id: 'sendcourieraboutaddress',
                                            annotations: [{ content: 'Send Courier\n about Address' }],
                                            margin: { left: 20, top: 150 },
                                            height: 40, width: 100
                                        },
                                        {
                                            id: 'deliveryonthataddress',
                                            annotations: [{ content: 'Delivery on that\n Address' }],
                                            margin: { left: 20, top: 220 },
                                            height: 40, width: 100
                                        },
                                        {
                                            id: 'getitItem',
                                            shape: { type: 'Path', data: pathData },
                                            annotations: [{ content: 'GET IT ITEM', style: { fontSize: 11 } }],
                                            margin: { left: 20, top: 300 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 120,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 370,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 370, offsetY: 270
                    },
                ];
                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }

                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram300');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
                grid = diagram.nodes[0].wrapper.children[0] as GridPanel;
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('PhaseSize 0', function (done) {
                (diagram.nodes[0].shape as SwimLaneModel).phaseSize = 0;
                previous = grid.columnDefinitions().length;

                diagram.dataBind();
                current = grid.columnDefinitions().length;

                expect(current === previous - 1).toBe(true);
                done();
            });
            it('PhaseSize is greater than 0', function (done) {
                previous = grid.columnDefinitions().length;
                (diagram.nodes[0].shape as SwimLaneModel).phaseSize = 10;
                diagram.dataBind();
                current = grid.columnDefinitions().length;

                expect(current === previous + 1).toBe(true);
                expect(grid.columnDefinitions()[0].width === 10).toBe(true);
                done();
            });
            it('Change the phaseSize to 20', function (done) {
                previous = grid.columnDefinitions()[0].width;
                (diagram.nodes[0].shape as SwimLaneModel).phaseSize = 20;
                diagram.dataBind();
                current = grid.columnDefinitions()[0].width;
                expect(previous === 10 && current === 20).toBe(true);
                done();
            });
            it('Change the lane width', function (done) {
                (diagram.nodes[0].shape as SwimLaneModel).lanes[0].width = 200;
                diagram.dataBind();
                let lane1 = document.getElementById('swimlanestackCanvas10').getAttribute('width');
                expect(lane1 === '200').toBe(true);
                (diagram.nodes[0].shape as SwimLaneModel).lanes[0].width = 170;
                diagram.dataBind();
                lane1 = document.getElementById('swimlanestackCanvas10').getAttribute('width');
                expect(lane1 === '170').toBe(true);
                done();
            });
            it('Change the phase offset', function (done) {
                (diagram.nodes[0].shape as SwimLaneModel).phases[0].offset = 150;
                diagram.dataBind();
                let phase = document.getElementById('swimlanestackCanvas10').getAttribute('height');
                expect(phase === '150').toBe(true);
                (diagram.nodes[0].shape as SwimLaneModel).phases[0].offset = 110;
                diagram.dataBind();
                phase = document.getElementById('swimlanestackCanvas10').getAttribute('height');
                expect(phase === '110').toBe(true);
                done();
            });
        });

    });
    describe('Vertical Swimlane add node at runtime', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane2' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 700, height: 400, offsetX: 600, offsetY: 250,
                    shape: {
                        type: 'SwimLane', orientation: 'Vertical',
                        header: { annotation: { content: 'Header' }, style: { fill: 'gray' } },
                        phases: [{ header: { annotation: { content: 'phase1' } }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 300 },
                        { header: { content: { annotation: 'phase2' } }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 100 }],
                        lanes: [
                            {
                                id: 'lane1',
                                children: [{
                                    id: 'node111',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'node113rr',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, height: 100, header: { annotation: { content: 'lane1' } }
                            },
                            {
                                id: 'lane2', height: 100,
                                children: [{
                                    id: 'abc',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'efg',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, headers: [{ content: 'lane1', style: { fill: 'red' } }]
                            }]
                    }
                },
            ];

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes, created: created });
            diagram.appendTo('#diagramSwimlane2');
            function created() {
                let nodef: NodeModel = {
                    id: 'Processwww', width: 50, height: 60, shape: { type: 'Flow', shape: 'Process' },
                    style: { strokeWidth: 1, fill: 'red' }, margin: { left: 300, top: 200 }
                }
                diagram.addNodeToLane(nodef, "node1", "lane1");
                let nodeff: NodeModel = {
                    id: 'Processwwww', width: 50, height: 60, shape: { type: 'Flow', shape: 'Process' },
                    style: { strokeWidth: 1, fill: 'red' }, margin: { left: 800, top: 800 }
                }
                diagram.addNodeToLane(nodeff, "node1", "lane2");
            }

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking vertical add node at runtime', (done: Function) => {
            expect(diagram.nodes[0].offsetX == 870 && diagram.nodes[0].offsetY == 515).toBe(true);
            done();
        });

    });
    describe('Horizontal Swimlane add node at runtime', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane1' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', offsetX: 600, offsetY: 250, width: 700, height: 400,
                    shape: {
                        type: 'SwimLane', orientation: 'Horizontal',
                        header: {
                            annotation: { content: 'Header', style: { fill: 'gray' } },
                            phases:
                                [
                                    { header: { annotation: { content: 'phase1' } }, style: { fill: 'blue', opacity: .5 }, offset: 300 },
                                    { header: { annotation: { content: 'phase1' } }, style: { fill: 'blue', opacity: .5 }, width: 300 }
                                ],
                            lanes: [
                                {
                                    id: 'lane1',
                                    children: [{
                                        id: 'node111',
                                        width: 50, height: 50,
                                        margin: { left: 520, top: 20 }
                                    }
                                        , {
                                        id: 'nodeabh',
                                        width: 50, height: 50,
                                        margin: { left: 50, top: 20 }
                                    }],
                                    style: { fill: 'red', opacity: .4 }, height: 100, header: { annotation: { content: 'lane1' } }
                                },
                                {
                                    id: 'lane2', height: 100,
                                    children: [{
                                        id: 'node11d1',
                                        width: 50, height: 50,
                                        margin: { left: 520, top: 20 }
                                    }
                                        , {
                                        id: 'nodeadbh',
                                        width: 50, height: 50,
                                        margin: { left: 50, top: 20 }
                                    }
                                    ],
                                    style: { fill: 'red', opacity: .4 }, header: { annotation: { content: 'lane1', style: { fill: 'red' } } }
                                }
                            ]
                        }
                    }
                }
            ];
            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes, created: created });
            diagram.appendTo('#diagramSwimlane1');
            function created() {
                let nodef: NodeModel = {
                    id: 'Processwww', width: 50, height: 60, shape: { type: 'Flow', shape: 'Process' },
                    style: { strokeWidth: 1, fill: 'red' }, margin: { left: 300, top: 200 }
                }
                diagram.addNodeToLane(nodef, "node1", "lane1");
                let nodeff: NodeModel = {
                    id: 'Processwwwq', width: 50, height: 60, shape: { type: 'Flow', shape: 'Process' },
                    style: { strokeWidth: 1, fill: 'red' }, margin: { left: 800, top: 800 }
                }
                diagram.addNodeToLane(nodeff, "node1", "lane2");
            }
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Horizontal add node at runtime', (done: Function) => {
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 250).toBe(true);
            done();
        });

    });
    describe('checking Swimlane , No width Given', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane1' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    shape: {
                        type: 'SwimLane',
                        header: {
                            annotation: { content: 'Pool', },
                            orientation: 'Horizontal',
                        },

                    },
                    id: "pool",
                    offsetX: 200,
                    offsetY: 200,

                }
            ];
            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes, });
            diagram.appendTo('#diagramSwimlane1');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('checking Swimlane , No width Given', (done: Function) => {
            expect(diagram.nodes[0].wrapper.actualSize.width === 100
                && diagram.nodes[0].wrapper.actualSize.height === 50).toBe(true)
            done();
        });

    });
    describe('Swimlane - Lane interchange', () => {
        describe('Horizontal swimlane', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram5', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);

                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                                orientation: 'Horizontal',
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1', canMove: false,
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, height: 100,
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
                                    id: 'stackCanvas3', canMove: false,
                                    header: {
                                        annotation: { content: 'SHOP' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                    id: 'phase1', offset: 170,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 450,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 420, offsetY: 270,
                        height: 100,
                        width: 650
                    },
                ];
                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram5');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Change delivery lane to second lane', function (done) {
                setTimeout(function () {
                    let node = diagram.nameTable["swimlanestackCanvas40"];
                    let target = diagram.nameTable["swimlanestackCanvas10"];

                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);

                    done();
                }, 300);
            });
            it('Change shop lane to second Lane (canMove-true)', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas30"];
                    let target = diagram.nameTable["swimlanestackCanvas40"];

                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);
                    done();
                }, 300);
            });
            it('Change online Lane to last lane', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas20"];
                    let target = diagram.nameTable["swimlanestackCanvas30"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 5);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 2 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas30"].rowIndex == 4 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas10"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 0 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 0).toBe(true);
                    done();
                }, 300);
            });
        });
        describe('Vertical swimlane', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram5', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);

                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            orientation: 'Vertical',
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLI' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    width: 140,
                                },
                                {
                                    id: 'stackCanvas2', canMove: false,
                                    header: {
                                        annotation: { content: 'ONLINE' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 170,
                                },
                                {
                                    id: 'stackCanvas3',
                                    header: {
                                        annotation: { content: 'SHOP' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 120,

                                },
                                {
                                    id: 'stackCanvas4', canMove: false,
                                    header: {
                                        annotation: { content: 'DELIVERY' }, height: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, width: 200,

                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 200,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 400,
                                    style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 350, offsetY: 290,
                        height: 360,
                    },
                ];
                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram5');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });


            it('Change delivery lane to first lane(canMove - true)', function (done) {
                setTimeout(function () {
                    let node = diagram.nameTable["swimlanestackCanvas40"];
                    let target = diagram.nameTable["swimlanestackCanvas10"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 4).toBe(true);
                    done();
                }, 300);
            });
            it('Change shop lane to third Lane', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas30"];
                    let target = diagram.nameTable["swimlanestackCanvas40"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 4).toBe(true);

                    done();
                }, 300);
            });
            it('Change online lane(canMove - true)', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas20"];
                    let target = diagram.nameTable["swimlanestackCanvas30"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft - 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 10, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft - 10, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 4).toBe(true);
                    done();
                }, 300);
            });
            it('Change customer lane to last lane(delivery lane: canMove - true)', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas11"];
                    let target = diagram.nameTable["swimlanestackCanvas41"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 5, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 5, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 3).toBe(true);
                    done();
                }, 300);
            });
            it('Change online lane(canMove - true) to last lane', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas20"];
                    let target = diagram.nameTable["swimlanestackCanvas10"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 3).toBe(true);
                    done();
                }, 300);
            });
            it('Change shop lane to second lane', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas30"];
                    let target = diagram.nameTable["swimlanestackCanvas20"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 3).toBe(true);
                    done();
                }, 300);
            });
            it('Change delivery lane(canMove - true) to third lane', function (done) {
                setTimeout(function () {

                    let node = diagram.nameTable["swimlanestackCanvas40"];
                    let target = diagram.nameTable["swimlanestackCanvas30"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft + 40, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft + 15, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["swimlanestackCanvas10"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 3).toBe(true);
                    done();
                }, 300);
            });
            it('Check Undo, redo action - after interchange the lane', function (done) {
                diagram.undo();
                expect(diagram.nameTable["swimlanestackCanvas10"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 3 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 4).toBe(true);
                diagram.redo();
                expect(diagram.nameTable["swimlanestackCanvas10"].columnIndex == 4 && diagram.nameTable["swimlanestackCanvas20"].columnIndex == 1 && diagram.nameTable["swimlanestackCanvas30"].columnIndex == 2 && diagram.nameTable["swimlanestackCanvas40"].columnIndex == 3).toBe(true);
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
            });
        });
    });
    describe('Swimlane - Support to restrict the movement of lane children beyond their boundaries', () => {
        describe('Horizontal swimlane', () => {
            let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
            let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
            let mouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'SwimlaneDiagram5', styles: 'width:74%;height:500px;float:left;' }));
                document.body.appendChild(ele);

                let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let darkColor = '#C7D4DF';
                let lightColor = '#f5f5f5';

                function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                    connector.type = 'Orthogonal'
                    return connector;
                }
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                                orientation: 'Horizontal',
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { content: 'CUSTOMER' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                            height: 40, width: 100,
                                            constraints: NodeConstraints.Default | NodeConstraints.AllowMovingOutsideLane
                                        }
                                    ],
                                },
                                {
                                    id: 'stackCanvas2',
                                    header: {
                                        annotation: { content: 'ONLINE' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, height: 100,
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
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
                                    id: 'phase1', offset: 170,
                                    style: { strokeColor: '#606060' },
                                    header: { annotation: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 450,
                                    style: { strokeColor: '#606060' },
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
                diagram = new Diagram({
                    width: '70%',
                    height: '800px',
                    nodes: nodes,
                    getConnectorDefaults: getConnectorDefaults,
                });
                diagram.appendTo('#SwimlaneDiagram5');

                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('Header Style', function (done) {
                let swimlane = diagram.nameTable["swimlane"];
                expect(swimlane.shape.header.annotation.style.fill == "transparent" &&
                    swimlane.shape.phases[0].header.annotation.style.fill == "transparent" &&
                    swimlane.shape.lanes[0].header.annotation.style.fill == "transparent").toBe(true);
                done();
            });

            it('DropBeyondSwimlane  - Order Node', function (done) {
                setTimeout(function () {
                    var node = diagram.nameTable["Order"];
                    var target = diagram.nameTable["swimlane"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.bounds.middleRight.x + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.bounds.middleRight.x + diagram.element.offsetLeft + 20, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.bounds.middleRight.x + diagram.element.offsetLeft + 30, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["Order"].parentId == 'swimlanestackCanvas10').toBe(true);
                    done();
                }, 300);
            });
            it('Lane Interchange', function (done) {
                setTimeout(function () {
                    var node = diagram.nameTable["swimlanestackCanvas40"];
                    var target = diagram.nameTable["swimlanestackCanvas10"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                    expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 4 &&
                        diagram.nameTable["swimlanestackCanvas30"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 2).toBe(true);
                    done();
                }, 300);
            });
            it('DropBeyondSwimlane  - Order Node', function (done) {
                setTimeout(function () {

                    var node = diagram.nameTable["Order"];
                    var target = diagram.nameTable["swimlane"];
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.bounds.middleRight.x + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.bounds.middleRight.x + diagram.element.offsetLeft + 20, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.bounds.middleRight.x + diagram.element.offsetLeft + 30, target.wrapper.offsetY + diagram.element.offsetTop);
                    expect(diagram.nameTable["Order"].parentId == 'swimlanestackCanvas10').toBe(true);
                    done();
                }, 300);
            });
        });
    });
    describe('Swimlane - TextWrapping not working for lane headers', () => {
        let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
        let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'SwimlaneDiagram5', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);

            let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
            let darkColor = '#C7D4DF';
            let lightColor = '#f5f5f5';

            function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                connector.type = 'Orthogonal'
                return connector;
            }
            let nodes: NodeModel[] = [
                {
                    id: 'swimlane',
                    shape: {
                        type: 'SwimLane',
                        lanes: [
                            {
                                id: 'stackCanvas1',
                                header: {
                                    annotation: { id: 'laneHeader', content: 'CUSTOMER VCDS DFGHJ ASDCV GHJUKIO HJMUIK,OL OIUJHG GHJ CUSTOMER VCDS DFGHJ ASDCV GHJUKIO HJMUIK,OL OIUJHG GHJ CUSTOMER VCDS DFGHJ ASDCV GHJUKIO HJMUIK,OL OIUJHG GHJCUSTOMER VCDS DFGHJ ASDCV GHJUKIO HJMUIK,OL OIUJHG GHJ CUSTOMER VCDS DFGHJ ASDCV GHJUKIO HJMUIK,OL OIUJHG GHJ CUSTOMER VCDS DFGHJ ASDCV GHJUKIO HJMUIK,OL OIUJHG GHJCUSTOMER VCDS DFGHJ ASDCV GHJUKIO HJMUIK,OL OIUJHG GHJ CUSTOMER VCDS DFGHJ ASDCV GHJUKIO HJMUIK,OL OIUJHG GHJ CUSTOMER VCDS DFGHJ ASDCV GHJUKIO HJMUIK,OL OIUJHG GHJ', style: { textOverflow: 'Ellipsis', textWrapping: 'Wrap' } }, width: 50,
                                    style: { fontSize: 11 }
                                },
                                height: 100,
                            }
                        ],
                        phaseSize: 0,
                    },
                    offsetX: 420, offsetY: 270,
                    height: 100,
                    width: 650
                },
            ];
            diagram = new Diagram({
                width: '70%',
                height: '800px',
                nodes: nodes,
                getConnectorDefaults: getConnectorDefaults,
            });
            diagram.appendTo('#SwimlaneDiagram5');

            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking - TextWrapping for lane headers', function (done) {
            setTimeout(function () {

                let collection = document.getElementById("swimlanestackCanvas1_0_header_laneHeader_groupElement").childNodes[1].childNodes;
                expect(collection.length == 3).toBe(true);
                done();
            }, 300);
        });
    });
    describe('Custom Issue - Not able to get TextAnnotation node margin values dropped in the swimlane', () => {
        let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
        let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolpalette1', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'Custom-Issue-TextAnnotation', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);
            let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
            let darkColor = '#C7D4DF';
            let lightColor = '#f5f5f5';
            let nodes: NodeModel[] = [
                {
                    id: 'swimlane',
                    shape: {
                        type: 'SwimLane',
                        header: {
                            annotation: { content: 'ONLINE PURCHASE STATUS' } as Annotation,
                            height: 50, style: { fill: darkColor, fontSize: 11 } as ShapeStyleModel
                        },
                        lanes: [
                            {
                                id: 'stackCanvas1',
                                header: {
                                    annotation: { content: 'CUSTOMER' } as Annotation, width: 50,
                                    style: { fill: darkColor, fontSize: 11 } as ShapeStyleModel
                                },
                                style: { fill: lightColor },
                                height: 400,
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
                            }
                        ],
                        phases: [
                            {
                                id: 'phase1', offset: 170,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } as Annotation }
                            },
                            {
                                id: 'phase2', offset: 450,
                                style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
                                header: { annotation: { content: 'Phase' } as Annotation }
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 420, offsetY: 270,
                    height: 100,
                    width: 650
                },
            ];
            diagram = new Diagram({
                width: '70%',
                height: '800px',
                nodes: nodes,
            });
            diagram.appendTo('#Custom-Issue-TextAnnotation');

            palette = new SymbolPalette({
                width: '25%', height: '500px',
                palettes: [
                    {
                        id: 'flow', expanded: true, symbols: [
                            {
                                id: 'TextAnnotation', width: 50, height: 50, constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                                shape: { type: 'Bpmn', shape: 'TextAnnotation', annotation: { angle: 280, length: 150, text: 'textAnnotation4', } }
                            },
                            { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' }, style: { strokeWidth: 1 } },
                            { id: 'Process', shape: { type: 'Flow', shape: 'Process' }, style: { strokeWidth: 1 } },
                            { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' }, style: { strokeWidth: 1 } },
                            { id: 'Document', shape: { type: 'Flow', shape: 'Document' }, style: { strokeWidth: 1 } }], title: 'Flow Shapes'
                    },
                    {
                        id: 'swimlaneShapes', expanded: true,
                        title: 'Swimlane Shapes',
                        symbols: [
                            {
                                id: 'stackCanvas1',
                                shape: {
                                    type: 'SwimLane', lanes: [
                                        {
                                            id: 'lane1',
                                            style: { fill: '#f5f5f5' }, height: 60, width: 150,
                                            header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                        }
                                    ],
                                    orientation: 'Horizontal', isLane: true
                                },
                                height: 60,
                                width: 140,
                                style: { fill: '#f5f5f5' },
                                offsetX: 70,
                                offsetY: 30,
                            }, {
                                id: 'stackCanvas2',
                                shape: {
                                    type: 'SwimLane',
                                    lanes: [
                                        {
                                            id: 'lane1',
                                            style: { fill: '#f5f5f5' }, height: 150, width: 60,
                                            header: { width: 50, height: 50, style: { fill: '#C7D4DF', fontSize: 11 } },
                                        }
                                    ],
                                    orientation: 'Vertical', isLane: true
                                },
                                height: 140,
                                width: 60,
                                style: { fill: '#f5f5f5' },
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
                ], symbolHeight: 50, symbolWidth: 50,
                expandMode: 'Multiple',
            });
            palette.appendTo('#symbolpalette1');

            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Selection - Swimlane', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                var clonedElement;
                var symbols = palette.symbolTable['TextAnnotation'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };
            var events = new MouseEvents();
            var ele = document.getElementById("TextAnnotation_container");
            var bounds = ele.getBoundingClientRect() as DOMRect;

            var laneElementBounds = document.getElementById("swimlanestackCanvas11").getBoundingClientRect() as DOMRect;
            var laneX = laneElementBounds.x + laneElementBounds.width / 2;
            var laneY = laneElementBounds.y + laneElementBounds.height / 2;
            var startPointX = bounds.x + bounds.width / 2 + ele.offsetLeft;
            var startPointY = bounds.y + bounds.height / 2 + ele.offsetTop;
            events.mouseDownEvent(palette.element, startPointX, startPointY, false, false);
            events.mouseMoveEvent(palette.element, startPointX + 3, startPointY, false, false);
            events.mouseMoveEvent(palette.element, startPointX, 200, false, false);
            events.mouseMoveEvent(diagramCanvas, 835, 163.5, false, false);
            var bounds = document.getElementById("borderRect_symbol").getBoundingClientRect() as DOMRect;
            expect(bounds.x == 836.5 && bounds.y == 164.5).toBe(true);
            events.mouseMoveEvent(diagramCanvas, laneX, laneY, false, false);            
            events.mouseMoveEvent(diagramCanvas, laneX + 10, laneY, false, false);
            events.mouseMoveEvent(diagramCanvas, laneX + 10, laneY + 10, false, false);
            events.mouseUpEvent(diagramCanvas, laneX + 10, laneY + 10, false, false);
            console.log("diagram.nodes[diagram.nodes.length - 1].id:" + (diagram.nodes[diagram.nodes.length - 1] as Node).id);
            console.log("diagram.nodes[diagram.nodes.length - 1].parentId:" + (diagram.nodes[diagram.nodes.length - 1] as Node).parentId);
            done();
        });
    }); 
});
describe('Swimlane - Enable Line Routing', () => {
    describe('(CR Issue) EJ2-37841 - Node dragging in swimlane is not working properly when line routing is enabled', () => {
        let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
        let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'Custom-Issue-Node-dragging', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);
            let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
            let nodes: NodeModel[] = [
                {
                    id: 'swimlane',
                    shape: {
                        type: 'SwimLane',
                        header: {
                            annotation: { content: 'ONLINE PURCHASE STATUS' } as Annotation,
                            height: 50, style: { fontSize: 11 } as ShapeStyleModel
                        },
                        lanes: [
                            {
                                id: 'stackCanvas1',
                                header: {
                                    annotation: { content: 'CUSTOMER' } as Annotation, width: 50,
                                    style: { fontSize: 11 } as ShapeStyleModel
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
                                    annotation: { content: 'ONLINE' } as Annotation, width: 50,
                                    style: { fontSize: 11 } as ShapeStyleModel
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
                                    annotation: { content: 'SHOP' } as Annotation, width: 50,
                                    style: { fontSize: 11 } as ShapeStyleModel
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
                                    annotation: { content: 'DELIVERY' } as Annotation, width: 50,
                                    style: { fontSize: 11 } as ShapeStyleModel
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
                                id: 'phase1', offset: 170,
                                header: { annotation: { content: 'Phase' } as Annotation }
                            },
                            {
                                id: 'phase2', offset: 450,
                                header: { annotation: { content: 'Phase' } as Annotation }
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
            function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
                connector.type = 'Orthogonal'
                return connector;
            }
            diagram = new Diagram({
                width: '800px',
                height: '800px',
                nodes: nodes,
                connectors: connectors,
                getConnectorDefaults: getConnectorDefaults,
                constraints: DiagramConstraints.Default | DiagramConstraints.LineRouting
            });
            diagram.appendTo('#Custom-Issue-Node-dragging');

            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        // it('Drag node inside the lane', (done: Function) => {
        //     for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
        //     done();
        // });

        it('Drag node inside the lane', (done: Function) => {
            debugger
            console.log('(CR Issue) EJ2-37841');

            // Connector Segments - Line Routing
            for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 165 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 245 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 295 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 245).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 245 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 455 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 245).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 455 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 245 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 430 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 245 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 395 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 345).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 345 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 455 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 345).toBe(true);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 455 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 345 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 430 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 345 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 445 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 395 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 445).toBe(true);
            expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 445 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 455 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 445).toBe(true);
            expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 555 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 445 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 605.52 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 445).toBe(true);

            let node = diagram.nameTable["pakingitem"];
            let targetNode = diagram.nameTable["swimlanestackCanvas31"];
            let sourcePointX = node.wrapper.offsetX + diagram.element.offsetLeft;
            let sourcePointY = node.wrapper.offsetY + diagram.element.offsetTop;
            let targetPointX = targetNode.wrapper.offsetX + diagram.element.offsetLeft;
            let targetPointY = targetNode.wrapper.offsetY + diagram.element.offsetTop;
            expect(diagram.nameTable["pakingitem"].parentId == 'swimlanestackCanvas31').toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, sourcePointX, sourcePointY);
            mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 20);
            mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 40);
            mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY - 20);
            mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY);
            mouseEvents.mouseUpEvent(diagramCanvas, targetPointX, targetPointY);
            expect(diagram.nameTable["pakingitem"].parentId == 'swimlanestackCanvas31').toBe(true);

            // Connector Segments - Line Routing
            for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 165 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 245 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 295 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 245).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 245 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 455 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 245).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 455 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 245 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 430 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 245 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 430 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 395 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 345).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 345 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 345 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 355 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 465 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 355).toBe(true);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 465 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 355 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 355 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 410 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 345 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 410 && (diagram.connectors[4] as Connector).intermediatePoints[4].x == 345 && (diagram.connectors[4] as Connector).intermediatePoints[4].y == 425).toBe(true);
            expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 445 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 455 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 445).toBe(true);
            expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 555 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 445 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 605.52 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 445).toBe(true);

            done();
        });

        it('Drag and drop node from one lane to another lane', (done: Function) => {
            let node = diagram.nameTable["paymentondebitcreditcard"];
            let targetNode = diagram.nameTable["swimlanestackCanvas11"];
            let sourcePointX = node.wrapper.offsetX + diagram.element.offsetLeft;
            let sourcePointY = node.wrapper.offsetY + diagram.element.offsetTop;
            let targetPointX = targetNode.wrapper.offsetX + diagram.element.offsetLeft;
            let targetPointY = targetNode.wrapper.offsetY + diagram.element.offsetTop;
            expect(diagram.nameTable["paymentondebitcreditcard"].parentId == 'swimlanestackCanvas21').toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, sourcePointX, sourcePointY);
            mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 20);
            mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 40);
            mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY - 20);
            mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY);
            mouseEvents.mouseUpEvent(diagramCanvas, targetPointX, targetPointY);
            expect(diagram.nameTable["paymentondebitcreditcard"].parentId == 'swimlanestackCanvas11').toBe(true);
            expect(diagram.nameTable['swimlanestackCanvas11'].width == 480 && diagram.nameTable['swimlanestackCanvas11'].height == 100).toBe(true);

            // Connector Segments - Line Routing
            for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 165 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 245 && (diagram.connectors[0] as Connector).intermediatePoints[2].x == 295 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 245).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 245 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 410 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 245 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 410 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 160 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 465 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 160).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 465 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 160 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 160 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 395 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 345).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 345 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 345 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 355 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 465 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 355).toBe(true);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 465 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 355 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 355 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 410 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 345 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 410 && (diagram.connectors[4] as Connector).intermediatePoints[4].x == 345 && (diagram.connectors[4] as Connector).intermediatePoints[4].y == 425).toBe(true);
            expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 445 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 455 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 445).toBe(true);
            expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 555 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 445 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 605.52 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 445).toBe(true);

            done();
        });

        it('Drag and drop node from one phase to another phase in same lane', (done: Function) => {
            let node = diagram.nameTable["selectItemaddcart"];
            let targetNode = diagram.nameTable["swimlanestackCanvas20"];
            let sourcePointX = node.wrapper.offsetX + diagram.element.offsetLeft;
            let sourcePointY = node.wrapper.offsetY + diagram.element.offsetTop;
            let targetPointX = targetNode.wrapper.offsetX + diagram.element.offsetLeft;
            let targetPointY = targetNode.wrapper.offsetY + diagram.element.offsetTop;
            expect(diagram.nameTable["selectItemaddcart"].parentId == 'swimlanestackCanvas21').toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, sourcePointX, sourcePointY);
            mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 20);
            mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 40);
            mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY - 20);
            mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY);
            mouseEvents.mouseUpEvent(diagramCanvas, targetPointX, targetPointY);
            expect(diagram.nameTable["selectItemaddcart"].parentId == 'swimlanestackCanvas20').toBe(true);
            expect(diagram.nameTable['swimlanestackCanvas20'].width == 170 && diagram.nameTable['swimlanestackCanvas20'].height == 100).toBe(true);

            // Connector Segments - Line Routing
            for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }

            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 165 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 245).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 255 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 265 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 270 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 265 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 270 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 160 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 465 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 160).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 465 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 160 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 160 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 395 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 345).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 345 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 345 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 355 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 465 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 355).toBe(true);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 465 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 355 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 355 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 410 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 345 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 410 && (diagram.connectors[4] as Connector).intermediatePoints[4].x == 345 && (diagram.connectors[4] as Connector).intermediatePoints[4].y == 425).toBe(true);
            expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 445 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 455 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 445).toBe(true);
            expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 555 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 445 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 605.52 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 445).toBe(true);
            done();
        });
        it('deliveryonthataddress node from swimlane to outside', function (done) {
            setTimeout(function () {

                var node = diagram.nameTable["deliveryonthataddress"];
                var target = diagram.nameTable["swimlane"];
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.bounds.middleRight.x + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.bounds.middleRight.x + diagram.element.offsetLeft + 20, target.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.bounds.middleRight.x + diagram.element.offsetLeft + 30, target.wrapper.offsetY + diagram.element.offsetTop);
                expect(diagram.nameTable["deliveryonthataddress"].parentId == '').toBe(true);
                for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }

                // Connector Segments - Line Routing
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 165 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 245).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 255 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 265 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 270 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 265 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 270 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 160 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 465 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 160).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 465 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 160 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 160 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 395 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 345).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 345 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 345 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 355 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 465 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 355).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 465 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 355 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 355 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 410 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 345 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 410 && (diagram.connectors[4] as Connector).intermediatePoints[4].x == 345 && (diagram.connectors[4] as Connector).intermediatePoints[4].y == 425).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 445 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 410 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 445 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 410 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 280 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 725 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 280).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 725 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 280 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 710 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 280 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 710 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 410 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 655 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 410 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 655 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 425).toBe(true);
                done();
            }, 300);
        });
        it('Drag and drop the node from diagram to swimlane node', (done: Function) => {
            let node = diagram.nameTable["deliveryonthataddress"];
            let targetNode = diagram.nameTable["swimlanestackCanvas30"];
            let sourcePointX = node.wrapper.offsetX + diagram.element.offsetLeft;
            let sourcePointY = node.wrapper.offsetY + diagram.element.offsetTop;
            let targetPointX = targetNode.wrapper.offsetX + diagram.element.offsetLeft;
            let targetPointY = targetNode.wrapper.offsetY + diagram.element.offsetTop;
            expect(diagram.nameTable["deliveryonthataddress"].parentId == '').toBe(true);
            mouseEvents.mouseDownEvent(diagramCanvas, sourcePointX, sourcePointY);
            mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 20);
            mouseEvents.mouseMoveEvent(diagramCanvas, sourcePointX, sourcePointY + 40);
            mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY - 20);
            mouseEvents.mouseMoveEvent(diagramCanvas, targetPointX, targetPointY);
            mouseEvents.mouseUpEvent(diagramCanvas, targetPointX, targetPointY);
            expect(diagram.nameTable["deliveryonthataddress"].parentId == 'swimlanestackCanvas30').toBe(true);

            // Connector Segments - Line Routing
            for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 165 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 245).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 255 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 265 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 270 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 265 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 270 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 160 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 465 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 160).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 465 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 160 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 160 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 345 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 395 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 345).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 345 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 345 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 355 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 465 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 355).toBe(true);
            expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 465 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 355 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 355 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 410 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 345 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 410 && (diagram.connectors[4] as Connector).intermediatePoints[4].x == 345 && (diagram.connectors[4] as Connector).intermediatePoints[4].y == 425).toBe(true);
            expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 295 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 445 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 270 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 445 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 270 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 350 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 255 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 350).toBe(true);
            expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 205 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 370 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 205 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 410 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 655 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 410 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 655 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 425).toBe(true);
            done();
        });

        it('Lane Interchange', function (done) {
            setTimeout(function () {
                var node = diagram.nameTable["swimlanestackCanvas40"];
                var target = diagram.nameTable["swimlanestackCanvas10"];
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                expect(diagram.nameTable["swimlanestackCanvas10"].rowIndex == 3 && diagram.nameTable["swimlanestackCanvas20"].rowIndex == 4 &&
                    diagram.nameTable["swimlanestackCanvas30"].rowIndex == 5 && diagram.nameTable["swimlanestackCanvas40"].rowIndex == 2).toBe(true);

                // Connector Segments - Line Routing
                for (var i = 0; i < diagram.connectors.length; i++) { console.log(getIntermediatePoints((diagram.connectors[i] as Connector).intermediatePoints, '(diagram.connectors[' + i + '] as Connector)')); }
                expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 265 && (diagram.connectors[0] as Connector).intermediatePoints[1].x == 205 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 345).toBe(true);
                expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 255 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 365 && (diagram.connectors[1] as Connector).intermediatePoints[1].x == 270 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 365 && (diagram.connectors[1] as Connector).intermediatePoints[2].x == 270 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 260 && (diagram.connectors[1] as Connector).intermediatePoints[3].x == 465 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 260).toBe(true);
                expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 465 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 260 && (diagram.connectors[2] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 260 && (diagram.connectors[2] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 445 && (diagram.connectors[2] as Connector).intermediatePoints[3].x == 395 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 445).toBe(true);
                expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 395 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 445 && (diagram.connectors[3] as Connector).intermediatePoints[1].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 445 && (diagram.connectors[3] as Connector).intermediatePoints[2].x == 445 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 455 && (diagram.connectors[3] as Connector).intermediatePoints[3].x == 465 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 455).toBe(true);
                expect((diagram.connectors[4] as Connector).intermediatePoints[0].x == 465 && (diagram.connectors[4] as Connector).intermediatePoints[0].y == 455 && (diagram.connectors[4] as Connector).intermediatePoints[1].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[1].y == 455 && (diagram.connectors[4] as Connector).intermediatePoints[2].x == 450 && (diagram.connectors[4] as Connector).intermediatePoints[2].y == 145 && (diagram.connectors[4] as Connector).intermediatePoints[3].x == 395 && (diagram.connectors[4] as Connector).intermediatePoints[3].y == 145).toBe(true);
                expect((diagram.connectors[5] as Connector).intermediatePoints[0].x == 295 && (diagram.connectors[5] as Connector).intermediatePoints[0].y == 145 && (diagram.connectors[5] as Connector).intermediatePoints[1].x == 270 && (diagram.connectors[5] as Connector).intermediatePoints[1].y == 145 && (diagram.connectors[5] as Connector).intermediatePoints[2].x == 270 && (diagram.connectors[5] as Connector).intermediatePoints[2].y == 450 && (diagram.connectors[5] as Connector).intermediatePoints[3].x == 255 && (diagram.connectors[5] as Connector).intermediatePoints[3].y == 450).toBe(true);
                expect((diagram.connectors[6] as Connector).intermediatePoints[0].x == 255 && (diagram.connectors[6] as Connector).intermediatePoints[0].y == 450 && (diagram.connectors[6] as Connector).intermediatePoints[1].x == 270 && (diagram.connectors[6] as Connector).intermediatePoints[1].y == 450 && (diagram.connectors[6] as Connector).intermediatePoints[2].x == 270 && (diagram.connectors[6] as Connector).intermediatePoints[2].y == 190 && (diagram.connectors[6] as Connector).intermediatePoints[3].x == 655 && (diagram.connectors[6] as Connector).intermediatePoints[3].y == 190 && (diagram.connectors[6] as Connector).intermediatePoints[4].x == 655 && (diagram.connectors[6] as Connector).intermediatePoints[4].y == 165).toBe(true);
                done();
            }, 300);
        });
    });
    describe('Custom issue(F152279) - Swim-lane header is not proper while swapping the lane', () => {
        describe('Vertical Swimlane - Constraints and annotation property', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let diagramCanvas: HTMLElement;
            let mouseEvents = new MouseEvents();
            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramSwimlane-F152279' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [
                    {
                        id: "Businessworkflow", offsetX: 300, offsetY: 200, height: 120, width: 2 * 120,
                        constraints: NodeConstraints.None,
                        shape: {
                            type: "SwimLane", orientation: "Vertical",
                            header: {
                                id: "swimHeader",
                                annotation: {
                                    id: "headerAnnotation", content: "Process",
                                    constraints: AnnotationConstraints.ReadOnly,
                                    visibility: false
                                } as Annotation
                            },
                            lanes: [
                                {
                                    id: "lane1", width: 120,
                                    header: { annotation: { content: "Customer" } as Annotation },
                                    children: [
                                        {
                                            id: "order", height: 100, width: 100,
                                            shape: { type: "Basic" },
                                            annotations: [{ content: "Order" }],
                                        }
                                    ]
                                },
                                {
                                    id: "lane2",
                                    width: 120,
                                    header: {
                                        annotation: {
                                            id: "annotation2", content: "Business", visibility: false,
                                            constraints: AnnotationConstraints.ReadOnly
                                        } as Annotation
                                    }
                                }
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 120,
                                    header: { annotation: { content: 'Phase' } as Annotation }
                                }
                            ],
                            phaseSize: 20,
                        }
                    }
                ];
                diagram = new Diagram({ width: "700px", height: "700px", nodes: nodes });
                diagram.appendTo('#diagramSwimlane-F152279');
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it("Checking the lane's header annotation - visiblity", (done: Function) => {
                let annotation = document.getElementById("Businessworkflowlane2_0_header_annotation2_text").getAttribute("visibility");
                expect(annotation == "hidden").toBe(true);
                done();
            });
            it("Checking the lane's header annotation - constraints", (done: Function) => {
                let laneObjAnnotation = diagram.nameTable["Businessworkflow"].shape.lanes[1].header.annotation.constraints;
                let laneNodeAnnotation = diagram.nameTable["Businessworkflowlane2_0_header"].annotations[0].constraints;
                expect(laneObjAnnotation == laneNodeAnnotation).toBe(true);
                done();
            });
            it("Checking the swimlane's header annotation - visiblity", (done: Function) => {
                let annotation = document.getElementById("BusinessworkflowswimHeader_headerAnnotation_text").getAttribute("visibility");
                expect(annotation == "hidden").toBe(true);
                done();
            });
            it("Checking the lane's header annotation - constraints", (done: Function) => {
                let headerObjAnnotation = (diagram.nodes[0].shape as SwimLaneModel).header.annotation.constraints;
                let headerNodeAnnotation = diagram.nameTable["BusinessworkflowswimHeader"].annotations[0].constraints;
                expect(headerObjAnnotation == headerNodeAnnotation).toBe(true);
                done();
            });
            it("Checking the lane Selection while swimlane have not select constraints", (done: Function) => {
                var node = diagram.nameTable["Businessworkflowlane20"];
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                expect(diagram.selectedItems.nodes.length == 0).toBe(true);
                done();
            });
            it("Checking the phase Selection while swimlane have not select constraints", (done: Function) => {
                var node = diagram.nameTable["Businessworkflowphase1_header"];
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                expect(diagram.selectedItems.nodes.length == 0).toBe(true);
                done();
            });
            it("Enable the select constraints at runtime", (done: Function) => {
                let swimlane = diagram.nodes[0];
                diagram.nodes[0].constraints = NodeConstraints.Default;
                diagram.dataBind();
                // Phase selection
                var node = diagram.nameTable["Businessworkflowphase1_header"];
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                expect(diagram.selectedItems.nodes.length > 0).toBe(true);
                // Lane Selection
                var node = diagram.nameTable["Businessworkflowlane20"];
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                expect(diagram.selectedItems.nodes.length > 0).toBe(true);
                // Swimlane Selection
                var node = diagram.nameTable[swimlane.id + (swimlane.shape as SwimLaneModel).header.id];
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                expect(diagram.selectedItems.nodes[0].id == swimlane.id).toBe(true);
                done();
            });
            it("Enable the select constraints at runtime", (done: Function) => {
                let swimlane = diagram.nodes[0];
                diagram.nodes[0].constraints = NodeConstraints.None;
                diagram.dataBind();
                // Phase selection
                var node = diagram.nameTable["Businessworkflowphase1_header"];
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                expect(diagram.selectedItems.nodes.length == 0).toBe(true);
                // Lane Selection
                var node = diagram.nameTable["Businessworkflowlane20"];
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                expect(diagram.selectedItems.nodes.length == 0).toBe(true);
                // Swimlane Selection
                var node = diagram.nameTable[swimlane.id + (swimlane.shape as SwimLaneModel).header.id];
                mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                expect(diagram.selectedItems.nodes.length == 0).toBe(true);
                done();
            });
        });
        describe('Vertical Swimlane - Lane interchange', () => {
            let diagram: Diagram;
            let ele: HTMLElement;
            let diagramCanvas: HTMLElement;
            let mouseEvents = new MouseEvents();
            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramSwimlane-F152279-2' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [
                    {
                        id: "Businessworkflow", offsetX: 300, offsetY: 200, height: 120, width: 280,
                        shape: {
                            type: "SwimLane", orientation: "Vertical",
                            header: {
                                id: "swimHeader",
                                annotation: { id: "headerAnnotation", content: "Process" } as Annotation
                            },
                            lanes: [
                                {
                                    id: "lane1", width: 140,
                                    header: { annotation: { content: "Customer" } as Annotation }                                    
                                },
                                {
                                    id: "lane2",
                                    width: 140,
                                    header: {
                                        annotation: { id: "annotation2", content: "Business" } as Annotation
                                    }
                                }
                            ],                            
                        }
                    }
                ];
                diagram = new Diagram({ width: "700px", height: "700px", nodes: nodes });
                diagram.appendTo('#diagramSwimlane-F152279-2');
                diagramCanvas = document.getElementById(diagram.element.id + 'content');
                mouseEvents.clickEvent(diagramCanvas, 10, 10);
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it("Checking swimlane header - while lane interchange(phaseSize - 20)", (done: Function) => {
                setTimeout(function () {
                    debugger
                    var node = diagram.nameTable["Businessworkflowlane10"];
                    var target = diagram.nameTable["Businessworkflowlane20"];
                    var beforeX = document.getElementById('BusinessworkflowswimHeader').getAttribute('x');
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                    expect(diagram.nameTable["Businessworkflowlane10"].rowIndex == 1 && diagram.nameTable["Businessworkflowlane10"].columnIndex == 1 &&
                        diagram.nameTable["Businessworkflowlane20"].rowIndex == 1 && diagram.nameTable["Businessworkflowlane20"].columnIndex == 0).toBe(true);
                    expect(document.getElementById('BusinessworkflowswimHeader').getAttribute('x') == beforeX);
                    done();
                }, 300);
            });

            it("Checking swimlane header - while lane interchange(phaseSize - 0)", (done: Function) => {
                setTimeout(function () {
                    var target = diagram.nameTable["Businessworkflowlane10"];
                    var node = diagram.nameTable["Businessworkflowlane20"];
                    var beforeX = document.getElementById('BusinessworkflowswimHeader').getAttribute('x');
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                    expect(diagram.nameTable["Businessworkflowlane10"].rowIndex == 1 && diagram.nameTable["Businessworkflowlane10"].columnIndex == 0 &&
                        diagram.nameTable["Businessworkflowlane20"].rowIndex == 1 && diagram.nameTable["Businessworkflowlane20"].columnIndex == 1).toBe(true);
                    expect(document.getElementById('BusinessworkflowswimHeader').getAttribute('x') == beforeX);
                    done();
                }, 300);
            });
            
            it("Checking swimlane header - while lane interchange(phaseSize - 20)", (done: Function) => {
                setTimeout(function () {
                    (diagram.nodes[0].shape as SwimLaneModel).phaseSize = 0;
                    diagram.dataBind();
                    var node = diagram.nameTable["Businessworkflowlane10"];
                    var target = diagram.nameTable["Businessworkflowlane20"];
                    var beforeX = document.getElementById('BusinessworkflowswimHeader').getAttribute('x');
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                    expect(diagram.nameTable["Businessworkflowlane10"].rowIndex == 1 && diagram.nameTable["Businessworkflowlane10"].columnIndex == 1 &&
                        diagram.nameTable["Businessworkflowlane20"].rowIndex == 1 && diagram.nameTable["Businessworkflowlane20"].columnIndex == 0).toBe(true);
                    expect(document.getElementById('BusinessworkflowswimHeader').getAttribute('x') == beforeX);
                    done();
                }, 300);
            });

            it("Checking swimlane header - while lane interchange(phaseSize - 0)", (done: Function) => {
                setTimeout(function () {
                    var target = diagram.nameTable["Businessworkflowlane10"];
                    var node = diagram.nameTable["Businessworkflowlane20"];
                    var beforeX = document.getElementById('BusinessworkflowswimHeader').getAttribute('x');
                    mouseEvents.clickEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseDownEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, node.wrapper.offsetX + diagram.element.offsetLeft, node.wrapper.offsetY + diagram.element.offsetTop - 40);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop);
                    mouseEvents.mouseMoveEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                    mouseEvents.mouseUpEvent(diagramCanvas, target.wrapper.offsetX + diagram.element.offsetLeft, target.wrapper.offsetY + diagram.element.offsetTop - 25);
                    expect(diagram.nameTable["Businessworkflowlane10"].rowIndex == 1 && diagram.nameTable["Businessworkflowlane10"].columnIndex == 0 &&
                        diagram.nameTable["Businessworkflowlane20"].rowIndex == 1 && diagram.nameTable["Businessworkflowlane20"].columnIndex == 1).toBe(true);
                    expect(document.getElementById('BusinessworkflowswimHeader').getAttribute('x') == beforeX);
                    done();
                }, 300);
            });
        });
        describe('Preventing Phase copy', () => {
            let diagram: Diagram;
            let mouseEvents: MouseEvents = new MouseEvents();
            let ele: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramSwimlane1' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    height: 100,
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
                        offsetX: 420, offsetY: 270,
                        height: 100,
                        width: 200
                    },
                ];
                diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
                diagram.appendTo('#diagramSwimlane1');
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
    
            it('Preventing Phase Copy in diagram', (done: Function) => {
                let diagramCanvas = document.getElementById(diagram.element.id + 'content');
                let phase = diagram.nameTable["swimlanephase1_header"];
                let mouseEvents : MouseEvents = new MouseEvents();
                mouseEvents.mouseDownEvent(diagramCanvas,phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas,phase.wrapper.offsetX + diagram.element.offsetLeft, phase.wrapper.offsetY + diagram.element.offsetTop);
                diagram.copy();
                diagram.paste();
                expect(diagram.nodes.length === 4).toBe(true);
                done();
            });
    
        });
         describe('swimlane delete constraints ', () => {
            let diagram: Diagram;
            let mouseEvents: MouseEvents = new MouseEvents();
            let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
            ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
            '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
            let ele: HTMLElement;
            beforeAll((): void => {
                ele = createElement('div', { id: 'diagramSwimlane1' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
                                height: 50, style: { fontSize: 11 },
                                orientation: 'Horizontal',
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
                                            constraints: NodeConstraints.Default &~ NodeConstraints.Delete,
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
                                    id: 'phase1', offset: 170,
                                    header: { content: { content: 'Phase' } }
                                },
                                {
                                    id: 'phase2', offset: 450,
                                    header: { content: { content: 'Phase' } }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 420, offsetY: 270,
                        height: 100,
                        width: 650
                    },
                ];
                diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
                diagram.appendTo('#diagramSwimlane1');
            });
            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });

            it('style change and serilaziation', (done: Function) => {
                let diagramCanvas = document.getElementById(diagram.element.id + 'content');
                diagram.select([diagram.nameTable["swimlanestackCanvas1_0_header"]]);
                diagram.selectedItems.nodes[0].annotations[0].style.color = "red";
                diagram.dataBind()
                let savedDiagram: string = diagram.saveDiagram();
                diagram.loadDiagram(savedDiagram);

                expect(diagram.nameTable['swimlane'].shape.lanes[0].header.annotation.style.color === "red").toBe(true);
                done();
            });
            it('node constraint node not deleted', (done: Function) => {
                let diagramCanvas = document.getElementById(diagram.element.id + 'content');
                let phase = diagram.nameTable["swimlanephase1_header"];
                let mouseEvents : MouseEvents = new MouseEvents();
                mouseEvents.mouseDownEvent(diagramCanvas,275.5, 35.5 + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas,275.5, 35.5  + diagram.element.offsetTop);
                diagram.remove()
                expect(diagram.nodes.length === 1).toBe(true);
                done();
            });
    
        });
        describe('render multiple swimlane  ', () => {
           let diagram: Diagram;
           let mouseEvents: MouseEvents = new MouseEvents();
           let pathData = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
           ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
           '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
           let ele: HTMLElement;
           beforeAll((): void => {
               ele = createElement('div', { id: 'diagramSwimlane1' });
               document.body.appendChild(ele);
               let nodes: NodeModel[] =  [
                {
                    id: 'swimlane',
                    shape: {
                        type: 'SwimLane',
                        header: {
                            annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
                            height: 50, style: { fontSize: 11 },
                            orientation: 'Horizontal',
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
                                        constraints: NodeConstraints.Default &~ NodeConstraints.Delete,
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
                                id: 'phase1', offset: 170,
                                header: { content: { content: 'Phase' } }
                            },
                            {
                                id: 'phase2', offset: 450,
                                header: { content: { content: 'Phase' } }
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 420, offsetY: 270,
                    height: 100,
                    width: 650
                }, {
                    id: 'swimlane1',
                    shape: {
                        type: 'SwimLane',
                        header: {
                            annotation: { content: 'ONLINE PURCHASE STATUS', style: { fill: '#111111' } },
                            height: 50, style: { fontSize: 11 },
                            orientation: 'Horizontal',
                        },
                        lanes: [
                            {
                                id: 'stackCanvas11',
                                header: {
                                    annotation: { content: 'CUSTOMER' }, width: 50,
                                    style: { fontSize: 11 }
                                },
                                height: 100,
                                children: [
                                    {
                                        id: 'Order1',
                                        shape: { type: 'Path', data: pathData },
                                        annotations: [
                                            {
                                                content: 'ORDER',
                                                style: { fontSize: 11 }
                                            }
                                        ],
                                        constraints: NodeConstraints.Default &~ NodeConstraints.Delete,
                                        margin: { left: 60, top: 20 },
                                        height: 40, width: 100
                                    }
                                ],
                            },
                            {
                                id: 'stackCanvas21',
                                header: {
                                    annotation: { content: 'ONLINE' }, width: 50,
                                    style: { fontSize: 11 }
                                },
                                height: 100,
                                children: [
                                    {
                                        id: 'selectItemaddcart1',
                                        annotations: [{ content: 'Select item\nAdd cart' }],
                                        margin: { left: 190, top: 20 },
                                        height: 40, width: 100
                                    },
                                    {
                                        id: 'paymentondebitcreditcard1',
                                        annotations: [{ content: 'Payment on\nDebit/Credit Card' }],
                                        margin: { left: 350, top: 20 },
                                        height: 40, width: 100
                                    }
                                ],
                            },
                            {
                                id: 'stackCanvas31',
                                header: {
                                    annotation: { content: 'SHOP' }, width: 50,
                                    style: { fontSize: 11 }
                                },
                                height: 100,
                                children: [
                                    {
                                        id: 'getmaildetailaboutorder1',
                                        annotations: [{ content: 'Get mail detail\nabout order' }],
                                        margin: { left: 190, top: 20 },
                                        height: 40, width: 100
                                    },
                                    {
                                        id: 'pakingitem1',
                                        annotations: [{ content: 'Paking item' }],
                                        margin: { left: 350, top: 20 },
                                        height: 40, width: 100
                                    }
                                ],
                            },
                            {
                                id: 'stackCanvas41',
                                header: {
                                    annotation: { content: 'DELIVERY' }, width: 50,
                                    style: { fontSize: 11 }
                                },
                                height: 100,
                                children: [
                                    {
                                        id: 'sendcourieraboutaddress1',
                                        annotations: [{ content: 'Send Courier\n about Address' }],
                                        margin: { left: 190, top: 20 },
                                        height: 40, width: 100
                                    },
                                    {
                                        id: 'deliveryonthataddress1',
                                        annotations: [{ content: 'Delivery on that\n Address' }],
                                        margin: { left: 350, top: 20 },
                                        height: 40, width: 100
                                    },
                                    {
                                        id: 'getitItem1',
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
                                id: 'phase11', offset: 170,
                                header: { content: { content: 'Phase' } }
                            },
                            {
                                id: 'phase21', offset: 450,
                                header: { content: { content: 'Phase' } }
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 420, offsetY: 270,
                    height: 100,
                    width: 650
                },
            ];
               diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
               diagram.appendTo('#diagramSwimlane1');
           });
           afterAll((): void => {
               diagram.destroy();
               ele.remove();
           });
   
           it('check with two swimlane', (done: Function) => {
            
               expect(diagram.nodes.length === 48).toBe(true);
               done();
               let savedString: string = diagram.saveDiagram();
               diagram.loadDiagram(savedString);
               expect(diagram.nodes.length === 48).toBe(true);
               done();
           });
   
       });
    });
    describe('Infinite loop ', () => {
        let diagram: Diagram;
        
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane1' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                getStartNode(),
                getOrdinaryNode('node1', 'Activity 1', 200, 100),
                getOrdinaryNode('node2', 'Activity 2', 350, 200),
                getOrdinaryNode('node3', 'Activity 3', 350, 100),
                getOrdinaryNode('node4', 'Activity 4', 500, 200),
                getEndNode('node5', 650, 200)
              ];
            
              let connectors: ConnectorModel[] = [
                get01Connector('connector1', 'node0', 'node1'),
                get01Connector('connector2', 'node0', 'node2'),
                get03Connector('connector3', 'node1', 'node2', 'Conditional'),
                get03Connector('connector4', 'node1', 'node3', 'Default'),
                get01Connector('connector5', 'node2', 'node4'),
              ];
            function getOrdinaryNode(nodeId:string, label:string, x:number, y:number): NodeModel {
                return {
                  id: nodeId,
                  offsetX: x,
                  offsetY: y,
                  width: 90,
                  height: 60,
                  annotations: [
                    {
                      content: label,
                      style: {
                        fontSize: 11,
                        textWrapping: 'WrapWithOverflow',
                        textOverflow: 'Ellipsis'
                      },
                      offset: { x: 0.5, y: 0.5 },
                      margin: { top: 7, right: 0, bottom: -8, left: 0 },
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
                            offset: x,
                            opacity: 0.1
                        },
                        {
                            color: '#d8ecdc',
                            offset: y,
                            opacity: 0.1
                        }
                      ],
                      type: 'Linear'
                    }
                  },
                  ports: [
                    {
                      id: 'left',
                      offset: { x: 0, y: 0.5 }
                    },
                    {
                      id: 'right',
                      offset: { x: 1, y: 0.5 }
                    },
                    {
                      id: 'top',
                      offset: { x: 0.5, y: 0 }
                    },
                    {
                      id: 'bottom',
                      offset: { x: 0.5, y: 1 }
                    }
                  ]
                };
              }
              function getStartNode(): NodeModel {
                return {
                  id: 'node0',
                  offsetX: 100,
                  offsetY: 300,
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
                  },
                  ports: [
                    { id: 'right', offset: { x: 1, y: 0.5 } },
                    { id: 'bottom', offset: { x: 0.5, y: 1 } }
                  ]
                };
              }
              function getEndNode(nodeId: string, x: number, y: number): NodeModel {
                return {
                  id: nodeId,
                  offsetX: x,
                  offsetY: y,
                  width: 30,
                  height: 30,
                  annotations: [{
                    content: 'End',
                    margin: { bottom: -30 }
                  }],
                  shape: {
                    type: 'Bpmn',
                    shape: 'Event',
                    event: {
                      event: 'End',
                      trigger: 'None'
                    }
                  },
                  style: {
                    strokeColor: '#FF0000',
                    strokeWidth: 1
                  },
                  ports: [
                    { id: 'left', offset: { x: 0, y: 0.5 } },
                    { id: 'top', offset: { x: 0.5, y: 0 } }
                  ]
                };
              }
              function get01Connector(conId:string, source:string, target:string): ConnectorModel {
                return {
                  id: conId,
                  sourceID: source,
                  targetID: target,
                  sourcePortID: 'right',
                  targetPortID: 'left',
                  /*shape: {
                    type: 'Bpmn',
                    flow: 'Sequence',
                    sequence: 'Default'
                  },*/
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
                };
              }
              function get03Connector(conId:string, source:string, target:string, sequence:BpmnSequenceFlows): ConnectorModel {
                return {
                  id: conId,
                  sourceID: source,
                  targetID: target,
                  sourcePortID: 'right',
                  targetPortID: 'left',
                  shape: {
                    type: 'Bpmn',
                    flow: 'Sequence',
                    sequence: sequence
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
                };
              }
              let layout: LayoutModel = {
                horizontalAlignment: 'Left',
                verticalAlignment: 'Top',
                orientation: 'LeftToRight',
                type: 'ComplexHierarchicalTree'
              };
            
              let snapSettings: SnapSettingsModel = {
                constraints: SnapConstraints.None,
                horizontalGridlines: {
                    lineDashArray: '2 2',
                    lineIntervals: [1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75,
                     0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75],
                },
                verticalGridlines: {
                    lineDashArray: '2 2',
                    lineIntervals: [1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75,
                     0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75],
                }
              };
            
              let scrollSettings: ScrollSettingsModel = {
                canAutoScroll: true,
                scrollLimit: 'Infinity',

                padding: { left: 0, top: 0, right: 10, bottom: 0 }
            };
            let constraints: DiagramConstraints = DiagramConstraints.Default | DiagramConstraints.LineRouting | DiagramConstraints.Bridging;
            let handles: UserHandleModel[] = [
                {
                  name: 'arrow',
                  pathData: 'M4,11v2h8v7l8-8L12,4v7Z',
                  visible: true,
                  offset: 0.5,
                  side: 'Top',
                  pathColor: 'black',
                  backgroundColor: 'transparent',
                  size: 32,
                  margin: {top: 12, bottom: 0, left: 0, right: 0}
                },
                {
                  name: 'Delete',
                  pathData: `M 0, 0 c -3.201999999999998,-2.8130000000000006,-8.105999999999995,-2.455,-11.119,
                          0.5579999999999998l-34.179,34.205l-34.337,-34.362c-3.093,-3.0920000000000005,-8.108,-3.0920000000000005,-11.201,
                          0l-0.11299999999999956,0.11299999999999956c-3.093,3.093,-3.093,8.107,0,11.201l34.341,34.366l-34.34,34.366c-3.093,
                          3.0930000000000035,-3.093,8.108000000000004,0,11.201000000000008l0.11299999999999956,0.11299999999999956c3.093,
                          3.0930000000000035,8.107,3.0930000000000035,11.201,0l34.337,-34.363l34.17900000000001,34.205c3.0130000000000052,
                          3.0130000000000052,7.917000000000002,3.3700000000000045,11.119,0.5580000000000069c3.507000000000005,
                          -3.081000000000003,3.6370000000000005,-8.429000000000002,0.38800000000000534,-11.677999999999997l-34.37899999999999,
                          -34.403l34.37700000000001,-34.404c3.25,-3.2489999999999988,3.1200000000000045,-8.596,-0.38800000000000534,-11.677Z`,
                  visible: true,
                  offset: 1,
                  side: 'Top',
                  pathColor: 'black',
                  backgroundColor: 'none',
                  size: 30,
                  margin: {top: 12, bottom: 0, left: 0, right: 0}
                },
                {
                  name: 'node',
                  pathData: 'M17.75,13.89H2.5a2,2,0,0,1-2-2V2.5a2,2,0,0,1,2-2H17.75a2,2,0,0,1,2,2v9.39A2,2,0,0,1,17.75,13.89Z',
                  visible: true,
                  offset: 0,
                  side: 'Right',
                  pathColor: '#e9f8ff',
                  backgroundColor: 'none',
                  size: 35,
                  margin: {top: 0, bottom: 0, left: 0, right: 12}
                },
                {
                  name: 'decision',
                  pathData: 'M19.94,11.93l-8,8a2,2,0,0,1-2.83,0l-8-8a2,2,0,0,1,0-2.83l8-8a2,2,0,0,1,2.83,0l8,8A2,2,0,0,1,19.94,11.93Z',
                  visible: true,
                  offset: 0.5,
                  side: 'Right',
                  pathColor: '#fff6df',
                  backgroundColor: 'none',
                  size: 35,
                  margin: {top: 0, bottom: 0, left: 0, right: 12}
                },
                {
                  name: 'end',
                  pathData: 'M16.92,8.71A8.21,8.21,0,1,1,8.71.5,8.21,8.21,0,0,1,16.92,8.71Z',
                  visible: true,
                  offset: 1,
                  side: 'Right',
                  pathColor: '#ffedef',
                  backgroundColor: 'none',
                  size: 35,
                  margin: {top: 0, bottom: 0, left: 0, right: 12}
                },
                {
                  name: 'attachment',
                  pathData: 'M11,9h5.5L11,3.5V9M4,2h8l6,6V20a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2M9,4H4V20H16V11H9Z',
                  visible: true,
                  offset: 0.5,
                  side: 'Bottom',
                  pathColor: '#5a5a64',
                  backgroundColor: 'none',
                  size: 35,
                  margin: {top: 0, bottom: 12, left: 0, right: 0}
                },
                {
                  name: 'annotation',
                  pathData: `M8,11h8v2H8Zm8-4H8V9h8Zm0,8H8v2h8ZM18,2H10V4h8V20H10v2h8a2,2,0,0,0,2-2V4A2,2,0,0,0,18,2ZM6,4H8V2H6A2,2,0,0,0,4,4v6L2,12l2,
                            2v6a2,2,0,0,0,2,2H8V20H6Z`,
                  visible: true,
                  offset: 1,
                  side: 'Bottom',
                  pathColor: '#5a5a64',
                  backgroundColor: 'none',
                  size: 35,
                  margin: {top: 0, bottom: 12, left: 0, right: 0}
                }
              ];
              let selectedItems: SelectorModel = {
                constraints: SelectorConstraints.UserHandle,
                userHandles: handles
              };
              let commandManager: any;
              
              let _userHandles: UserHandleModel[] = JSON.parse(JSON.stringify(handles));
              function selectionChanged(event: ISelectionChangeEventArgs): void {
                if (event.state === 'Changed') {
                  if (event.newValue.length > 0) {
                    let node = null;
                    if (event.newValue[0].addInfo) {
                      node = (event.newValue[0].addInfo as any).getDiagramNode();
                    }
            
                    if (event.newValue[0].id === '0') {
                      handles[1].visible = false;
                    handles[3].offset = 1;
                      handles[4].visible = false;
                      handles[6].offset = 0;
                    } else {
                      // tslint:disable
                      event.newValue[0].constraints = NodeConstraints.Default & ~NodeConstraints.Rotate;
                      // tslint:enable
                      handles = JSON.parse(JSON.stringify(_userHandles));
                    }
                  }
            
                  selectedItems = {
                    constraints: SelectorConstraints.UserHandle,
                    userHandles: handles
                  };
                }
              }
              function loadJson(): void {
                // this.diagram.clear();
                diagram.loadDiagram(`{
                  "enableRtl": false,
                  "locale": "en-US",
                  "animationComplete": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "click": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "collectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "commandExecute": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "connectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "contextMenuBeforeItemRender": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "contextMenuClick": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "contextMenuOpen": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "created": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "dataLoaded": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "doubleClick": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "dragEnter": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "dragLeave": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "dragOver": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "drop": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "expandStateChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "historyChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "historyStateChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "keyDown": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "keyUp": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "mouseEnter": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "mouseLeave": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "mouseOver": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "onImageLoad": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "onUserHandleMouseDown": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "onUserHandleMouseEnter": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "onUserHandleMouseLeave": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "onUserHandleMouseUp": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "positionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "propertyChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "rotateChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "scrollChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "segmentCollectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "selectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "sizeChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "sourcePointChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "targetPointChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "textEdit": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "__isAsync": false },
                  "commandManager": {
                      "commands": [
                          { "name": "undo", "parameter": "node", "canExecute": {}, "execute": {}, "gesture": { "key": 90, "keyModifiers": 1 } },
                          { "name": "redo", "parameter": "node", "canExecute": {}, "execute": {}, "gesture": { "key": 89, "keyModifiers": 1 } },
                          { "name": "copy", "parameter": "node", "canExecute": {}, "execute": {}, "gesture": { "key": 67, "keyModifiers": 1 } },
                          { "name": "cut", "parameter": "node", "canExecute": {}, "execute": {}, "gesture": { "key": 88, "keyModifiers": 1 } },
                          { "name": "paste", "parameter": "node", "canExecute": {}, "gesture": { "key": 86, "keyModifiers": 1 } },
                          { "name": "delete", "parameter": "node", "canExecute": {}, "execute": {}, "gesture": {} }
                      ]
                  },
                  "connectors": [
                      {
                          "id": "node0-node1",
                          "sourceID": "node0",
                          "sourceDecorator": {
                              "shape": "None",
                              "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                              "width": 10,
                              "height": 10,
                              "pivot": { "x": 0, "y": 0.5 }
                          },
                          "targetID": "node1",
                          "cornerRadius": 10,
                          "targetDecorator": {
                              "shape": "Arrow",
                              "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                              "height": 8,
                              "width": 10,
                              "pivot": { "x": 0, "y": 0.5 }
                          },
                          "type": "Orthogonal",
                          "constraints": 486150,
                          "sourcePortID": "right",
                          "targetPortID": "left",
                          "shape": { "type": "None" },
                          "zIndex": 13,
                          "sourcePoint": { "x": 175, "y": 127.5 },
                          "targetPoint": { "x": 285, "y": 127.5 },
                          "sourcePadding": 0,
                          "targetPadding": 0,
                          "segments": [{ "type": "Orthogonal", "length": null, "direction": null }],
                          "wrapper": { "actualSize": { "width": 110, "height": 0 }, "offsetX": 230, "offsetY": 127.5 },
                          "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                          "annotations": [],
                          "visible": true,
                          "bridgeSpace": 10,
                          "parentId": ""
                      },
                      {
                          "id": "node1-node2",
                          "sourceID": "node1",
                          "sourceDecorator": {
                              "shape": "None",
                              "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                              "width": 10,
                              "height": 10,
                              "pivot": { "x": 0, "y": 0.5 }
                          },
                          "targetID": "node2",
                          "cornerRadius": 10,
                          "targetDecorator": {
                              "shape": "Arrow",
                              "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                              "height": 8,
                              "width": 10,
                              "pivot": { "x": 0, "y": 0.5 }
                          },
                          "type": "Orthogonal",
                          "constraints": 486150,
                          "sourcePortID": "right",
                          "targetPortID": "left",
                          "shape": { "type": "None" },
                          "zIndex": 14,
                          "sourcePoint": { "x": 375, "y": 127.5 },
                          "targetPoint": { "x": 425, "y": 127.5 },
                          "sourcePadding": 0,
                          "targetPadding": 0,
                          "segments": [{ "type": "Orthogonal", "length": null, "direction": null }],
                          "wrapper": { "actualSize": { "width": 50, "height": 0 }, "offsetX": 400, "offsetY": 127.5 },
                          "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                          "annotations": [],
                          "visible": true,
                          "bridgeSpace": 10,
                          "hitPadding": 10,
                          "parentId": ""
                      }
                  ],
                  "constraints": 2550,
                  "getCustomTool": {},
                  "height": "100%",
                  "nodes": [
                      {
                          "id": "node3ABD5B643E43C09B1476DABD3DC49908",
                          "offsetX": 702,
                          "offsetY": 125,
                          "width": 1354,
                          "height": 225,
                          "backgroundColor": "transparent",
                          "style": { "fill": "white", "strokeWidth": 2, "strokeColor": "#778899", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                          "shape": {
                              "type": "SwimLane",
                              "header": {
                                  "style": { "fill": "#E7F4FF", "strokeColor": "#CCCCCC", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                                  "annotation": { "id": "aqPPB", "content": "New process", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent" } },
                                  "height": 25,
                                  "id": "pCf0X"
                              },
                              "phaseSize": 0,
                              "lanes": [
                                  {
                                      "id": "F2825CD4428DBB1954F509995CB3DA09",
                                      "height": 200,
                                      "style": { "fill": "transparent", "strokeColor": "#CCCCCC", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                                      "header": {
                                          "style": { "fill": "#E7F4FF", "strokeColor": "#CCCCCC", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                                          "annotation": { "id": "cKdbG", "content": "Lane1", "style": { "strokeWidth": 0, "strokeColor": "transparent", "fill": "transparent", "textWrapping": "NoWrap", "textOverflow": "Ellipsis" } },
                                          "width": 25,
                                          "height": 600,
                                          "id": "node3ABD5B643E43C09B1476DABD3DC49908F2825CD4428DBB1954F509995CB3DA09_0_header"
                                      },
                                      "children": [
                                          {
                                              "shape": { "type": "Bpmn", "shape": "Event", "event": { "event": "Start", "trigger": "None" }, "activity": { "subProcess": {} }, "annotations": [] },
                                              "id": "node0",
                                              "width": 30,
                                              "height": 30,
                                              "annotations": [
                                                  {
                                                      "id": "node0-label",
                                                      "content": "Start",
                                                      "horizontalAlignment": "Center",
                                                      "verticalAlignment": "Top",
                                                      "style": {
                                                          "strokeWidth": 0,
                                                          "strokeColor": "transparent",
                                                          "fill": "transparent",
                                                          "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                                                          "fontSize": 11,
                                                          "textOverflow": "Wrap",
                                                          "textWrapping": "WrapWithOverflow",
                                                          "whiteSpace": "CollapseSpace",
                                                          "bold": false,
                                                          "color": "black",
                                                          "italic": false,
                                                          "opacity": 1,
                                                          "strokeDashArray": "",
                                                          "textAlign": "Center",
                                                          "textDecoration": "None"
                                                      },
                                                      "offset": { "x": 0.5, "y": 1 },
                                                      "margin": { "left": 0, "top": 2, "right": 0, "bottom": 0 },
                                                      "constraints": 0,
                                                      "annotationType": "String",
                                                      "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                                                      "visibility": true,
                                                      "rotateAngle": 0
                                                  }
                                              ],
                                              "offsetX": 160,
                                              "offsetY": 127.5,
                                              "style": { "fill": "#FFFFFF", "strokeColor": "#62A716", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                                              "constraints": 38795174,
                                              "addInfo": {
                                                  "node": {
                                                      "__type": "StartNode:http://www.kofax.com/agility/services/sdk",
                                                      "Identity": { "NodeType": 5, "Id": 0, "Name": "Start" },
                                                      "ResetLimit": -1,
                                                      "ActivityTimedOutAction": 0,
                                                      "Annotations": [],
                                                      "Allocate": false,
                                                      "AppendAssociatedFile": false,
                                                      "Attachments": [],
                                                      "Automatic": false,
                                                      "AvailableFireEvent": {},
                                                      "CollaborationNodes": [],
                                                      "CompletedFireEvent": {},
                                                      "Dependants": [],
                                                      "Destinations": [{ "Identity": { "NodeType": 1, "Id": 1, "Name": "Activity 1" }, "EmbeddedProcess": {} }],
                                                      "EmbeddedProcessCount": 0,
                                                      "ExpectedCost": 0,
                                                      "ActivationProbability": 100,
                                                      "Origins": [],
                                                      "Priority": 1,
                                                      "SecurityLevel": 10,
                                                      "SkillLevel": 10,
                                                      "FixedCost": 0,
                                                      "MilestoneAvailable": { "Identity": {} },
                                                      "MilestoneCompleted": { "Identity": {} },
                                                      "NodeColorGroup": 0,
                                                      "InheritNodeGroupColorFromSystem": true,
                                                      "States": [],
                                                      "SwimLane": { "Height": 600, "Index": 0, "Name": "Lane1", "PoolId": "3ABD5B643E43C09B1476DABD3DC49908" },
                                                      "TitlePosition": 0,
                                                      "TextPosition": 0,
                                                      "StartNodeEventType": 0,
                                                      "EndNodeEventType": 0,
                                                      "GroupArtifacts": [],
                                                      "MFPReady": 0,
                                                      "DesignTimeType": 0,
                                                      "NodeType": 5,
                                                      "Color": "#62A716",
                                                      "Width": 30,
                                                      "Height": 30,
                                                      "XPosition": 45,
                                                      "YPosition": 414.5,
                                                      "Process": {
                                                          "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                                                          "Author": {},
                                                          "CaptureEnabled": false,
                                                          "Category": { "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk", "Id": "201F370CA5164F76ADDD8EEEFF666AF7", "Name": "Default Category" },
                                                          "ExpectedCost": 0,
                                                          "ExpectedDuration": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                          "Identity": { "Id": "51377FB0CA851FAC41F6D8C932B136B0", "Version": 0.01, "Name": "New process" },
                                                          "LastModified": {},
                                                          "LastModifiedDate": {},
                                                          "LatestVersion": true,
                                                          "LockedBy": {},
                                                          "ProcessType": 0,
                                                          "SupportsSkinning": false,
                                                          "Synchronous": false,
                                                          "Version": 0.01
                                                      },
                                                      "ThreadPool": { "Id": 0, "Name": "Default Thread Pool" }
                                                  }
                                              },
                                              "ports": [
                                                  {
                                                      "inEdges": [],
                                                      "outEdges": ["node0-node1"],
                                                      "id": "right",
                                                      "offset": { "x": 1, "y": 0.5 },
                                                      "visibility": 2,
                                                      "height": 12,
                                                      "width": 12,
                                                      "shape": "Square",
                                                      "margin": { "right": 0, "bottom": 0, "left": 0, "top": 0 },
                                                      "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 },
                                                      "horizontalAlignment": "Center",
                                                      "verticalAlignment": "Center",
                                                      "constraints": 24
                                                  },
                                                  {
                                                      "inEdges": [],
                                                      "outEdges": [],
                                                      "id": "bottom",
                                                      "offset": { "x": 0.5, "y": 1 },
                                                      "visibility": 2,
                                                      "height": 12,
                                                      "width": 12,
                                                      "shape": "Square",
                                                      "margin": { "right": 0, "bottom": 0, "left": 0, "top": 0 },
                                                      "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 },
                                                      "horizontalAlignment": "Center",
                                                      "verticalAlignment": "Center",
                                                      "constraints": 24
                                                  }
                                              ],
                                              "margin": { "left": 120, "top": 75, "right": 0, "bottom": 0 },
                                              "zIndex": 10,
                                              "container": null,
                                              "visible": true,
                                              "horizontalAlignment": "Left",
                                              "verticalAlignment": "Top",
                                              "backgroundColor": "transparent",
                                              "borderColor": "none",
                                              "borderWidth": 0,
                                              "rotateAngle": 0,
                                              "pivot": { "x": 0.5, "y": 0.5 },
                                              "flip": "None",
                                              "wrapper": { "actualSize": { "width": 30, "height": 30 }, "offsetX": 160, "offsetY": 127.5 },
                                              "isExpanded": true,
                                              "expandIcon": { "shape": "None" },
                                              "inEdges": [],
                                              "outEdges": ["node0-node1"],
                                              "parentId": "node3ABD5B643E43C09B1476DABD3DC49908F2825CD4428DBB1954F509995CB3DA090",
                                              "processId": "",
                                              "umlIndex": -1,
                                              "isPhase": false,
                                              "isLane": false
                                          },
                                          {
                                              "shape": {
                                                  "shape": "Activity",
                                                  "type": "Bpmn",
                                                  "activity": { "activity": "Task", "task": { "type": "User", "call": false, "compensation": false, "loop": "None" }, "subProcess": { "type": "None" } },
                                                  "annotations": []
                                              },
                                              "id": "node1",
                                              "width": 90,
                                              "height": 60,
                                              "annotations": [
                                                  {
                                                      "id": "node1-label",
                                                      "content": "Activity 1",
                                                      "style": {
                                                          "strokeWidth": 0,
                                                          "strokeColor": "transparent",
                                                          "fill": "transparent",
                                                          "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                                                          "fontSize": 11,
                                                          "textOverflow": "Wrap",
                                                          "textWrapping": "WrapWithOverflow",
                                                          "whiteSpace": "CollapseSpace",
                                                          "color": "#000000",
                                                          "bold": false,
                                                          "italic": false,
                                                          "opacity": 1,
                                                          "strokeDashArray": "",
                                                          "textAlign": "Center",
                                                          "textDecoration": "None"
                                                      },
                                                      "offset": { "x": 0.5, "y": 0.5 },
                                                      "margin": { "top": 10, "right": 2, "bottom": 3, "left": 2 },
                                                      "constraints": 0,
                                                      "annotationType": "String",
                                                      "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                                                      "visibility": true,
                                                      "rotateAngle": 0,
                                                      "horizontalAlignment": "Center",
                                                      "verticalAlignment": "Center"
                                                  }
                                              ],
                                              "offsetX": 330,
                                              "offsetY": 127.5,
                                              "style": { "fill": "#E3EDF3", "strokeColor": "#7fadc8", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                                              "constraints": 38795238,
                                              "addInfo": {
                                                  "node": {
                                                      "__type": "OrdinaryActivity:http://www.kofax.com/agility/services/sdk",
                                                      "Notification": {
                                                          "AppendAssociatedFile": false,
                                                          "ContentText": "",
                                                          "ContentVariable": null,
                                                          "SendEmail": false,
                                                          "SendTo": 0,
                                                          "SubjectText": "",
                                                          "SubjectVariable": null,
                                                          "UrlText": "",
                                                          "UrlVariable": null
                                                      },
                                                      "PreconditionInputs": [],
                                                      "UsePreviousUser": false,
                                                      "Resources": {
                                                          "AdvanceWorkflowRules": {
                                                              "ConcurrentActivityAccess": false,
                                                              "ExitCondition": null,
                                                              "ExpandGroupResources": false,
                                                              "NeedsValidated": false,
                                                              "NoOfResourcesRequired": 0,
                                                              "NoOfResourcesRequiredValue": 0,
                                                              "NoOfResourcesRequiredVariable": { "Id": "", "Name": "" },
                                                              "SequentialActivityAssignment": false,
                                                              "UseAdvanceWorkflowRules": false,
                                                              "UseExcludedResources": false,
                                                              "UseExitCondition": false,
                                                              "UseResourceSettings": false
                                                          },
                                                          "DynamicResourcesOverwriteStatic": false,
                                                          "RequiredResources": [],
                                                          "UsableResources": [
                                                              {
                                                                  "Dynamic": false,
                                                                  "DynamicResourceVariable": null,
                                                                  "Excluded": false,
                                                                  "SequentialOrder": 1,
                                                                  "StaticResource": { "Id": "7DF43CCDF24611D2804B00104B71BD15", "ResourceType": 3, "Name": "Everyone", "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk" },
                                                                  "__type": "ActivityResource:http://www.kofax.com/agility/services/sdk"
                                                              }
                                                          ]
                                                      },
                                                      "BusinessEvents": [],
                                                      "DueDateTriggers": [],
                                                      "HasDueDateTriggers": false,
                                                      "InputVariables": [],
                                                      "OutputVariables": [],
                                                      "LagDuration": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                      "Identity": { "NodeType": 1, "Id": 1, "Name": "Activity 1" },
                                                      "ResetLimit": -1,
                                                      "ActivityTimedOutAction": 0,
                                                      "Annotations": [],
                                                      "Allocate": false,
                                                      "AppendAssociatedFile": false,
                                                      "Attachments": [],
                                                      "Automatic": false,
                                                      "AvailableFireEvent": {},
                                                      "CollaborationNodes": [],
                                                      "CompletedFireEvent": {},
                                                      "Dependants": [],
                                                      "Destinations": [{ "Identity": { "NodeType": 6, "Id": 2, "Name": "End" }, "EmbeddedProcess": {} }],
                                                      "EmbeddedProcessCount": 0,
                                                      "ExpectedCost": 0,
                                                      "ActivationProbability": 100,
                                                      "Origins": [{ "Identity": { "NodeType": 5, "Id": 0, "Name": "Start" }, "EmbeddedProcess": {} }],
                                                      "Priority": 1,
                                                      "SecurityLevel": 10,
                                                      "SkillLevel": 10,
                                                      "FixedCost": 0,
                                                      "MilestoneAvailable": { "Identity": {} },
                                                      "MilestoneCompleted": { "Identity": {} },
                                                      "NodeColorGroup": 1,
                                                      "InheritNodeGroupColorFromSystem": true,
                                                      "States": [],
                                                      "SwimLane": { "Height": 600, "Index": 0, "Name": "Lane1", "PoolId": "3ABD5B643E43C09B1476DABD3DC49908" },
                                                      "TitlePosition": 0,
                                                      "TextPosition": 0,
                                                      "StartNodeEventType": 0,
                                                      "EndNodeEventType": 0,
                                                      "GroupArtifacts": [],
                                                      "MFPReady": 0,
                                                      "DesignTimeType": 1,
                                                      "NodeType": 1,
                                                      "Rag": {
                                                          "SlaStatus2Threshold": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                          "SlaStatus3Threshold": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                          "SlaStatus4Threshold": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                          "SlaStatus5Threshold": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 }
                                                      },
                                                      "TargetDuration": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                      "Width": 90,
                                                      "Height": 60,
                                                      "XPosition": 185,
                                                      "YPosition": 414.5,
                                                      "Color": "#FFE3EDF3",
                                                      "Process": {
                                                          "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                                                          "Author": {},
                                                          "CaptureEnabled": false,
                                                          "Category": { "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk", "Id": "201F370CA5164F76ADDD8EEEFF666AF7", "Name": "Default Category" },
                                                          "ExpectedCost": 0,
                                                          "ExpectedDuration": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                          "Identity": { "Id": "51377FB0CA851FAC41F6D8C932B136B0", "Version": 0.01, "Name": "New process" },
                                                          "LastModified": {},
                                                          "LastModifiedDate": {},
                                                          "LatestVersion": true,
                                                          "LockedBy": {},
                                                          "ProcessType": 0,
                                                          "SupportsSkinning": false,
                                                          "Synchronous": false,
                                                          "Version": 0.01
                                                      },
                                                      "ThreadPool": { "Id": 0, "Name": "Default Thread Pool" },
                                                      "IsAfterStartNode": true,
                                                      "ShouldTrackVariableChanges": false
                                                  }
                                              },
                                              "ports": [
                                                  {
                                                      "inEdges": ["node0-node1"],
                                                      "outEdges": [],
                                                      "id": "left",
                                                      "offset": { "x": 0, "y": 0.5 },
                                                      "visibility": 2,
                                                      "height": 12,
                                                      "width": 12,
                                                      "shape": "Square",
                                                      "margin": { "right": 0, "bottom": 0, "left": 0, "top": 0 },
                                                      "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 },
                                                      "horizontalAlignment": "Center",
                                                      "verticalAlignment": "Center",
                                                      "constraints": 24
                                                  },
                                                  {
                                                      "inEdges": [],
                                                      "outEdges": [],
                                                      "id": "top",
                                                      "offset": { "x": 0.5, "y": 0 },
                                                      "visibility": 2,
                                                      "height": 12,
                                                      "width": 12,
                                                      "shape": "Square",
                                                      "margin": { "right": 0, "bottom": 0, "left": 0, "top": 0 },
                                                      "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 },
                                                      "horizontalAlignment": "Center",
                                                      "verticalAlignment": "Center",
                                                      "constraints": 24
                                                  },
                                                  {
                                                      "inEdges": [],
                                                      "outEdges": ["node1-node2"],
                                                      "id": "right",
                                                      "offset": { "x": 1, "y": 0.5 },
                                                      "visibility": 2,
                                                      "height": 12,
                                                      "width": 12,
                                                      "shape": "Square",
                                                      "margin": { "right": 0, "bottom": 0, "left": 0, "top": 0 },
                                                      "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 },
                                                      "horizontalAlignment": "Center",
                                                      "verticalAlignment": "Center",
                                                      "constraints": 24
                                                  },
                                                  {
                                                      "inEdges": [],
                                                      "outEdges": [],
                                                      "id": "bottom",
                                                      "offset": { "x": 0.5, "y": 1 },
                                                      "visibility": 2,
                                                      "height": 12,
                                                      "width": 12,
                                                      "shape": "Square",
                                                      "margin": { "right": 0, "bottom": 0, "left": 0, "top": 0 },
                                                      "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 },
                                                      "horizontalAlignment": "Center",
                                                      "verticalAlignment": "Center",
                                                      "constraints": 24
                                                  }
                                              ],
                                              "margin": { "left": 260, "top": 60, "right": 0, "bottom": 0 },
                                              "zIndex": 11,
                                              "container": null,
                                              "visible": true,
                                              "horizontalAlignment": "Left",
                                              "verticalAlignment": "Top",
                                              "backgroundColor": "transparent",
                                              "borderColor": "none",
                                              "borderWidth": 0,
                                              "rotateAngle": 0,
                                              "pivot": { "x": 0.5, "y": 0.5 },
                                              "flip": "None",
                                              "wrapper": { "actualSize": { "width": 90, "height": 60 }, "offsetX": 330, "offsetY": 127.5 },
                                              "isExpanded": true,
                                              "expandIcon": { "shape": "None" },
                                              "inEdges": ["node0-node1"],
                                              "outEdges": ["node1-node2"],
                                              "parentId": "node3ABD5B643E43C09B1476DABD3DC49908F2825CD4428DBB1954F509995CB3DA090",
                                              "processId": "",
                                              "umlIndex": -1,
                                              "isPhase": false,
                                              "isLane": false
                                          },
                                          {
                                              "shape": { "type": "Bpmn", "shape": "Event", "event": { "event": "End", "trigger": "None" }, "activity": { "subProcess": {} }, "annotations": [] },
                                              "id": "node2",
                                              "width": 30,
                                              "height": 30,
                                              "annotations": [
                                                  {
                                                      "id": "node2-label",
                                                      "content": "End",
                                                      "horizontalAlignment": "Center",
                                                      "verticalAlignment": "Top",
                                                      "style": {
                                                          "strokeWidth": 0,
                                                          "strokeColor": "transparent",
                                                          "fill": "transparent",
                                                          "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                                                          "fontSize": 11,
                                                          "textOverflow": "Wrap",
                                                          "textWrapping": "WrapWithOverflow",
                                                          "whiteSpace": "CollapseSpace",
                                                          "bold": false,
                                                          "color": "black",
                                                          "italic": false,
                                                          "opacity": 1,
                                                          "strokeDashArray": "",
                                                          "textAlign": "Center",
                                                          "textDecoration": "None"
                                                      },
                                                      "offset": { "x": 0.5, "y": 1 },
                                                      "margin": { "left": 0, "top": 2, "right": 0, "bottom": 0 },
                                                      "constraints": 0,
                                                      "annotationType": "String",
                                                      "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                                                      "visibility": true,
                                                      "rotateAngle": 0
                                                  }
                                              ],
                                              "offsetX": 440,
                                              "offsetY": 127.5,
                                              "style": { "fill": "#FFFFFF", "strokeColor": "#9b0000", "strokeWidth": 4, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                                              "constraints": 38795238,
                                              "addInfo": {
                                                  "node": {
                                                      "__type": "EndNode:http://www.kofax.com/agility/services/sdk",
                                                      "Identity": { "NodeType": 6, "Id": 2, "Name": "End" },
                                                      "ResetLimit": -1,
                                                      "ActivityTimedOutAction": 0,
                                                      "Annotations": [],
                                                      "Allocate": false,
                                                      "AppendAssociatedFile": false,
                                                      "Attachments": [],
                                                      "Automatic": false,
                                                      "AvailableFireEvent": {},
                                                      "CollaborationNodes": [],
                                                      "CompletedFireEvent": {},
                                                      "Dependants": [],
                                                      "Destinations": [],
                                                      "EmbeddedProcessCount": 0,
                                                      "ExpectedCost": 0,
                                                      "ActivationProbability": 100,
                                                      "Origins": [{ "Identity": { "NodeType": 1, "Id": 1, "Name": "Activity 1" }, "EmbeddedProcess": {} }],
                                                      "Priority": 1,
                                                      "SecurityLevel": 10,
                                                      "SkillLevel": 10,
                                                      "FixedCost": 0,
                                                      "MilestoneAvailable": { "Identity": {} },
                                                      "MilestoneCompleted": { "Identity": {} },
                                                      "NodeColorGroup": 0,
                                                      "InheritNodeGroupColorFromSystem": true,
                                                      "States": [],
                                                      "SwimLane": { "Height": 600, "Index": 0, "Name": "Lane1", "PoolId": "3ABD5B643E43C09B1476DABD3DC49908" },
                                                      "TitlePosition": 0,
                                                      "TextPosition": 0,
                                                      "StartNodeEventType": 0,
                                                      "EndNodeEventType": 0,
                                                      "GroupArtifacts": [],
                                                      "MFPReady": 0,
                                                      "DesignTimeType": 0,
                                                      "NodeType": 6,
                                                      "Color": "#FF9B0000",
                                                      "Width": 30,
                                                      "Height": 30,
                                                      "XPosition": 325,
                                                      "YPosition": 414.5,
                                                      "Process": {
                                                          "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                                                          "Author": {},
                                                          "CaptureEnabled": false,
                                                          "Category": { "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk", "Id": "201F370CA5164F76ADDD8EEEFF666AF7", "Name": "Default Category" },
                                                          "ExpectedCost": 0,
                                                          "ExpectedDuration": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                          "Identity": { "Id": "51377FB0CA851FAC41F6D8C932B136B0", "Version": 0.01, "Name": "New process" },
                                                          "LastModified": {},
                                                          "LastModifiedDate": {},
                                                          "LatestVersion": true,
                                                          "LockedBy": {},
                                                          "ProcessType": 0,
                                                          "SupportsSkinning": false,
                                                          "Synchronous": false,
                                                          "Version": 0.01
                                                      },
                                                      "ThreadPool": { "Id": 0, "Name": "Default Thread Pool" },
                                                      "ShouldTrackVariableChanges": false,
                                                      "Notification": {
                                                          "AppendAssociatedFile": false,
                                                          "ContentText": "",
                                                          "ContentVariable": null,
                                                          "SendEmail": false,
                                                          "SendTo": 0,
                                                          "SubjectText": "",
                                                          "SubjectVariable": null,
                                                          "UrlText": "",
                                                          "UrlVariable": null
                                                      }
                                                  }
                                              },
                                              "ports": [
                                                  {
                                                      "inEdges": ["node1-node2"],
                                                      "outEdges": [],
                                                      "id": "left",
                                                      "offset": { "x": 0, "y": 0.5 },
                                                      "visibility": 2,
                                                      "height": 12,
                                                      "width": 12,
                                                      "shape": "Square",
                                                      "margin": { "right": 0, "bottom": 0, "left": 0, "top": 0 },
                                                      "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 },
                                                      "horizontalAlignment": "Center",
                                                      "verticalAlignment": "Center",
                                                      "constraints": 24
                                                  },
                                                  {
                                                      "inEdges": [],
                                                      "outEdges": [],
                                                      "id": "top",
                                                      "offset": { "x": 0.5, "y": 0 },
                                                      "visibility": 2,
                                                      "height": 12,
                                                      "width": 12,
                                                      "shape": "Square",
                                                      "margin": { "right": 0, "bottom": 0, "left": 0, "top": 0 },
                                                      "style": { "fill": "white", "strokeColor": "black", "opacity": 1, "strokeDashArray": "", "strokeWidth": 1 },
                                                      "horizontalAlignment": "Center",
                                                      "verticalAlignment": "Center",
                                                      "constraints": 24
                                                  }
                                              ],
                                              "margin": { "left": 400, "top": 75, "right": 0, "bottom": 0 },
                                              "zIndex": 12,
                                              "container": null,
                                              "visible": true,
                                              "horizontalAlignment": "Left",
                                              "verticalAlignment": "Top",
                                              "backgroundColor": "transparent",
                                              "borderColor": "none",
                                              "borderWidth": 0,
                                              "rotateAngle": 0,
                                              "pivot": { "x": 0.5, "y": 0.5 },
                                              "flip": "None",
                                              "wrapper": { "actualSize": { "width": 30, "height": 30 }, "offsetX": 440, "offsetY": 127.5 },
                                              "isExpanded": true,
                                              "expandIcon": { "shape": "None" },
                                              "inEdges": ["node1-node2"],
                                              "outEdges": [],
                                              "parentId": "node3ABD5B643E43C09B1476DABD3DC49908F2825CD4428DBB1954F509995CB3DA090",
                                              "processId": "",
                                              "umlIndex": -1,
                                              "isPhase": false,
                                              "isLane": false
                                          }
                                      ],
                                      "width": 100
                                  }
                              ],
                              "orientation": "Horizontal",
                              "phases": [],
                              "isLane": false,
                              "isPhase": false,
                              "hasHeader": true
                          },
                          "constraints": 22017646,
                          "addInfo": {
                              "node": {
                                  "Height": 600,
                                  "Width": 1354,
                                  "Identity": { "Id": "3ABD5B643E43C09B1476DABD3DC49908", "Name": "New process", "PoolType": 0 },
                                  "PoolXPosition": 25,
                                  "PoolYPosition": 25,
                                  "SwimLanes": [{ "Identity": { "Height": 600, "Index": 0, "Name": "Lane1", "PoolId": "3ABD5B643E43C09B1476DABD3DC49908" } }]
                              },
                              "diagramLanes": [
                                  {
                                      "poolLane": { "Identity": { "Height": 600, "Index": 0, "Name": "Lane1", "PoolId": "3ABD5B643E43C09B1476DABD3DC49908" } },
                                      "lane": {
                                          "id": "F2825CD4428DBB1954F509995CB3DA09",
                                          "height": 200,
                                          "style": { "fill": "transparent" },
                                          "header": { "annotation": { "content": "Lane1", "style": { "fill": "transparent", "textWrapping": "NoWrap", "textOverflow": "Ellipsis" } }, "width": 25, "height": 600 },
                                          "children": [
                                              {
                                                  "id": "node0",
                                                  "width": 30,
                                                  "height": 30,
                                                  "annotations": [
                                                      {
                                                          "id": "node0-label",
                                                          "content": "Start",
                                                          "horizontalAlignment": "Center",
                                                          "verticalAlignment": "Top",
                                                          "style": { "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif", "fontSize": 11, "textOverflow": "Wrap", "textWrapping": "WrapWithOverflow", "whiteSpace": "CollapseSpace" },
                                                          "offset": { "x": 0.5, "y": 1 },
                                                          "margin": { "left": 0, "top": 2, "right": 0, "bottom": 0 },
                                                          "constraints": 0
                                                      }
                                                  ],
                                                  "offsetX": 45,
                                                  "offsetY": 414.5,
                                                  "style": { "strokeColor": "#62A716", "fill": "#FFFFFF", "strokeWidth": 2 },
                                                  "shape": { "type": "Bpmn", "shape": "Event", "event": { "event": "Start", "trigger": "None" } },
                                                  "constraints": 38795174,
                                                  "addInfo": {
                                                      "node": {
                                                          "__type": "StartNode:http://www.kofax.com/agility/services/sdk",
                                                          "Identity": { "NodeType": 5, "Id": 0, "Name": "Start" },
                                                          "ResetLimit": -1,
                                                          "ActivityTimedOutAction": 0,
                                                          "Annotations": [],
                                                          "Allocate": false,
                                                          "AppendAssociatedFile": false,
                                                          "Attachments": [],
                                                          "Automatic": false,
                                                          "AvailableFireEvent": {},
                                                          "CollaborationNodes": [],
                                                          "CompletedFireEvent": {},
                                                          "Dependants": [],
                                                          "Destinations": [{ "Identity": { "NodeType": 1, "Id": 1, "Name": "Activity 1" }, "EmbeddedProcess": {} }],
                                                          "EmbeddedProcessCount": 0,
                                                          "ExpectedCost": 0,
                                                          "ActivationProbability": 100,
                                                          "Origins": [],
                                                          "Priority": 1,
                                                          "SecurityLevel": 10,
                                                          "SkillLevel": 10,
                                                          "FixedCost": 0,
                                                          "MilestoneAvailable": { "Identity": {} },
                                                          "MilestoneCompleted": { "Identity": {} },
                                                          "NodeColorGroup": 0,
                                                          "InheritNodeGroupColorFromSystem": true,
                                                          "States": [],
                                                          "SwimLane": { "Height": 600, "Index": 0, "Name": "Lane1", "PoolId": "3ABD5B643E43C09B1476DABD3DC49908" },
                                                          "TitlePosition": 0,
                                                          "TextPosition": 0,
                                                          "StartNodeEventType": 0,
                                                          "EndNodeEventType": 0,
                                                          "GroupArtifacts": [],
                                                          "MFPReady": 0,
                                                          "DesignTimeType": 0,
                                                          "NodeType": 5,
                                                          "Color": "#62A716",
                                                          "Width": 30,
                                                          "Height": 30,
                                                          "XPosition": 45,
                                                          "YPosition": 414.5,
                                                          "Process": {
                                                              "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                                                              "Author": {},
                                                              "CaptureEnabled": false,
                                                              "Category": { "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk", "Id": "201F370CA5164F76ADDD8EEEFF666AF7", "Name": "Default Category" },
                                                              "ExpectedCost": 0,
                                                              "ExpectedDuration": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                              "Identity": { "Id": "51377FB0CA851FAC41F6D8C932B136B0", "Version": 0.01, "Name": "New process" },
                                                              "LastModified": {},
                                                              "LastModifiedDate": {},
                                                              "LatestVersion": true,
                                                              "LockedBy": {},
                                                              "ProcessType": 0,
                                                              "SupportsSkinning": false,
                                                              "Synchronous": false,
                                                              "Version": 0.01
                                                          },
                                                          "ThreadPool": { "Id": 0, "Name": "Default Thread Pool" }
                                                      }
                                                  },
                                                  "ports": [
                                                      { "id": "right", "offset": { "x": 1, "y": 0.5 }, "visibility": 2 },
                                                      { "id": "bottom", "offset": { "x": 0.5, "y": 1 }, "visibility": 2 }
                                                  ],
                                                  "margin": { "left": 120, "top": 75 }
                                              },
                                              {
                                                  "id": "node1",
                                                  "width": 90,
                                                  "height": 60,
                                                  "annotations": [
                                                      {
                                                          "id": "node1-label",
                                                          "content": "Activity 1",
                                                          "style": { "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif", "fontSize": 11, "textOverflow": "Wrap", "textWrapping": "WrapWithOverflow", "whiteSpace": "CollapseSpace", "color": "#000000" },
                                                          "offset": { "x": 0.5, "y": 0.5 },
                                                          "margin": { "top": 10, "right": 2, "bottom": 3, "left": 2 },
                                                          "constraints": 0
                                                      }
                                                  ],
                                                  "offsetX": 185,
                                                  "offsetY": 414.5,
                                                  "style": { "strokeColor": "#7fadc8", "fill": "#E3EDF3", "strokeWidth": 2 },
                                                  "shape": { "shape": "Activity", "type": "Bpmn", "activity": { "activity": "Task", "task": { "type": "User" } } },
                                                  "constraints": 38795238,
                                                  "addInfo": {
                                                      "node": {
                                                          "__type": "OrdinaryActivity:http://www.kofax.com/agility/services/sdk",
                                                          "Notification": {
                                                              "AppendAssociatedFile": false,
                                                              "ContentText": "",
                                                              "ContentVariable": null,
                                                              "SendEmail": false,
                                                              "SendTo": 0,
                                                              "SubjectText": "",
                                                              "SubjectVariable": null,
                                                              "UrlText": "",
                                                              "UrlVariable": null
                                                          },
                                                          "PreconditionInputs": [],
                                                          "UsePreviousUser": false,
                                                          "Resources": {
                                                              "AdvanceWorkflowRules": {
                                                                  "ConcurrentActivityAccess": false,
                                                                  "ExitCondition": null,
                                                                  "ExpandGroupResources": false,
                                                                  "NeedsValidated": false,
                                                                  "NoOfResourcesRequired": 0,
                                                                  "NoOfResourcesRequiredValue": 0,
                                                                  "NoOfResourcesRequiredVariable": { "Id": "", "Name": "" },
                                                                  "SequentialActivityAssignment": false,
                                                                  "UseAdvanceWorkflowRules": false,
                                                                  "UseExcludedResources": false,
                                                                  "UseExitCondition": false,
                                                                  "UseResourceSettings": false
                                                              },
                                                              "DynamicResourcesOverwriteStatic": false,
                                                              "RequiredResources": [],
                                                              "UsableResources": [
                                                                  {
                                                                      "Dynamic": false,
                                                                      "DynamicResourceVariable": null,
                                                                      "Excluded": false,
                                                                      "SequentialOrder": 1,
                                                                      "StaticResource": { "Id": "7DF43CCDF24611D2804B00104B71BD15", "ResourceType": 3, "Name": "Everyone", "__type": "ResourceIdentity:http://www.kofax.com/agility/services/sdk" },
                                                                      "__type": "ActivityResource:http://www.kofax.com/agility/services/sdk"
                                                                  }
                                                              ]
                                                          },
                                                          "BusinessEvents": [],
                                                          "DueDateTriggers": [],
                                                          "HasDueDateTriggers": false,
                                                          "InputVariables": [],
                                                          "OutputVariables": [],
                                                          "LagDuration": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                          "Identity": { "NodeType": 1, "Id": 1, "Name": "Activity 1" },
                                                          "ResetLimit": -1,
                                                          "ActivityTimedOutAction": 0,
                                                          "Annotations": [],
                                                          "Allocate": false,
                                                          "AppendAssociatedFile": false,
                                                          "Attachments": [],
                                                          "Automatic": false,
                                                          "AvailableFireEvent": {},
                                                          "CollaborationNodes": [],
                                                          "CompletedFireEvent": {},
                                                          "Dependants": [],
                                                          "Destinations": [{ "Identity": { "NodeType": 6, "Id": 2, "Name": "End" }, "EmbeddedProcess": {} }],
                                                          "EmbeddedProcessCount": 0,
                                                          "ExpectedCost": 0,
                                                          "ActivationProbability": 100,
                                                          "Origins": [{ "Identity": { "NodeType": 5, "Id": 0, "Name": "Start" }, "EmbeddedProcess": {} }],
                                                          "Priority": 1,
                                                          "SecurityLevel": 10,
                                                          "SkillLevel": 10,
                                                          "FixedCost": 0,
                                                          "MilestoneAvailable": { "Identity": {} },
                                                          "MilestoneCompleted": { "Identity": {} },
                                                          "NodeColorGroup": 1,
                                                          "InheritNodeGroupColorFromSystem": true,
                                                          "States": [],
                                                          "SwimLane": { "Height": 600, "Index": 0, "Name": "Lane1", "PoolId": "3ABD5B643E43C09B1476DABD3DC49908" },
                                                          "TitlePosition": 0,
                                                          "TextPosition": 0,
                                                          "StartNodeEventType": 0,
                                                          "EndNodeEventType": 0,
                                                          "GroupArtifacts": [],
                                                          "MFPReady": 0,
                                                          "DesignTimeType": 1,
                                                          "NodeType": 1,
                                                          "Rag": {
                                                              "SlaStatus2Threshold": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                              "SlaStatus3Threshold": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                              "SlaStatus4Threshold": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                              "SlaStatus5Threshold": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 }
                                                          },
                                                          "TargetDuration": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                          "Width": 90,
                                                          "Height": 60,
                                                          "XPosition": 185,
                                                          "YPosition": 414.5,
                                                          "Color": "#FFE3EDF3",
                                                          "Process": {
                                                              "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                                                              "Author": {},
                                                              "CaptureEnabled": false,
                                                              "Category": { "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk", "Id": "201F370CA5164F76ADDD8EEEFF666AF7", "Name": "Default Category" },
                                                              "ExpectedCost": 0,
                                                              "ExpectedDuration": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                              "Identity": { "Id": "51377FB0CA851FAC41F6D8C932B136B0", "Version": 0.01, "Name": "New process" },
                                                              "LastModified": {},
                                                              "LastModifiedDate": {},
                                                              "LatestVersion": true,
                                                              "LockedBy": {},
                                                              "ProcessType": 0,
                                                              "SupportsSkinning": false,
                                                              "Synchronous": false,
                                                              "Version": 0.01
                                                          },
                                                          "ThreadPool": { "Id": 0, "Name": "Default Thread Pool" },
                                                          "IsAfterStartNode": true,
                                                          "ShouldTrackVariableChanges": false
                                                      }
                                                  },
                                                  "ports": [
                                                      { "id": "left", "offset": { "x": 0, "y": 0.5 }, "visibility": 2 },
                                                      { "id": "top", "offset": { "x": 0.5, "y": 0 }, "visibility": 2 },
                                                      { "id": "right", "offset": { "x": 1, "y": 0.5 }, "visibility": 2 },
                                                      { "id": "bottom", "offset": { "x": 0.5, "y": 1 }, "visibility": 2 }
                                                  ],
                                                  "margin": { "left": 260, "top": 60 }
                                              },
                                              {
                                                  "id": "node2",
                                                  "width": 30,
                                                  "height": 30,
                                                  "annotations": [
                                                      {
                                                          "id": "node2-label",
                                                          "content": "End",
                                                          "horizontalAlignment": "Center",
                                                          "verticalAlignment": "Top",
                                                          "style": { "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif", "fontSize": 11, "textOverflow": "Wrap", "textWrapping": "WrapWithOverflow", "whiteSpace": "CollapseSpace" },
                                                          "offset": { "x": 0.5, "y": 1 },
                                                          "margin": { "left": 0, "top": 2, "right": 0, "bottom": 0 },
                                                          "constraints": 0
                                                      }
                                                  ],
                                                  "offsetX": 325,
                                                  "offsetY": 414.5,
                                                  "style": { "strokeColor": "#9b0000", "fill": "#FFFFFF", "strokeWidth": 4 },
                                                  "shape": { "type": "Bpmn", "shape": "Event", "event": { "event": "End", "trigger": "None" } },
                                                  "constraints": 38795238,
                                                  "addInfo": {
                                                      "node": {
                                                          "__type": "EndNode:http://www.kofax.com/agility/services/sdk",
                                                          "Identity": { "NodeType": 6, "Id": 2, "Name": "End" },
                                                          "ResetLimit": -1,
                                                          "ActivityTimedOutAction": 0,
                                                          "Annotations": [],
                                                          "Allocate": false,
                                                          "AppendAssociatedFile": false,
                                                          "Attachments": [],
                                                          "Automatic": false,
                                                          "AvailableFireEvent": {},
                                                          "CollaborationNodes": [],
                                                          "CompletedFireEvent": {},
                                                          "Dependants": [],
                                                          "Destinations": [],
                                                          "EmbeddedProcessCount": 0,
                                                          "ExpectedCost": 0,
                                                          "ActivationProbability": 100,
                                                          "Origins": [{ "Identity": { "NodeType": 1, "Id": 1, "Name": "Activity 1" }, "EmbeddedProcess": {} }],
                                                          "Priority": 1,
                                                          "SecurityLevel": 10,
                                                          "SkillLevel": 10,
                                                          "FixedCost": 0,
                                                          "MilestoneAvailable": { "Identity": {} },
                                                          "MilestoneCompleted": { "Identity": {} },
                                                          "NodeColorGroup": 0,
                                                          "InheritNodeGroupColorFromSystem": true,
                                                          "States": [],
                                                          "SwimLane": { "Height": 600, "Index": 0, "Name": "Lane1", "PoolId": "3ABD5B643E43C09B1476DABD3DC49908" },
                                                          "TitlePosition": 0,
                                                          "TextPosition": 0,
                                                          "StartNodeEventType": 0,
                                                          "EndNodeEventType": 0,
                                                          "GroupArtifacts": [],
                                                          "MFPReady": 0,
                                                          "DesignTimeType": 0,
                                                          "NodeType": 6,
                                                          "Color": "#FF9B0000",
                                                          "Width": 30,
                                                          "Height": 30,
                                                          "XPosition": 325,
                                                          "YPosition": 414.5,
                                                          "Process": {
                                                              "__type": "ProcessSummary:http://www.kofax.com/agility/services/sdk",
                                                              "Author": {},
                                                              "CaptureEnabled": false,
                                                              "Category": { "__type": "CategoryIdentity:http://www.kofax.com/agility/services/sdk", "Id": "201F370CA5164F76ADDD8EEEFF666AF7", "Name": "Default Category" },
                                                              "ExpectedCost": 0,
                                                              "ExpectedDuration": { "Days": 0, "Hours": 0, "Minutes": 0, "Negative": false, "Seconds": 0, "UseNegative": false, "DurationType": 0 },
                                                              "Identity": { "Id": "51377FB0CA851FAC41F6D8C932B136B0", "Version": 0.01, "Name": "New process" },
                                                              "LastModified": {},
                                                              "LastModifiedDate": {},
                                                              "LatestVersion": true,
                                                              "LockedBy": {},
                                                              "ProcessType": 0,
                                                              "SupportsSkinning": false,
                                                              "Synchronous": false,
                                                              "Version": 0.01
                                                          },
                                                          "ThreadPool": { "Id": 0, "Name": "Default Thread Pool" },
                                                          "ShouldTrackVariableChanges": false,
                                                          "Notification": {
                                                              "AppendAssociatedFile": false,
                                                              "ContentText": "",
                                                              "ContentVariable": null,
                                                              "SendEmail": false,
                                                              "SendTo": 0,
                                                              "SubjectText": "",
                                                              "SubjectVariable": null,
                                                              "UrlText": "",
                                                              "UrlVariable": null
                                                          }
                                                      }
                                                  },
                                                  "ports": [
                                                      { "id": "left", "offset": { "x": 0, "y": 0.5 }, "visibility": 2 },
                                                      { "id": "top", "offset": { "x": 0.5, "y": 0 }, "visibility": 2 }
                                                  ],
                                                  "margin": { "left": 400, "top": 75 }
                                              }
                                          ],
                                          "addInfo": { "Identity": { "Height": 600, "Index": 0, "Name": "Lane1", "PoolId": "3ABD5B643E43C09B1476DABD3DC49908" } }
                                      }
                                  }
                              ]
                          },
                          "margin": { "left": 0, "top": 0 },
                          "zIndex": 6,
                          "container": { "type": "Grid", "orientation": "Horizontal" },
                          "visible": true,
                          "horizontalAlignment": "Left",
                          "verticalAlignment": "Top",
                          "borderColor": "none",
                          "borderWidth": 0,
                          "rotateAngle": 0,
                          "pivot": { "x": 0.5, "y": 0.5 },
                          "flip": "None",
                          "wrapper": { "actualSize": { "width": 1354, "height": 225 }, "offsetX": 702, "offsetY": 125 },
                          "annotations": [],
                          "ports": [],
                          "isExpanded": true,
                          "expandIcon": { "shape": "None" },
                          "inEdges": [],
                          "outEdges": [],
                          "processId": "",
                          "isPhase": false,
                          "isLane": false
                      }
                  ],
                  "scrollSettings": {
                      "canAutoScroll": true,
                      "scrollLimit": "Infinity",
                      "padding": { "left": 10, "right": 30, "top": 10, "bottom": 30 },
                      "viewPortWidth": 1404,
                      "viewPortHeight": 829,
                      "currentZoom": 1,
                      "horizontalOffset": 0,
                      "verticalOffset": 0
                  },
                  "selectedItems": {
                      "constraints": 4096,
                      "userHandles": [
                          {
                              "name": "connector",
                              "backgroundColor": "transparent",
                              "pathColor": "#5a5a64",
                              "side": "Top",
                              "offset": 0.5,
                              "visible": false,
                              "size": 33,
                              "pathData": "M4,11v2h8v7l8-8L12,4v7Z",
                              "margin": { "top": 17, "left": 0, "right": 0, "bottom": 0 },
                              "disableConnectors": false,
                              "disableNodes": false,
                              "horizontalAlignment": "Center",
                              "verticalAlignment": "Center",
                              "borderColor": "",
                              "borderWidth": 0.5
                          },
                          {
                              "name": "delete",
                              "backgroundColor": "transparent",
                              "pathColor": "#5a5a64",
                              "side": "Top",
                              "offset": 1,
                              "visible": false,
                              "size": 25,
                              "pathData": "M828.2096467757849,-5.547905384373092c-3.201999999999998,-2.8130000000000006,-8.105999999999995,-2.455,-11.119,0.5579999999999998l-34.179,34.205l-34.337,-34.362c-3.093,-3.0920000000000005,-8.108,-3.0920000000000005,-11.201,0l-0.11299999999999956,0.11299999999999956c-3.093,3.093,-3.093,8.107,0,11.201l34.341,34.366l-34.34,34.366c-3.093,3.0930000000000035,-3.093,8.108000000000004,0,11.201000000000008l0.11299999999999956,0.11299999999999956c3.093,3.0930000000000035,8.107,3.0930000000000035,11.201,0l34.337,-34.363l34.17900000000001,34.205c3.0130000000000052,3.0130000000000052,7.917000000000002,3.3700000000000045,11.119,0.5580000000000069c3.507000000000005,-3.081000000000003,3.6370000000000005,-8.429000000000002,0.38800000000000534,-11.677999999999997l-34.37899999999999,-34.403l34.37700000000001,-34.404c3.25,-3.2489999999999988,3.1200000000000045,-8.596,-0.38800000000000534,-11.677Z",
                              "margin": { "top": 10, "right": 10, "left": 0, "bottom": 0 },
                              "disableConnectors": false,
                              "disableNodes": false,
                              "horizontalAlignment": "Center",
                              "verticalAlignment": "Center",
                              "borderColor": "",
                              "borderWidth": 0.5
                          },
                          {
                              "name": "node",
                              "backgroundColor": "transparent",
                              "pathColor": "#e9f8ff",
                              "side": "Right",
                              "offset": 0,
                              "visible": false,
                              "size": 33,
                              "pathData": "M17.75,13.89H2.5a2,2,0,0,1-2-2V2.5a2,2,0,0,1,2-2H17.75a2,2,0,0,1,2,2v9.39A2,2,0,0,1,17.75,13.89Z",
                              "margin": { "right": 15, "left": 0, "top": 0, "bottom": 0 },
                              "disableConnectors": false,
                              "disableNodes": false,
                              "horizontalAlignment": "Center",
                              "verticalAlignment": "Center",
                              "borderColor": "",
                              "borderWidth": 0.5
                          },
                          {
                              "name": "decision",
                              "backgroundColor": "transparent",
                              "pathColor": "#fff6df",
                              "side": "Right",
                              "offset": 0.5,
                              "visible": false,
                              "size": 33,
                              "pathData": "M19.94,11.93l-8,8a2,2,0,0,1-2.83,0l-8-8a2,2,0,0,1,0-2.83l8-8a2,2,0,0,1,2.83,0l8,8A2,2,0,0,1,19.94,11.93Z",
                              "margin": { "right": 15, "left": 0, "top": 0, "bottom": 0 },
                              "disableConnectors": false,
                              "disableNodes": false,
                              "horizontalAlignment": "Center",
                              "verticalAlignment": "Center",
                              "borderColor": "",
                              "borderWidth": 0.5
                          },
                          {
                              "name": "end",
                              "backgroundColor": "transparent",
                              "pathColor": "#ffedef",
                              "side": "Right",
                              "offset": 1,
                              "visible": false,
                              "size": 33,
                              "pathData": "M16.92,8.71A8.21,8.21,0,1,1,8.71.5,8.21,8.21,0,0,1,16.92,8.71Z",
                              "margin": { "right": 15, "left": 0, "top": 0, "bottom": 0 },
                              "disableConnectors": false,
                              "disableNodes": false,
                              "horizontalAlignment": "Center",
                              "verticalAlignment": "Center",
                              "borderColor": "",
                              "borderWidth": 0.5
                          },
                          {
                              "name": "annotation",
                              "backgroundColor": "transparent",
                              "pathColor": "#5a5a64",
                              "side": "Bottom",
                              "offset": 1,
                              "visible": false,
                              "size": 33,
                              "pathData": "M8,11h8v2H8Zm8-4H8V9h8Zm0,8H8v2h8ZM18,2H10V4h8V20H10v2h8a2,2,0,0,0,2-2V4A2,2,0,0,0,18,2ZM6,4H8V2H6A2,2,0,0,0,4,4v6L2,12l2,2v6a2,2,0,0,0,2,2H8V20H6Z",
                              "margin": { "right": 10, "bottom": 9, "left": 5, "top": 0 },
                              "disableConnectors": false,
                              "disableNodes": false,
                              "horizontalAlignment": "Center",
                              "verticalAlignment": "Center",
                              "borderColor": "",
                              "borderWidth": 0.5
                          },
                          {
                              "name": "attachment",
                              "backgroundColor": "transparent",
                              "pathColor": "#5a5a64",
                              "side": "Bottom",
                              "offset": 0,
                              "visible": false,
                              "size": 33,
                              "pathData": "M11,9h5.5L11,3.5V9M4,2h8l6,6V20a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2M9,4H4V20H16V11H9Z",
                              "margin": { "bottom": 9, "left": 0, "right": 0, "top": 0 },
                              "disableConnectors": false,
                              "disableNodes": false,
                              "horizontalAlignment": "Center",
                              "verticalAlignment": "Center",
                              "borderColor": "",
                              "borderWidth": 0.5
                          }
                      ],
                      "nodes": [],
                      "connectors": [],
                      "rotateAngle": 0,
                      "pivot": { "x": 0.5, "y": 0.5 },
                      "width": 0,
                      "height": 0,
                      "offsetX": 0,
                      "offsetY": 0,
                      "wrapper": null
                  },
                  "snapSettings": {
                      "constraints": 0,
                      "horizontalGridlines": { "lineIntervals": [1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75], "snapIntervals": [10] },
                      "verticalGridlines": { "lineIntervals": [1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75], "snapIntervals": [10] },
                      "gridType": "Lines"
                  },
                  "width": "100%",
                  "enablePersistence": false,
                  "rulerSettings": { "showRulers": false },
                  "backgroundColor": "transparent",
                  "layout": {
                      "type": "ComplexHierarchicalTree",
                      "enableAnimation": true,
                      "connectionDirection": "Orientation",
                      "connectorSegments": "Layout",
                      "margin": { "left": 30, "top": 30, "right": 30, "bottom": 30 },
                      "orientation": "LeftToRight",
                      "horizontalSpacing": 80,
                      "verticalSpacing": 80,
                      "horizontalAlignment": "Left",
                      "verticalAlignment": "Center"
                  },
                  "contextMenuSettings": {},
                  "dataSourceSettings": { "dataManager": null, "dataSource": null, "crudAction": { "read": "" }, "connectionDataSource": { "crudAction": { "read": "" } } },
                  "mode": "SVG",
                  "layers": [
                      {
                          "id": "default_layer",
                          "visible": true,
                          "lock": false,
                          "objects": [
                              "node3ABD5B643E43C09B1476DABD3DC49908",
                              "node3ABD5B643E43C09B1476DABD3DC49908pCf0X",
                              "node3ABD5B643E43C09B1476DABD3DC49908F2825CD4428DBB1954F509995CB3DA090",
                              "node3ABD5B643E43C09B1476DABD3DC49908F2825CD4428DBB1954F509995CB3DA09_0_header",
                              "node0",
                              "node1",
                              "node2",
                              "node0-node1",
                              "node1-node2"
                          ],
                          "zIndex": 0
                      }
                  ],
                  "diagramSettings": { "inversedAlignment": true },
                  "pageSettings": { "boundaryConstraints": "Infinity", "orientation": "Landscape", "height": null, "width": null, "background": { "source": "", "color": "transparent" }, "showPageBreaks": false, "fitOptions": { "canFit": false } },
                  "basicElements": [],
                  "tooltip": { "content": "", "relativeMode": "Mouse" },
                  "tool": 3,
                  "customCursor": [],
                  "bridgeDirection": "Top",
                  "version": 17.1
              }`);
            
                setTimeout(() => diagram.resetSegments(), 100);
              }
              diagram = new Diagram({
                width: '100%',height: '600px',nodes: nodes,connectors: connectors,
                selectedItems: selectedItems,constraints: constraints,snapSettings: snapSettings,
                scrollSettings: scrollSettings,commandManager: commandManager,selectionChange: selectionChanged
            });
            diagram.appendTo('#diagramSwimlane1');
            loadJson();

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('While setting delete constraints for node in swimlane and clear the diagram', (done: Function) => {
        diagram.clear();
        expect(diagram.nodes.length === 0 && diagram.connectors.length === 0).toBe(true);
        done();
        });
    });
    describe('Horizontal Swimlane', () => {
        let diagram: Diagram;
        let mouseEvents: MouseEvents = new MouseEvents();
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlane1' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'swimlane',
                    shape: {
                        type: 'SwimLane',
                        orientation: 'Horizontal',
                        header: {
                            annotation: { content: 'SALES PROCESS FLOW CHART', style: { fill: 'transparent' } },
                            height: 50, style: { fontSize: 11 },
                        },
                        lanes: [
                            {
                                id: 'stackCanvas1',
                                header: {
                                    annotation: { content: 'Consumer' }, width: 50,
                                    style: { fontSize: 11 }
                                },
                                height: 100,
                                children: [
                                    {
                                        id: 'node1',
                                        annotations: [
                                            {
                                                content: 'Consumer learns \n of product',
                                                style: { fontSize: 11 }
                                            }
                                        ],
                                        margin: { left: 60, top: 30 },
                                        height: 40, width: 100, ports: this.port
                                    },
                                    {
                                        id: 'node2',
                                        shape: { type: 'Flow', shape: 'Decision' },
                                        annotations: [
                                            {
                                                content: 'Does \nConsumer want \nthe product',
                                                style: { fontSize: 11 }
                                            }
                                        ],
                                        margin: { left: 200, top: 20 },
                                        height: 60, width: 120, ports: this.port
                                    },
                                    
                                ],
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
                    offsetX: 390, offsetY: 320,
                    height: 100,
                    width: 650
                },
            ];
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1', sourceID: 'node1',
                    targetID: 'node2'
                },
            ];
            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes, connectors:connectors, created: created });
            diagram.appendTo('#diagramSwimlane1');
            function created() {
                const lane: LaneModel[] = [
                    {
                      id: 'lane1',
                      height: 100,
                      header: {
                        annotation: { content: 'Online Consumer 2' },
                        width: 50,
                        style: { fontSize: 11, fill: 'blue' },
                      },                      
                    },
                  ];
                diagram.addLanes(diagram.nodes[0], lane);
                let node1: NodeModel = 
                {
                    id: 'newNode', width: 50, height: 60, shape: { type: 'Flow', shape: 'Process' },
                    style: { strokeWidth: 1, fill: 'red' }, margin: { left: 400, top: 25 }
                }
                diagram.addNodeToLane(node1, 'swimlane', 'lane1');
            }
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Node added to the dynamically rendered lane', (done: Function) => {
            let node = diagram.nameTable['newNode'];
            diagram.select([node]);
            console.log(diagram.selectedItems.nodes[0].offsetX);
            console.log(diagram.selectedItems.nodes[0].offsetY);
            expect(diagram.selectedItems.nodes[0].offsetX === 490 && diagram.selectedItems.nodes[0].offsetY === 460).toBe(true);
            let laneElement = document.getElementById('lane10');
            expect(laneElement !== undefined).toBe(true);
            done();
        });
    });
});