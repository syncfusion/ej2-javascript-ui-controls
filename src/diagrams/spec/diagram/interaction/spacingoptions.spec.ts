import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';


/**
 * SpacingOptions Spec
 */
describe('SpacingOptions Commands', () => {

    describe('Nodes with SpacingOptions RightToLeft', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 600, y: 100 }, targetPoint: { x: 800, y: 100 }
            };
            let node: NodeModel = {
                id: 'node1', width: 200, height: 100, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3],
                connectors: [connector]
            });
            diagram.appendTo('#diagram');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.connectors[0]);
            diagram.distribute('RightToLeft', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 300 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 600 && diagram.connectors[0].sourcePoint.y === 100) &&
                (diagram.connectors[0].targetPoint.x === 800 && diagram.connectors[0].targetPoint.y === 100)).toBe(true);
            done();
        });
    });
    describe('Nodes with SpacingOptions Right', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 200, height: 100, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3]
            });
            diagram.appendTo('#diagram1');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2]);
            diagram.distribute('Right', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 250 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100)).toBe(true);
            done();
        });
    });
    describe('Nodes with SpacingOptions Left', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 200, height: 100, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3]
            });
            diagram.appendTo('#diagram2');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2]);
            diagram.distribute('Left', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 350 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100)).toBe(true);
            done();
        });
    });
    describe('Nodes with SpacingOptions Center', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 200, height: 100, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3]
            });
            diagram.appendTo('#diagram3');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2]);
            diagram.distribute('Center', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 300 && diagram.nodes[0].offsetY === 200) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 100)).toBe(true);
            done();
        });
    });
    describe('Nodes with SpacingOptions BottomToTop', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 200, height: 100, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 250, y: 300 }, targetPoint: { x: 400, y: 300 }
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 500,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3], connectors: [connector]
            });
            diagram.appendTo('#diagram4');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.connectors[0]);
            diagram.distribute('Middle', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 500 && diagram.nodes[2].offsetY === 500) &&
                (Math.round(diagram.nodes[0].offsetX) === 200 && Math.round(diagram.nodes[0].offsetY) === 233) &&
                (diagram.connectors[0].sourcePoint.x === 250 && Math.round(diagram.connectors[0].sourcePoint.y) === 367) &&
                (diagram.connectors[0].targetPoint.x === 400 && Math.round(diagram.connectors[0].targetPoint.y) === 367)).toBe(true);
            done();
        });
    });
    describe('Nodes with SpacingOptions Top', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 300 },
                type: 'Orthogonal'
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 150, offsetX: 300, offsetY: 400,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2], connectors: [connector]
            });
            diagram.appendTo('#diagram5');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.connectors[0]);
            diagram.distribute('Top', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 400) &&
                (diagram.connectors[0].sourcePoint.x === 100 && diagram.connectors[0].sourcePoint.y === 187.5) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 287.5)).toBe(true);
            done();
        });
    });
    describe('Nodes with SpacingOptions Bottom', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 300 },
                type: 'Orthogonal'
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 150, offsetX: 300, offsetY: 400,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2], connectors: [connector]
            });
            diagram.appendTo('#diagram6');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.connectors[0]);
            diagram.distribute('Bottom', objects);

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 400) &&
                (diagram.connectors[0].sourcePoint.x === 100 && diagram.connectors[0].sourcePoint.y === 212.5) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 312.5)).toBe(true);
            done();
        });
    });
    describe('Nodes with SpacingOptions Default', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 300 },
                type: 'Orthogonal'
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 150, offsetX: 300, offsetY: 400,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2], connectors: [connector]
            });
            diagram.appendTo('#diagram6');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.connectors[0]);
            diagram.distribute('BottomToTop', objects);
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 400) &&
                (diagram.connectors[0].sourcePoint.x === 100 && diagram.connectors[0].sourcePoint.y === 187.5) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 287.5)).toBe(true);
            done();
        });
    });
});