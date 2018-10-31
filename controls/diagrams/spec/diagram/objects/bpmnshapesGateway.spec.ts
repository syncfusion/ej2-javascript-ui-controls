import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BpmnShapeModel } from '../../../src/diagram/objects/node-model';
import { ShapeStyleModel } from '../../../src/diagram/core/appearance-model';
import { ShadowModel, RadialGradientModel, StopModel } from '../../../src/diagram/core/appearance-model';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
Diagram.Inject(BpmnDiagrams);

/**
 * bpmn gateway shapes
 */
describe('Diagram Control', () => {

    describe('BPMN Gateway', () => {
        let diagram: Diagram;
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram96gateway' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } } as BpmnShapeModel,
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
                style: { fill: 'red', strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Complex' } } as BpmnShapeModel,
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 100,
                style: { strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,

                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'EventBased' } } as BpmnShapeModel,
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 700, offsetY: 100,
                shadow: shadow,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'ExclusiveEventBased' } } as BpmnShapeModel,
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 900, offsetY: 100,
                style: { gradient: gradient } as ShapeStyleModel,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Inclusive' } } as BpmnShapeModel,
            };
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Parallel' } } as BpmnShapeModel,
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'ParallelEventBased' } } as BpmnShapeModel,
            };
            let node7: NodeModel = {
                id: 'node7', width: 100, height: 100, offsetX: 500, offsetY: 300,
                shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'None' } } as BpmnShapeModel,
            };

            diagram = new Diagram({
                width: 1500, height: 800, nodes: [node, node1, node2, node3, node4, node5, node6, node7]
            });
            diagram.appendTo('#diagram96gateway');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking before, after,  BPMN Gateway shape and type as Exclusive', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[0] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 45
                    && wrapper.children[1].actualSize.height === 45 &&
                    wrapper.children[1].offsetX === 100 && wrapper.children[1].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Checking before, after,   BPMN Gateway shape and type as Complex ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[1] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 300 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 45
                    && wrapper.children[1].actualSize.height === 45 &&
                    wrapper.children[1].offsetX === 300 && wrapper.children[1].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Checking before, after,   BPMN Gateway shape and type as EventBased ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[2] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 500 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 45
                    && wrapper.children[1].actualSize.height === 45 &&
                    wrapper.children[1].offsetX === 500 && wrapper.children[1].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Checking before, after,  BPMN Gateway shape and type as ExclusiveEventBased ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[3] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 700 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 45
                    && wrapper.children[1].actualSize.height === 45 &&
                    wrapper.children[1].offsetX === 700 && wrapper.children[1].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Checking before, after,   BPMN Gateway shape and type as Inclusive ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[4] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 900 && wrapper.children[0].offsetY === 100) &&
                //second node
                (wrapper.children[1].actualSize.width === 45
                    && wrapper.children[1].actualSize.height === 45 &&
                    wrapper.children[1].offsetX === 900 && wrapper.children[1].offsetY === 100)
            ).toBe(true);
            done();
        });

        it('Checking before, after,  BPMN Gateway shape and type as Parallel ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[5] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 100 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 45
                    && wrapper.children[1].actualSize.height === 45 &&
                    wrapper.children[1].offsetX === 100 && wrapper.children[1].offsetY === 300)
            ).toBe(true);
            done();
        });

        it('Checking before, after, BPMN Gateway shape and type as ParallelEventBased ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[6] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 300 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 45
                    && wrapper.children[1].actualSize.height === 45 &&
                    wrapper.children[1].offsetX === 300 && wrapper.children[1].offsetY === 300)
            ).toBe(true);
            done();
        });

        it('Checking before, after,  BPMN Gateway shape and type as none ', (done: Function) => {
            let wrapper: Canvas = (diagram.nodes[7] as NodeModel).wrapper.children[0] as Canvas;
            expect((wrapper.children[0].actualSize.width === 100
                && wrapper.children[0].actualSize.height === 100 &&
                wrapper.children[0].offsetX === 500 && wrapper.children[0].offsetY === 300) &&
                //second node
                (wrapper.children[1].actualSize.width === 45
                    && wrapper.children[1].actualSize.height === 45 &&
                    wrapper.children[1].offsetX === 500 && wrapper.children[1].offsetY === 300)
            ).toBe(true);
            done();
        });
    });
});
