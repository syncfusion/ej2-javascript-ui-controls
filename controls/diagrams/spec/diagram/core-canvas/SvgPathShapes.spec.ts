import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { NodeModel, PathModel } from '../../../src/diagram/objects/node-model';
import { NodeConstraints } from '../../../src/diagram/enum/enum';
/**
 * Node spec
 */
describe('Diagram Control for shadow properties', () => {
    describe('Simple Diagram', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramg' });
            document.body.appendChild(ele);
            let shape1: PathModel = { type: 'Path', data: 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' }
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: shape1
            };


            let shape2: PathModel = { type: 'Path', data: 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' }
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 200,
                shape: shape2
            };

            let shape3: PathModel = { type: 'Path', data: 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' }
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: shape3
            };

            let shape4: PathModel = { type: 'Path', data: 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' }
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 100, offsetY: 400,
                shape: shape4
            };

            let shape5: PathModel = { type: 'Path', data: 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' }
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 250, offsetY: 400,
                shape: shape5
            };


            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, nodes: [node1, node2, node3, node4, node5] });
            diagram.appendTo('#diagramg');
            let shape15: PathModel = { type: 'Path', data: 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' }
            let node15: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 250, offsetY: 400,
                shape: shape15
            };
            let diagram1 = new Diagram({ width: 1000, height: 1000, nodes: [node15] });
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking nodes shadow in SVG rendering Mode', (done: Function) => {
            expect(((diagram.nodes[0] as NodeModel).shape as PathModel).data == 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' &&
                ((diagram.nodes[1] as NodeModel).shape as PathModel).data == 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' &&
                ((diagram.nodes[2] as NodeModel).shape as PathModel).data == 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z' &&
                ((diagram.nodes[3] as NodeModel).shape as PathModel).data == 'M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z').toBe(true);
            done();
        });
    });
    describe('Simple Diagram', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramh' });
            document.body.appendChild(ele);

            let shape1: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' }
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: shape1
            };


            let shape2: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 200,
                shape: shape2
            };



            let shape3: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 400, offsetY: 200,
                shape: shape3
            };


            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 1000, nodes: [node1, node2, node3] });
            diagram.appendTo('#diagramh');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram gradient in SVG rendering Mode', (done: Function) => {
            expect(((diagram.nodes[0] as NodeModel).shape as PathModel).data == 'M 0,0 L 100,0 L100,100 L0,100 Z' &&
                ((diagram.nodes[1] as NodeModel).shape as PathModel).data == 'M 0,0 L 100,0 L100,100 L0,100 Z' &&
                ((diagram.nodes[2] as NodeModel).shape as PathModel).data == 'M 0,0 L 100,0 L100,100 L0,100 Z').toBe(true);
            done();
        });
    });
});