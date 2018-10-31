import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BasicShapeModel, BpmnActivityModel, BpmnSubProcessModel } from '../../../src/diagram/objects/node-model';
import { NodeConstraints, ConnectorModel, BpmnShape, LinearGradientModel } from '../../../src/index';
import { MouseEvents } from '../../diagram/interaction/mouseevents.spec';


/**
 * Node spec
 */
describe('Diagram Control', () => {

    describe('BPMN processes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let linearGradient: LinearGradientModel;
            linearGradient = {
                //Start point of linear gradient
                x1: 0,
                y1: 0,
                //End point of linear gradient
                x2: 50,
                y2: 50,
                //Sets an array of stop objects
                stops: [{ color: "white", offset: 0 },
                { color: "darkCyan", offset: 100 }
                ],
                type: 'Linear'
            };
            let nod: NodeModel = {
                id: 'nod', width: 100, height: 100, offsetX: 300, offsetY: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                style: {
                    gradient: linearGradient
                },

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nod1: NodeModel = {
                id: 'nod1', width: 100, height: 100, offsetX: 300, offsetY: 300, margin: { top: 200 },
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nodea: NodeModel = {
                id: 'nodea', width: 400, height: 400, maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: false, type: 'Event',
                            processes: ['start', 'end', 'nod1', 'nod']
                        } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let start: NodeModel = {
                id: 'start', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
                margin: { left: 10, top: 50 }
            };

            let end: NodeModel = {
                id: 'end', shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End' } } as BpmnShape, width: 100, height: 100,
                margin: { left: 300, top: 50 }
            };
            let connector6: ConnectorModel[] = [{
                id: 'connector6', type: 'Straight', sourceID: 'start', targetID: 'nod1'
            },
            {
                id: 'connector2', type: 'Straight', sourceID: 'nod1', targetID: 'end'
            }];
            diagram = new Diagram({
                width: 1200, height: 1200, nodes: [nodea, nod, nod1, start, end], connectors: connector6
            });

            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking parent enlarge with respect to child drag', (done: Function) => {
            let ele = document.getElementById("nod_boundary");
            let value = ele.getAttribute("fill");
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['end'].wrapper;
            mouseEvents.dragAndDropEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y, node.bounds.center.x + 30, node.bounds.center.y);

            // expect(node.margin.left === 330).toBe(true);
            // done();
            expect(value ===
                "url(#nod_boundary_linear)" && diagram.nameTable['nodea'].wrapper.bounds.containsRect(diagram.nameTable['end'].wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child drag - undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            // expect(node.wrapper.margin.left === 300).toBe(true);
            // done();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child drag - redo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();

            // expect(node.wrapper.margin.left === 330).toBe(true);
            // done();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking parent enlarge with respect to child resize', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 320, 100);
            let node: NodeModel = diagram.nameTable['end'];
            let resize = node.wrapper.bounds;
            mouseEvents.clickEvent(diagramCanvas, resize.middleRight.x, resize.middleRight.y);
            mouseEvents.dragAndDropEvent(diagramCanvas, resize.middleRight.x, resize.middleRight.y, resize.middleRight.x + 100, resize.middleRight.x + 100);
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child resize - undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child resize - redo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking parent enlarge with respect to node rotate ', (done: Function) => {

            let node: NodeModel = diagram.nameTable['end'];
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child rotate - undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child rotate - redo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });

        it('Checking add child into parent', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            let resize = node.wrapper.bounds;
            mouseEvents.clickEvent(diagramCanvas, resize.center.x, resize.center.y);
            mouseEvents.dragAndDropEvent(diagramCanvas, resize.center.x, resize.center.y, 200, 100);
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking add child into parente - redo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking add child into parent - undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking remove child from parent', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 320, 100);
            let node: NodeModel = diagram.nameTable['end'];
            let resize = node.wrapper.bounds;
            mouseEvents.clickEvent(diagramCanvas, resize.center.x, resize.center.y);
            mouseEvents.dragAndDropEvent(diagramCanvas, resize.center.x, resize.center.y, resize.center.x + 400, resize.center.y + 400);
            expect(!diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking remove child from parent - undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking remove child from parente - redo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(!diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking remove child from parent - undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });

    });
    describe('BPMN processes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nod: NodeModel = {
                id: 'nod', width: 100, height: 100, offsetX: 300, offsetY: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nod1: NodeModel = {
                id: 'nod1', width: 100, height: 100, offsetX: 300, offsetY: 300, margin: { top: 200 },
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nodea: NodeModel = {
                id: 'nodea', width: 400, height: 400, maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: false, type: 'Event',
                            processes: ['start', 'end', 'nod1', 'nod']
                        } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let start: NodeModel = {
                id: 'start', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
                margin: { left: 10, top: 50 }
            };

            let end: NodeModel = {
                id: 'end', shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End' } }, width: 100, height: 100,
                margin: { left: 300, top: 50 }
            };
            let connector6: ConnectorModel[] = [{
                id: 'connector6', type: 'Straight', sourceID: 'start', targetID: 'nod1'
            },
            {
                id: 'connector2', type: 'Straight', sourceID: 'nod1', targetID: 'end'
            }];
            diagram = new Diagram({
                width: 1200, height: 1200, nodes: [nodea, nod, nod1, start, end], connectors: connector6
            });

            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking parent enlarge with respect to child drag', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');

            diagram.select([diagram.nameTable['nodea']], false);
            diagram.copy();
            diagram.paste();
            let node = diagram.nameTable[diagram.nodes[5].id].wrapper;
            mouseEvents.dragAndDropEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y, node.bounds.center.x - 5, node.bounds.center - 5);
            let node1 = diagram.nameTable['nodea'].wrapper;
            mouseEvents.dragAndDropEvent(diagramCanvas, 40, 350, node.bounds.center.x + 50, node.bounds.center - 5);

            expect(diagram.nameTable[diagram.nodes[5].id].wrapper.bounds.containsRect(diagram.nameTable['end'].wrapper.bounds)).toBe(true);
            done();
        });

    });
    describe('BPMN processes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nod: NodeModel = {
                id: 'nod', width: 100, height: 100, offsetX: 300, offsetY: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nod1: NodeModel = {
                id: 'nod1', width: 100, height: 100, offsetX: 300, offsetY: 300, margin: { top: 200 },
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nodea: NodeModel = {
                id: 'nodea', width: 400, height: 400, maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: false, type: 'Event',
                            processes: ['start', 'end', 'nod1', 'nod']
                        } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };

            let start: NodeModel = {
                id: 'start', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
                margin: { left: 10, top: 50 }
            };

            let end: NodeModel = {
                id: 'end', shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End' } }, width: 100, height: 100,
                margin: { left: 300, top: 50 }
            };

            let connector6: ConnectorModel[] = [{
                id: 'connector6', type: 'Straight', sourceID: 'start', targetID: 'nod1'
            },
            {
                id: 'connector2', type: 'Straight', sourceID: 'nod1', targetID: 'end'
            }];
            diagram = new Diagram({
                width: 1200, height: 1200, nodes: [nodea, nod, nod1, start, end], connectors: connector6
            });

            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Checking copy the BPMN sub process with processes', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['nodea'];
            diagram.select([node]);
            diagram.copy();
            diagram.paste();
            expect(diagram.nodes.length === 10).toBe(true);
            done();

        });
        it('Checking copy the BPMN sub process with processes-undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nodes.length === 5).toBe(true);
            done();

        });
        it('Checking copy the BPMN sub process with processes', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nodes.length === 10).toBe(true);
            done();

        });
        it('Checking copy the BPMN sub process with processes-undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nodes.length === 5).toBe(true);
            done();

        });

        //       it('Checking parent enlarge with respect to node rotate ', (done: Function) => {
        //     diagram.nodes[0].rotateAngle = 90;
        //     diagram.dataBind();
        //     let node: NodeModel = diagram.nameTable['end']; 
        //     expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
        //     done();
        // });
        // it('Checking updating parent  with respect to child rotate - undo', (done: Function) => {
        //     let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        //     let node: NodeModel = diagram.nameTable['end'];
        //     diagram.undo(); 
        //     expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
        //     done();
        // });
        // it('Checking updating parent  with respect to child rotate - redo', (done: Function) => {
        //     let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        //     let node: NodeModel = diagram.nameTable['end'];
        //     diagram.redo(); 
        //     expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
        //     done();
        // });

        it('Checking cut paste the BPMN sub process with processes', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['nodea'];
            diagram.select([node]);
            mouseEvents.keyDownEvent(diagramCanvas, 'X', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);
            expect(diagram.nodes.length === 5).toBe(true);
            done();
        });
        it('Checking  cut paste  the BPMN sub process with processes-undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nodes.length === 0).toBe(true);
            done();
        });
        it('Checking  cut paste  the BPMN sub process with processes', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nodes.length === 5).toBe(true);
            done();
        });


        it('Checking  delete the BPMN sub process with processes', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.select([diagram.nodes[1]]);
            diagram.remove();
            expect(diagram.nodes.length === 4).toBe(true);
            done();

        });
        it('Checking  delete the BPMN sub process with processes-undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.undo();
            expect(diagram.nodes.length === 5).toBe(true);
            done();
        });


        it('Checking  delete the BPMN sub process with processes-undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nodes.length === 4).toBe(true);
            done();
        });

    });

    describe('BPMN processes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nod: NodeModel = {
                id: 'nod', width: 100, height: 100, offsetX: 300, offsetY: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nod1: NodeModel = {
                id: 'nod1', width: 100, height: 100, offsetX: 300, offsetY: 300, margin: { top: 200 },
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nodea: NodeModel = {
                id: 'nodea', width: 400, height: 400, maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: false, type: 'Event',
                            processes: ['start', 'end', 'nod1', 'nod']
                        } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };

            let start: NodeModel = {
                id: 'start', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
                margin: { left: 10, top: 50 }
            };

            let end: NodeModel = {
                id: 'end', shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End' } }, width: 100, height: 100,
                margin: { left: 300, top: 50 }
            };

            let connector6: ConnectorModel[] = [{
                id: 'connector6', type: 'Straight', sourceID: 'start', targetID: 'nod1'
            },
            {
                id: 'connector2', type: 'Straight', sourceID: 'nod1', targetID: 'end'
            }];
            diagram = new Diagram({
                width: '74%', height: '74%', nodes: [nodea, nod, nod1, start, end], connectors: connector6
            });

            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  connectionchange of BPMN sub process with processes', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let point = diagram.connectors[1].sourcePoint
            diagram.add({
                id: 'tt', width: 100, height: 100, offsetX: 700, offsetY: 700,
                annotations: [{ content: 'Default Shape' }]
            })
            mouseEvents.clickEvent(diagramCanvas, point.x + 8, point.y);
            mouseEvents.mouseDownEvent(diagramCanvas, point.x, point.y + 8);
            mouseEvents.mouseMoveEvent(diagramCanvas, point.x + 200, point.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 700, 700);
            mouseEvents.mouseUpEvent(diagramCanvas, point.x - 200, point.y);
            mouseEvents.mouseDownEvent(diagramCanvas, point.x, point.y + 8);
            mouseEvents.mouseMoveEvent(diagramCanvas, point.x - 200, point.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, point.x + 200, point.y);
            mouseEvents.mouseUpEvent(diagramCanvas, point.x + 200, point.y);
            expect(diagram.connectors.length === 2).toBe(true);
            done();

        });
        it('Checking  connectionchange of BPMN sub process with processes -undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let point = diagram.connectors[0].sourcePoint
            diagram.undo();

            expect(diagram.connectors.length === 2).toBe(true);
            done();
        });
        it('Checking  connectionchange of BPMN sub process with processes', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let point = diagram.connectors[0].sourcePoint
            diagram.redo();

            expect(diagram.connectors.length === 2).toBe(true);
            done();
        });
        it('Checking  connectionchange of BPMN sub process with processes -undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let point = diagram.connectors[0].sourcePoint
            diagram.undo();
            expect(diagram.connectors.length === 2).toBe(true);
            done();
        });
        it('Checking  connectionchange of BPMN sub process with processes -1', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let point = diagram.connectors[0].targetPoint
            diagram.add({
                id: 'tt', width: 100, height: 100, offsetX: 700, offsetY: 700,
                annotations: [{ content: 'Default Shape' }]
            })
            mouseEvents.clickEvent(diagramCanvas, point.x, point.y - 8);
            mouseEvents.clickEvent(diagramCanvas, point.x, point.y - 8);
            mouseEvents.mouseDownEvent(diagramCanvas, point.x, point.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, point.x + 200, point.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, 350, 100);
            mouseEvents.mouseMoveEvent(diagramCanvas, 700, 700);
            mouseEvents.mouseUpEvent(diagramCanvas, point.x - 200, point.y);
            mouseEvents.mouseDownEvent(diagramCanvas, point.x, point.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, point.x - 200, point.y);
            mouseEvents.mouseMoveEvent(diagramCanvas, point.x + 200, point.y);
            mouseEvents.mouseUpEvent(diagramCanvas, point.x + 200, point.y);

            expect(diagram.connectors.length === 2).toBe(true);
            done();

        });
        it('Checking  connectionchange of BPMN sub process with processes -undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.undo();
            expect(diagram.connectors.length === 2).toBe(true);
            done();

        });
        it('Checking  connectionchange of BPMN sub process with processes', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.redo();
            expect(diagram.connectors.length === 2).toBe(true);
            done();

        });
        it('Checking remove child from parent', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 320, 100);
            let node: NodeModel = diagram.nameTable['end'];
            let resize = node.wrapper.bounds;
            mouseEvents.clickEvent(diagramCanvas, resize.center.x, resize.center.y);
            mouseEvents.dragAndDropEvent(diagramCanvas, resize.center.x, resize.center.y, resize.center.x + 400, resize.center.y + 400);
            diagram.removeProcess('end');
            expect(!diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking drop child from parent', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 320, 100);
            let node: NodeModel = diagram.nameTable['end'];
            diagram.add({
                id: 'connector211', type: 'Straight', targetID: 'end'
            });
            let resize = node.wrapper.bounds;
            mouseEvents.clickEvent(diagramCanvas, resize.center.x, resize.center.y);
            mouseEvents.dragAndDropEvent(diagramCanvas, resize.center.x, resize.center.y, 200, 200);
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking drop child from parent - undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking drop child from parente - redo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
    });

    describe('BPMN processes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let nod: NodeModel = {
                id: 'nod', width: 100, height: 100, offsetX: 700, offsetY: 700,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nod1: NodeModel = {
                id: 'nod1', width: 100, height: 100, offsetX: 300, offsetY: 300, margin: { top: 200 },
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nodea: NodeModel = {
                id: 'nodea', width: 400, height: 400, maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: false, type: 'Event',
                            processes: ['start', 'end', 'nod1', 'nod']
                        } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let start: NodeModel = {
                id: 'start', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
                margin: { left: 10, top: 50 }
            };

            let end: NodeModel = {
                id: 'end', shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End' } }, width: 100, height: 100,
                margin: { left: 300, top: 50 }
            };
            let connector6: ConnectorModel[] = [{
                id: 'connector6', type: 'Straight', sourceID: 'start', targetID: 'nod1'
            },
            {
                id: 'connector2', type: 'Straight', sourceID: 'nod1', targetID: 'end'
            }];
            diagram = new Diagram({
                width: '74%', height: '74%', nodes: [nodea, nod, nod1, start, end], connectors: connector6
            });

            diagram.appendTo('#diagram12');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking parent enlarge with respect to child drag-11', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['nod'];
            mouseEvents.dragAndDropEvent(diagramCanvas, node.wrapper.bounds.center.x, node.wrapper.bounds.center.y, 200, 100);
            expect(diagram.nameTable['nod'].processId === 'nodea').toBe(true);
            done();

        });
        it('Checking updating parent  with respect to child drag -11- undo', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.removeProcess('nod');
            diagram.removeProcess('nod');
            diagram.removeProcess('tt');
            diagram.add({
                id: 'tt', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Default Shape' }]
            })
            diagram.removeProcess('tt');
            diagram.addProcess({
                id: 'tt44', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Default Shape' }]
            } as NodeModel, 'nodea')
            let node1: NodeModel = diagram.nameTable['tt'];
            mouseEvents.dragAndDropEvent(diagramCanvas, node.wrapper.bounds.center.x, node.wrapper.bounds.center.y, 100, 200);
            expect(diagram.nameTable['nod'].processId === '').toBe(true);
            done();

        });
        // it('drop a child into sub -processes', (done: Function) => {
        //     let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        //     diagram.add({
        //         id: 'startdd', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
        //          offsetX:400,offsetY:700,
        //         margin: { left: 10, top: 50 }
        //     });
        //      diagram.add({
        //         id: 'start44', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
        //         offsetX:500,offsetY:700,
        //         margin: { left: 10, top: 50 }
        //     });
        //     diagram.add({
        //         id: 'connector6r', type: 'Straight', sourceID: 'startdd', targetID: 'start44'
        //     });
        //     let resize = diagram.nameTable['startdd'].wrapper.bounds;
        //     mouseEvents.dragAndDropEvent(diagramCanvas, resize.center.x, resize.center.y, 200, 100);
        //     console.log(diagram.nameTable['startdd'].processId);
        //     expect(diagram.nameTable['startdd'].processId).toBe('nod');
        //     done();

        // });

        it('Checking parent enlarge with respect to child drag', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['end'].wrapper;
            mouseEvents.dragAndDropEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y, node.bounds.center.x, node.bounds.center.y + 650);
            mouseEvents.dragAndDropEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y, node.bounds.center.x + 500, node.bounds.center.y);
            expect(!diagram.nameTable['nodea'].wrapper.bounds.containsRect(diagram.nameTable['end'].wrapper.bounds)).toBe(true);
            done();
        });

    });
    describe('BPMN processes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nod: NodeModel = {
                id: 'nod', width: 50, height: 50, //maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity',
                    activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: true, type: 'Event', events: [{
                                id: 'event1', offset: { x: 0, y: 0.5 }
                            }]
                        },
                    }
                }
            };
            let nod1: NodeModel = {
                id: 'nod1', width: 100, height: 100, offsetX: 300, offsetY: 300, margin: { top: 200 },
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nodea: NodeModel = {
                id: 'nodea', width: 400, height: 400, maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: true, type: 'Event',
                            processes: ['start', 'end', 'nod1', 'nod']
                        } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let start: NodeModel = {
                id: 'start', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
                margin: { left: 10, top: 50 }
            };

            let end: NodeModel = {
                id: 'end', shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End' } }, width: 100, height: 100,
                margin: { left: 300, top: 50 }
            };
            let connector6: ConnectorModel[] = [{
                id: 'connector6', type: 'Straight', sourceID: 'start', targetID: 'nod1'
            },
            {
                id: 'connector2', type: 'Straight', sourceID: 'nod1', targetID: 'end'
            }];
            diagram = new Diagram({
                width: 1200, height: 1200, nodes: [nodea, nod, nod1, start, end], connectors: connector6
            });

            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('set processess visibility true & false ', (done: Function) => {
            diagram.nodes[3].visible = false;
            diagram.dataBind();
            expect(diagram.nodes[3].visible).toBe(false);
            diagram.nodes[3].visible = true;
            diagram.dataBind();
            expect(diagram.nodes[3].visible).toBe(true);
            done()
        });
        it('set processess visibility true & false ', (done: Function) => {
            diagram.nodes[0].visible = false;
            diagram.dataBind();
            expect(diagram.nodes[0].visible).toBe(false);
            diagram.nodes[0].visible = true;
            diagram.dataBind();
            expect(diagram.nodes[0].visible).toBe(true);
            done()
        });
        it('set collapse false', (done: Function) => {
            (diagram.nodes[0].shape as BpmnShape).activity.subProcess.collapsed = false;
            diagram.dataBind()
            expect((diagram.nodes[0].shape as BpmnShape).activity.subProcess.collapsed).toBe(false);
            (diagram.nodes[0].shape as BpmnShape).activity.subProcess.collapsed = true;
            diagram.dataBind();
            expect((diagram.nodes[0].shape as BpmnShape).activity.subProcess.collapsed).toBe(true);
            done()
        });



    });


    describe('BPMN processes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nod: NodeModel = {
                id: 'nod', width: 100, height: 100, offsetX: 300, offsetY: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nod1: NodeModel = {
                id: 'nod1', width: 100, height: 100, offsetX: 300, offsetY: 300, margin: { top: 200 },
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nodea: NodeModel = {
                id: 'nodea', width: 400, height: 400, maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: false, type: 'Event',
                            processes: ['start', 'end', 'nod1', 'nod']
                        } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let start: NodeModel = {
                id: 'start', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
                margin: { left: 10, top: 50 }
            };

            let end: NodeModel = {
                id: 'end', shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End' } }, width: 100, height: 100,
                margin: { left: 300, top: 50 }
            };
            let connector6: ConnectorModel[] = [{
                id: 'connector6', type: 'Straight', sourceID: 'start', targetID: 'nod1'
            },
            {
                id: 'connector2', type: 'Straight', sourceID: 'nod1', targetID: 'end'
            }];
            diagram = new Diagram({
                width: 1200, height: 1200, nodes: [nodea, nod, nod1, start, end], connectors: connector6
            });

            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking parent enlarge with respect to child drag-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['end'].wrapper;
            mouseEvents.dragAndDropEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y, node.bounds.center.x + 30, node.bounds.center.y);

            // expect(node.margin.left === 330).toBe(true);
            // done();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(diagram.nameTable['end'].wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child drag - undo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            // expect(node.wrapper.margin.left === 300).toBe(true);
            // done();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child drag - redo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();

            // expect(node.wrapper.margin.left === 330).toBe(true);
            // done();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking parent enlarge with respect to child resize-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 320, 100);
            let node: NodeModel = diagram.nameTable['end'];
            let resize = node.wrapper.bounds;
            mouseEvents.clickEvent(diagramCanvas, resize.middleRight.x, resize.middleRight.y);
            mouseEvents.dragAndDropEvent(diagramCanvas, resize.middleRight.x, resize.middleRight.y, resize.middleRight.x + 100, resize.middleRight.x + 100);
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child resize - undo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child resize - redo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking parent enlarge with respect to node rotate-svg ', (done: Function) => {

            let node: NodeModel = diagram.nameTable['end'];
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child rotate - undo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking updating parent  with respect to child rotate - redo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });

        it('Checking add child into parent-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            let resize = node.wrapper.bounds;
            mouseEvents.clickEvent(diagramCanvas, resize.center.x, resize.center.y);
            mouseEvents.dragAndDropEvent(diagramCanvas, resize.center.x, resize.center.y, 200, 100);
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking add child into parente - redo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking add child into parent - undo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking remove child from -svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 320, 100);
            let node: NodeModel = diagram.nameTable['end'];
            let resize = node.wrapper.bounds;
            mouseEvents.clickEvent(diagramCanvas, resize.center.x, resize.center.y);
            mouseEvents.dragAndDropEvent(diagramCanvas, resize.center.x, resize.center.y, resize.center.x + 400, resize.center.y + 400);
            expect(!diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();
        });
        it('Checking remove child from parent - undo -svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking remove child from parente - redo -svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(!diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });
        it('Checking remove child from parent -  -svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
            done();

        });

    });

    describe('BPMN processes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nod: NodeModel = {
                id: 'nod', width: 100, height: 100, offsetX: 300, offsetY: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nod1: NodeModel = {
                id: 'nod1', width: 100, height: 100, offsetX: 300, offsetY: 300, margin: { top: 200 },
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nodea: NodeModel = {
                id: 'nodea', width: 400, height: 400, maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: false, type: 'Event',
                            processes: ['start', 'end', 'nod1', 'nod']
                        } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };

            let start: NodeModel = {
                id: 'start', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
                margin: { left: 10, top: 50 }
            };

            let end: NodeModel = {
                id: 'end', shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End' } }, width: 100, height: 100,
                margin: { left: 300, top: 50 }
            };

            let connector6: ConnectorModel[] = [{
                id: 'connector6', type: 'Straight', sourceID: 'start', targetID: 'nod1'
            },
            {
                id: 'connector2', type: 'Straight', sourceID: 'nod1', targetID: 'end'
            }];
            diagram = new Diagram({
                width: 1200, height: 1200, nodes: [nodea, nod, nod1, start, end], connectors: connector6
            });

            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });


        it('Checking copy the BPMN sub process with processes-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['nodea'];
            diagram.select([node]);
            diagram.copy();
            diagram.paste();
            expect(diagram.nodes.length === 10).toBe(true);
            done();

        });
        it('Checking copy the BPMN sub process with processes-undo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nodes.length === 5).toBe(true);
            done();

        });
        it('Checking copy the BPMN sub process with processes-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nodes.length === 10).toBe(true);
            done();

        });
        it('Checking copy the BPMN sub process with processes-undo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nodes.length === 5).toBe(true);
            done();

        });

        //       it('Checking parent enlarge with respect to node rotate ', (done: Function) => {
        //     diagram.nodes[0].rotateAngle = 90;
        //     diagram.dataBind();
        //     let node: NodeModel = diagram.nameTable['end']; 
        //     expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
        //     done();
        // });
        // it('Checking updating parent  with respect to child rotate - undo', (done: Function) => {
        //     let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        //     let node: NodeModel = diagram.nameTable['end'];
        //     diagram.undo(); 
        //     expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
        //     done();
        // });
        // it('Checking updating parent  with respect to child rotate - redo', (done: Function) => {
        //     let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        //     let node: NodeModel = diagram.nameTable['end'];
        //     diagram.redo(); 
        //     expect(diagram.nameTable['nodea'].wrapper.bounds.containsRect(node.wrapper.bounds)).toBe(true);
        //     done();
        // });

        it('Checking cut paste the BPMN sub process with processes-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['nodea'];
            diagram.select([node]);
            mouseEvents.keyDownEvent(diagramCanvas, 'X', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);
            expect(diagram.nodes.length === 5).toBe(true);
            done();
        });
        it('Checking  cut paste  the BPMN sub process with processes-undo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.undo();
            expect(diagram.nodes.length === 0).toBe(true);
            done();
        });
        it('Checking  cut paste  the BPMN sub process with processes-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nodes.length === 5).toBe(true);
            done();
        });


        it('Checking  delete the BPMN sub process with processes-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.select([diagram.nodes[1]]);
            diagram.remove();
            expect(diagram.nodes.length === 4).toBe(true);
            done();

        });
        it('Checking  delete the BPMN sub process with processes-undo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.undo();
            expect(diagram.nodes.length === 5).toBe(true);
            done();
        });


        it('Checking  delete the BPMN sub process with processes-undo-svg', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: NodeModel = diagram.nameTable['end'];
            diagram.redo();
            expect(diagram.nodes.length === 4).toBe(true);
            done();
        });
        it('add a processes and sub-processes -  -svg', (done: Function) => {
            diagram.add({
                id: 'node221', width: 40, height: 40, offsetX: 35, offsetY: 230, shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'Start' }
                }
            });
            diagram.add({
                id: 'nodeggg', width: 40, height: 40, offsetX: 50, offsetY: 70, shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'Start' }
                }
            });
            diagram.add({
                id: 'connector6222', type: 'Straight', sourceID: 'node221', targetID: 'nodeggg'
            })
            diagram.add({
                id: 'node213', width: 520, height: 250, offsetX: 355, offsetY: 230, constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                shape: {
                    shape: 'Activity', type: 'Bpmn',
                    activity: {
                        activity: 'SubProcess', subProcess: {
                            type: 'Transaction', collapsed: false,
                            processes: ['node221', 'nodeggg']
                        }
                    }
                }
            });
            expect(diagram.nameTable['node213'].wrapper.bounds.containsRect(diagram.nameTable['node221'].wrapper.bounds)).toBe(true);
            done();

        });

    });
    describe('BPMN processes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nod: NodeModel = {
                id: 'nod', width: 50, height: 50, //maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity',
                    activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: false, type: 'Event', events: [{
                                id: 'event1', offset: { x: 0, y: 0.5 }
                            }]
                        },
                    }
                }
            };
            let nod1: NodeModel = {
                id: 'nod1', width: 100, height: 100, offsetX: 300, offsetY: 300, margin: { top: 200 },
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,

                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: false } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let nodea: NodeModel = {
                id: 'nodea', width: 400, height: 400, maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: false, type: 'Event',
                            processes: ['start', 'nod']
                        } as BpmnSubProcessModel
                    } as BpmnActivityModel,
                },
            };
            let start: NodeModel = {
                id: 'start', shape: { type: 'Bpmn', shape: 'Event' }, width: 100, height: 100,
                margin: { left: 10, top: 50 }
            };

            let end: NodeModel = {
                id: 'end', shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End' } }, width: 100, height: 100,
                offsetX: 0, offsetY: 0,
                margin: { left: 300, top: 50 }
            };
            let connector6: ConnectorModel[] = [{
                id: 'connector6', type: 'Straight', sourceID: 'start', targetID: 'nod1'
            },
            {
                id: 'connector2', type: 'Straight', sourceID: 'nod1', targetID: 'end'
            }];
            diagram = new Diagram({
                width: 1200, height: 1200, nodes: [end, nodea, nod, nod1, start], connectors: connector6
            });

            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('drag and drop the processes with low z index ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['end'].wrapper;
            mouseEvents.dragAndDropEvent(diagramCanvas, node.bounds.center.x, node.bounds.center.y, 225, 225);
            expect((diagram.nodes[0].shape as BpmnShape).activity.subProcess.collapsed).toBe(true);
            done()
        });



    });

});