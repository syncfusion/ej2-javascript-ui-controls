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
import { Node, Html, SwimLane } from '../../../src/diagram/objects/node';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { Selector } from '../../../src/diagram/objects/node';
import { Container } from '../../../src/diagram/core/containers/container';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { PhaseModel, LaneModel } from '../../../src/diagram/objects/node-model';
import { SymbolPalette, SymbolInfo, PaletteModel, } from '../../../src/symbol-palette/index'; 
import { IElement, PointModel, NodeConstraints, LineRouting, Connector, DiagramConstraints, AnnotationConstraints, CommandHandler, DiagramEventHandler, UserHandleModel, ISelectionChangeEventArgs, ScrollSettingsModel, SnapSettingsModel, LayoutModel, BpmnSequenceFlows, SnapConstraints, SelectorConstraints, IDraggingEventArgs, IHistoryChangeArgs, ZoomOptions } from '../../../src/diagram/index';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { Annotation } from '../../../src/diagram/objects/annotation';
import {  ShapeStyleModel } from '../../../src/diagram/core/appearance-model';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
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
                        phases: [{ header: { annotation: {content: 'phase1'}  as Annotation },addInfo:{name:'phase1 info'}, style: { fill: 'blue', opacity: .5 }, offset: 300 },
                        { headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, width: 300 }],
                        lanes: [
                            {
                                id: 'lane1',
                                addInfo:{name:'lane1 info'},
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
        it('Checking addInfo in lanes at initial rendering',(done:Function)=>{
            let shape = diagram.nodes[0].shape as SwimLaneModel;
            console.log('addInfo for lanes')
            expect(shape.lanes[0].addInfo!==null).toBe(true);
            done();
        });
        it('Changing addInfo value in lanes at runtime',(done:Function)=>{
            let shape = diagram.nodes[0].shape as SwimLaneModel;
            shape.lanes[0].addInfo={name:"lane1 info changed"}
            console.log('addInfo for lanes changed')
            expect(shape.lanes[0].addInfo).toEqual({name:'lane1 info changed'});
            done();
        });
    
        it('Checking addInfo in phases at initial rendering',(done:Function)=>{
            let shape = diagram.nodes[0].shape as SwimLaneModel;
            console.log('addInfo for phases')
            expect(shape.phases[0].addInfo!==null).toBe(true);
            done();
        });
        it('Changing addInfo value in phases at runtime',(done:Function)=>{
            let shape = diagram.nodes[0].shape as SwimLaneModel;
            shape.phases[0].addInfo={name:"phase1 info changed"}
            console.log('addInfo for phases changed')
            expect(shape.phases[0].addInfo).toEqual({name:'phase1 info changed'});
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
                expect(diagram.nameTable["Order"].parentId === "swimlanestackCanvas21").toBe(true);
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

                expect((node.offsetX == 370||node.offsetX == 365  )&& (node.offsetY == 310|| node.offsetY == 320)).toBe(true);
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
                expect((swimlane.offsetX == 402.5 || swimlane.offsetX == 397.5|| swimlane.offsetX == 395) && (swimlane.offsetY == 330||swimlane.offsetY == 335) && (swimlane.shape.phases[0].offset == 265 || swimlane.shape.phases[0].offset == 260)).toBe(true);
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
            console.log("nametable");
            console.log(diagram.nameTable["swimlane"].shape.phases[1].offset);
            expect(diagram.nameTable["swimlane"].shape.phases[1].offset == 710).toBe(true);
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
            console.log("bounds1.height");
            console.log(bounds1.height);
            expect(bounds1.height == 390).toBe(true);
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
    describe('Swimlane Connector interaction', () => {
        describe('Connector Selection issue', () => {
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


            it('Check-Connector selection', (done: Function) => {
                    let connector = diagram.connectors[0];
                    diagram.select([connector]);
                    expect(diagram.selectedItems.connectors[0].id == 'connector1').toBe(true);
                    done();
            });

            it('Check-Connector z index', (done: Function) => {
                let connector = diagram.connectors[0];
                diagram.select([connector]);
                expect(diagram.selectedItems.connectors[0].zIndex == 16).toBe(true);
                done();
        });

            it('check connector z index after save and load operation', (done: Function) => {
                let save: string = diagram.saveDiagram();
                diagram.loadDiagram(save);
                let connector = diagram.connectors[0];
                diagram.select([connector]);
                expect(diagram.selectedItems.connectors[0].zIndex == 16).toBe(true);
                done();
        });

        it('Checking connector is drag and drop without selecting', (done : Function) => {
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
            console.log("dragclone");
            console.log(document.getElementsByClassName('e-dragclone').length);
            expect(document.getElementsByClassName('e-dragclone').length == 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 500, 300, false, false);
            events.mouseUpEvent(diagram.element, 500, 300, false, false);
            console.log("connectors.length");
            console.log(diagram.connectors.length);
            expect(diagram.connectors.length).toBe(7);
            //dragging the node
            events.mouseDownEvent(diagram.element, 326, 426, false, false);
            events.mouseMoveEvent(diagram.element, 360, 470, false, false);
            events.mouseUpEvent(diagram.element, 360, 470, false, false);
           //dragging the connector
            events.mouseDownEvent(diagram.element, 500, 300, false, false);
            events.mouseMoveEvent(diagram.element, 540, 340, false, false);
            events.mouseMoveEvent(diagram.element, 600, 400, false, false);
            events.mouseUpEvent(diagram.element, 600, 400, false, false);
            done();
        });

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
                diagram.select([diagram.nodes[0]]);
                console.log("selectedItems for nodes");
                console.log(diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(diagram.selectedItems.nodes[0].wrapper.bounds.x == 110 && diagram.selectedItems.nodes[0].wrapper.bounds.y == 60 &&
                    diagram.selectedItems.nodes[0].wrapper.bounds.width == 750 && diagram.selectedItems.nodes[0].wrapper.bounds.height == 470).toBe(true);
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
                console.log("selectedItems id");
                console.log(diagram.selectedItems.nodes[0].id ,diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase2_header' && diagram.selectedItems.wrapper.bounds.x == 300 && diagram.selectedItems.wrapper.bounds.y == 110 &&
                    diagram.selectedItems.wrapper.bounds.width == 640 && diagram.selectedItems.wrapper.bounds.height == 420).toBe(true);
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
                console.log("selectedItems id one");
                console.log(diagram.selectedItems.nodes[0].id ,diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header' && diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 110
                    && diagram.selectedItems.wrapper.bounds.width == 190 && diagram.selectedItems.wrapper.bounds.height == 420).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + diagram.selectedItems.wrapper.bounds.width + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height / 2) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 20, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 40, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 70, y);
                mouseEvents.mouseUpEvent(diagramCanvas, x + 70, y);
                redoOffsetX = phase.wrapper.offsetX; redoOffsetY = phase.wrapper.offsetY;
                console.log("selectedItems id two");
                console.log(diagram.selectedItems.nodes[0].id ,diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header' && diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 110 &&
                    diagram.selectedItems.wrapper.bounds.width == 270 && diagram.selectedItems.wrapper.bounds.height == 420).toBe(true);
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
                console.log("selectedItems id three");
                console.log(diagram.selectedItems.nodes[0].id ,diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(diagram.selectedItems.nodes[0].id == 'swimlanephase1_header' && diagram.selectedItems.wrapper.bounds.x == 110 && diagram.selectedItems.wrapper.bounds.y == 110 &&
                    diagram.selectedItems.wrapper.bounds.width == 270 && diagram.selectedItems.wrapper.bounds.height == 420).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + (diagram.selectedItems.wrapper.bounds.width / 2) + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 70);
                mouseEvents.mouseUpEvent(diagramCanvas, x, y + 70);
                redoOffsetX = phase.wrapper.offsetX; redoOffsetY = phase.wrapper.offsetY;
                done();
            });
            it('Undo, redo action after phase resizing south direction', (done: Function) => {
                let swimlane = diagram.nameTable["swimlanephase1_header"];
                diagram.undo();
                console.log("wrapper offset");
                console.log(swimlane.wrapper.offsetX == undoOffsetX,swimlane.wrapper.offsetY == undoOffsetY);
                expect(swimlane.wrapper.offsetX != undoOffsetX && swimlane.wrapper.offsetY == undoOffsetY).toBe(true);
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
                diagram.select([node]);
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
                expect(node.offsetX == 250 && (node.offsetY == 310||node.offsetY == 320)).toBe(true);
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
                expect((node.offsetX == 370 || node.offsetX == 380) && (node.offsetY == 310||node.offsetY == 320)).toBe(true);
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
                diagram.select([diagram.nodes[0]]);
                console.log("selectedItems id five");
                console.log(diagram.selectedItems.nodes[0].id ,diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(
                    diagram.selectedItems.wrapper.bounds.x == 60 &&
                    diagram.selectedItems.wrapper.bounds.y == 90 &&
                    diagram.selectedItems.wrapper.bounds.width == 710 &&
                    diagram.selectedItems.wrapper.bounds.height == 450).toBe(true);
                done();
            });
            it('Resize East - Lane', (done: Function) => {
                let lane = diagram.nameTable["swimlanestackCanvas11"];
                undoOffsetX = lane.wrapper.offsetX; undoOffsetY = lane.wrapper.offsetY;
                mouseEvents.mouseDownEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);
                mouseEvents.mouseUpEvent(diagramCanvas, lane.wrapper.offsetX + diagram.element.offsetLeft, lane.wrapper.offsetY + diagram.element.offsetTop);
                console.log("selectedItems id six");
                console.log(diagram.selectedItems.nodes[0].id ,diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas11' && diagram.selectedItems.wrapper.bounds.x == 80 &&
                    diagram.selectedItems.wrapper.bounds.y == 140 && diagram.selectedItems.wrapper.bounds.width == 180 &&
                    diagram.selectedItems.wrapper.bounds.height == 400).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + diagram.selectedItems.wrapper.bounds.width + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height / 2) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 20, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 40, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x + 70, y);
                mouseEvents.mouseUpEvent(diagramCanvas, x + 70, y);
                redoOffsetX = lane.wrapper.offsetX; redoOffsetY = lane.wrapper.offsetY;
                console.log("selectedItems id seven");
                console.log(diagram.selectedItems.nodes[0].id ,diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas11' && diagram.selectedItems.wrapper.bounds.x == 80 && diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 260 && diagram.selectedItems.wrapper.bounds.height == 400).toBe(true);
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
                console.log("selectedItems id eight");
                console.log(diagram.selectedItems.nodes[0].id ,diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas11' && diagram.selectedItems.wrapper.bounds.x == 80 && diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 260 && diagram.selectedItems.wrapper.bounds.height == 400).toBe(true);
                let x = diagram.selectedItems.wrapper.bounds.x + (diagram.selectedItems.wrapper.bounds.width / 2) + diagram.element.offsetLeft;
                let y = diagram.selectedItems.wrapper.bounds.y + (diagram.selectedItems.wrapper.bounds.height) + diagram.element.offsetTop;
                mouseEvents.mouseDownEvent(diagramCanvas, x, y);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 20);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 40);
                mouseEvents.mouseMoveEvent(diagramCanvas, x, y + 70);
                mouseEvents.mouseUpEvent(diagramCanvas, x, y + 70);
                redoOffsetX = lane.wrapper.offsetX; redoOffsetY = lane.wrapper.offsetY;
                diagram.select([diagram.nodes[0]]);
                console.log("selectedItems id nine");
                console.log(diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(
                    diagram.selectedItems.wrapper.bounds.x == 60 && diagram.selectedItems.wrapper.bounds.y == 90 &&
                    diagram.selectedItems.wrapper.bounds.width == 790 && diagram.selectedItems.wrapper.bounds.height == 450).toBe(true);
                done();
            });
            it('Undo, redo action after lane resizing south direction', (done: Function) => {
                let swimlane = diagram.nameTable["swimlanestackCanvas11"];
                diagram.undo();
                console.log("wrapper.offsetX");
                console.log(swimlane.wrapper.offsetX == undoOffsetX, swimlane.wrapper.offsetY == undoOffsetY)
                expect(swimlane.wrapper.offsetX != undoOffsetX && swimlane.wrapper.offsetY == undoOffsetY).toBe(true);
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
                console.log("selectedItems id ten");
                console.log(diagram.selectedItems.nodes[0].id ,diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas40' && diagram.selectedItems.wrapper.bounds.x == 710 && diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 210 && diagram.selectedItems.wrapper.bounds.height == 400).toBe(true);
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
                console.log("selectedItems id eleven");
                console.log(diagram.selectedItems.nodes[0].id ,diagram.selectedItems.wrapper.bounds.x, diagram.selectedItems.wrapper.bounds.y,diagram.selectedItems.wrapper.bounds.width,diagram.selectedItems.wrapper.bounds.height );
                expect(diagram.selectedItems.nodes[0].id == 'swimlanestackCanvas21' && diagram.selectedItems.wrapper.bounds.x == 340 && diagram.selectedItems.wrapper.bounds.y == 140 &&
                    diagram.selectedItems.wrapper.bounds.width == 320 && diagram.selectedItems.wrapper.bounds.height == 400).toBe(true);
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
                console.log("node.wrapper.offsetX");
                console.log(node.wrapper.offsetX,node.wrapper.offsetY );
                expect(node.wrapper.offsetX == 510 && node.wrapper.offsetY == 320).toBe(true);
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
                console.log("node.wrapper.offsetX second");
                console.log(node.wrapper.offsetX , node.wrapper.offsetY);
                expect(node.wrapper.offsetX == 650 && node.wrapper.offsetY == 320).toBe(true);
                let lane = Number(document.getElementById('swimlanestackCanvas20').getAttribute('width'));
                expect(lane === 385||lane === 380).toBe(true);
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
            it('EJ2-47034 Exception occurs when drag and drop a lane on connector in swimlane', (done: Function) => {
                diagram.collectionChange = function (args) {
                    if (args.state === "Changing" && args.type === "Addition") {
                      if (
                        args.element &&
                        args.element.shape &&
                        args.element.shape.type === "SwimLane"
                      ) {
                        args.cancel = true;
                      }else{
                        args.cancel = true;
                      }
                    }
                  }
                
                setTimeout(() => {
                    var connector:any = { type: 'Orthogonal', sourcePortID: "node1" };
                    diagram.drawingObject = connector as any;
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
                    console.log("EJ2-47034 Exception occurs when drag and drop a lane on connector in swimlane"+diagram.nodes.length)
                    expect(diagram.nodes.length === 0).toBe(true);
                    done();
                }, 10);
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
                    console.log("width");
                    console.log(width);
                    expect(width <= previousWidth).toBe(true);

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
    describe('853721-Grid lines remain hidden when lane fill is set to transparent.', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let btn: HTMLButtonElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlaneTransparent' });
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
                                style:{fill:'transparent'},
                                children: [

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
                                style:{fill:'green'},
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
                    width: 650,
                    style:{fill:'transparent'}
                },
            ];

            diagram = new Diagram({
                width: '80%',
                height: '600px',
                nodes: nodes,
            });
            diagram.appendTo('#diagramSwimlaneTransparent');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Check swimlane fill color', (done: Function) => {
            let swimlane = diagram.nodes[0];
            diagram.select([swimlane]);
            let fill = diagram.selectedItems.nodes[0].wrapper.children[0].style.fill;
            expect(fill === 'transparent').toBe(true);
            done();
        });
    });

    describe('876330-After performing cut operations followed by an undo, lanes and nodes in the swimlane are not rendered properly', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let btn: HTMLButtonElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlaneUndo' });
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
                                style:{fill:'transparent'},
                                children: [
                                    {
                                        id: 'selectItemaddcart',
                                        annotations: [{ content: 'Select item\nAdd cart' }],
                                        margin: { left: 190, top: 20 },
                                        height: 40, width: 100
                                    },
                                ],
                            },
                            {
                                id: 'stackCanvas2',
                                header: {
                                    annotation: { content: 'ONLINE' }, width: 50,
                                    style: { fontSize: 11 }
                                },
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
                    width: 650,
                    style:{fill:'transparent'}
                },
            ];

            diagram = new Diagram({
                width: '80%',
                height: '600px',
                nodes: nodes,
            });
            diagram.appendTo('#diagramSwimlaneUndo');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Add child node to lane and check lane children collection', (done: Function) => {
            let child =  {
                id: 'newChild',
                annotations: [{ content: 'newChild' }],
                margin: { left: 190, top: 20 },
                height: 40, width: 100
            };
            let swimalne = diagram.nameTable['swimlane'];
            let lane = swimalne.shape.lanes[1];
            diagram.addNodeToLane(child,'swimlane',lane.id);
            expect(lane.children.length === 1).toBe(true);
            done();
        });
        it('Cut the lane and perform undo and check lane count and children', (done: Function) => {
            diagram.select([diagram.nameTable['swimlanestackCanvas20']]);
            let swimalne = diagram.nameTable['swimlane'];
            diagram.cut();
            let prevLaneCount = swimalne.shape.lanes.length;
            diagram.undo();
            let curLaneCount = swimalne.shape.lanes.length;
            expect(prevLaneCount !== curLaneCount && curLaneCount === 2 && swimalne.shape.lanes[1].children.length > 0).toBe(true);
            done();
        });
        it('Perform redo and check lane count', (done: Function) => {
            diagram.redo();
            let swimalne = diagram.nameTable['swimlane'];
            let prevLaneCount = swimalne.shape.lanes.length;
            diagram.undo();
            let curLaneCount = swimalne.shape.lanes.length;
            expect(prevLaneCount !== curLaneCount && curLaneCount === 2 && swimalne.shape.lanes[1].children.length > 0).toBe(true);
            done();
        });
    });

    describe('876330-After performing cut operations followed by an undo, lanes and nodes in the swimlane are not rendered properly', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let btn: HTMLButtonElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlaneUndoCut' });
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

            diagram = new Diagram({
                width: '80%',
                height: '600px',
                nodes: nodes,
            });
            diagram.appendTo('#diagramSwimlaneUndoCut');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Cut same lane multiple times and undo', (done: Function) => {
            let swimlane = diagram.nameTable['swimlane'];
            let laneCount = swimlane.shape.lanes.length;
            let lane = diagram.nameTable['swimlanestackCanvas20'];
            diagram.select([lane]);
            diagram.cut();
            diagram.undo();
            diagram.select([lane]);
            diagram.cut();
            diagram.undo();
            diagram.select([lane]);
            diagram.cut();
            let laneCutCount = swimlane.shape.lanes.length;
            diagram.undo();
            expect(laneCount !== laneCutCount).toBe(true);
            done();
        });
        it('Cut different lanes multiple times and undo', (done: Function) => {
            let swimlane = diagram.nameTable['swimlane'];
            let laneCount = swimlane.shape.lanes.length;
            let lane = diagram.nameTable['swimlanestackCanvas20'];
            let lane2 = diagram.nameTable['swimlanestackCanvas30'];
            diagram.select([lane]);
            diagram.cut();
            diagram.undo();
            diagram.select([lane2]);
            diagram.cut();
            diagram.undo();
            diagram.select([lane]);
            diagram.cut();
            diagram.select([diagram.nameTable['swimlanestackCanvas30']]);
            diagram.cut();
            diagram.undo();
            diagram.undo();
            let lane2ChildCount = swimlane.shape.lanes[1].children.length;
            let laneChildCount = swimlane.shape.lanes[2].children.length;
            let curLaneCount = swimlane.shape.lanes.length;
            expect(lane2ChildCount > 0 && laneChildCount > 0 && laneCount === curLaneCount).toBe(true);
            done();
        });
    });

    describe('Check swimlane render or not while passing element container as secondary parameter', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let btn: HTMLButtonElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlaneTransparent' });
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
                                style:{fill:'transparent'},
                                children: [

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
                    offsetX: 420, offsetY: 270,
                    height: 100,
                    width: 650,
                    style:{fill:'transparent'}
                },
            ];

            diagram = new Diagram({
                width: '80%',
                height: '600px',
                nodes: nodes,
            },'#diagramSwimlaneTransparent'
            );
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Check swimlane render or not', (done: Function) => {
            let swimlane = diagram.nodes[0];
            expect(swimlane !== undefined).toBe(true);
            done();
        });
    });

    describe('empty the lane and Check swimlane render or not while passing element container as secondary parameter', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let btn: HTMLButtonElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlaneTransparent' });
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
                            },
                        ],
                    },
                    offsetX: 420, offsetY: 270,
                    height: 100,
                    width: 650,
                    style:{fill:'transparent'}
                },
            ];

            diagram = new Diagram({
                width: '80%',
                height: '600px',
                nodes: nodes,
            },'#diagramSwimlaneTransparent'
            );
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Empty the lane check swimlane render or not', (done: Function) => {
            let swimlane = diagram.nameTable["swimlane"];
            expect(swimlane.shape.lanes.length == 1).toBe(true);
            done();
        });
        it('set the header and check swimlane render or not', (done: Function) => {
            let header = diagram.nodes[1].annotations[0].content;
            expect(header === 'ONLINE PURCHASE STATUS').toBe(true);
            done();
        });
    });
    
    describe('set multiple lane and Check swimlane render or not while passing element container as secondary parameter', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let btn: HTMLButtonElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlaneTransparent' });
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
                                style:{fill:'transparent'},
                                children: [

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
                                style:{fill:'green'},
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
                    width: 650,
                    style:{fill:'transparent'}
                },
            ];

            diagram = new Diagram({
                width: '80%',
                height: '600px',
                nodes: nodes,
            },'#diagramSwimlaneTransparent'
            );
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Check swimlane render or not for multiple lanes', (done: Function) => {
            let swimlane = diagram.nameTable["swimlane"];
            expect(swimlane.shape.lanes.length == 3).toBe(true);
            done();
        });
        it('Check swimlane render or not for adding phases', (done: Function) => {
            let swimlane = diagram.nameTable["swimlane"];
            expect(swimlane.shape.phases.length == 1).toBe(true);
            done();
        });
    });
    
    describe('878835 - selecting swimlane phase after deleting first phase without header throws error', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSwimlanePhaseSelect' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'swimlane',
                    shape: {
                        type: 'SwimLane',
                        
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
                                        id: 'selectItemaddcart',
                                        annotations: [{ content: 'Select item\nAdd cart' }],
                                        margin: { left: 190, top: 20 },
                                        height: 40, width: 100
                                    },
                                ],
                            },
                            {
                                id: 'stackCanvas2',
                                header: {
                                    annotation: { content: 'ONLINE' }, width: 50,
                                    style: { fontSize: 11 }
                                },
                                height: 100,
                            },
                        ],
                        phases: [
                            {
                                id: 'phase1', offset: 170,
                                header: { annotation: { content: 'Phase 1' } }
                            },
                            {
                                id: 'phase2',
                                header: { annotation: { content: 'Phase2' } }
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 420, offsetY: 270,
                    height: 100,
                    width: 650,
                    style:{fill:'transparent'}
                },
            ];

            diagram = new Diagram({
                width: '80%',
                height: '600px',
                nodes: nodes,
            });
            diagram.appendTo('#diagramSwimlanePhaseSelect');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('select the 1st phase and delete it then try to select the next phase', (done: Function) => {
           let diagramCanvas = document.getElementById(diagram.element.id + 'content');
           expect(diagram.nodes.length).toBe(10);
            mouseEvents.clickEvent(diagramCanvas, 163, 169);
            expect( diagram.selectedItems.nodes.length).toBe(1);
            diagram.remove();
            expect(diagram.nodes.length).toBe(7);
            mouseEvents.clickEvent(diagramCanvas, 153, 169);
            expect( diagram.selectedItems.nodes.length).toBe(1);
            done();
        }); 
    });

    describe('879085: swimlane helper guides wrongly updated when diagram is zoomed', () => {
        let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
        let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { styles: 'width:100%;height:500px;' });
            ele.appendChild(createElement('div', { id: 'symbolGuides', styles: 'width:25%;float:left;' }));
            ele.appendChild(createElement('div', { id: 'SwimlaneGuides', styles: 'width:74%;height:500px;float:left;' }));
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: '70%',
                height: '800px',

            });
            diagram.appendTo('#SwimlaneGuides');

            palette = new SymbolPalette({
                width: '25%', height: '500px',
                palettes: [
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

                ], symbolHeight: 50, symbolWidth: 50,
                symbolPreview: { width: 100, height: 100 },
                expandMode: 'Multiple',
            });
            palette.appendTo('#symbolGuides');

            diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Zoom the diagram', (done: Function) => {
            let zoomin: ZoomOptions = { type: 'ZoomIn', zoomFactor: 0.2 };
            diagram.zoomTo(zoomin);
            expect(diagram.scroller.currentZoom).toBe(1.2);
            done();
        });
        it('Drag and drop the Horizontal swmilane from palette to Diagram', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let symbols: IElement = palette.symbolTable['stackCanvas1'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };
            let events: MouseEvents = new MouseEvents();
            let ele = document.getElementById("stackCanvas1_container");
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

        it('Drag and drop new Horizontal swmilane from palette to Diagram', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let symbols: IElement = palette.symbolTable['stackCanvas1'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };
            let events: MouseEvents = new MouseEvents();
            let ele = document.getElementById("stackCanvas1_container");
            let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;
            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 555, 360, false, false);
            events.mouseMoveEvent(diagram.element, 555, 360, false, false);
            events.mouseMoveEvent(diagram.element, 555, 360, false, false);
            events.mouseUpEvent(diagram.element, 555, 360, false, false);
            expect(diagram.nodes.length).toBe(7);
            diagram.clear();
            done();
        });
        it('Drag and drop the vertical swmilane from palette to Diagram', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let symbols: IElement = palette.symbolTable['stackCanvas2'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };
            let events: MouseEvents = new MouseEvents();
            let ele = document.getElementById("stackCanvas1_container");
            let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;

            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 600, 300, false, false);
            events.mouseMoveEvent(diagram.element, 600, 305, false, false);
            events.mouseMoveEvent(diagram.element, 600, 310, false, false);
            events.mouseUpEvent(diagram.element, 600, 300, false, false);
            done();
        });

        it('Drag and drop new vertical swmilane from palette to Diagram', (done: Function) => {
            palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                let clonedElement: HTMLElement; let diagramElement: any;
                let position: PointModel = palette['getMousePosition'](e.sender);
                let symbols: IElement = palette.symbolTable['stackCanvas2'];
                palette['selectedSymbols'] = symbols;
                if (symbols !== undefined) {
                    clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                    clonedElement.setAttribute('paletteId', palette.element.id);
                }
                return clonedElement;
            };
            let events: MouseEvents = new MouseEvents();
            let ele = document.getElementById("stackCanvas1_container");
            let bounds: DOMRect = ele.getBoundingClientRect() as DOMRect;

            events.mouseDownEvent(palette.element, 75, 100, false, false);
            events.mouseMoveEvent(palette.element, 100, 100, false, false);
            events.mouseMoveEvent(palette.element, 200, 200, false, false);
            expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
            events.mouseMoveEvent(diagram.element, 660, 400, false, false);
            events.mouseMoveEvent(diagram.element, 660, 405, false, false);
            events.mouseMoveEvent(diagram.element, 660, 410, false, false);
            events.mouseUpEvent(diagram.element, 660, 410, false, false);
            expect(diagram.nodes.length).toBe(7);
            done();
        });

    });
});

