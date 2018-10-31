import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { Node } from '../../../src/diagram/objects/node';
import { NodeModel, BpmnShapeModel, BpmnGatewayModel } from '../../../src/diagram/objects/node-model';
import { ShapeStyleModel, ShadowModel } from '../../../src/diagram/core/appearance-model';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { NodeConstraints } from '../../../src/diagram/enum/enum';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
Diagram.Inject(BpmnDiagrams);

/**
 * BPMN shapes -  Message, DataSource, Group
 */
describe('Diagram Control', () => {

    describe('BPMN Shapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
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
    });
});
