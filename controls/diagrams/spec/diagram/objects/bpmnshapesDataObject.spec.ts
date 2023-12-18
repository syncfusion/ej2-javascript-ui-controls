import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BpmnShapeModel, BpmnSubProcessModel, BpmnGatewayModel } from '../../../src/diagram/objects/node-model';
import { ShapeStyleModel } from '../../../src/diagram/core/appearance-model';
import { ShadowModel, RadialGradientModel, StopModel } from '../../../src/diagram/core/appearance-model';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
import { BpmnShape, Container } from '../../../src';
Diagram.Inject(BpmnDiagrams);

/**
 * BPMN DataObjects shapes
 */
describe('Diagram Control', () => {

    describe('Diagram Element', () => {
        let diagram: Diagram;
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

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
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                shape: {
                    type: 'Bpmn', shape: 'DataObject',
                    dataObject: { collection: false, type: 'Input' }
                } as BpmnShapeModel,
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'DataObject',
                    dataObject: { collection: false, type: 'Output' }
                } as BpmnShapeModel,
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue' } as ShapeStyleModel,
                shape: {
                    type: 'Bpmn', shape: 'DataObject',
                    dataObject: { collection: false, type: 'None' }
                } as BpmnShapeModel,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
                style: { strokeWidth: 5, } as ShapeStyleModel,
                shape: {
                    type: 'Bpmn', shape: 'DataObject',
                    dataObject: { collection: true, type: 'Input' }
                } as BpmnShapeModel,
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 900, offsetY: 100,
                shadow: shadow,
                shape: {
                    type: 'Bpmn', shape: 'DataObject',
                    dataObject: { collection: true, type: 'Output' }
                } as BpmnShapeModel,
            };
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
                style: { gradient: gradient } as ShapeStyleModel,
                shape: {
                    type: 'Bpmn', shape: 'DataObject',
                    dataObject: { collection: true, type: 'None' }
                } as BpmnShapeModel,
            };

            diagram = new Diagram({
                width: 1500, height: 800, nodes: [node, node1, node2, node3, node4, node5]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking before, after,  BPMN  dataObject with collection as false and type as Input ', (done: Function) => { 
            let wrapper: Canvas = (diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 25
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 67.5 && wrapper.children[1].offsetY === 65) &&
                //third node
                (wrapper.children[2].actualSize.width === 7.5
                    && wrapper.children[2].actualSize.height === 15 &&
                    wrapper.children[2].offsetX === 100 && wrapper.children[2].offsetY === 142.5)
            ).toBe(true);
            done();
        });

        it('Checking before, after,  BPMN  dataObject with collection as false  and  type as output ', (done: Function) => { 
            let wrapper: Canvas = (diagram.nodes[1] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 300 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 25
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 267.5 && wrapper.children[1].offsetY === 65) &&
                //third node
                (wrapper.children[2].actualSize.width === 7.5
                    && wrapper.children[2].actualSize.height === 15 &&
                    wrapper.children[2].offsetX === 300 && wrapper.children[2].offsetY === 142.5)
            ).toBe(true);
            done();
        });

        it('Checking before, after,  BPMN  dataObject with collection as false  and  type as none ', (done: Function) => { 
            let wrapper: Canvas = (diagram.nodes[2] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 500 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 25
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 467.5 && wrapper.children[1].offsetY === 65) &&
                //third node
                (wrapper.children[2].actualSize.width === 7.5
                    && wrapper.children[2].actualSize.height === 15 &&
                    wrapper.children[2].offsetX === 500 && wrapper.children[2].offsetY === 142.5)
            ).toBe(true);
            done();
        });

        it('Checking before, after,  BPMN  dataObject with collection as true  and  type as Input ', (done: Function) => { 
            let wrapper: Canvas = (diagram.nodes[3] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 700 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 25
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 667.5 && wrapper.children[1].offsetY === 65) &&
                //third node
                (wrapper.children[2].actualSize.width === 7.5
                    && wrapper.children[2].actualSize.height === 15 &&
                    wrapper.children[2].offsetX === 700 && wrapper.children[2].offsetY === 142.5)
            ).toBe(true);
            done();
        });

        it('Checking before, after,  BPMN  dataObject with collection as true  and  type as output ', (done: Function) => { 
            let wrapper: Canvas = (diagram.nodes[4] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 900 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 25
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 867.5 && wrapper.children[1].offsetY === 65) &&
                //third node
                (wrapper.children[2].actualSize.width === 7.5
                    && wrapper.children[2].actualSize.height === 15 &&
                    wrapper.children[2].offsetX === 900 && wrapper.children[2].offsetY === 142.5)
            ).toBe(true);
            done();
        });

        it('Checking before, after,  BPMN  dataObject with collection as true  and  type as none ', (done: Function) => { 
            let wrapper: Canvas = (diagram.nodes[5] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 25
                    && wrapper.children[1].actualSize.height === 20 &&
                    wrapper.children[1].offsetX === 67.5 && wrapper.children[1].offsetY === 265) &&
                //third node
                (wrapper.children[2].actualSize.width === 7.5
                    && wrapper.children[2].actualSize.height === 15 &&
                    wrapper.children[2].offsetX === 100 && wrapper.children[2].offsetY === 342.5)
            ).toBe(true);
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
describe('BPMN dataobject node visibility issue', () => {
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

        let nodes: NodeModel[] = [
            {
                id: 'subProcess', width: 520, height: 250, offsetX: 300, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'DataObject'}
            }  ,

        ];
           diagram = new Diagram({
            width: '74%', height: '600px', nodes: nodes,
         });
        diagram.appendTo('#diagram1');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('BPMN dataObject after visibility true and false', (done: Function) => { 
       diagram.nodes[0].visible = false;
       diagram.dataBind();
       diagram.nodes[0].visible = true;
       diagram.dataBind();
        expect((diagram.nodes[0].wrapper.children[0] as Container).children[2].visible === false).toBe(true);
        expect((diagram.nodes[0].wrapper.children[0] as Container).children[1].visible === false).toBe(true);
        (diagram.nodes[0].shape as BpmnShape).dataObject = { type : 'Input', collection : false};
        diagram.dataBind();
        diagram.nodes[0].visible = false;
        diagram.dataBind();
        diagram.nodes[0].visible = true;
        diagram.dataBind();
        expect((diagram.nodes[0].wrapper.children[0] as Container).children[2].visible === false).toBe(true);
        (diagram.nodes[0].shape as BpmnShape).dataObject = { type : 'None', collection : true};
        diagram.dataBind();
        diagram.nodes[0].visible = false;
        diagram.dataBind();
        diagram.nodes[0].visible = true;
        diagram.dataBind();
        expect((diagram.nodes[0].wrapper.children[0] as Container).children[1].visible === false).toBe(true);
        done();
    });

});

