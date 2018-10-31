import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
/**
 * flow shapes
 */
describe('Diagram Control', () => {

    describe('Flow Shapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram96' });
            document.body.appendChild(ele);

            let node: NodeModel = {
                id: 'node', width: 90, height: 90, offsetX: 100, offsetY: 100,
                shape: { type: 'Flow', shape: 'Process' }
            };

            let node1: NodeModel = {
                id: 'node1', width: 90, height: 90, offsetX: 300, offsetY: 100, shape: {
                    type: 'Flow', shape: 'Decision'
                }
            };

            let node2: NodeModel = {
                id: 'node2', width: 90, height: 90, offsetX: 500, offsetY: 100,
                shape: { type: 'Flow', shape: 'Document' }
            };

            let node3: NodeModel = {
                id: 'node3', width: 90, height: 90, offsetX: 700, offsetY: 100,
                shape: { type: 'Flow', shape: 'PreDefinedProcess', }
            };
            let node4: NodeModel = {
                id: 'node4', width: 90, height: 90, offsetX: 900, offsetY: 100,
                shape: { type: 'Flow', shape: 'Terminator', }
            };
            let node5: NodeModel = {
                id: 'node5', width: 90, height: 90, offsetX: 1100, offsetY: 100,
                shape: { type: 'Flow', shape: 'PaperTap', }
            };
            let node6: NodeModel = {
                id: 'node6', width: 90, height: 90, offsetX: 100, offsetY: 300,
                shape: { type: 'Flow', shape: 'DirectData', }
            };
            let node7: NodeModel = {
                id: 'node7', width: 90, height: 90, offsetX: 300, offsetY: 300,
                shape: { type: 'Flow', shape: 'SequentialData', }
            };

            let node8: NodeModel = {
                id: 'node8', width: 90, height: 90, offsetX: 500, offsetY: 300,
                shape: { type: 'Flow', shape: 'Sort', }
            };
            let node9: NodeModel = {
                id: 'node9', width: 90, height: 90, offsetX: 700, offsetY: 300,
                shape: { type: 'Flow', shape: 'MultiDocument', }
            };
            let node10: NodeModel = {
                id: 'node10', width: 90, height: 90, offsetX: 900, offsetY: 300,
                shape: { type: 'Flow', shape: 'Collate', }
            };
            let node11: NodeModel = {
                id: 'node11', width: 90, height: 90, offsetX: 1100, offsetY: 300,
                shape: { type: 'Flow', shape: 'SummingJunction' }
            };

            let node12: NodeModel = {
                id: 'node12', width: 90, height: 90, offsetX: 100, offsetY: 500,
                shape: { type: 'Flow', shape: 'Or', }
            };

            let node13: NodeModel = {
                id: 'node13', width: 90, height: 90, offsetX: 300, offsetY: 500,
                shape: { type: 'Flow', shape: 'InternalStorage', }
            };

            let node14: NodeModel = {
                id: 'node14', width: 90, height: 90, offsetX: 500, offsetY: 500,
                shape: { type: 'Flow', shape: 'Extract', }
            };
            let node15: NodeModel = {
                id: 'node15', width: 90, height: 90, offsetX: 700, offsetY: 500,
                shape: { type: 'Flow', shape: 'ManualOperation' }
            };

            let node16: NodeModel = {
                id: 'node16', width: 90, height: 90, offsetX: 900, offsetY: 500,
                shape: { type: 'Flow', shape: 'Merge', }
            };

            let node17: NodeModel = {
                id: 'node17', width: 90, height: 90, offsetX: 1100, offsetY: 500,
                shape: { type: 'Flow', shape: 'OffPageReference', }
            };

            let node18: NodeModel = {
                id: 'node18', width: 90, height: 90, offsetX: 100, offsetY: 700,
                shape: { type: 'Flow', shape: 'SequentialAccessStorage', }
            };

            let node19: NodeModel = {
                id: 'node19', width: 90, height: 90, offsetX: 300, offsetY: 700,
                shape: { type: 'Flow', shape: 'Annotation', }
            };
            let node20: NodeModel = {
                id: 'node20', width: 90, height: 90, offsetX: 500, offsetY: 700,
                shape: { type: 'Flow', shape: 'Annotation2', }
            };
            let node21: NodeModel = {
                id: 'node21', width: 90, height: 90, offsetX: 700, offsetY: 700,
                shape: { type: 'Flow', shape: 'Data' }
            };
            let node22: NodeModel = {
                id: 'node22', width: 90, height: 90, offsetX: 900, offsetY: 700,
                shape: { type: 'Flow', shape: 'Card', }
            };
            let node23: NodeModel = {
                id: 'node23', width: 90, height: 90, offsetX: 1100, offsetY: 700, shape: {
                    type: 'Flow', shape: 'Delay',
                }
            };
            let node24: NodeModel = {
                id: 'node24', width: 90, height: 90, offsetX: 100, offsetY: 900,
                shape: { type: 'Flow', shape: 'Preparation', }
            };
            let node25: NodeModel = {
                id: 'node25', width: 90, height: 90, offsetX: 300, offsetY: 900,
                shape: { type: 'Flow', shape: 'Display', }
            };
            let node26: NodeModel = {
                id: 'node26', width: 90, height: 90, offsetX: 500, offsetY: 900,
                shape: { type: 'Flow', shape: 'ManualInput', }
            };
            let node27: NodeModel = {
                id: 'node27', width: 90, height: 90, offsetX: 700, offsetY: 900,
                shape: { type: 'Flow', shape: 'LoopLimit', }
            };
            let node28: NodeModel = {
                id: 'node28', width: 90, height: 90, offsetX: 900, offsetY: 900,
                shape: { type: 'Flow', shape: 'StoredData', }
            };
            diagram = new Diagram({
                width: 1500, height: 1500, nodes: [node,
                    node1, node2, node3, node4, node5, node6, node7, node8, node9, node10,
                    node11, node12, node13, node14, node15, node16, node17, node18, node19,
                    node20, node21, node22, node23, node24, node25, node26, node27, node28
                ]
            });
            diagram.appendTo('#diagram96');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking flow shapes', (done: Function) => {
            done();
        });
    });
});
