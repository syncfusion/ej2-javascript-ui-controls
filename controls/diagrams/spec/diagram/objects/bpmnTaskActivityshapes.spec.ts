import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeConstraints } from '../../../src/diagram/enum/enum';
import { MarginModel } from '../../../src/diagram/core/appearance-model';
import { NodeModel, BpmnSubProcessModel } from '../../../src/diagram/objects/node-model';
import { ShadowModel, RadialGradientModel, StopModel } from '../../../src/diagram/core/appearance-model';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { BpmnShape } from "../../../src/index";
Diagram.Inject(BpmnDiagrams);

/**
 * flow shapes
 */
describe('Diagram Control', () => {

    describe('BPMN Subprocess', () => {
        let diagram: Diagram;
        let shadow: ShadowModel = { distance: 10, opacity: 0.5 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                style: { strokeDashArray: '2 2', opacity: 0.6 },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { adhoc: true }
                    },
                },
            };
            let shadow1: ShadowModel = { angle: 135 };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                style: { strokeWidth: 5, },
                shadow: shadow1, constraints: NodeConstraints.Default | NodeConstraints.Shadow,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { adhoc: false, collapsed: true }
                    },

                },
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
                shadow: shadow, constraints: NodeConstraints.Default | NodeConstraints.Shadow,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { adhoc: false, boundary: 'Default', collapsed: true }
                    },

                },
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
                style: { gradient: gradient, fill: 'red' }, shadow: shadow, constraints: NodeConstraints.Default & ~NodeConstraints.Shadow,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { adhoc: false, boundary: 'Event', collapsed: true }
                    },

                },
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 900, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { adhoc: false, boundary: 'Call', collapsed: true }
                    },
                },
            };

            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: true, compensation: true }
                    },
                }
            };
            diagram = new Diagram({
                width: '1500px', height: '1500px', nodes: [node, node1, node2, node3, node4, node5]
            });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking diagram instance creation - adhoc true', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 100) &&
                //collapsed node
                (wrapper.children[1].visible === true) &&
                //loop node
                (wrapper.children[2].visible === false) &&
                (wrapper.children[3].actualSize.width === 12
                    && wrapper.children[3].actualSize.height === 8 &&
                    wrapper.children[3].offsetX === 110 && wrapper.children[3].offsetY === 141) &&
                //compensation node
                (wrapper.children[4].visible === false)
            ).toBe(true);
            done();
        });

        it('Checking diagram instance creation - adhoc false and collapsed - true', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[1] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 300 && wrapper.children[0].offsetY === 100) &&
                //collapsed node
                (wrapper.children[1].visible === true &&
                    wrapper.children[1].actualSize.width === 12
                    && wrapper.children[1].actualSize.height === 12 &&
                    (wrapper.children[1].offsetX === 302 || wrapper.children[1].offsetX === 300) && wrapper.children[1].offsetY === 139
                ) &&
                //loop node
                (wrapper.children[2].visible === false) &&
                //adhoc node
                (wrapper.children[3].visible === false) &&
                //compensation node
                (wrapper.children[4].visible === false)
            ).toBe(true);
            done();
        });

        it('Checking diagram instance creation - adhoc false, boundary-default and collapsed - true', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[2] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 500 && wrapper.children[0].offsetY === 100) &&
                //collapsed node
                (wrapper.children[1].visible === true &&
                    wrapper.children[1].actualSize.width === 12
                    && wrapper.children[1].actualSize.height === 12 &&
                    (wrapper.children[1].offsetX === 502 || wrapper.children[1].offsetX === 500) && wrapper.children[1].offsetY === 139
                ) &&
                //loop node
                (wrapper.children[2].visible === false) &&
                //adhoc node
                (wrapper.children[3].visible === false) &&
                //compensation node
                (wrapper.children[4].visible === false)
            ).toBe(true);
            done();
        });

        it('Checking diagram instance creation - adhoc false, boundary-event and collapsed - true', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[3] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 700 && wrapper.children[0].offsetY === 100 &&
                wrapper.children[0].style.strokeDashArray === '2 2') &&
                //second node
                (wrapper.children[1].actualSize.width === 12
                    && wrapper.children[1].actualSize.height === 12 &&
                    (wrapper.children[1].offsetX === 702 || wrapper.children[1].offsetX === 700) && wrapper.children[1].offsetY === 139) &&
                //loop node
                (wrapper.children[2].visible === false) &&
                //adhoc node
                (wrapper.children[3].visible === false) &&
                //compensation node
                (wrapper.children[4].visible === false)
            ).toBe(true);
            done();
        });

        it('Checking diagram instance creation - adhoc false, boundary-call and collapsed - true', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[4] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 900 && wrapper.children[0].offsetY === 100 &&
                wrapper.children[0].style.strokeDashArray === '1 0' &&
                wrapper.children[0].style.strokeWidth === 4
            ) &&
                //second node
                (wrapper.children[1].actualSize.width === 12
                    && wrapper.children[1].actualSize.height === 12 &&
                    (wrapper.children[1].offsetX === 902 || wrapper.children[1].offsetX === 900) && wrapper.children[1].offsetY === 139) &&
                //loop node
                (wrapper.children[2].visible === false) &&
                //adhoc node
                (wrapper.children[3].visible === false) &&
                //compensation node
                (wrapper.children[4].visible === false)
            ).toBe(true);
            done();
        });

        it('Checking subProcess with collapsed - true, compensation - true ', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[5] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 300) &&
                //first node
                (wrapper.children[1].actualSize.width === 12
                    && wrapper.children[1].actualSize.height === 12 &&
                    (wrapper.children[1].offsetX === 92 || wrapper.children[1].offsetX === 100) && wrapper.children[1].offsetY === 339) &&
                //loop node
                (wrapper.children[2].visible === false) &&
                //adhoc node
                (wrapper.children[3].visible === false) &&
                //compensation node
                (wrapper.children[4].actualSize.width === 12
                    && wrapper.children[4].actualSize.height === 12 &&
                    wrapper.children[4].offsetX === 110 && wrapper.children[4].offsetY === 339)
            ).toBe(true);
            done();
        });
    });

    describe('BPMN Sub Events', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
        let subeventMargin: MarginModel = { left: 10, top: 10 };
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 190, height: 190, offsetX: 300, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            type: 'Event', loop: 'ParallelMultiInstance',
                            compensation: true, adhoc: false, boundary: 'Event', collapsed: true,
                            events: [{
                                height: 20, width: 20, offset: { x: 0, y: 0 }, margin: { left: 10, top: 10 },
                                horizontalAlignment: 'Left',
                                verticalAlignment: 'Top',
                                annotations: [{
                                    id: 'label3', margin: { bottom: 10 },
                                    horizontalAlignment: 'Center',
                                    verticalAlignment: 'Top',
                                    content: 'Event', offset: { x: 0.5, y: 1 },
                                    style: {
                                        color: 'black', fontFamily: 'Fantasy', fontSize: 8
                                    }
                                }],
                                ports: [{
                                    shape: 'Square', id: 'port4',
                                    width: 6, height: 6, offset: { x: 0.5, y: 1 }, style: {
                                        strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                }],
                                event: 'Intermediate', trigger: 'Error'
                            }]
                        }
                    }
                }
            };
            let node2: NodeModel = {
                id: 'node2', width: 190, height: 190, offsetX: 500, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            type: 'Event', loop: 'ParallelMultiInstance',
                            compensation: true, adhoc: false, boundary: 'Event', collapsed: true,
                            events: [{
                                height: 20, width: 20, offset: { x: 1, y: 0.5 },
                                annotations: [{
                                    id: 'label3', margin: { bottom: 10 },
                                    horizontalAlignment: 'Center',
                                    verticalAlignment: 'Top',
                                    content: 'Event', offset: { x: 0.5, y: 1 },
                                    style: {
                                        color: 'black', fontFamily: 'Fantasy', fontSize: 8,
                                        strokeColor: 'white'
                                    }
                                }],
                                ports: [{
                                    shape: 'Square', id: 'port4',
                                    width: 6, height: 6, offset: { x: 0.5, y: 1 },
                                    style: {
                                        fill: 'lightgrey', strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                }],
                                event: 'Intermediate', trigger: 'Error'
                            },
                            {
                                height: 20, width: 20, offset: { x: 0, y: 0 },
                                annotations: [{
                                    id: 'label3', margin: sourceMargin, horizontalAlignment: 'Center',
                                    verticalAlignment: 'Center',
                                    content: 'Text', offset: { x: 0, y: 0 },
                                    style: {
                                        color: 'black', fontFamily: 'Fantasy', fontSize: 4,
                                        strokeColor: 'white',
                                    }
                                }],
                                ports:[{
                                    shape: 'Square', id: 'port4', margin: sourceMargin, horizontalAlignment: 'Right',
                                    verticalAlignment: 'Bottom',
                                    width: 6, height: 6, offset: { x: 1, y: 1 }, style: {
                                        fill: 'red', strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                }],
                                event: 'Intermediate', trigger: 'Error'
                            }]
                        }
                    }
                }
            };
            diagram = new Diagram({
                width: '1500px', height: '500px', nodes: [node1, node2]
            });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking single sub-event with ports-annotations', (done: Function) => {
            let wrapper: Canvas = ((diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 190
                && wrapper.children[0].actualSize.height === 190 &&
                wrapper.children[0].offsetX === 300 && wrapper.children[0].offsetY === 200) &&
                //second node
                (wrapper.children[1].actualSize.width === 12
                    && wrapper.children[1].actualSize.height === 12 &&
                    (Math.round(wrapper.children[1].offsetX) === 284 || wrapper.children[1].offsetX === 300) && Math.round(wrapper.children[1].offsetY) === 284) &&
                //third node
                (wrapper.children[2].actualSize.width === 20
                    && wrapper.children[2].actualSize.height === 20 &&
                    wrapper.children[2].offsetX === 225 && wrapper.children[2].offsetY === 125) &&
                //fourth node
                (wrapper.children[3].actualSize.width === 12
                    && wrapper.children[3].actualSize.height === 12 &&
                    (wrapper.children[1].offsetX === 284 || wrapper.children[1].offsetX === 300) && wrapper.children[3].offsetY === 284) &&
                //fith node
                (wrapper.children[5].actualSize.width === 12
                    && wrapper.children[5].actualSize.height === 12 &&
                    wrapper.children[5].offsetX === 318 && wrapper.children[5].offsetY === 284)
            ).toBe(true);
            done();
        });

        it('Checking mulitple sub events', (done: Function) => {
            let wrapper: Canvas = ((diagram.nodes[1] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 190
                && wrapper.children[0].actualSize.height === 190 &&
                wrapper.children[0].offsetX === 500 && wrapper.children[0].offsetY === 200) &&
                // second node
                (wrapper.children[1].actualSize.width === 12
                    && wrapper.children[1].actualSize.height === 12 &&
                    (wrapper.children[1].offsetX === 484 || wrapper.children[1].offsetX === 500) && wrapper.children[1].offsetY === 284) &&
                //   third node
                (wrapper.children[2].actualSize.width === 20
                    && wrapper.children[2].actualSize.height === 20 &&
                    wrapper.children[2].offsetX === 595 && wrapper.children[2].offsetY === 200) &&
                //     fourth node
                (wrapper.children[3].actualSize.width === 20
                    && wrapper.children[3].actualSize.height === 20 &&
                    wrapper.children[3].offsetX === 405 && wrapper.children[3].offsetY === 105) &&
                //       fith node
                (wrapper.children[6].actualSize.width === 12
                    && wrapper.children[6].actualSize.height === 12 &&
                    wrapper.children[6].offsetX === 518 && wrapper.children[6].offsetY === 284)
            ).toBe(true);
            done();
        });
    });

    describe('BPMN Sub Events rotate handle', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
        let subeventMargin: MarginModel = { left: 10, top: 10 };
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodea: NodeModel = {
                id: 'nodea', maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: false, type: 'Transaction',
                        } as BpmnSubProcessModel
                    },
                },
            };
            diagram = new Diagram({
                width: '500px', height: '500px', nodes: [nodea]
            });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking bpmn subprocess rotate handle', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            let rotateelem: HTMLCollection = document.getElementsByClassName('.e-diagram-rotate-handle');
            expect(rotateelem && rotateelem.length === 0)
            done();
        });
    });
    describe('BPMN transaction with its icon', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
        let subeventMargin: MarginModel = { left: 10, top: 10 };
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodea: NodeModel = {
                id: 'nodea', maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                offsetX: 200, offsetY: 200,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            type: 'Transaction',collapsed:false
                        } as BpmnSubProcessModel
                    },
                },
            };
            diagram = new Diagram({
                width: '500px', height: '500px', nodes: [nodea]
            });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('update icon visibility', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            (diagram.selectedItems.nodes[0].shape as BpmnShape).activity.subProcess.collapsed = true;
            (diagram.selectedItems.nodes[0].shape as BpmnShape).activity.subProcess.compensation = true;
            (diagram.selectedItems.nodes[0].shape as BpmnShape).activity.subProcess.loop = 'Standard';
            (diagram.selectedItems.nodes[0].shape as BpmnShape).activity.subProcess.adhoc = true;
            diagram.dataBind();
            
            let task = (diagram.selectedItems.nodes[0].wrapper.children[0] as Canvas).children[0];
            expect((task as Canvas).children[4].visible).toBe(true);
            expect((task as Canvas).children[5].visible).toBe(true);
            expect((task as Canvas).children[6].visible).toBe(true);
            done();
        });
    });
});