describe('882239 - Fill color not applied properly while adding phase at runtime', () => {
    let diagram: Diagram; let undoOffsetX: number; let undoOffsetY: number;
    let ele: HTMLElement; let redoOffsetX: number; let redoOffsetY: number;
    let mouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { styles: 'width:100%;height:500px;' });
        ele.appendChild(createElement('div', { id: 'symbolpalette5', styles: 'width:25%;float:left;' }));
        ele.appendChild(createElement('div', { id: 'SwimlaneDiagram45', styles: 'width:74%;height:500px;float:left;' }));
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
                    orientation: 'Horizontal',
                    header: {
                        annotation: { content: 'ONLINE PURCHASE STATUS' },
                        height: 50, style: { fill: darkColor, fontSize: 11 },
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
                            header: { annotation : { content: 'Phase' } }
                        },
                        {
                            id: 'phase2', offset: 450,
                            style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: '#606060' },
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
        diagram.appendTo('#SwimlaneDiagram45');

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
                            id: 'stackCanvas1a',
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
                            id: 'stackCanvas2a',
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
                            id: 'verticalPhase1a',
                            shape: {
                                type: 'SwimLane',
                                phases: [{ style: { strokeWidth: 1, strokeDashArray: '3,3',  strokeColor: 'red',fill:'yellow' }, }],
                                annotations: [{ text: '' }],
                                orientation: 'Vertical', isPhase: true
                            },
                            height: 60,
                            width: 140
                        }, {
                            id: 'horizontalPhase1a',
                            shape: {
                                type: 'SwimLane',
                                phases: [{ style: { strokeWidth: 1, strokeDashArray: '3,3', strokeColor: 'yellow',fill:'pink' }, }],
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
        palette.appendTo('#symbolpalette5');

        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 10, 10);
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking the vertical phase fill styles in symbol palette are properly rendered in horizontal swimlane ', (done : Function) => {
      
        palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
            let clonedElement: HTMLElement; let diagramElement: any;
            let position: PointModel = palette['getMousePosition'](e.sender);
            let symbols: IElement = palette.symbolTable['verticalPhase1a'];
            palette['selectedSymbols'] = symbols;
            if (symbols !== undefined) {
                clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                clonedElement.setAttribute('paletteId', palette.element.id);
            }
            return clonedElement;
        };
       
      
        let events: MouseEvents = new MouseEvents();
        events.mouseDownEvent(palette.element, 153, 205, false, false);
        events.mouseMoveEvent(palette.element, 100, 100, false, false);
        events.mouseMoveEvent(palette.element, 200, 200, false, false);
        events.mouseMoveEvent(diagram.element, 907, 110, false, false);
        events.mouseUpEvent(diagram.element, 907, 110 , false, false);
        mouseEvents.clickEvent(diagramCanvas, 907, 100);
        expect(diagram.selectedItems.nodes[0].style.fill=="yellow").toBe(true);
      
        done();
  
    });

    it('Checking the horizontal phase fill styles in symbol palette are properly rendered in vertical swimlane ', (done : Function) => {
    
        diagram.clear();
        palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
            let clonedElement: HTMLElement; let diagramElement: any;
            let position: PointModel = palette['getMousePosition'](e.sender);
            let symbols: IElement = palette.symbolTable['stackCanvas2a'];
            palette['selectedSymbols'] = symbols;
            if (symbols !== undefined) {
                clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                clonedElement.setAttribute('paletteId', palette.element.id);
            }
            return clonedElement;
        };
       
        
        let events: MouseEvents = new MouseEvents();
        events.mouseDownEvent(palette.element, 100, 259, false, false);
        events.mouseMoveEvent(palette.element, 100, 100, false, false);
        events.mouseMoveEvent(palette.element, 200, 200, false, false);
      
        events.mouseMoveEvent(diagram.element, 1101, 130, false, false);
        events.mouseUpEvent(diagram.element, 1101, 130 , false, false);
        
       
       //For horizontal phase in swimlane
        palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
            let clonedElement: HTMLElement; let diagramElement: any;
            let position: PointModel = palette['getMousePosition'](e.sender);
            let symbols: IElement = palette.symbolTable['horizontalPhase1a'];
            palette['selectedSymbols'] = symbols;
            if (symbols !== undefined) {
                clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                clonedElement.setAttribute('paletteId', palette.element.id);
            }
            return clonedElement;
        };
      
        let events2: MouseEvents = new MouseEvents();
        events2.mouseDownEvent(palette.element, 194, 257, false, false);
        events2.mouseMoveEvent(palette.element, 100, 100, false, false);
        events2.mouseMoveEvent(palette.element, 200, 200, false, false);
      
        events2.mouseMoveEvent(diagram.element, 1101, 240, false, false);
        events2.mouseUpEvent(diagram.element, 1101, 240 , false, false);

        
       
        mouseEvents.clickEvent(diagramCanvas, 1101, 238);
       
        expect(diagram.selectedItems.nodes[0].style.fill == 'pink').toBe(true);

     
        done();
      
    });

 });


