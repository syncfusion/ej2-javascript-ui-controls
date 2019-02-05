import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, PathModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { PointPortModel } from '../../../src/diagram/objects/port-model';
import { Container } from '../../../src/diagram/core/containers/container';
import { PathElement } from '../../../src/diagram/core/elements/path-element';



/**
 * Test cases for default ports and port positions
 */
describe('Diagram Control', () => {

    describe('Center Ports', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram101' });
            document.body.appendChild(ele);
            let node: NodeModel = { shape: {}, style: {} };
            node.id = 'node';
            node.width = 100; node.height = 100;
            node.offsetX = 300; node.offsetY = 300;
            node.shape = { type: 'Path' };
            (node.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,' +
                '194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
            let nodeport: PointPortModel = { offset: {} };
            nodeport.shape = 'Square';

            let nodeport12: PointPortModel = { offset: {} };
            node.ports = [nodeport, nodeport12];

            let node2: NodeModel = { shape: {}, style: {} };
            node2.id = 'node2'; node2.width = 100; node2.height = 100;
            node2.offsetX = 500;
            node2.offsetY = 300;
            node2.shape = { type: 'Path' };
            (node2.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,' +
                '194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
            let nodeport2: PointPortModel = { offset: {} };
            nodeport2.shape = 'Circle';
            node2.ports = [nodeport2];

            let node3: NodeModel = { shape: {}, style: {} };
            node3.id = 'node3'; node3.width = 100; node3.height = 100;
            node3.offsetX = 700;
            node3.offsetY = 300;
            node3.shape = { type: 'Path' };
            (node3.shape as PathModel).data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,' +
                '194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
            let nodeport3: PointPortModel = { offset: {} };
            nodeport3.shape = 'X';
            node3.ports = [nodeport3];
            diagram = new Diagram({ width: 800, height: 800, nodes: [node, node2, node3] });
            diagram.appendTo('#diagram101');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking default port', (done: Function) => {
            let container1: Container = (diagram.nodes[0] as Node).wrapper;
            expect((container1.children[2] as PathElement).absolutePath === 'M 0 0 L 12 0 L 12 12 L 0 12 Z' &&
                container1.children[2].offsetX === 300 && container1.children[2].offsetY === 300 &&
                container1.children[2].actualSize.width === 12 && container1.children[2].actualSize.height === 12).toBe(true);
            done();
        });
        it('Checking square port at center', (done: Function) => {
            let container1: Container = (diagram.nodes[0] as Node).wrapper;
            expect((container1.children[1] as PathElement).absolutePath === 'M 0 0 L 12 0 L 12 12 L 0 12 Z' &&
                container1.children[1].offsetX === 300 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking circle port at center', (done: Function) => {
            let container1: Container = (diagram.nodes[1] as Node).wrapper;
            expect((container1.children[1] as PathElement).absolutePath === 'M 0 6 A 6 6 0 1 1 12 6 A 6 6 0 1 1 0 6 Z' &&
                container1.children[1].offsetX === 500 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking X port at center', (done: Function) => {
            let container1: Container = (diagram.nodes[2] as Node).wrapper;
            expect((container1.children[1] as PathElement).absolutePath === 'M 0 0 L 12 12 M 12 0 L 0 12' &&
                container1.children[1].offsetX === 700 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });
        it('Checking port at 0,0', (done: Function) => {
            (diagram.nodes[0] as Node).ports[0].offset.x = 0;
            (diagram.nodes[0] as Node).ports[0].offset.y = 0;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[0] as Node).wrapper;
            expect(container1.children[1].offsetX === 250 && container1.children[1].offsetY === 250 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking circle port at 0,0.5', (done: Function) => {
            (diagram.nodes[1] as Node).ports[0].offset.x = 0;
            (diagram.nodes[1] as Node).ports[0].offset.y = 0.5;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[1] as Node).wrapper;
            expect(container1.children[1].offsetX === 450 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking square port at 0,1', (done: Function) => {
            (diagram.nodes[2] as Node).ports[0].offset.x = 0;
            (diagram.nodes[2] as Node).ports[0].offset.y = 1;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[2] as Node).wrapper;
            expect(container1.children[1].offsetX === 650 && container1.children[1].offsetY === 350 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });
        it('Checking port at 1,0', (done: Function) => {
            (diagram.nodes[0] as Node).ports[0].offset.x = 1;
            (diagram.nodes[0] as Node).ports[0].offset.y = 0;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[0] as Node).wrapper;
            expect(container1.children[1].offsetX === 350 && container1.children[1].offsetY === 250 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking circle port at 1,0.5', (done: Function) => {
            (diagram.nodes[1] as Node).ports[0].offset.x = 1;
            (diagram.nodes[1] as Node).ports[0].offset.y = 0.5;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[1] as Node).wrapper;
            expect(container1.children[1].offsetX === 550 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking square port at 1,1', (done: Function) => {
            (diagram.nodes[2] as Node).ports[0].offset.x = 1;
            (diagram.nodes[2] as Node).ports[0].offset.y = 1;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[2] as Node).wrapper;
            expect(container1.children[1].offsetX === 750 && container1.children[1].offsetY === 350 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });
        it('Checking port at 0.5,0', (done: Function) => {
            (diagram.nodes[1] as Node).ports[0].offset.x = 0.5;
            (diagram.nodes[1] as Node).ports[0].offset.y = 0;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[0] as Node).wrapper;
            expect(container1.children[1].offsetX === 350 && container1.children[1].offsetY === 250 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking circle port at 0.5,0.5', (done: Function) => {
            (diagram.nodes[1] as Node).ports[0].offset.x = 0.5;
            (diagram.nodes[1] as Node).ports[0].offset.y = 0.5;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[1] as Node).wrapper;
            expect(container1.children[1].offsetX === 500 && container1.children[1].offsetY === 300 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });

        it('Checking square port at 0.5,1', (done: Function) => {
            (diagram.nodes[2] as Node).ports[0].offset.x = 0.5;
            (diagram.nodes[2] as Node).ports[0].offset.y = 1;
            diagram.dataBind();
            let container1: Container = (diagram.nodes[2] as Node).wrapper;
            expect(container1.children[1].offsetX === 700 && container1.children[1].offsetY === 350 &&
                container1.children[1].actualSize.width === 12 && container1.children[1].actualSize.height === 12).toBe(true);
            done();
        });
        it('Checking updation of custom port', (done: Function) => {
            (diagram.nodes[2] as Node).ports[0].shape = 'Custom';
            (diagram.nodes[2] as Node).ports[0].pathData = 'M6.805,0L13.61,10.703L0,10.703z';
            diagram.dataBind();
            expect((diagram.nodes[2] as Node).ports[0].pathData === 'M6.805,0L13.61,10.703L0,10.703z').toBe(true);
            done();
        });
    });
});