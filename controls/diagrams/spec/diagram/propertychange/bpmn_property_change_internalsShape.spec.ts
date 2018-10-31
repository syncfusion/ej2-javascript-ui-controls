import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BpmnShapeModel, BpmnSubProcessModel, BpmnActivityModel } from '../../../src/diagram/objects/node-model';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { TextStyleModel, MarginModel } from '../../../src/diagram/core/appearance-model';
import { HorizontalAlignment, VerticalAlignment, NodeConstraints } from '../../../src/diagram/enum/enum';
import { ConnectorModel, BpmnFlowModel } from '../../../src/diagram/objects/connector-model';
import { BpmnFlow } from '../../../src/diagram/index';

Diagram.Inject(BpmnDiagrams);

/**
 * BPMN Shape property changes
 */
describe('Diagram Control', () => {
    describe('Property Change - BPMN Shape - datobject and gateway', () => {
        let diagram: Diagram; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmn2' });
            document.body.appendChild(ele);
            //gateway
            let node0: NodeModel = {
                id: 'node0', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } },
            };
            //gateway
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'EventBased' } },
            };
            //gateway
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'None' } },
            };
            //dataobject 
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'DataObject', dataObject: { collection: true, type: 'Input' }
                } as BpmnShapeModel,
            };
            //dataobject-collection and type
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'DataObject', dataObject: { collection: false, type: 'Output' }
                } as BpmnShapeModel,
            };

            //dataobject-collection and type
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'DataObject', dataObject: { collection: false, type: 'None' }
                } as BpmnShapeModel,
            };

            //dataobject-collection and type
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 700, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'DataObject', dataObject: { collection: true, type: 'Input' }
                } as BpmnShapeModel,
            };
            diagram = new Diagram({
                width: '1500px', height: '500px', nodes: [node0, node1, node2, node3, node4, node5, node6]
            });
            diagram.appendTo('#bpmn2');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking gateway type change - complex', (done: Function) => {
            // gateway- gateway: { type: 'Exclusive' } 
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).gateway.type = 'Complex';
            diagram.dataBind();
            diagram.nodes[0].width = 150;
            diagram.nodes[0].height = 150;

            diagram.nodes[3].width = 150;
            diagram.nodes[3].height = 150;

            diagram.nodes[6].width = 150;
            diagram.nodes[6].height = 150;
            expect(((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).gateway.type === 'Complex').toBe(true); done();
        });
        it('Checking gateway type change - None', (done: Function) => {

            // // gateway: { type: 'EventBased' }
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).gateway.type = 'None';
            diagram.dataBind();

            expect(((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).gateway.type === 'None').toBe(true); done();
        });

        it('Checking  gateway type change-parallel', (done: Function) => {

            // // gateway: { type: 'EventBased' }
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).gateway.type = 'Parallel';
            diagram.dataBind();

            expect(((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).gateway.type === 'Parallel').toBe(true); done();
        });

        it('Checking DataObject type change', (done: Function) => {
            (diagram.nodes[3] as NodeModel).style.fill = 'lightblue';
            (diagram.nodes[3] as NodeModel).style.opacity = 0.75;
            ((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).dataObject.type = 'Output';
            ((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).dataObject.collection = false;
            diagram.dataBind();

            expect(((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).dataObject.type === 'Output' &&
                ((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).dataObject.collection === false).toBe(true); done();
        });
        it('Checking DataObject type change', (done: Function) => {
            // //dataobject dataObject: { collection: false, type: 'Output' }
            ((diagram.nodes[4] as NodeModel).shape as BpmnShapeModel).dataObject.type = 'Input';
            ((diagram.nodes[4] as NodeModel).shape as BpmnShapeModel).dataObject.collection = true;
            // dataobject - dataObject: { collection: true, type: 'Input' }
            diagram.dataBind();

            expect(((diagram.nodes[4] as NodeModel).shape as BpmnShapeModel).dataObject.type === 'Input' &&
                ((diagram.nodes[4] as NodeModel).shape as BpmnShapeModel).dataObject.collection === true).toBe(true); done();
        });
        it('Checking DataObject type change', (done: Function) => {

            // //dataobject dataObject: { collection: false, type: 'None' }
            ((diagram.nodes[5] as NodeModel).shape as BpmnShapeModel).dataObject.type = 'Input';
            ((diagram.nodes[5] as NodeModel).shape as BpmnShapeModel).dataObject.collection = true;
            // //dataobject  dataObject: { collection: true, type: 'Input' }
            ((diagram.nodes[6] as NodeModel).shape as BpmnShapeModel).dataObject.type = 'None';
            ((diagram.nodes[6] as NodeModel).shape as BpmnShapeModel).dataObject.collection = false;
            diagram.dataBind();

            expect(((diagram.nodes[6] as NodeModel).shape as BpmnShapeModel).dataObject.type === 'None' &&
                ((diagram.nodes[6] as NodeModel).shape as BpmnShapeModel).dataObject.collection === false).toBe(true); done();
        });
    });

    describe('Property Change - BPMN Shape - events', () => {
        let diagram: Diagram; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmn3' });
            document.body.appendChild(ele);
            //event- event and trigger
            let node0: NodeModel = {
                id: 'node0', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End', trigger: 'None' } },
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Intermediate', trigger: 'None' } },
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Event', event: { event: 'NonInterruptingIntermediate', trigger: 'None' } },
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Event', event: { event: 'NonInterruptingStart', trigger: 'None' } },
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 900, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'None' } },
            };
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'Event', event: { event: 'ThrowingIntermediate', trigger: 'None' } },
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Intermediate', trigger: 'Escalation' } },
            };
            let node7: NodeModel = {
                id: 'node7', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'None' } },
            };
            let node8: NodeModel = {
                id: 'node8', width: 100, height: 100, offsetX: 700, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'Conditional' } },
            };
            let node9: NodeModel = {
                id: 'node9', width: 100, height: 100, offsetX: 900, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'Message' } },
            };
            diagram = new Diagram({
                width: '1500px', height: '500px', nodes: [node0, node1, node2, node3, node4, node5, node6, node7, node8, node9]
            });
            diagram.appendTo('#bpmn3');
            diagram.dataBind();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking event property changes', (done: Function) => {

            diagram.nodes[0].width = 150;
            diagram.nodes[0].height = 150;

            diagram.nodes[9].width = 150;
            diagram.nodes[9].height = 150;

            // event: { event: 'End', trigger: 'None' } },
            diagram.nodes[1].style.fill = 'lightblue';
            diagram.nodes[1].style.opacity = 0.75;
            diagram.nodes[1].style.strokeColor = 'red';

            diagram.nodes[6].style.fill = 'lightblue';
            diagram.nodes[6].style.opacity = 0.75;
            diagram.nodes[6].style.strokeColor = 'red';
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).event.event = 'Intermediate';
            // event: { event: 'Intermediate', trigger: 'None' } },
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).event.event = 'End';
            // event: { event: 'NonInterruptingIntermediate', trigger: 'None' } },
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).event.event = 'NonInterruptingStart';
            // event: { event: 'NonInterruptingStart', trigger: 'None' } }
            ((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).event.event = 'NonInterruptingIntermediate';
            //  event: { event: 'Start', trigger: 'None' } }, 
            ((diagram.nodes[4] as NodeModel).shape as BpmnShapeModel).event.event = 'ThrowingIntermediate';
            //  event: { event: 'ThrowingIntermediate', trigger: 'None' } },
            ((diagram.nodes[5] as NodeModel).shape as BpmnShapeModel).event.event = 'Start';
            // event: { event: 'Intermediate', trigger: 'Escalation' } },
            ((diagram.nodes[6] as NodeModel).shape as BpmnShapeModel).event.trigger = 'Compensation';
            // event: { event: 'Start', trigger: 'None' } },
            ((diagram.nodes[7] as NodeModel).shape as BpmnShapeModel).event.trigger = 'Compensation';
            //event: { event: 'Start', trigger: 'Conditional' } },
            ((diagram.nodes[8] as NodeModel).shape as BpmnShapeModel).event.trigger = 'None';
            diagram.dataBind();

            expect(((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).event.event === 'Intermediate').toBe(true); done();
        });
    });

    describe('Property Change - BPMN Shape - task and loop', () => {
        let diagram: Diagram;
        let ele: HTMLElement; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };

        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmn4' });
            document.body.appendChild(ele);
            let node0: NodeModel = {
                id: 'node0', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'BusinessRule', loop: 'ParallelMultiInstance'
                        }
                    }
                },
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'None', loop: 'None'
                        }
                    }
                },
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'InstantiatingReceive', loop: 'Standard'
                        }
                    }
                },
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'Receive', loop: 'Standard', call: true
                        }
                    }
                },
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 900, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'None', loop: 'None', call: false
                        }
                    }
                },
            };
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'None', loop: 'None', compensation: true
                        }
                    }
                },
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'None', loop: 'None', compensation: false
                        }
                    }
                },
            };
            diagram = new Diagram({
                width: '1500px', height: '500px', nodes: [node0, node1, node2, node3, node4, node5, node6]
            });
            diagram.appendTo('#bpmn4');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking -  task-service', (done: Function) => {
            diagram.nodes[0].width = 150;
            diagram.nodes[0].height = 150;
            //issue
            //activity - task task: { type: 'BusinessRule', loop: 'ParallelMultiInstance' }
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.task.type = 'Service';
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.task.loop = 'SequenceMultiInstance';
            //activity - task: { type: 'None', loop: 'None' }
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.task.type = 'InstantiatingReceive';
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.task.loop = 'ParallelMultiInstance';
            //task: { type: 'InstantiatingReceive', loop: 'Standard' }
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).activity.task.type = 'None';
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).activity.task.loop = 'None';
            //         // event: { event: 'NonInterruptingStart', trigger: 'None' } }
            ((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).activity.task.call = false;
            //  event: { event: 'Start', trigger: 'None' } }, 
            ((diagram.nodes[4] as NodeModel).shape as BpmnShapeModel).activity.task.call = true;
            //  event: { event: 'ThrowingIntermediate', trigger: 'None' } },
            ((diagram.nodes[5] as NodeModel).shape as BpmnShapeModel).activity.task.compensation = false;
            // event: { event: 'Intermediate', trigger: 'Escalation' } },
            ((diagram.nodes[6] as NodeModel).shape as BpmnShapeModel).activity.task.compensation = true;
            diagram.dataBind();

            expect(((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.task.type === 'Service' &&
                (((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.task.loop === 'SequenceMultiInstance'
                )).toBe(true); done();
        });

    });

    describe('Property Change - BPMN Shape - adhoc and boundary', () => {
        let diagram: Diagram;
        let ele: HTMLElement; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };

        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmn5' });
            document.body.appendChild(ele);   //activity- subprocess -  adhoc
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event', adhoc: true, events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 },
                                event: 'Intermediate', trigger: 'Compensation'
                            }]
                        }
                    }
                },
            };  //activity-adhoc          
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event', adhoc: false, events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 },
                                event: 'Intermediate', trigger: 'Compensation'
                            }]
                        }
                    }
                },
            };
            //event- boundary
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event', boundary: 'Call', events: [{
                                height: 20, width: 20, offset: {
                                    x: 0.9, y: 0.4
                                }, event: 'Intermediate', trigger: 'Compensation'
                            }]
                        }
                    }
                },
            };
            //event-boundary
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 700, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event', boundary: 'Default',
                            events: [{ height: 20, width: 20, offset: { x: 0.9, y: 0.4 }, event: 'Intermediate', trigger: 'Compensation' }]
                        }
                    }
                },
            };
            //event- boundary
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 900, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event', boundary: 'Event', events: [{
                                height: 20, width: 20,
                                offset: { x: 0.9, y: 0.4 }, event: 'Intermediate', trigger: 'Compensation'
                            }]
                        }
                    }
                },
            };
            diagram = new Diagram({
                width: '1500px', height: '500px', nodes: [node1, node2, node4, node5, node6]
            });
            diagram.appendTo('#bpmn5');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking subprocess adhoc', (done: Function) => {
            //adhoc
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.adhoc = false;
            //adhoc
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.adhoc = true;
            //boundary
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).activity.subProcess.boundary = 'Default';
            //boundary
            ((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).activity.subProcess.boundary = 'Event';
            //boundary
            ((diagram.nodes[4] as NodeModel).shape as BpmnShapeModel).activity.subProcess.boundary = 'Call';
            diagram.dataBind();

            expect(((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.adhoc === false).toBe(true); done();
        });

    });

    describe('Property Change - BPMN Shape - loop, collapsed, compensation', () => {
        let diagram: Diagram;
        let ele: HTMLElement; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };

        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmn6' });
            document.body.appendChild(ele);   //activity- subprocess -  loop
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event', loop: 'ParallelMultiInstance', events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 },
                                event: 'Start', trigger: 'None'
                            }]
                        }
                    }
                },
            };  //activity-collapsed          
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event', events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 }, event: 'Start', trigger: 'None'
                            }]
                        }
                    }
                },
            };
            //event- collapsed
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: false, type: 'Event', events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 }, event: 'Start', trigger: 'None'
                            }]
                        }
                    }
                },
            };
            //event-compensation
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 700, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            compensation: true, type: 'Event', boundary: 'Default',
                            events: [{ height: 20, width: 20, offset: { x: 0.9, y: 0.4 }, event: 'Intermediate', trigger: 'Compensation' }]
                        }
                    }
                },
            };
            //event-compensation
            let node5a: NodeModel = {
                id: 'node5a', width: 100, height: 100, offsetX: 900, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            compensation: false, type: 'Event', boundary: 'Default',
                            events: [{ height: 20, width: 20, offset: { x: 0, y: 0 }, event: 'Intermediate', trigger: 'Conditional' }]
                        }
                    }
                },
            };
            diagram = new Diagram({
                width: '1500px', height: '500px', nodes: [node1, node2, node4, node5, node5a]
            });
            diagram.appendTo('#bpmn6');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking subprocess-loop', (done: Function) => {
            //subprocess loop
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.loop = 'SequenceMultiInstance';
            //collapsed 
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.collapsed = false;
            //collapsed
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).activity.subProcess.collapsed = true;
            //compensation
            ((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).activity.subProcess.compensation = false;
            //compensation
            ((diagram.nodes[4] as NodeModel).shape as BpmnShapeModel).activity.subProcess.compensation = true;
            diagram.dataBind();

            expect(((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.loop === 'SequenceMultiInstance').toBe(true); done();
        });
    });

    describe('Property Change - BPMN Shape', () => {
        let diagram: Diagram;
        let ele: HTMLElement; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };

        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmn7' });
            document.body.appendChild(ele);
            //activity- annotations
            let node8: NodeModel = {
                id: 'node8', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event',
                            events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 },
                                annotations: [{
                                    id: 'label3', horizontalAlignment: 'Center',
                                    verticalAlignment: 'Top',
                                    content: 'Error', offset: { x: 0.5, y: 1 },
                                    style: {
                                        color: 'black', fontSize: 12, fill: 'white',
                                        strokeColor: 'white', whiteSpace: 'PreserveAll'
                                    } as TextStyleModel
                                }],
                                ports: [{
                                    shape: 'Square', id: 'port4', margin: sourceMargin,
                                    width: 6, height: 6, offset: { x: 0, y: 0 }, style: {
                                        fill: 'red', strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                }],
                                event: 'Intermediate', trigger: 'Error'
                            }]
                        }
                    }
                },
            };
            //activity- ports
            let node9: NodeModel = {
                id: 'node9', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event',
                            events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 },
                                annotations: [{
                                    id: 'label3', horizontalAlignment: 'Center',
                                    verticalAlignment: 'Top',
                                    content: 'Error', offset: { x: 0.5, y: 1 },
                                    style: {
                                        color: 'black', fontSize: 12, fill: 'white',
                                        strokeColor: 'white', whiteSpace: 'PreserveAll'
                                    } as TextStyleModel
                                }],
                                ports: [{
                                    shape: 'Square', id: 'port4', margin: sourceMargin,
                                    width: 6, height: 6, offset: { x: 0, y: 0 }, style: {
                                        fill: 'red', strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                }],
                                event: 'Intermediate', trigger: 'Error'
                            }]
                        }
                    }
                },
            };
            diagram = new Diagram({
                width: '1500px', height: '500px', nodes: [node8, node9]
            });
            diagram.appendTo('#bpmn7');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking sub event annotation property change', (done: Function) => {
            //annotations
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].annotations[0].content = 'Link';
            //ports
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].ports[0].shape = 'Circle';
            diagram.dataBind();

            expect((((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].annotations[0].content) === 'Link'
            ).toBe(true); done();
        });


    });

    describe('Property Change - BPMN Shape - width and height, event, offset', () => {
        let diagram: Diagram;
        let ele: HTMLElement; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };

        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmn8' });
            document.body.appendChild(ele);
            //activity- width and height
            let node10: NodeModel = {
                id: 'node10', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event',
                            events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 },
                                annotations: [{
                                    id: 'label3', horizontalAlignment: 'Center',
                                    verticalAlignment: 'Top',
                                    content: 'Error', offset: { x: 0.5, y: 1 },
                                    style: {
                                        color: 'black', fontSize: 12, fill: 'white',
                                        strokeColor: 'white', whiteSpace: 'PreserveAll'
                                    } as TextStyleModel
                                }],
                                ports: [{
                                    shape: 'Square', id: 'port4', margin: sourceMargin,
                                    width: 6, height: 6, offset: { x: 0, y: 0 }, style: {
                                        fill: 'red', strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                }],
                                event: 'Intermediate', trigger: 'Error'
                            }]
                        }
                    }
                },
            };
            //activity- event
            let node15: NodeModel = {
                id: 'node15', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event', loop: 'ParallelMultiInstance', events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 },
                                event: 'Start', trigger: 'None'
                            }]
                        }
                    }
                },
            };
            //activity- offset
            let node16: NodeModel = {
                id: 'node16', width: 100, height: 100, offsetX: 500, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event', loop: 'ParallelMultiInstance', events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 },
                                event: 'Start', trigger: 'None'
                            }]
                        }
                    }
                },
            };
            diagram = new Diagram({
                width: '1500px', height: '500px', nodes: [node10, node15, node16]
            });
            diagram.appendTo('#bpmn8');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking sub event property change', (done: Function) => {

            //width and height

            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].width = 38;
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].height = 38;
            //event
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].event = 'Intermediate';
            //offset
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].offset = { x: 0, y: 0 };
            diagram.dataBind();

            expect((((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].width === 38) &&
                (((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].height === 38)
            ).toBe(true);
            done();
        });

    });

    describe('Property Change - BPMN Shape - margin and Alignmnet', () => {
        let diagram: Diagram;
        let ele: HTMLElement; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
        let subeventMargin: MarginModel = { left: 10, top: 10 };

        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmn8' });
            document.body.appendChild(ele);
            //activity- margin
            let node10: NodeModel = {
                id: 'node10', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event',
                            events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 },
                                margin: subeventMargin,
                                annotations: [{
                                    id: 'label3', horizontalAlignment: 'Center',
                                    verticalAlignment: 'Top',
                                    content: 'Error', offset: { x: 0.5, y: 1 },
                                    style: {
                                        color: 'black', fontSize: 12, fill: 'white',
                                        strokeColor: 'white', whiteSpace: 'PreserveAll'
                                    } as TextStyleModel
                                }],
                                ports: [{
                                    shape: 'Square', id: 'port4', margin: sourceMargin,
                                    width: 6, height: 6, offset: { x: 0, y: 0 }, style: {
                                        fill: 'red', strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                }],
                                event: 'Intermediate', trigger: 'Error'
                            }]
                        }
                    }
                },
            };
            //activity- alignmnet
            let node15: NodeModel = {
                id: 'node15', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event', loop: 'ParallelMultiInstance', events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 },
                                horizontalAlignment: 'Left', verticalAlignment: 'Top',
                                event: 'Start', trigger: 'None'
                            }]
                        }
                    }
                },
            };
            diagram = new Diagram({
                width: '1500px', height: '500px', nodes: [node10, node15]
            });
            diagram.appendTo('#bpmn8');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Subprocess - event - property change', (done: Function) => {
            //margin - { left: 10, top: 10 }

            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].margin.left = 25;
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].margin.top = 25;
            // horizontalAlignment: HorizontalAlignment.Left, verticalAlignment: VerticalAlignment.Top,
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel
            ).activity.subProcess.events[0].horizontalAlignment = 'Right';
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel
            ).activity.subProcess.events[0].verticalAlignment = 'Center';

            diagram.dataBind();

            expect((((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].margin.left === 25) &&
                (((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events[0].margin.top === 25)
            ).toBe(true); done();
        });

    });

    describe('Property Change - BPMN Shape -toggle - task subprocess', () => {
        let diagram: Diagram;
        let ele: HTMLElement; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };

        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmn18' });
            document.body.appendChild(ele);
            //activity- subprocess
            let node10: NodeModel = {
                id: 'node10', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess', subProcess: {
                            collapsed: true, type: 'Event',
                            events: [{
                                height: 20, width: 20, offset: { x: 0.9, y: 0.4 },
                                annotations: [{
                                    id: 'label3', horizontalAlignment: 'Center',
                                    verticalAlignment: 'Top',
                                    content: 'Error', offset: { x: 0.5, y: 1 },
                                    style: {
                                        color: 'black', fontSize: 12, fill: 'white',
                                        strokeColor: 'white', whiteSpace: 'PreserveAll'
                                    } as TextStyleModel
                                }],
                                ports: [{
                                    shape: 'Square', id: 'port4', margin: sourceMargin,
                                    width: 6, height: 6, offset: { x: 0, y: 0 }, style: {
                                        fill: 'red', strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                }],
                                event: 'Intermediate', trigger: 'Error'
                            }]
                        }
                    }
                },
            };
            //activity- event
            let node15: NodeModel = {
                id: 'node15', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity',
                    activity: {
                        activity: 'Task', task: { type: 'Script', loop: 'ParallelMultiInstance', call: false }
                    }
                },
            };
            diagram = new Diagram({
                width: '1500px', height: '500px', nodes: [node10, node15]
            });
            diagram.appendTo('#bpmn18');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Toggle -  subprocess to task', (done: Function) => {
            //subprocess to task
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.activity = 'Task';
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.task.type = 'Service';
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.task.loop = 'ParallelMultiInstance';

            //task to subprocess
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.activity = 'SubProcess';
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.type = 'Event';
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.loop = 'ParallelMultiInstance';
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.compensation = true;
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.boundary = 'Event';
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.collapsed = true;
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.events = [{
                event: 'Intermediate', trigger: 'Compensation', width: 25, height: 25
            }];
            diagram.dataBind();

            expect((((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.activity === 'Task') &&
                (((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.task.type === 'Service') &&
                (((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.task.loop === 'ParallelMultiInstance')
            ).toBe(true); done();
        });
    });

    describe('Property Change - BPMN Shape connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmn5conn' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Straight', sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 150, y: 150 }, shape: {
                    type: 'Bpmn',
                    flow: 'Sequence', sequence: 'Normal'
                } as BpmnFlowModel
            };
            let connector2: ConnectorModel = {
                id: 'connector2', type: 'Straight', sourcePoint: { x: 170, y: 170 },
                targetPoint: { x: 250, y: 250 }, shape: {
                    type: 'Bpmn',
                    flow: 'Sequence', sequence: 'Conditional'
                } as BpmnFlowModel
            };
            let connector3: ConnectorModel = {
                id: 'connector3', type: 'Straight', sourcePoint: { x: 270, y: 270 },
                targetPoint: { x: 330, y: 330 }, shape: {
                    type: 'Bpmn',
                    flow: 'Sequence', sequence: 'Default'
                } as BpmnFlowModel
            };
            let connector4: ConnectorModel = {
                id: 'connector4', type: 'Straight', sourcePoint: { x: 350, y: 350 },
                targetPoint: { x: 400, y: 400 }, shape: {
                    type: 'Bpmn',
                    flow: 'Association', association: 'BiDirectional'
                } as BpmnFlowModel
            };
            let connector5: ConnectorModel = {
                id: 'connector5', type: 'Straight', sourcePoint: { x: 430, y: 430 },
                targetPoint: { x: 500, y: 500 }, shape: {
                    type: 'Bpmn',
                    flow: 'Association', association: 'Directional'
                } as BpmnFlowModel
            };
            let connector6: ConnectorModel = {
                id: 'connector6', type: 'Straight', sourcePoint: { x: 530, y: 530 },
                targetPoint: { x: 600, y: 600 }, shape: {
                    type: 'Bpmn',
                    flow: 'Association', association: 'Default'
                } as BpmnFlowModel
            };
            let connector7: ConnectorModel = {
                id: 'connector7', type: 'Straight', sourcePoint: { x: 620, y: 620 },
                targetPoint: { x: 700, y: 700 }, shape: {
                    type: 'Bpmn',
                    flow: 'Message', message: 'Default'
                } as BpmnFlowModel
            };
            let connector8: ConnectorModel = {
                id: 'connector8', type: 'Straight',
                sourcePoint: { x: 730, y: 730 },
                targetPoint: { x: 800, y: 800 },
                shape: {
                    type: 'Bpmn',
                    flow: 'Message', message: 'InitiatingMessage'
                } as BpmnFlowModel
            };
            let connector9: ConnectorModel = {
                id: 'connector9', type: 'Straight', sourcePoint: { x: 830, y: 830 },
                targetPoint: { x: 890, y: 890 }, shape: {
                    type: 'Bpmn',
                    flow: 'Message', message: 'NonInitiatingMessage'
                } as BpmnFlowModel
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', connectors: [connector1,
                    connector2, connector3, connector4, connector5, connector6, connector7, connector8, connector9]
            });
            diagram.appendTo('#bpmn5conn');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking BPMN Flows property change', (done: Function) => {
            ((diagram.connectors[0] as ConnectorModel).shape as BpmnFlowModel).sequence = 'Conditional';
            ((diagram.connectors[1] as ConnectorModel).shape as BpmnFlowModel).sequence = 'Default';
            ((diagram.connectors[2] as ConnectorModel).shape as BpmnFlowModel).sequence = 'Normal';
            ((diagram.connectors[3] as ConnectorModel).shape as BpmnFlowModel).association = 'Directional';
            ((diagram.connectors[4] as ConnectorModel).shape as BpmnFlowModel).association = 'Default';
            ((diagram.connectors[5] as ConnectorModel).shape as BpmnFlowModel).association = 'BiDirectional';
            ((diagram.connectors[6] as ConnectorModel).shape as BpmnFlowModel).message = 'InitiatingMessage';
            ((diagram.connectors[7] as ConnectorModel).shape as BpmnFlowModel).message = 'NonInitiatingMessage';
            ((diagram.connectors[8] as ConnectorModel).shape as BpmnFlowModel).message = 'Default';
            diagram.dataBind();

            expect((((diagram.connectors[0] as ConnectorModel).shape as BpmnFlowModel).sequence === 'Conditional') &&
                (((diagram.connectors[3] as ConnectorModel).shape as BpmnFlowModel).association === 'Directional') &&
                (((diagram.connectors[6] as ConnectorModel).shape as BpmnFlowModel).message === 'InitiatingMessage')
            ).toBe(true); done();
        });
        it('Property change - BPMN Flows', (done: Function) => {
            ((diagram.connectors[0] as ConnectorModel).shape as BpmnFlow).flow = 'Message';
            ((diagram.connectors[0] as ConnectorModel).shape as BpmnFlowModel).message = 'InitiatingMessage';

            ((diagram.connectors[1] as ConnectorModel).shape as BpmnFlow).flow = 'Association';
            ((diagram.connectors[1] as ConnectorModel).shape as BpmnFlowModel).association = 'Directional';

            ((diagram.connectors[3] as ConnectorModel).shape as BpmnFlowModel).flow = 'Sequence';
            ((diagram.connectors[3] as ConnectorModel).shape as BpmnFlowModel).sequence = 'Normal';

            diagram.dataBind();

            expect((((diagram.connectors[0] as ConnectorModel).shape as BpmnFlowModel).message === 'InitiatingMessage') &&
                (((diagram.connectors[1] as ConnectorModel).shape as BpmnFlowModel).association === 'Directional') &&
                (((diagram.connectors[3] as ConnectorModel).shape as BpmnFlowModel).sequence === 'Normal')

            ).toBe(true); done();
        });
    });


    describe('checking subprocess visibility', () => {
        let diagram: Diagram;
        let ele: HTMLElement; let sourceMargin: MarginModel = { left: 5, right: 5, bottom: 5, top: 5 };
        let subeventMargin: MarginModel = { left: 10, top: 10 };

        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmn8' });
            document.body.appendChild(ele);


            diagram = new Diagram({
                width: '1500px', height: '500px', nodes: [{
                    id: 'end', shape: { type: 'Bpmn', event: { event: 'NonInterruptingStart' } }, width: 100, height: 100,
                    margin: { left: 300, top: 50 }
                },
                {
                    id: 'nodea', width: 400, height: 400, maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                    offsetX: 200, offsetY: 200,
                    visible:false,
                    shape: {
                        type: 'Bpmn', shape: 'Activity', activity: {
                            activity: 'SubProcess',
                            subProcess: {
                                collapsed: false, type: 'Event',
                                processes: ['end']
                            } as BpmnSubProcessModel
                        } as BpmnActivityModel,
                    },
                }]
            });
            diagram.appendTo('#bpmn8');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking Subprocess - event visibility ', (done: Function) => {
            let node: NodeModel = diagram.nameTable['nodea'];
            node.visible = true;
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[0].visible == true).toBe(true);
            done();
        });

    });

});