describe('BPMN shapes', () => {
    describe('Changing of BPMN Shapes from one to another', () => {
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
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'DataObject',
                    dataObject: { collection: false, type: 'Input' }
                } as BpmnShapeModel,
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Event',
                    event: { event: 'Start', trigger: 'None' }
                }
            };
            let node3 :NodeModel= {
                id: 'node3', width: 100, height: 100, offsetX: 380, offsetY: 100,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } as BpmnGatewayModel },
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 500, offsetY: 100,
             shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: { collapsed: true } as BpmnSubProcessModel
                    }
                },
            };
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 650, offsetY: 100,
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'Service'

                        }
                    },
                },
            };
            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [ node1,node2,node3,node4,node5]
            });
            diagram.appendTo('#diagram');
            });
            afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Update BPMN Shape from  dataobject to datasource', function (done) {
                let node = diagram.nodes[0];
                node.shape = {
                    type: 'Bpmn', shape: 'DataSource',
                    dataObject: { collection: false, type: 'Input' }
                },
                diagram.dataBind();
                let pathElement = document.getElementById('node1_0_dataobj');
                expect(pathElement === null).toBe(true);
                done();
        });
        it('Update BPMN Shape from  event to activity task', function (done) {
                let node = diagram.nodes[1];
                node.shape = {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'Task', task: {
                            type: 'Service'
                        }
                    },
                },
                diagram.dataBind();
                let pathElement = document.getElementById('node2_1_event');
                expect(pathElement === null).toBe(true);
                done();
        });
        it('Update BPMN Shape from gateway to event', function (done) {
                let node = diagram.nodes[2];
                node.shape = {
                    type: 'Bpmn', shape: 'Event',
                        event: { event: 'Start', trigger: 'None' }
                    }
                diagram.dataBind();
                let pathElement = document.getElementById('node3_0_gateway');
                expect(pathElement === null).toBe(true);
                done();
        });
        it('Update BPMN Shape from  activity subprocess to gateway', function (done) {
                let node = diagram.nodes[3];
                node.shape = {
                    type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } 
                },
                diagram.dataBind();
                let pathElement = document.getElementById('node4_boundary');
                expect(pathElement === null).toBe(true);
                done();
        });
        it('Update BPMN Shape from  activity task to dataobject', function (done) {
                let node = diagram.nodes[4];
                node.shape = {
                    type: 'Bpmn', shape: 'DataObject',
                    dataObject: { collection: false, type: 'Input' }
                },
                diagram.dataBind();
                let pathElement = document.getElementById('node5_0_task');
                expect(pathElement === null).toBe(true);
                done();
        });
    });
});