describe('879088: Swimlane throws exception when drag and drop and delete', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { styles: 'width:100%;height:500px;' });
        ele.appendChild(createElement('div', { id: 'symbolException', styles: 'width:25%;float:left;' }));
        ele.appendChild(createElement('div', { id: 'ExceptionSwim', styles: 'width:74%;height:500px;float:left;' }));
        document.body.appendChild(ele);

        diagram = new Diagram({
            width: '70%',
            height: '800px',

        });
        diagram.appendTo('#ExceptionSwim');

        palette = new SymbolPalette({
            width: '25%', height: '500px',
            palettes: [
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

            ], symbolHeight: 50, symbolWidth: 50,
            symbolPreview: { width: 100, height: 100 },
            expandMode: 'Multiple',
        });
        palette.appendTo('#symbolException');

        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 10, 10);
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    
    it('Drag and drop the swmilane from palette to Diagram - check quad Table', (done: Function) => {
        palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
            let clonedElement: HTMLElement; let diagramElement: any;
            let position: PointModel = palette['getMousePosition'](e.sender);
            let symbols: IElement = palette.symbolTable['stackCanvas1'];
            palette['selectedSymbols'] = symbols;
            if (symbols !== undefined) {
                clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                clonedElement.setAttribute('paletteId', palette.element.id);
            }
            return clonedElement;
        };
        let events: MouseEvents = new MouseEvents();
        let ele = document.getElementById("stackCanvas1_container");
        events.mouseDownEvent(palette.element, 75, 100, false, false);
        events.mouseMoveEvent(palette.element, 100, 100, false, false);
        events.mouseMoveEvent(palette.element, 200, 200, false, false);
        expect(document.getElementsByClassName('e-dragclone').length > 0).toBe(true);
        events.mouseMoveEvent(diagram.element, 500, 300, false, false);
        events.mouseMoveEvent(diagram.element, 500, 300, false, false);
        events.mouseUpEvent(diagram.element, 500, 300, false, false);
        expect((diagram as any).nodes.length === 5).toBe(true);
        diagram.selectAll();
        diagram.remove();
        expect((diagram as any).nodes.length === 0).toBe(true);
        done();
    });
});
