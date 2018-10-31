import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';

/**
 * Annotation - changing offsets
 */
describe('Diagram Control', () => {

    describe('Annotations with zero offsets', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let pathData: string = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,' +
            '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram50' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    content: 'Zero',
                    height: 50,
                    offset: { x: 0, y: 0 }
                }]
            };

            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100,
                offsetX: 300,
                offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    content: 'Zero',
                    height: 50,
                    offset: { x: 0, y: 0.5 }
                }]
            };

            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100,
                offsetX: 500,
                offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    content: 'zero',
                    height: 50,
                    offset: { x: 0, y: 1 }
                }]
            };
            diagram = new Diagram({ mode: 'Canvas', width: 800, height: 800, nodes: [node, node2, node3] });
            diagram.appendTo('#diagram50');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking annotation offsets as 0', (done: Function) => {
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 50
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 50 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 250 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 450 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 150).toBe(true);
            done();

        });

        it('Checking annotation offsets as 0.5', (done: Function) => {

            (diagram.nodes[0] as NodeModel).annotations[0].offset.x = 0.5;
            (diagram.nodes[1] as NodeModel).annotations[0].offset.x = 0.5;
            (diagram.nodes[2] as NodeModel).annotations[0].offset.x = 0.5;
            diagram.dataBind();
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 100
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 50 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 300 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 500 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 150).toBe(true);
            done();
        });
        it('Checking annotation offset as 1', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].offset.x = 1;
            (diagram.nodes[1] as NodeModel).annotations[0].offset.x = 1;
            (diagram.nodes[2] as NodeModel).annotations[0].offset.x = 1;
            diagram.dataBind();
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 150
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 50 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 350 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 550 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 150).toBe(true);
            done();
        });
    });
});