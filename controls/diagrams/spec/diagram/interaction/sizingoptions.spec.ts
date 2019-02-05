import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';

/**
 * SizingOptions Spec
 */
describe('SizingOptions Commands', () => {

    describe('Nodes with SizingOptions Width', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 350, y: 200 }, targetPoint: { x: 450, y: 200 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 200, offsetY: 100,
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 250,
            };
            let node3: NodeModel = {
                id: 'node3', width: 200, height: 75, offsetX: 200, offsetY: 400,
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3],
                connectors: [connector]
            });
            diagram.appendTo('#diagram');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.connectors[0]);
            diagram.sameSize('Width', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].width === 150 && diagram.nodes[0].height === 100) &&
                (diagram.nodes[1].width === 150 && diagram.nodes[1].height === 130) &&
                (diagram.nodes[2].width === 150 && diagram.nodes[2].height === 75) &&
                (diagram.connectors[0].wrapper.bounds.width === 150)).toBe(true);
            done();
        });
    });
    describe('Nodes with SizingOptions Height', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 200, height: 150, offsetX: 200, offsetY: 200
            };
            let node2: NodeModel = {
                id: 'node2', width: 150, height: 180, offsetX: 400, offsetY: 200
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 70, offsetX: 600, offsetY: 200
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3],
                connectors: [connector]
            });
            diagram.appendTo('#diagram1');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.connectors[0]);
            diagram.sameSize('Height', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].width === 200 && diagram.nodes[0].height === 150) &&
                (diagram.nodes[1].width === 150 && diagram.nodes[1].height === 150) &&
                (diagram.nodes[2].width === 80 && diagram.nodes[2].height === 150) &&
                (diagram.connectors[0].wrapper.bounds.height === 150)).toBe(true);
            done();
        });
    });
    describe('Nodes with SizingOptions size', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 200 }, targetPoint: { x: 600, y: 300 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 200, offsetY: 200
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 170, offsetX: 200, offsetY: 350
            };
            let node3: NodeModel = {
                id: 'node3', width: 200, height: 80, offsetX: 200, offsetY: 500
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3],
                connectors: [connector]
            });
            diagram.appendTo('#diagram2');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.connectors[0]);
            diagram.sameSize('Size', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].width === 150 && diagram.nodes[0].height === 100) &&
                (diagram.nodes[1].width === 150 && diagram.nodes[1].height === 100) &&
                (diagram.nodes[2].width === 150 && diagram.nodes[2].height === 100) &&
                (diagram.connectors[0].wrapper.bounds.width === 150 && diagram.connectors[0].wrapper.bounds.height === 100)).toBe(true);
            done();
        });
    });
});