import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { Node } from '../../../src/diagram/objects/node';
import { NodeModel, BpmnShapeModel, BpmnGatewayModel } from '../../../src/diagram/objects/node-model';
import { ShapeStyleModel, ShadowModel } from '../../../src/diagram/core/appearance-model';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { NodeConstraints } from '../../../src/diagram/enum/enum';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
import { ConnectorModel } from '../../../src';
Diagram.Inject(BpmnDiagrams);

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
            ele = createElement('div', { id: 'diagram' });
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
            diagram.appendTo('#diagram');
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
            ele = createElement('div', { id: 'diagram' });
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
            diagram.appendTo('#diagram');
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
            ele = createElement('div', { id: 'diagram' });
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
            diagram.appendTo('#diagram');
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
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shadow: ShadowModel = { distance: 10, opacity: 0.5 };
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
            diagram.appendTo('#diagram');
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
            expect(element.children[0].getAttribute('x')==="205.5").toBe(true);
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
