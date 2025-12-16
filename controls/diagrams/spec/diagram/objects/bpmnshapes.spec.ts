import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { Node } from '../../../src/diagram/objects/node';
import { NodeModel, BpmnShapeModel, BpmnGatewayModel, BpmnSubProcessModel } from '../../../src/diagram/objects/node-model';
import { ShapeStyleModel, ShadowModel } from '../../../src/diagram/core/appearance-model';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { NodeConstraints } from '../../../src/diagram/enum/enum';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
import { ConnectorModel } from '../../../src';
import { BpmnFlowModel, HierarchicalTree, } from '../../../src/diagram/index';
import { MouseEvents } from '../interaction/mouseevents.spec';
Diagram.Inject(BpmnDiagrams,HierarchicalTree);

/**
 * BPMN shapes -  Message, DataSource, Group
 */
describe('Diagram Control', () => {

    describe('BPMN Shapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);
            let shadow: ShadowModel = { distance: 10, opacity: 0.5 };
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'DataObject', dataObject: { type: 'Input', collection: true } } as BpmnShapeModel,
                shadow: shadow, constraints: NodeConstraints.Default | NodeConstraints.Shadow
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'DataSource' } as BpmnShapeModel
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Group' }
            };
            let node3: NodeModel = {
                id: 'node2', offsetX: 700, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'DataObject', dataObject: { type: 'Input', collection: true } } as BpmnShapeModel
            };
            diagram = new Diagram({
                width: 1500, height: 500, nodes: [node, node1, node2,
                    node3]
            });
            diagram.appendTo('#diagram1');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('BPMN shapes -  Message', (done: Function) => {

            let path: PathElement = (diagram.nodes[0] as Node).wrapper.children[0] as PathElement;
            expect(path.offsetX === 100 && path.offsetY === 100).toBe(true);
            done();
        });
     });
    describe('BPMN Shapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let shadow: ShadowModel = { distance: 10, opacity: 0.5 };
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'DataObject', dataObject: { type: 'Input', collection: true } } as BpmnShapeModel,
                shadow: shadow, constraints: NodeConstraints.Default & ~NodeConstraints.Shadow
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'DataSource' } as BpmnShapeModel, shadow: shadow, constraints: NodeConstraints.Default | NodeConstraints.Shadow

            };
            let node2: NodeModel = {
                id: 'node2', offsetX: 500, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Message' }, shadow: shadow, constraints: NodeConstraints.Default & ~NodeConstraints.Shadow

            };
            let node3: NodeModel = {
                id: 'node3', offsetX: 700, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'DataSource' } as BpmnShapeModel, shadow: shadow, constraints: NodeConstraints.Default | NodeConstraints.Shadow
            };
            diagram = new Diagram({
                width: 1500, height: 500, nodes: [node, node1, node2,
                    node3]
            });
            diagram.appendTo('#diagram2');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking BPMN shapes -  Message', (done: Function) => {

            let path: PathElement = (diagram.nodes[0] as Node).wrapper.children[0] as PathElement;
            expect(path.offsetX === 100 && path.offsetY === 100).toBe(true);
            done();
        });
       });

    describe('BPMN Shapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let shadow: ShadowModel = { distance: 10, opacity: 0.5 };
            let nodes: NodeModel[] = [{
                id: 'node', offsetX: 100, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'DataObject', dataObject: { type: 'Input', collection: true } } as BpmnShapeModel
            }, {
                id: 'node1', offsetX: 300, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'Event' } as BpmnShapeModel

            }, {
                id: 'node2', offsetX: 500, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Gateway' }, shadow: shadow, constraints: NodeConstraints.Default & ~NodeConstraints.Shadow

            }, {
                id: 'node3', offsetX: 700, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'Activity' } as BpmnShapeModel
            },
            {
                id: 'node4', offsetX: 100, offsetY: 400,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'SubProcess' } } as BpmnShapeModel
            },
            {
                id: 'node5', offsetX: 400, offsetY: 400,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task' } } as BpmnShapeModel
            },
            {
                id: 'node6', offsetX: 700, offsetY: 400,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task', task: { type: 'BusinessRule' } } } as BpmnShapeModel
            },
            {
                id: 'node7', offsetX: 700, offsetY: 400, minWidth: 50, minHeight: 50,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task', task: { type: 'BusinessRule' } } } as BpmnShapeModel
            },
            {
                id: 'node8', offsetX: 700, offsetY: 400, maxHeight: 40, maxWidth: 40,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task', task: { type: 'BusinessRule' } } } as BpmnShapeModel
            },
            {
                id: 'node9', offsetX: 100, offsetY: 600, maxHeight: 40, maxWidth: 40,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { type: 'Transaction' }
                    }
                } as BpmnShapeModel
            }];
            diagram = new Diagram({
                width: 1000, height: 500, nodes: nodes
            });
            diagram.appendTo('#diagram3');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking BPMN shapes without size', (done: Function) => {
            expect(Math.round((diagram.nodes[0] as NodeModel).wrapper.actualSize.width)).toBe(34);
            expect(Math.round((diagram.nodes[0] as NodeModel).wrapper.actualSize.height)).toBe(40);

            expect(Math.round((diagram.nodes[1] as NodeModel).wrapper.actualSize.width)).toBe(29);
            expect(Math.round((diagram.nodes[1] as NodeModel).wrapper.actualSize.height)).toBe(29);

            expect(Math.round((diagram.nodes[2] as NodeModel).wrapper.actualSize.width)).toBe(40);
            expect(Math.round((diagram.nodes[2] as NodeModel).wrapper.actualSize.height)).toBe(40);

            expect(Math.round((diagram.nodes[3] as NodeModel).wrapper.actualSize.width)).toBe(50);
            expect(Math.round((diagram.nodes[3] as NodeModel).wrapper.actualSize.height)).toBe(50);

            expect(Math.round((diagram.nodes[4] as NodeModel).wrapper.actualSize.width)).toBe(50);
            expect(Math.round((diagram.nodes[4] as NodeModel).wrapper.actualSize.height)).toBe(50);

            expect(Math.round((diagram.nodes[5] as NodeModel).wrapper.actualSize.width)).toBe(50);
            expect(Math.round((diagram.nodes[5] as NodeModel).wrapper.actualSize.height)).toBe(50);

            expect(Math.round((diagram.nodes[6] as NodeModel).wrapper.actualSize.width)).toBe(50);
            expect(Math.round((diagram.nodes[6] as NodeModel).wrapper.actualSize.height)).toBe(50);
            expect(Math.round((diagram.nodes[7] as NodeModel).wrapper.actualSize.height)).toBe(50);
            expect(Math.round((diagram.nodes[7] as NodeModel).wrapper.actualSize.width)).toBe(50);
            expect(Math.round((diagram.nodes[8] as NodeModel).wrapper.actualSize.height)).toBe(40);
            expect(Math.round((diagram.nodes[8] as NodeModel).wrapper.actualSize.width)).toBe(40);
            expect(Math.round((diagram.nodes[9] as NodeModel).wrapper.actualSize.height)).toBe(40);
            expect(Math.round((diagram.nodes[9] as NodeModel).wrapper.actualSize.width)).toBe(40);

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
    describe('BPMN Shapes trigger change run time change issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let connectors: ConnectorModel[] = [
                {
                  id: 'Connector1',
                  sourceID: 'node0',
                  targetID: 'node1',
                  shape: {
                    type: 'Bpmn',
                    flow: 'Sequence',
                    sequence: 'Default'
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
                },
              ];
            
            
            let nodes: NodeModel[] = [
                {
                  id: 'node0',
                  offsetX: 100,
                  offsetY: 100,
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
                  }
                },
                {
                    id: 'node1',
                    offsetX: 250,
                    offsetY: 250,
                    width: 90,
                    height: 60,
                    annotations: [
                      {
                        content: 'Activity 1'
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
                              offset: 30,
                              opacity: 0.1
                          },
                          {
                              color: '#d8ecdc',
                              offset: 100,
                              opacity: 0.1
                          }
                        ],
                        type: 'Linear'
                      }
                    }
                  },
               
              ];
               diagram = new Diagram({
                width: 1000, height: 500, nodes: nodes,connectors:connectors,
            });
            diagram.appendTo('#diagram4');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('BPMN Shapes trigger change run time change issue', (done: Function) => {
            var node= diagram.nodes[0];
            (node.shape as BpmnShapeModel).event.trigger = 'Message'
            diagram.dataBind();
            let nodeElement = document.getElementById('node0_2_trigger_groupElement')
            expect(nodeElement.children[0].getAttribute('d')==="M0,0 L8.02,6.02 L16.2,0 L0,0 L0,12 L16.2,12 L16.2,0 ").toBe(true);
            (node.shape as BpmnShapeModel).event.trigger = 'Timer'
            diagram.dataBind();
            let newelement = document.getElementById('node0_2_trigger_groupElement')
            expect(newelement.children[0].getAttribute('d')==="M15,7.5 C15,10.75,12.94,13.51,10.05,14.55 C9.26,14.84,8.4,15,7.5,15 C3.36,15,0,11.64,0,7.5 C0,3.3599999999999994,3.36,0,7.5,0 C11.64,0,15,3.36,15,7.5 Z M7.5,0 L7.5,0.97 L7.5,1.98 M3.76,1.01 L4.37,2.07 L4.75,2.72 M1.02,3.75 L2.26,4.46 L2.74,4.74 M0.03,7.49 L1,7.49 L2.01,7.49 M1.03,11.23 L2.15,10.58 L2.75,10.24 M3.77,13.96 L4.23,13.16 L4.76,12.25 M7.51,14.96 L7.51,13.66 L7.51,12.98 M11.25,13.96 L10.83,13.23 L10.26,12.24 M13.99,11.22 L12.98,10.63 L12.27,10.23 M14.99,7.47 L14.03,7.47 L13.01,7.47 M13.98,3.74 L12.97,4.32 L12.27,4.73 M11.24,1 L10.74,1.86 L10.25,2.71 M8.29,3.19 L7.38,7.5 L9.28,7.5 L11.85,7.5 L9.28,7.5 L7.38,7.5 Z ").toBe(true);

            (<BpmnShapeModel> diagram.nodes[1].shape) = {
                type: 'Bpmn',
                shape: 'Activity',
                activity: {
                    activity: 'SubProcess',
                    subProcess: {
                      collapsed: true,
                      boundary: 'Default'
                    }
                }
            }; 
            diagram.dataBind();
            let element = document.getElementById('node1_groupElement')
            expect(element.children[0].getAttribute('x')==="205").toBe(true);
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
    describe('Child is not positioned properly when calling doLayout() method', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);
            let connectors: ConnectorModel[] = [
                {
                    id: 'Connector1',
                    sourceID: 'node1',
                    targetID: 'node2',
                    shape: {
                        type: 'Bpmn',
                        flow: 'Sequence',
                        sequence: 'Default'
                      },
                    style: {
                        strokeDashArray: '2,2'
                    },
                    targetDecorator: {
                        shape: 'None'
                    },
                    type: 'Orthogonal',
                    cornerRadius: 10
                },
                {
                    id: 'Connector2',
                    sourceID: 'node1',
                    targetID: 'node3',
                    style: {
                        strokeDashArray: '2,2'
                    },
                    targetDecorator: {
                        shape: 'None'
                    },
                    type: 'Orthogonal',
                    cornerRadius: 10
                },
                {
                    id: 'Connector3',
                    sourceID: 'node2',
                    targetID: 'node4',
                    style: {
                        strokeDashArray: '2,2'
                    },
                    targetDecorator: {
                        shape: 'None'
                    },
                    type: 'Orthogonal',
                    cornerRadius: 10
                },
                {
                    id: 'Connector4',
                    sourceID: 'node3',
                    targetID: 'node5',
                    style: {
                        strokeDashArray: '2,2'
                    },
                    targetDecorator: {
                        shape: 'None'
                    },
                    type: 'Orthogonal',
                    cornerRadius: 10
                }
              ]
            
            let nodes: NodeModel[] = [
                {
                    id: 'node1',
                    offsetX: 250,
                    offsetY: 150,
                    width: 90,
                    height: 60,
                    annotations: [
                        {
                            content: 'Activity 1'
                        }
                    ],
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
                            x1: 0,
                            y1: 0,
                            x2: 1,
                            y2: 1,
                            stops: [
                                {
                                    color: 'white',
                                    offset: 30,
                                    opacity: 0.1
                                },
                                {
                                    color: '#d8ecdc',
                                    offset: 100,
                                    opacity: 0.1
                                }
                            ],
                            type: 'Linear'
                        }
                    }
                },
                {
                    id: 'node2',
                    offsetX: 400,
                    offsetY: 100,
                    width: 90,
                    height: 60,
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
                    annotations: [
                        {
                            content: "Sample Text",
                            style: {
                                textOverflow: 'Clip',
                                textWrapping: 'WrapWithOverflow',
                                textAlign: 'Left'
                            },
                            height: 50,
                            width: 80,
                            margin: { left: 0, top: 0, right: 0, bottom: 0 }
                        }
                    ],
                    style: {
                        strokeColor: '#778899',
                        strokeWidth: 3
                    }
                },
                {
                    id: 'node3',
                    offsetX: 400,
                    offsetY: 200,
                    width: 90,
                    height: 60,
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
                    annotations: [
                        {
                            content: "Sample Text",
                            style: {
                                textOverflow: 'Clip',
                                textWrapping: 'WrapWithOverflow',
                                textAlign: 'Left'
                            },
                            height: 50,
                            width: 80,
                            margin: { left: 0, top: 0, right: 0, bottom: 0 }
                        }
                    ],
                    style: {
                        strokeColor: '#778899',
                        strokeWidth: 3
                    }
                },
                {
                    id: 'node4',
                    annotations: [
                        {
                            content: 'End',
                            margin: { bottom: -30 }
                        }
                    ],
                    shape: {
                        type: 'Bpmn',
                        shape: 'Event',
                        event: {
                            event: 'End',
                            trigger: 'None'
                        }
                    },
                    offsetX: 500,
                    offsetY: 100,
                    width: 30,
                    height: 30,
                    style: {
                        strokeColor: '#FF0000',
                        strokeWidth: 3
                    }
                },
                {
                    id: 'node5',
                    annotations: [
                        {
                            content: 'End',
                            margin: { bottom: -30 }
                        }
                    ],
                    shape: {
                        type: 'Bpmn',
                        shape: 'Event',
                        event: {
                            event: 'End',
                            trigger: 'None'
                        }
                    },
                    offsetX: 500,
                    offsetY: 200,
                    width: 30,
                    height: 30,
                    style: {
                        strokeColor: '#FF0000',
                        strokeWidth: 3
                    }
                }
            ];
            
           
            diagram = new Diagram({
                width: '800px', height: '500px', nodes: nodes,
                connectors:connectors,
            });
            diagram.appendTo('#diagram5');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Child is not positioned properly when calling doLayout() method', (done: Function) => {
            diagram.layout.orientation = 'LeftToRight';
            diagram.layout.orientation = 'LeftToRight';
            diagram.layout.type = 'HierarchicalTree';
            diagram.doLayout();
            diagram.dataBind();
            let ele = document.getElementById('Connector4_path_groupElement');
           expect(ele.children[0].getAttribute('d')==='M0,0 L30.76,0 ').toBe(true);
           let connector = document.getElementById('Connector1_Default_groupElement')
           expect(connector.children[0].getAttribute('d') === 'M0,0 L22,0 ').toBe(true);
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

    describe('Conditional sequence connector is improper when connected with BPMN Service shape', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let connectors: ConnectorModel[] = [
                {
                  id: 'connector1', sourceID: 'service', targetID: 'processesTask',
                   type: 'Orthogonal',
                }
              ]
            
            let nodes: NodeModel[] = [
                {
                    id: 'service', style: { fill: '#6FAAB0' }, width: 95, height: 70,
                     annotations: [{
                        id: 'serviceLabel2', content: 'Book hotel', offset: { x: 0.50, y: 0.50 },
                        style: { color: 'white', }
                    }],  offsetX:200, offsetY:200
                },
                 
                {
                    id: 'processesTask', style: { fill: '#F6B53F' }, width: 95, height: 70,
                    shape: {
                        type: 'Bpmn', shape: 'Activity', activity: {
                            activity: 'Task', task: {
                                type: 'Service',
                            },
                        },
                    }, annotations: [{
                        id: 'serviceLabel2', content: 'Charge credit card', offset: { x: 0.50, y: 0.60 },
                        style: { color: 'white' }
                    }], offsetX:400, offsetY:200
                }, 
            ];
            
            diagram = new Diagram({
                width: '800px', height: '500px', nodes: nodes,
                connectors:connectors,
              
            });
            diagram.appendTo('#diagram6');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        function getDefaultSequenceConnector(): ConnectorModel {
            return {
              id: 'node1-processesTask',
              sourceID: 'service',
              shape: {
                  type: 'Bpmn',
                  flow: 'Sequence',
                  sequence: 'Conditional'
              },
              targetID: 'processesTask',
              cornerRadius: 10,
              type: 'Orthogonal', 
            }
          }
        it('Conditional sequence connector is improper when connected with BPMN Service shape', (done: Function) => {
            diagram.remove(diagram.connectors[0]);
            diagram.add(getDefaultSequenceConnector()); 
            diagram.dataBind();
            let ele = document.getElementById('TaskprocessesTask_groupElement')
            expect(ele.children[0].getAttribute('width')==="95").toBe(true);
            let ele2 = document.getElementById('node1-processesTaskBpmn_groupElement');
            console.log("ele22",ele2.children[0].getAttribute('transform'));
           expect(ele2.children[0].getAttribute('transform')==='rotate(0,248,200.5)translate(248,200.5)').toBe(false);
    done();
        });
    });
    describe('Style for inner elements of BPMN Gateway and subprocess Shapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram7' });
            document.body.appendChild(ele);
             
              let nodes: NodeModel[] = [
                 {
                    id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                    style: {strokeColor: 'red'},
                    shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } as BpmnGatewayModel },
                 },
                 {
                    id: 'node2', width: 100, height: 100, offsetX: 700, offsetY: 100,
                    style: {strokeColor: 'red'},
                    shape: { type: 'Bpmn', shape: 'Activity',  activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            collapsed: true
                        } 
                    }
                 }
                }
              ];
               diagram = new Diagram({
                width: 1000, height: 500, nodes: nodes
            });
            diagram.appendTo('#diagram7');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Strokecolor for BPMN Gateway and subprocess initial rendering', (done: Function) => { 
             let gatewayElement = document.getElementById('node1_1_gatewayType_groupElement');
             expect(gatewayElement.firstElementChild.getAttribute('stroke') === 'red').toBe(true);
             let subprocessElement = document.getElementById('node2_0_collapsed_groupElement');
             expect(subprocessElement.firstElementChild.getAttribute('stroke') === 'red').toBe(true);
             done();
        });
        it('Strokecolor for BPMN Gateway and subprocess runtime', (done: Function) => { 
            let node = diagram.nodes[0];
            node.style.strokeColor = 'green';
            diagram.dataBind();
            let gatewayElement = document.getElementById('node1_1_gatewayType_groupElement');
            expect(gatewayElement.firstElementChild.getAttribute('stroke') === 'green').toBe(true);
            let node1 = diagram.nodes[1];
            node1.style.strokeColor = 'green';
            diagram.dataBind();
            let subprocessElement = document.getElementById('node2_0_collapsed_groupElement');
            expect(subprocessElement.firstElementChild.getAttribute('stroke') === 'green').toBe(true);
            done();
        });
    });

    

