/**
 * Test cases for swimlane
 */

import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { GridPanel, RowDefinition, ColumnDefinition } from '../../../src/diagram/core/containers/grid';
import { Margin } from '../../../src/diagram/core/appearance';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { Selector } from '../../../src/diagram/interaction/selector';
import { Container } from '../../../src/diagram/core/containers/container';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';

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
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramSwimlane1' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', offsetX: 600, offsetY: 250, width: 700, height: 400,
                    shape: {
                        type: 'SwimLane', orientation: 'Horizontal',
                        header: {
                            content: { content: 'Header', style: { fill: 'gray' } },
                            phases:
                                [
                                    { header: { content: { content: 'phase1' } }, style: { fill: 'blue', opacity: .5 }, offset: 300 },
                                    { header: { content: { content: 'phase1' } }, style: { fill: 'blue', opacity: .5 }, width: 300 }],
                            lanes: [
                                {
                                    id: 'lane1',
                                    childNodes: [{
                                        id: 'node111',
                                        width: 50, height: 50,
                                        margin: { left: 520, top: 20 }
                                    }
                                        , {
                                        id: 'nodeabh',
                                        width: 50, height: 50,
                                        margin: { left: 50, top: 20 }
                                    }],
                                    style: { fill: 'red', opacity: .4 }, height: 100, header: { content: { content: 'lane1' } }
                                },
                                {
                                    id: 'lane2', height: 100,
                                    childNodes: [{
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
                                    style: { fill: 'red', opacity: .4 }, header: { content: { content: 'lane1', style: { fill: 'red' } } }
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramSwimlane11' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', offsetX: 600, offsetY: 250,
                    shape: {
                        type: 'SwimLane', orientation: 'Horizontal',
                        // headers: [{ content: 'Header', style: { fill: 'gray' } }],
                        phases: [{ headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, offset: 300 },
                        { headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, width: 300 }],
                        lanes: [
                            {
                                id: 'lane1',
                                childNodes: [{
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
                                childNodes: [{
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


    });
    // describe('Horizontal Swimlane without phase', () => {
    //     let diagram: Diagram;
    //     let ele: HTMLElement;
    //     beforeAll((): void => {
    //         ele = createElement('div', { id: 'diagramSwimlane12' });
    //         document.body.appendChild(ele);
    //         let nodes: NodeModel[] = [
    //             {
    //                 id: 'node1', offsetX: 600, offsetY: 250,
    //                 shape: {
    //                     type: 'SwimLane', orientation: 'Horizontal',
    //                     header: { content: { content: 'Header' }, style: { fill: 'gray' } },
    //                     // phases: [{ headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, offset: 300 },
    //                     // { headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, width: 300 }],
    //                     lanes: [
    //                         {
    //                             id: 'lane1',
    //                             childNodes: [{
    //                                 id: 'node111',
    //                                 width: 50, height: 50,
    //                                 margin: { left: 520, top: 20 }
    //                             }
    //                                 , {
    //                                 id: 'nodeabh',
    //                                 width: 50, height: 50,
    //                                 margin: { left: 50, top: 20 }
    //                             }],
    //                             style: { fill: 'red', opacity: .4 }, height: 100, header: { content: { content: 'lane1' } }
    //                         },
    //                         {
    //                             id: 'lane2', height: 100,
    //                             childNodes: [{
    //                                 id: 'node11d1',
    //                                 width: 50, height: 50,
    //                                 margin: { left: 520, top: 20 }
    //                             }
    //                                 , {
    //                                 id: 'nodeadbh',
    //                                 width: 50, height: 50,
    //                                 margin: { left: 50, top: 20 }
    //                             }
    //                             ],
    //                             style: { fill: 'red', opacity: .4 }, header: { content: { content: 'lane1' }, style: { fill: 'red' } }
    //                         }
    //                     ]
    //                 }
    //             },
    //         ];
    //         diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
    //         diagram.appendTo('#diagramSwimlane12');
    //     });
    //     afterAll((): void => {
    //         debugger
    //         diagram.destroy();
    //         ele.remove();
    //     });

    //     it('Checking Horizontal swimlane rendering with header, lane', (done: Function) => {
    //         expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 250).toBe(true);
    //         done();
    //     });
    // });
    // describe('Horizontal Swimlane without header and phase', () => {
    //     let diagram: Diagram;
    //     let ele: HTMLElement;
    //     beforeAll((): void => {
    //         debugger
    //         ele = createElement('div', { id: 'diagramSwimlane13' });
    //         document.body.appendChild(ele);
    //         let nodes: NodeModel[] = [
    //             {
    //                 id: 'node1', offsetX: 600, offsetY: 250,
    //                 shape: {
    //                     type: 'SwimLane', orientation: 'Horizontal',
    //                     header: { content: { content: 'Header' }, style: { fill: 'gray' } },
    //                     // phases: [{ headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, offset: 300 },
    //                     // { headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, width: 300 }],
    //                     lanes: [
    //                         {
    //                             id: 'lane1',
    //                             childNodes: [{
    //                                 id: 'node111',
    //                                 width: 50, height: 50,
    //                                 margin: { left: 520, top: 20 }
    //                             }
    //                                 , {
    //                                 id: 'nodeabh',
    //                                 width: 50, height: 50,
    //                                 margin: { left: 50, top: 20 }
    //                             }],
    //                             style: { fill: 'red', opacity: .4 }, height: 100, headers: [{ content: 'lane1' }]
    //                         },
    //                         {
    //                             id: 'lane2', height: 100,
    //                             childNodes: [{
    //                                 id: 'node11d1',
    //                                 width: 50, height: 50,
    //                                 margin: { left: 520, top: 20 }
    //                             }
    //                                 , {
    //                                 id: 'nodeadbh',
    //                                 width: 50, height: 50,
    //                                 margin: { left: 50, top: 20 }
    //                             }
    //                             ],
    //                             style: { fill: 'red', opacity: .4 }, headers: [{ content: 'lane1', style: { fill: 'red' } }]
    //                         }
    //                     ]
    //                 }
    //             },
    //         ];
    //         diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
    //         diagram.appendTo('#diagramSwimlane13');
    //     });
    //     afterAll((): void => {
    //         diagram.destroy();
    //         ele.remove();
    //     });

    //     it('Checking Horizontal swimlane rendering with header, lane', (done: Function) => {
    //         expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 250).toBe(true);
    //         done();
    //     });
    // });
    describe('Vertical Swimlane', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramSwimlane2' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 700, height: 400, offsetX: 600, offsetY: 250,
                    shape: {
                        type: 'SwimLane', orientation: 'Vertical',
                        header: { content: { content: 'Header' }, style: { fill: 'gray' } },
                        phases: [{ header: { content: { content: 'phase1' } }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 300 },
                        { header: { content: { content: 'phase2' } }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 100 }],
                        lanes: [
                            {
                                id: 'lane1',//offset:100,
                                childNodes: [{
                                    id: 'node111',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'node113rr',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, height: 100, header: { content: { content: 'lane1' } }
                            },
                            {
                                id: 'lane2', height: 100,
                                childNodes: [{
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

    });
    describe('Vertical Swimlane without header', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramSwimlane21' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 700, height: 400, offsetX: 600, offsetY: 250,
                    shape: {
                        type: 'SwimLane', orientation: 'Vertical',
                        // headers: [{ content: 'Header', style: { fill: 'gray' } }],
                        phases: [{ headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 300 },
                        { headers: { content: 'phase2' }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 100 }],
                        lanes: [
                            {
                                id: 'lane1',//offset:100,
                                childNodes: [{
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
                                childNodes: [{
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
    describe('Vertical Swimlane without phase', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramSwimlane22' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 700, height: 400, offsetX: 600, offsetY: 250,
                    shape: {
                        type: 'SwimLane', orientation: 'Vertical',
                        header: { content: { content: 'Header' }, style: { fill: 'gray' } },
                        // phases: [{ headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 300 },
                        // { headers: { content: 'phase2' }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 100 }],
                        lanes: [
                            {
                                id: 'lane1',//offset:100,
                                childNodes: [{
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
                                childNodes: [{
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramSwimlane23' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 700, height: 400, offsetX: 600, offsetY: 250,
                    shape: {
                        type: 'SwimLane', orientation: 'Vertical',
                        header: { content: { content: 'Header' }, style: { fill: 'gray' } },
                        // phases: [{ headers: { content: 'phase1' }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 300 },
                        // { headers: { content: 'phase2' }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 100 }],
                        lanes: [
                            {
                                id: 'lane1',//offset:100,
                                childNodes: [{
                                    id: 'node111',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'node113rr',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, height: 100, header: { content: { content: 'lane1' } }
                            },
                            {
                                id: 'lane2', height: 100,
                                childNodes: [{
                                    id: 'abc',
                                    width: 50, height: 50,
                                    margin: { left: 30, top: 50 }
                                }, {
                                    id: 'efg',
                                    width: 50, height: 50,
                                    margin: { left: 50, top: 150 }
                                }],
                                style: { fill: 'red', opacity: .4 }, header: { content: { content: 'lane1' }, style: { fill: 'red' } }
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
                            content: { content: 'ONLINE PURCHASE STATUS' },
                            height: 50, style: { fill: darkColor, fontSize: 11 },
                        },
                        lanes: [
                            //initialize the lanes
                            {
                                id: 'stackCanvas1',
                                //set the header properties
                                header: {
                                    content: { content: 'CUSTOMER' }, width: 50,
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
                                header: { content: { content: 'Phase' } }
                            },

                        ],
                        phaseSize: 20,
                    },
                    offsetX: 350, offsetY: 290,
                    height: 100, width: 300
                },
            ];

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane24');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking horizontal swimlane resizing', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            let x = 500; let y = 325.5;
            mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
            mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
            done();
        });

    });

    describe('Horziontal Swimlane Selection when resizing - resizeSouth', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
                            content: { content: 'ONLINE PURCHASE STATUS' },
                            height: 50, style: { fill: darkColor, fontSize: 11 },
                        },
                        lanes: [
                            //initialize the lanes
                            {
                                id: 'stackCanvas1',
                                //set the header properties
                                header: {
                                    content: { content: 'CUSTOMER' }, width: 50,
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
                                header: { content: { content: 'Phase' } }
                            },

                        ],
                        phaseSize: 20,
                    },
                    offsetX: 350, offsetY: 290,
                    height: 100, width: 300
                },
            ];

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane25');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking horizontal swimlane resizing', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            let x = 300; let y = 390;
            mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
            mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
            done();
        });

    });

    describe('Horziontal Swimlane Selection when resizing - resizeSouth', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
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
                        orientation: 'Vertical',
                        type: 'SwimLane',
                        //initialize swimlane header
                        header: {
                            content: { content: 'ONLINE PURCHASE STATUS' },
                            height: 50, style: { fill: darkColor, fontSize: 11 },
                        },
                        lanes: [
                            //initialize the lanes
                            {
                                id: 'stackCanvas1',
                                //set the header properties
                                header: {
                                    content: { content: 'CUSTOMER' }, width: 50,
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
                                header: { content: { content: 'Phase' } }
                            },

                        ],
                        phaseSize: 20,
                    },
                    offsetX: 350, offsetY: 290,
                    height: 100, width: 300
                },
            ];

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane26');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking horizontal swimlane resizing', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            let x = 300; let y = 420;
            mouseEvents.mouseDownEvent(diagramCanvas, x + diagram.element.offsetLeft, y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop);
            mouseEvents.mouseMoveEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
            mouseEvents.mouseUpEvent(diagramCanvas, x + diagram.element.offsetLeft + 20, y + diagram.element.offsetTop + 20);
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
    describe('Horziontal Swimlane Selection when resizing - resizeSouth', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramSwimlane26' });
            document.body.appendChild(ele);

            let pathData: string = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';

            let darkColor: string = '#C7D4DF';
            let lightColor: string = '#f5f5f5';

            let nodes: NodeModel[] = [
                {
                    id: 'swimlane', offsetX: 600, offsetY: 250, width: 300,
                    shape: {
                        type: 'SwimLane', orientation: 'Vertical',
                        header: { content: { content: 'Header', style: { fontSize: 20, color: 'red' } }, style: { fill: 'gray' }, height: 50 },
                        phases: [{ header: { content: { content: 'phase1' } }, style: { fill: 'blue', opacity: .5 }, width: 300, offset: 200 },
                        ],
                        lanes: [
                            {
                                id: 'lane1',
                                style: { fill: 'red', opacity: .4 }, height: 100,
                                header: {
                                    content: { content: 'lane1' }
                                }
                            },
                        ]
                    }
                },
            ];

            diagram = new Diagram({ width: 1000, height: 1000, nodes: nodes });
            diagram.appendTo('#diagramSwimlane26');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Coverage for swimlane', (done: Function) => {
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            var mouseevents = new MouseEvents();
            var swimlaneElement = document.getElementById('swimlane');
            var bounds = swimlaneElement.getBoundingClientRect();
            mouseevents.clickEvent(diagramCanvas, (bounds.left + (bounds.width / 2) + diagram.element.offsetLeft) + 20, (bounds.top + diagram.element.offsetTop) + 20);
            mouseevents.mouseDownEvent(diagramCanvas, (bounds.left + (bounds.width / 2) + diagram.element.offsetLeft + 10) + 20, (bounds.top + bounds.height + diagram.element.offsetTop) + 20);
            expect(diagram.nodes[0].offsetX == 600 && diagram.nodes[0].offsetY == 250).toBe(true);
            done();
        });
    });

});