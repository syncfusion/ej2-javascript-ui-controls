import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BpmnShapeModel } from '../../../src/diagram/objects/node-model';
import { ShapeAnnotationModel } from '../../../src/diagram/objects/annotation-model';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { HorizontalAlignment, VerticalAlignment } from '../../../src/diagram/enum/enum';
import { TextStyleModel, } from '../../../src/diagram/core/appearance-model';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { ConnectorModel, BpmnFlowModel } from '../../../src/diagram/objects/connector-model';
import { Segments, DecoratorShapes } from '../../../src/diagram/enum/enum';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';

Diagram.Inject(BpmnDiagrams);

/**
 * BPMN Shapes property change
 */
describe('Diagram Control', () => {

    describe('BPMN Shape property Changes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmna1' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'DataObject', dataObject: { collection: false, type: 'Input' } } as BpmnShapeModel
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } },
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'EventBased' } },
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Inclusive' } },
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 900, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'None' } }
            };
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'DataObject', dataObject: { collection: false, type: 'Input' } } as BpmnShapeModel
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } },
            };
            let node7: NodeModel = {
                id: 'node7', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'EventBased' } },
            };
            let node8: NodeModel = {
                id: 'node8', width: 100, height: 100, offsetX: 700, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'Message' } as BpmnShapeModel
            };
            diagram = new Diagram({
                width: '1500px', height: '600px', nodes: [node,
                    node1, node2, node3, node4, node5, node6, node7, node8]
            });
            diagram.appendTo('#bpmna1');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking data object to gateway', (done: Function) => {
            // gateway
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).shape = 'Gateway';
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).gateway.type = 'Complex';
            diagram.dataBind();
            expect((((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).shape === 'Gateway') &&
                (((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).gateway.type === 'Complex')).toBe(true); done();
        });
        it('Checking gateway to data object', (done: Function) => {
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).shape = 'DataObject';
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).dataObject.type = 'Output';
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).dataObject.collection = true;
            diagram.dataBind();
            // dataobject
            expect((((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).shape === 'DataObject') &&
                (((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).dataObject.type === 'Output') &&
                (((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).dataObject.collection === true)
            ).toBe(true); done();
        });

        it('Checking gateway to event', (done: Function) => {
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).shape = 'Event';
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).event.event = 'Intermediate';
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).event.trigger = 'Error';
            // //events
            diagram.dataBind();
            expect((((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).shape === 'Event') &&
                (((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).event.event === 'Intermediate') &&
                (((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).event.trigger === 'Error')
            ).toBe(true); done();
        });

        it('Checking gateway, event to activity', (done: Function) => {
            ((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).shape = 'Activity';
            ((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).activity.task.type = 'Service';
            //activity - task
            ((diagram.nodes[4] as NodeModel).shape as BpmnShapeModel).shape = 'Activity';
            ((diagram.nodes[4] as NodeModel).shape as BpmnShapeModel).activity.task.type = 'Service';
            ((diagram.nodes[4] as NodeModel).shape as BpmnShapeModel).activity.task.loop = 'ParallelMultiInstance';
            //activity- task with loop type
            diagram.dataBind();
            expect(((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).shape === 'Activity' &&
                ((diagram.nodes[3] as NodeModel).shape as BpmnShapeModel).activity.task.type === 'Service'
            ).toBe(true); done();
        });

        it('Checking data object to message shape', (done: Function) => {
            ((diagram.nodes[5] as NodeModel).shape as BpmnShapeModel).shape = 'Message';
            //   message
            diagram.dataBind();
            expect(((diagram.nodes[5] as NodeModel).shape as BpmnShapeModel).shape === 'Message').toBe(true); done();
        });

        it('Gateway to Data source property change', (done: Function) => {
            ((diagram.nodes[6] as NodeModel).shape as BpmnShapeModel).shape = 'DataSource';
            diagram.dataBind();
            expect(((diagram.nodes[6] as NodeModel).shape as BpmnShapeModel).shape === 'DataSource').toBe(true); done();
        });

        it('Checking message to activity', (done: Function) => {
            ((diagram.nodes[8] as NodeModel).shape as BpmnShapeModel).shape = 'Activity';
            ((diagram.nodes[8] as NodeModel).shape as BpmnShapeModel).activity.task.type = 'Service';
            ((diagram.nodes[8] as NodeModel).shape as BpmnShapeModel).activity.task.loop = 'ParallelMultiInstance';
            diagram.dataBind();
            expect(((diagram.nodes[8] as NodeModel).shape as BpmnShapeModel).shape === 'Activity').toBe(true); done();

        });
    });

    describe('Change the bpmn shapes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmna2' });
            document.body.appendChild(ele);
            let node9: NodeModel = {
                id: 'node9', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'DataSource' } as BpmnShapeModel
            };
            let node11: NodeModel = {
                id: 'node11', width: 100, height: 100, offsetX: 700, offsetY: 500,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: { type: 'Service', compensation: false, }
                    }
                } as BpmnShapeModel,
            };
            let node13: NodeModel = {
                id: 'node13', width: 100, height: 100, offsetX: 500, offsetY: 500,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            type: 'Event', loop: 'ParallelMultiInstance',
                            compensation: true, adhoc: false, boundary: 'Event', collapsed: true,
                            events: [{
                                height: 20, width: 20, offset: { x: 0, y: 0 },
                                annotations: [{
                                    id: 'label3', horizontalAlignment: 'Center',
                                    verticalAlignment: 'Center',
                                    content: 'Text', offset: { x: 0, y: 0 },
                                    style: {
                                        color: 'black', fill: 'red', fontFamily: 'Fantasy', fontSize: 12,
                                        strokeColor: 'white',
                                    } as TextStyleModel
                                } as ShapeAnnotationModel],
                                ports: [{
                                    shape: 'Square', id: 'port4', horizontalAlignment: 'Right',
                                    verticalAlignment: 'Bottom',
                                    width: 6, height: 6, offset: { x: 1, y: 1 }, style: {
                                        fill: 'red', strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                } as PointPortModel],
                                event: 'Intermediate', trigger: 'Error'
                            }]
                        }
                    }
                } as BpmnShapeModel
            };
            diagram = new Diagram({ width: '1500px', height: '600px', nodes: [node9, node11, node13] });
            diagram.appendTo('#bpmna2');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking data source to event', (done: Function) => {

            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).shape = 'Event';
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).event.event = 'Intermediate';
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).event.trigger = 'Error';
            diagram.dataBind();
            expect(((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).shape === 'Event' &&
                ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).event.event === 'Intermediate' &&
                ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).event.trigger === 'Error').toBe(true);
            done();

        });
        it('Checking activity to message', (done: Function) => {
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).shape = 'Message';
            diagram.dataBind();
            expect((((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).shape === 'Message')).toBe(true); done();
        });
    });

    describe('Change the bpmn subprocess shapes ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'bpmnsubprocess' });
            document.body.appendChild(ele);
            let node9: NodeModel = {
                id: 'node9', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            type: 'Event', loop: 'ParallelMultiInstance',
                            compensation: true, adhoc: false, boundary: 'Event', collapsed: true,
                            events: [{
                                height: 20, width: 20, offset: { x: 0, y: 0 },
                                annotations: [{
                                    id: 'label3', horizontalAlignment: 'Center',
                                    verticalAlignment: 'Center',
                                    content: 'Text', offset: { x: 0, y: 0 },
                                    style: {
                                        color: 'black', fill: 'red', fontFamily: 'Fantasy', fontSize: 12,
                                        strokeColor: 'white',
                                    } as TextStyleModel
                                } as ShapeAnnotationModel],
                                ports: [{
                                    shape: 'Square', id: 'port4', horizontalAlignment: 'Right',
                                    verticalAlignment: 'Bottom',
                                    width: 6, height: 6, offset: { x: 1, y: 1 }, style: {
                                        fill: 'red', strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                } as PointPortModel],
                                event: 'Intermediate', trigger: 'Error'
                            }]
                        }
                    }
                } as BpmnShapeModel
            };
            let node10: NodeModel = {
                id: 'node10', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            type: 'Event', loop: 'ParallelMultiInstance',
                            compensation: true, adhoc: false, boundary: 'Event', collapsed: true,
                            events: [{
                                height: 20, width: 20, offset: { x: 0, y: 0 },
                                annotations: [{
                                    id: 'label3', horizontalAlignment: 'Center',
                                    verticalAlignment: 'Center',
                                    content: 'Text', offset: { x: 0, y: 0 },
                                    style: {
                                        color: 'black', fill: 'red', fontFamily: 'Fantasy', fontSize: 12,
                                        strokeColor: 'white',
                                    } as TextStyleModel
                                } as ShapeAnnotationModel],
                                ports: [{
                                    shape: 'Square', id: 'port4', horizontalAlignment: 'Right',
                                    verticalAlignment: 'Bottom',
                                    width: 6, height: 6, offset: { x: 1, y: 1 }, style: {
                                        fill: 'red', strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                } as PointPortModel],
                                event: 'Intermediate', trigger: 'Error'
                            }]
                        }
                    }
                } as BpmnShapeModel
            };
            let node11: NodeModel = {
                id: 'node11', width: 100, height: 100, offsetX: 700, offsetY: 500,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            type: 'Event', loop: 'ParallelMultiInstance',
                            compensation: true, adhoc: false, boundary: 'Event', collapsed: true,
                            events: [{
                                height: 20, width: 20, offset: { x: 0, y: 0 },
                                annotations: [{
                                    id: 'label3', horizontalAlignment: 'Center',
                                    verticalAlignment: 'Center',
                                    content: 'Text', offset: { x: 0, y: 0 },
                                    style: {
                                        color: 'black', fill: 'red', fontFamily: 'Fantasy', fontSize: 12,
                                        strokeColor: 'white',
                                    } as TextStyleModel
                                } as ShapeAnnotationModel],
                                ports: [{
                                    shape: 'Square', id: 'port4', horizontalAlignment: 'Right',
                                    verticalAlignment: 'Bottom',
                                    width: 6, height: 6, offset: { x: 1, y: 1 }, style: {
                                        fill: 'red', strokeColor: 'black', strokeWidth: 2, opacity: 1
                                    }
                                } as PointPortModel],
                                event: 'Intermediate', trigger: 'Error'
                            }]
                        }
                    }
                } as BpmnShapeModel,
            };
            diagram = new Diagram({ width: '1500px', height: '600px', nodes: [node9, node10, node11,] });
            diagram.appendTo('#bpmnsubprocess');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking subprocess changes compensation, adhoc enabling', (done: Function) => {
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.loop = 'SequenceMultiInstance';
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.compensation = true;
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.adhoc = true;
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.boundary = 'Call';
            ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.collapsed = false;
            diagram.dataBind();
            expect(((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.loop === 'SequenceMultiInstance' &&
                ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.compensation === true &&
                ((diagram.nodes[0] as NodeModel).shape as BpmnShapeModel).activity.subProcess.adhoc === true).toBe(true);
            done();

        });
        it('Checking subprocess changes compensation, adhoc disabling', (done: Function) => {
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.loop = 'ParallelMultiInstance';
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.compensation = false;
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.adhoc = false;
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.boundary = 'Default';
            ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.collapsed = true;
            diagram.dataBind();
            expect(((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.compensation === false &&
                ((diagram.nodes[1] as NodeModel).shape as BpmnShapeModel).activity.subProcess.boundary === 'Default').toBe(true);
            done();
        });
        it('Checking subprocess boundary as event', (done: Function) => {
            ((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).activity.subProcess.boundary = 'Event';
            diagram.dataBind();
            expect((((diagram.nodes[2] as NodeModel).shape as BpmnShapeModel).activity.subProcess.boundary === 'Event')).toBe(true);
            done();

        });
    });
});