describe('BPMN subprocess save and load issue ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram8' });
            document.body.appendChild(ele);
             
              let nodes: NodeModel[] = [
                  {
         width: 520, height: 250, offsetX: 355, offsetY: 180,
        constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
        shape: {
            shape: 'Activity', type: 'Bpmn',
            activity: {
                activity: 'SubProcess', subProcess: {
                    type: 'Transaction', collapsed: false,
                    // processes: ['processesStart',]
                }
            }
        }
    }              ];
               diagram = new Diagram({
               width: '74%', height: '600px',// connectors: connector6,
        nodes: nodes,
            });
            diagram.appendTo('#diagram8');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('BPMN subprocess save and load issue', (done: Function) => { 
              var check = '{"width":"74%","height":"600px","nodes":[{"shape":{"shape":"Activity","type":"Bpmn","activity":{"activity":"SubProcess","subProcess":{"type":"Transaction","collapsed":false,"processes":["subProcessqiBnC"],"loop":"None","compensation":false,"adhoc":false,"transaction":{"success":{"id":"success","event":"End","offset":{"x":1,"y":0.5},"trigger":"None","annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","visible":true},"cancel":{"id":"cancel","event":"Intermediate","trigger":"Cancel","offset":{"x":0.75,"y":1},"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","visible":true},"failure":{"id":"failure","event":"Intermediate","trigger":"Error","offset":{"x":0.25,"y":1},"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","visible":true}},"boundary":"Default"}},"event":{"trigger":"None"},"annotations":[]},"width":800.02,"height":286.0596484375,"offsetX":495.01,"offsetY":198.03,"constraints":5242862,"annotations":[],"id":"SNU0Z","zIndex":0,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":0},"flip":"None","wrapper":{"actualSize":{"width":800.02,"height":286.0596484375},"offsetX":495.01,"offsetY":198.03},"style":{"fill":"white","gradient":{"type":"None"},"strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1},"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"tooltip":{"openOn":"Auto"},"inEdges":[],"outEdges":[],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"shape":"Activity","type":"Bpmn","activity":{"activity":"SubProcess","subProcess":{"type":"Transaction","collapsed":false,"processes":["subProcessbaFZE","subProcessbuNeV"],"transaction":{"cancel":{"id":"cancel","event":"Intermediate","trigger":"Cancel","offset":{"x":0.75,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"failure":{"id":"failure","event":"Intermediate","trigger":"Error","offset":{"x":0.25,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"success":{"id":"success","event":"End","offset":{"x":1,"y":0.5},"visible":false,"trigger":"None","annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"}},"loop":"None","compensation":false,"adhoc":false,"boundary":"Default"}},"event":{"trigger":"None"},"annotations":[]},"id":"subProcessd7Ruo","width":493.0000000000001,"height":191.99859375000003,"offsetX":1105.52,"offsetY":495.05999999999995,"constraints":5242862,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":31.000703124999973,"left":105,"right":0,"bottom":0},"flip":"None","wrapper":{"actualSize":{"width":493.0000000000001,"height":191.99859375000003},"offsetX":648.52,"offsetY":245.06052734374998},"style":{"fill":"white","gradient":{"type":"None"},"strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1},"previewSize":{},"dragSize":{},"zIndex":2,"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"tooltip":{"openOn":"Auto"},"inEdges":[],"outEdges":[],"parentId":"","processId":"subProcessqiBnC","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"shape":"Activity","type":"Bpmn","activity":{"activity":"SubProcess","subProcess":{"type":"Transaction","collapsed":false,"processes":["subProcessVg5ME"],"transaction":{"cancel":{"id":"cancel","event":"Intermediate","trigger":"Cancel","offset":{"x":0.75,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"failure":{"id":"failure","event":"Intermediate","trigger":"Error","offset":{"x":0.25,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"success":{"id":"success","event":"End","offset":{"x":1,"y":0.5},"visible":false,"trigger":"None","annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"}},"loop":"None","compensation":false,"adhoc":false,"boundary":"Default"}},"event":{"trigger":"None"},"annotations":[]},"id":"subProcessbuNeV","width":255.99999999999991,"height":83.00000000000001,"offsetX":1060.02,"offsetY":266.56,"constraints":5242862,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":108.99859375,"left":77.99562500000002,"right":0,"bottom":0},"flip":"None","wrapper":{"actualSize":{"width":255.99999999999991,"height":83.00000000000001},"offsetX":608.0156249999999,"offsetY":299.55982421874995},"style":{"fill":"white","gradient":{"type":"None"},"strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1},"previewSize":{},"dragSize":{},"zIndex":8,"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"tooltip":{"openOn":"Auto"},"inEdges":[],"outEdges":[],"parentId":"","processId":"subProcessd7Ruo","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"shape":"Activity","type":"Bpmn","activity":{"activity":"SubProcess","subProcess":{"type":"Transaction","collapsed":false,"processes":["subProcessd7Ruo"],"transaction":{"cancel":{"id":"cancel","event":"Intermediate","trigger":"Cancel","offset":{"x":0.75,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"failure":{"id":"failure","event":"Intermediate","trigger":"Error","offset":{"x":0.25,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"success":{"id":"success","event":"End","offset":{"x":1,"y":0.5},"visible":false,"trigger":"None","annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"}},"loop":"None","compensation":false,"adhoc":false,"boundary":"Default"}},"event":{"trigger":"None"},"annotations":[]},"id":"subProcessqiBnC","width":598,"height":222.99929687500003,"offsetX":596.02,"offsetY":229.56,"constraints":5242862,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":63.06035156249999,"left":202.01999999999992,"right":0,"bottom":0},"flip":"None","wrapper":{"actualSize":{"width":598.0000000000001,"height":222.99929687500003},"offsetX":596.02,"offsetY":229.56017578125},"style":{"fill":"white","gradient":{"type":"None"},"strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1},"previewSize":{},"dragSize":{},"zIndex":4,"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"tooltip":{"openOn":"Auto"},"inEdges":[],"outEdges":[],"parentId":"","processId":"SNU0Z","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"shape":"Activity","type":"Bpmn","activity":{"activity":"SubProcess","subProcess":{"type":"Transaction","collapsed":false,"processes":[],"transaction":{"cancel":{"id":"cancel","event":"Intermediate","trigger":"Cancel","offset":{"x":0.75,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"failure":{"id":"failure","event":"Intermediate","trigger":"Error","offset":{"x":0.25,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"success":{"id":"success","event":"End","offset":{"x":1,"y":0.5},"visible":false,"trigger":"None","annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"}},"loop":"None","compensation":false,"adhoc":false,"boundary":"Default"}},"event":{"trigger":"None"},"annotations":[]},"id":"subProcessbaFZE","width":50,"height":50,"offsetX":936.015625,"offsetY":141.060703125,"constraints":5242862,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":56.99562500000002,"right":0,"bottom":0},"flip":"None","wrapper":{"actualSize":{"width":50,"height":50},"offsetX":484.01562499999994,"offsetY":174.06123046874995},"style":{"fill":"white","gradient":{"type":"None"},"strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1},"previewSize":{},"dragSize":{},"zIndex":7,"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"tooltip":{"openOn":"Auto"},"inEdges":[],"outEdges":[],"parentId":"","processId":"subProcessd7Ruo","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"shape":"Activity","type":"Bpmn","activity":{"activity":"SubProcess","subProcess":{"type":"Transaction","collapsed":false,"processes":[],"transaction":{"cancel":{"id":"cancel","event":"Intermediate","trigger":"Cancel","offset":{"x":0.75,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"failure":{"id":"failure","event":"Intermediate","trigger":"Error","offset":{"x":0.25,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"success":{"id":"success","event":"End","offset":{"x":1,"y":0.5},"visible":false,"trigger":"None","annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"}},"loop":"None","compensation":false,"adhoc":false,"boundary":"Default"}},"event":{"trigger":"None"},"annotations":[]},"id":"subProcessbaFZE","width":50,"height":50,"offsetX":936.015625,"offsetY":141.060703125,"constraints":5242862,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":0,"left":56.99562500000002,"right":0,"bottom":0},"flip":"None","wrapper":{"actualSize":{"width":50,"height":50},"offsetX":484.01562499999994,"offsetY":174.06123046874995},"style":{"fill":"white","gradient":{"type":"None"},"strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1},"previewSize":{},"dragSize":{},"zIndex":7,"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"tooltip":{"openOn":"Auto"},"inEdges":[],"outEdges":[],"parentId":"","processId":"subProcessd7Ruo","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"shape":"Activity","type":"Bpmn","activity":{"activity":"SubProcess","subProcess":{"type":"Transaction","collapsed":false,"processes":["subProcessVg5ME"],"transaction":{"cancel":{"id":"cancel","event":"Intermediate","trigger":"Cancel","offset":{"x":0.75,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"failure":{"id":"failure","event":"Intermediate","trigger":"Error","offset":{"x":0.25,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"success":{"id":"success","event":"End","offset":{"x":1,"y":0.5},"visible":false,"trigger":"None","annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"}},"loop":"None","compensation":false,"adhoc":false,"boundary":"Default"}},"event":{"trigger":"None"},"annotations":[]},"id":"subProcessbuNeV","width":255.99999999999991,"height":83.00000000000001,"offsetX":1060.02,"offsetY":266.56,"constraints":5242862,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":108.99859375,"left":77.99562500000002,"right":0,"bottom":0},"flip":"None","wrapper":{"actualSize":{"width":255.99999999999991,"height":83.00000000000001},"offsetX":608.0156249999999,"offsetY":299.55982421874995},"style":{"fill":"white","gradient":{"type":"None"},"strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1},"previewSize":{},"dragSize":{},"zIndex":8,"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"tooltip":{"openOn":"Auto"},"inEdges":[],"outEdges":[],"parentId":"","processId":"subProcessd7Ruo","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"shape":"Activity","type":"Bpmn","activity":{"activity":"SubProcess","subProcess":{"type":"Transaction","collapsed":false,"processes":[],"transaction":{"cancel":{"id":"cancel","event":"Intermediate","trigger":"Cancel","offset":{"x":0.75,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"failure":{"id":"failure","event":"Intermediate","trigger":"Error","offset":{"x":0.25,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"success":{"id":"success","event":"End","offset":{"x":1,"y":0.5},"visible":false,"trigger":"None","annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"}},"loop":"None","compensation":false,"adhoc":false,"boundary":"Default"}},"event":{"trigger":"None"},"annotations":[]},"id":"subProcessVg5ME","width":50,"height":50,"offsetX":1021.015625,"offsetY":280.05859375,"constraints":5242862,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":29.998593749999998,"left":63.99562500000002,"right":0,"bottom":0},"flip":"None","wrapper":{"actualSize":{"width":50,"height":50},"offsetX":569.01125,"offsetY":313.05841796874995},"style":{"fill":"white","gradient":{"type":"None"},"strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1},"previewSize":{},"dragSize":{},"zIndex":10,"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"inEdges":[],"outEdges":[],"parentId":"","processId":"subProcessbuNeV","umlIndex":-1,"isPhase":false,"isLane":false},{"shape":{"shape":"Activity","type":"Bpmn","activity":{"activity":"SubProcess","subProcess":{"type":"Transaction","collapsed":false,"processes":[],"transaction":{"cancel":{"id":"cancel","event":"Intermediate","trigger":"Cancel","offset":{"x":0.75,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"failure":{"id":"failure","event":"Intermediate","trigger":"Error","offset":{"x":0.25,"y":1},"visible":false,"annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},"success":{"id":"success","event":"End","offset":{"x":1,"y":0.5},"visible":false,"trigger":"None","annotations":[],"ports":[],"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"}},"loop":"None","compensation":false,"adhoc":false,"boundary":"Default"}},"event":{"trigger":"None"},"annotations":[]},"id":"subProcessVg5ME","width":50,"height":50,"offsetX":1021.015625,"offsetY":280.05859375,"constraints":5242862,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{"top":29.998593749999998,"left":63.99562500000002,"right":0,"bottom":0},"flip":"None","wrapper":{"actualSize":{"width":50,"height":50},"offsetX":569.01125,"offsetY":313.05841796874995},"style":{"fill":"white","gradient":{"type":"None"},"strokeColor":"black","strokeWidth":1,"strokeDashArray":"","opacity":1},"previewSize":{},"dragSize":{},"zIndex":10,"annotations":[],"ports":[],"isExpanded":true,"expandIcon":{"shape":"None"},"fixedUserHandles":[],"inEdges":[],"outEdges":[],"parentId":"","processId":"subProcessbuNeV","umlIndex":-1,"isPhase":false,"isLane":false}],"enableRtl":false,"locale":"en-US","enablePersistence":false,"scrollSettings":{"viewPortWidth":1764.16015625,"viewPortHeight":600,"currentZoom":1,"horizontalOffset":0,"verticalOffset":0,"padding":{"left":0,"right":0,"top":0,"bottom":0},"scrollLimit":"Diagram","canAutoScroll":false},"rulerSettings":{"showRulers":false},"backgroundColor":"transparent","constraints":500,"layout":{"type":"None","enableAnimation":true,"connectionPointOrigin":"SamePoint","arrangement":"Nonlinear"},"snapSettings":{"constraints":31,"gridType":"Lines","verticalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20],"lineDashArray":"","lineColor":"lightgray"},"horizontalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapIntervals":[20],"lineDashArray":"","lineColor":"lightgray"}},"contextMenuSettings":{},"dataSourceSettings":{"dataManager":null,"dataSource":null,"crudAction":{"read":""},"connectionDataSource":{"crudAction":{"read":""}}},"mode":"SVG","layers":[{"id":"default_layer","visible":true,"lock":false,"objects":["SNU0Z","subProcessbuNeV","subProcessd7Ruo","subProcessbaFZE","subProcessqiBnC","subProcessVg5ME"],"zIndex":0,"objectZIndex":5}],"connectors":[],"diagramSettings":{"inversedAlignment":true},"pageSettings":{"boundaryConstraints":"Infinity","orientation":"Landscape","height":null,"width":null,"background":{"source":"","color":"transparent"},"showPageBreaks":false,"fitOptions":{"canFit":false}},"selectedItems":{"nodes":[],"connectors":[],"wrapper":null,"constraints":16382,"userHandles":[],"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"width":598,"height":222.99929687500003,"offsetX":596.02,"offsetY":229.56017578125},"basicElements":[],"tooltip":{"content":"","relativeMode":"Mouse"},"commandManager":{"commands":[]},"tool":3,"customCursor":[],"version":17.1}'
        
             diagram.loadDiagram(check);
             console.log("length for bpmn");
             console.log(diagram.nodes[0].wrapper.children.length);
            expect(diagram.nodes[0].wrapper.children.length===3).toBe(false);
             done();
        });
        
    });




    describe('BPMN subprocess annotation moving issue ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram9' });
            document.body.appendChild(ele);
             
            let nodes: NodeModel[] = [
                {
                    id: 'subProcess', width: 520, height: 250, offsetX: 355, offsetY: 180,
                    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                    shape: {
                        shape: 'Activity', type: 'Bpmn',
                        activity: {
                            activity: 'SubProcess', subProcess: {
                                type: 'Transaction', collapsed: false,
                                processes: [   'processesTask',
                                    ]
                            }
                        }
                    }
                }  ,
                {
                    id: 'processesTask', style: { fill: '#F6B53F' }, width: 95, height: 70,
                    shape: {
                        type: 'Bpmn', shape: 'Activity', activity: {
                            activity: 'Task', task: {
                                type: 'Service',
                            },
                        },
                    }, annotations: [{
                            id: 'serviceLabel2', content: 'Charge credit card', offset: { x: 0.50, y: 0.60 },
                            style: { color: 'white' }
                        }], margin: { left: 290, top: 20 },
                }
                      ];
               diagram = new Diagram({
                width: '74%', height: '600px',// connectors: connector6,
         nodes: nodes,
             });
            diagram.appendTo('#diagram9');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('BPMN subprocess annotation moving issue', (done: Function) => { 
            diagram.drag(diagram.nodes[1],-140,0);
            diagram.drag(diagram.nodes[0],-40,150);
            
            diagram.select([diagram.nodes[1]]);
            var node = diagram.selectedItems.nodes[0];
            diagram.dataBind();
            node.annotations[0].content =  "t"
            diagram.dataBind();
          
            expect(node.wrapper.offsetY===260).toBe(true);
            done();
        });
        
    });
});

