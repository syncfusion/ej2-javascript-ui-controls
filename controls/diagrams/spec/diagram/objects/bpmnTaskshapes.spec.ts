import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ShadowModel, RadialGradientModel, StopModel } from '../../../src/diagram/core/appearance-model';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
Diagram.Inject(BpmnDiagrams);

/**
 * Task shapes
 */
describe('Diagram Control', () => {

    describe('BPMN Tasks', () => {
        let diagram: Diagram;
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram96task' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'None', compensation: false,
                        }
                    },
                },
            };

            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                style: { strokeWidth: 5, },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'Service', compensation: false,
                        }
                    }
                },
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
                style: { fill: 'red', strokeWidth: 5, },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'BusinessRule', compensation: false,
                        }
                    },
                },
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
                style: { opacity: 0.6, gradient: gradient },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'InstantiatingReceive', compensation: false,
                        }
                    },
                },
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 900, offsetY: 100,
                style: { strokeWidth: 5, strokeDashArray: '2 2' },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'Manual', compensation: false,
                        }
                    },
                },
            };
            diagram = new Diagram({
                width: 1500, height: 500, nodes: [node, node1, node2, node3, node4]
            });
            diagram.appendTo('#diagram96task');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking before, after,  BPMN shape as Activity with Task and task Type as None', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 20
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 65 && wrapper.children[1].offsetY === 65)
            ).toBe(true);
            done();
        });
        it('Checking before, after,   BPMN shape as Activity with Task and task Type as Service ', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[1] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 300 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 20
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 265 && wrapper.children[1].offsetY === 65)
            ).toBe(true);
            done();
        });

        it('Checking before, after,   BPMN shape as Activity with Task and task Type as BusinessRule ', (done: Function) => {
            let wrapper: Canvas = ((diagram.nodes[2] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 500 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 20
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 465 && wrapper.children[1].offsetY === 65)
            ).toBe(true);
            done();
        });

        it('Checking before, after, BPMN shape as Activity with Task and task Type as InstantiatingReceive ', (done: Function) => {
            let wrapper: Canvas = ((diagram.nodes[3] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 700 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 20
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 665 && wrapper.children[1].offsetY === 65)
            ).toBe(true);
            done();
        });

        it('Checking visibility of the task ', (done: Function) => {
            diagram.nodes[0].visible = false;
            expect(diagram.nodes[0].visible).toBe(false);
            diagram.nodes[0].visible = true;
            expect(diagram.nodes[0].visible).toBe(true);
            done();
        });
    });


    describe('Diagram Element', () => {
        let diagram: Diagram; let shadow1: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stopscol: StopModel[] = [];
        let stops1: StopModel = { color: 'white', offset: 0 };
        stopscol.push(stops1);
        let stops2: StopModel = { color: 'red', offset: 50 };
        stopscol.push(stops2);
        let gradient1: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stopscol, type: 'Radial' };


        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram96tasks2' });
            document.body.appendChild(ele);

            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shadow: shadow1,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'Receive', compensation: false,
                        }
                    },
                },
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'Script', compensation: false,
                        }
                    },
                },
            };
            let node7: NodeModel = {
                id: 'node7', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'Send', compensation: false,
                        }
                    },
                },
            };
            let node8: NodeModel = {
                id: 'node8', width: 100, height: 100, offsetX: 700, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'User', compensation: false,
                        }
                    },

                },
            };
            diagram = new Diagram({
                width: 1500, height: 500, nodes: [node5, node6, node7, node8]
            });
            diagram.appendTo('#diagram96tasks2');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking before, after, BPMN shape as Activity with Task and task Type as Receive ', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 18
                    && wrapper.children[1].actualSize.height === 16 &&
                    wrapper.children[1].offsetY === 263 && wrapper.children[1].offsetX === 64)
            ).toBe(true);
            done();
        });
    });


    describe('Diagram Element', () => {
        let diagram: Diagram; let shadow1: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stopscol: StopModel[] = [];
        let stops1: StopModel = { color: 'white', offset: 0 };
        stopscol.push(stops1);
        let stops2: StopModel = { color: 'red', offset: 50 };
        stopscol.push(stops2);
        let gradient1: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stopscol, type: 'Radial' };


        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram961a' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                style: { fill: 'red', strokeWidth: 5, },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            loop: 'Standard',
                        }
                    },
                },
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                style: { strokeColor: 'red', strokeWidth: 5, },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            loop: 'ParallelMultiInstance',
                        }
                    },
                },
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
                style: { opacity: 0.6, fill: 'red' },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            loop: 'SequenceMultiInstance',
                        }
                    },
                },
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
                style: { gradient: gradient1 },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'InstantiatingReceive', loop: 'None',
                        }
                    },
                },
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 900, offsetY: 100,
                shadow: shadow1,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'InstantiatingReceive', loop: 'ParallelMultiInstance',
                        }
                    },
                },
            };
            diagram = new Diagram({
                width: 1500, height: 500, nodes: [node, node1, node2, node3, node4]
            });
            diagram.appendTo('#diagram961a');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking before, after,  BPMN shape as Activity with Task and task Type as None and loop as Standard', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 100
            ) &&
                //second node
                (wrapper.children[1].actualSize.width === 20
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 65 && wrapper.children[1].offsetY === 65) &&
                //third node
                (wrapper.children[2].actualSize.width === 12
                    && wrapper.children[2].actualSize.height === 12 &&
                    (wrapper.children[2].offsetX === 103 || wrapper.children[2].offsetX === 100 ) && wrapper.children[2].offsetY === 139)
            ).toBe(true);
            done();
        });
    });

    describe('Diagram Element', () => {
        let diagram: Diagram; let shadow1: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stopscol: StopModel[] = [];
        let stops1: StopModel = { color: 'white', offset: 0 };
        stopscol.push(stops1);
        let stops2: StopModel = { color: 'red', offset: 50 };
        stopscol.push(stops2);
        let gradient1: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stopscol, type: 'Radial' };


        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram961' });
            document.body.appendChild(ele);
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'Receive', loop: 'SequenceMultiInstance',
                        }
                    },
                },
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'Service', loop: 'ParallelMultiInstance', call: true,
                        }
                    },
                },
            };
            let node7: NodeModel = {
                id: 'node7', width: 100, height: 100, offsetX: 500, offsetY: 300,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 },
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task',
                        task: { call: true, compensation: false, type: 'Service', loop: 'ParallelMultiInstance' }
                    },
                }
            };
            let node8: NodeModel = {
                id: 'node8', width: 100, height: 100, offsetX: 700, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: { call: true, compensation: true, type: 'Service', loop: 'ParallelMultiInstance', }
                    },
                }
            };
            diagram = new Diagram({
                width: 1500, height: 500, nodes: [node5, node6, node7, node8]
            });
            diagram.appendTo('#diagram961');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking before, after, task Type Receive and loop as SequenceMultiInstance', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 18
                    && wrapper.children[1].actualSize.height === 16 &&
                    wrapper.children[1].offsetX === 64 && wrapper.children[1].offsetY === 263) &&
                //third node
                (wrapper.children[2].actualSize.width === 12
                    && wrapper.children[2].actualSize.height === 12 &&
                    (wrapper.children[2].offsetX === 103 || wrapper.children[2].offsetX === 100) && wrapper.children[2].offsetY === 339)
            ).toBe(true);
            done();
        });

        it('Checking before, after,  type - Service and loop - ParallelMultiInstance and call - true', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[1] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 300 && wrapper.children[0].offsetY === 300 &&
                wrapper.children[0].style.strokeWidth === 4) &&
                //second node
                (wrapper.children[1].actualSize.width === 20
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 265 && wrapper.children[1].offsetY === 265) &&
                //third node
                (wrapper.children[2].actualSize.width === 12
                    && wrapper.children[2].actualSize.height === 12 &&
                    (wrapper.children[2].offsetX === 303 || wrapper.children[2].offsetX === 300) && wrapper.children[2].offsetY === 339)
            ).toBe(true);
            done();
        });

        it('Checking before, after,call-true and compensation-false and type-Service and loop-ParallelMultiInstance', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[2] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 500 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 20
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 465 && wrapper.children[1].offsetY === 265) &&
                //third node
                (wrapper.children[2].actualSize.width === 12
                    && wrapper.children[2].actualSize.height === 12 &&
                    (wrapper.children[2].offsetX === 503 || wrapper.children[2].offsetX === 500) && wrapper.children[2].offsetY === 339) &&
                //fourth node
                (wrapper.children[3].actualSize.width === 12
                    && wrapper.children[3].actualSize.height === 12 &&
                    wrapper.children[3].offsetX === 500 && wrapper.children[3].offsetY === 339 &&
                    wrapper.children[3].visible === false)
            ).toBe(true);
            done();
        });

        it('Checking before, after,call-true and compensation-true and type-Service and loop-ParallelMultiInstance', (done: Function) => {

            let wrapper: Canvas = ((diagram.nodes[3] as NodeModel).wrapper.children[0] as Canvas).children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 700 && wrapper.children[0].offsetY === 300 &&
                wrapper.children[0].style.strokeWidth === 4) &&
                //second node
                (wrapper.children[1].actualSize.width === 20
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 665 && wrapper.children[1].offsetY === 265) &&
                //third node
                (wrapper.children[2].actualSize.width === 12
                    && wrapper.children[2].actualSize.height === 12 &&
                    (wrapper.children[2].offsetX === 690 || wrapper.children[2].offsetX === 700) && wrapper.children[2].offsetY === 339) &&
                //fourth node
                (wrapper.children[3].actualSize.width === 12
                    && wrapper.children[3].actualSize.height === 12 &&
                    wrapper.children[3].offsetX === 707 && wrapper.children[3].offsetY === 339 &&
                    wrapper.children[3].visible === true)
            ).toBe(true);
            done();
        });


    });
});