describe('BPMN Flow connectors not changed properly at runtime ', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
        ele = createElement('div', { id: 'diagram10' });
        document.body.appendChild(ele);
         
        let connectors:ConnectorModel[]=[
            {
                id:'association', sourcePoint:{x:100,y:100},targetPoint:{x:250,y:300},type:'Straight',
                shape:{
                    type:'Bpmn',
                    association:'Directional',
                    flow:'Association',
                },
            },
            {
                id:'sequence', sourcePoint:{x:300,y:100},targetPoint:{x:550,y:300},type:'Straight',
                shape:{
                    type:'Bpmn',
                    sequence:'Conditional',
                    flow:'Sequence',
                },
            },
            {
                id:'message', sourcePoint:{x:450,y:100},targetPoint:{x:650,y:300},type:'Straight',
                shape:{
                    type:'Bpmn',
                    message:'InitiatingMessage',
                    flow:'Message',
                },
            },
        ]
           diagram = new Diagram({
            width: '74%', height: '600px',connectors:connectors
         });
        diagram.appendTo('#diagram10');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('Checking Bpmn association flow connector after changing its association type at runtime', (done: Function) => { 
        let preAssociationType = (diagram.connectors[0].shape as BpmnFlowModel).association;
        let preSrcDec = diagram.connectors[0].sourceDecorator.shape;
        (diagram.connectors[0].shape as BpmnFlowModel).association = 'BiDirectional';
        diagram.dataBind();
        let currAssociationType = (diagram.connectors[0].shape as BpmnFlowModel).association;
        let currSrcDec = diagram.connectors[0].sourceDecorator.shape;
        console.log("BPMN association");
        console.log(preAssociationType, currAssociationType,preSrcDec, currSrcDec);
        expect(preAssociationType === 'Directional' && currAssociationType === 'BiDirectional' &&
        preSrcDec === 'None'&& currSrcDec === 'OpenArrow').toBe(true);
        done();
    });
    it('Checking Bpmn sequence flow connector after changing its sequence type at runtime', (done: Function) => { 
        let preSequenceType = (diagram.connectors[1].shape as BpmnFlowModel).sequence;
        let preSrcDec = diagram.connectors[1].sourceDecorator.shape;
        (diagram.connectors[1].shape as BpmnFlowModel).sequence = 'Normal';
        diagram.dataBind();
        let currSequenceType = (diagram.connectors[1].shape as BpmnFlowModel).sequence;
        let currSrcDec = diagram.connectors[1].sourceDecorator.shape;
        expect(preSequenceType === 'Conditional' && currSequenceType === 'Normal' &&
        preSrcDec === 'Diamond' && currSrcDec === 'None').toBe(true);
        done();
    });
       it('Checking Bpmn message flow connector after changing its message type at runtime', (done: Function) => { 
        let preMessageType = (diagram.connectors[2].shape as BpmnFlowModel).message;
        let preMessageColor = diagram.connectors[2].wrapper.children[3].style.fill.toLowerCase();
        (diagram.connectors[2].shape as BpmnFlowModel).message = 'NonInitiatingMessage';
        diagram.dataBind();
        let currMessageType = (diagram.connectors[2].shape as BpmnFlowModel).message;
        let currMessageColor = diagram.connectors[2].wrapper.children[3].style.fill.toLowerCase();
        expect(preMessageType === 'InitiatingMessage' && currMessageType === 'NonInitiatingMessage' &&
        preMessageColor === 'white' && currMessageColor === 'lightgrey').toBe(true);
        done();
    });
    it('Changing flow connectors at runtime for coverage', (done: Function) => { 
        (diagram.connectors[0].shape as BpmnFlowModel).association = 'Default';
        diagram.dataBind();
        (diagram.connectors[0].shape as BpmnFlowModel).association = 'Directional';
        diagram.dataBind();
        (diagram.connectors[1].shape as BpmnFlowModel).sequence = 'Default';
        diagram.dataBind();
        (diagram.connectors[2].shape as BpmnFlowModel).message = 'InitiatingMessage';
        diagram.dataBind();
        expect((diagram.connectors[0].shape as BpmnFlowModel).association === 'Directional' && (diagram.connectors[1].shape as BpmnFlowModel).sequence === 'Default').toBe(true);
        done();
    });
    it('Checking Bpmn flow type after changing it at runtime', (done: Function) => { 
        let preFlow = (diagram.connectors[0].shape as BpmnFlowModel).flow;
        (diagram.connectors[0].shape as BpmnFlowModel).flow = 'Sequence';
        (diagram.connectors[0].shape as BpmnFlowModel).sequence = 'Conditional';
        diagram.dataBind();
        let currFlow = (diagram.connectors[0].shape as BpmnFlowModel).flow;
        let srcDec = diagram.connectors[0].sourceDecorator.shape;
        (diagram.connectors[0].shape as BpmnFlowModel).flow = 'Message';
        diagram.dataBind();
        let changedFlow = (diagram.connectors[0].shape as BpmnFlowModel).flow;
        let changedSrcDec = diagram.connectors[0].sourceDecorator.shape;
        expect(preFlow === 'Association' && currFlow === 'Sequence' && srcDec === 'Diamond'
        && changedFlow === 'Message' && changedSrcDec === 'Circle').toBe(true);
        done();
    });
    
});

describe('BPMN Shapes strokecolor changing', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
        ele = createElement('div', { id: 'diagram11' });
        document.body.appendChild(ele);
        let shadow: ShadowModel = { distance: 10, opacity: 0.5 };
        let nodes: NodeModel[] = [{
            id: 'node', offsetX: 100, offsetY: 100,
            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
            shape: { type: 'Bpmn', shape: 'DataObject', dataObject: { type: 'Input', collection: true } } as BpmnShapeModel
        }, {
            id: 'node1', offsetX: 300, offsetY: 100,
            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
            shape: { type: 'Bpmn', shape: 'Event' } as BpmnShapeModel

        }, {
            id: 'node2', offsetX: 500, offsetY: 100,
            shape: { type: 'Bpmn', shape: 'Gateway' }, shadow: shadow, constraints: NodeConstraints.Default & ~NodeConstraints.Shadow

        }, {
            id: 'node3', offsetX: 700, offsetY: 100,
            style: { fill: '#FBF6E1', strokeColor: 'red', strokeWidth: 2 } as ShapeStyleModel,
            shape: { type: 'Bpmn', shape: 'DataSource' } as BpmnShapeModel
        },
        {
            id: 'node9', offsetX: 100, offsetY: 600, maxHeight: 40, maxWidth: 40,
            style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
            shape: {
                type: 'Bpmn', shape: 'Activity', activity: {
                    activity: 'SubProcess',
                    subProcess: { type: 'Transaction' }
                }
            } as BpmnShapeModel
        }];
        diagram = new Diagram({
            width: 1000, height: 500, nodes: nodes
        });
        diagram.appendTo('#diagram11');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('BPMN Shapes strokecolor changing at runtime', (done: Function) => {
        let node = diagram.nodes[0];
            node.style.strokeColor = 'green';
            diagram.dataBind();
            expect(diagram.nodes[0].style.strokeColor === 'green').toBe(true);
            let node1 = diagram.nodes[1];
            node1.style.strokeColor = 'green';
            diagram.dataBind();
            expect(diagram.nodes[1].style.strokeColor  === 'green').toBe(true);
            let node2 = diagram.nodes[2];
            node2.style.strokeColor = 'green';
            diagram.dataBind();
            expect(diagram.nodes[2].style.strokeColor === 'green').toBe(true);
            let node3 = diagram.nodes[3];
            node3.style.strokeColor = 'green';
            diagram.dataBind();
            expect(diagram.nodes[3].style.strokeColor === 'green').toBe(true);
            let node4 = diagram.nodes[4];
            node4.style.strokeColor = 'green';
            diagram.dataBind();
            expect(diagram.nodes[4].style.strokeColor === 'green').toBe(true);
            done();
    });
  
});
describe('BPMN sub process Shape render highlighter', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let events: MouseEvents = new MouseEvents();
    let diagramCanvas: HTMLElement;
    beforeAll((): void => {
        const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
        ele = createElement('div', { id: 'diagramSubProcess' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [{
            id: 'processesStart', width: 30, height: 30, shape: {
                type: 'Bpmn', shape: 'Event',
                event: { event: 'Start' }
            }, margin: { left: 40, top: 80 }
        }, {
            id: 'nodea', maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
            offsetX: 200, offsetY: 200,
            shape: {
                type: 'Bpmn', shape: 'Activity', activity: {
                    activity: 'SubProcess',
                    subProcess: {
                        collapsed: false, type: 'Transaction',
                        processes: ['processesStart']
                    } as BpmnSubProcessModel
                },
            },
        }]
        diagram = new Diagram({
            width: 1000, height: 500, nodes: nodes, connectors:[{id:'connector1', sourcePoint:{x:400,y:200}, targetPoint:{x:600,y:200}}]
        });
        diagram.appendTo('#diagramSubProcess');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('check highlighter for sub process when connetor dock', (done: Function) => {
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        diagram.select([diagram.connectors[0]]);
        let decorator = document.getElementById('connectorSourceThumb');
        let bounds: any = decorator.getBoundingClientRect();
        events.mouseDownEvent(diagramCanvas, bounds.x, bounds.y, false, false);
        events.mouseMoveEvent(diagramCanvas, bounds.x, bounds.y, false, false);
        events.mouseMoveEvent(diagramCanvas, bounds.x - 50, bounds.y, false, false);
        events.mouseMoveEvent(diagramCanvas, bounds.x - 100, bounds.y, false, false);
        events.mouseUpEvent(diagramCanvas, bounds.x - 100, bounds.y, false, false);
        done();
    });
    it('select child Select BPMN subprocess', (done: Function) => {
        diagramCanvas = document.getElementById(diagram.element.id + 'content');
        let node=diagram.getObject('processesStart');
        diagram.select([node]);
        let resizeHandle= document.getElementById('resizeSouth');
        let resizeBounds: any = resizeHandle.getBoundingClientRect();
        events.mouseDownEvent(diagramCanvas, resizeBounds.x, resizeBounds.y, false, false);
        events.mouseMoveEvent(diagramCanvas, resizeBounds.x, resizeBounds.y, false, false);
        events.mouseMoveEvent(diagramCanvas, resizeBounds.x, resizeBounds.y+10, false, false);
        events.mouseMoveEvent(diagramCanvas, resizeBounds.x, resizeBounds.y+10, false, false);
        events.mouseUpEvent(diagramCanvas, resizeBounds.x, resizeBounds.y+10, false, false);
        done();
    });
});

