import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';

/**
 * Command spec
 */

describe('Diagram Control', () => {

    let pathData: string = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366' +
        'L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966' +
        'L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
    describe('Interactive Commands', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Path',
                    data: pathData
                },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center',
                    height: 50,
                    width: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Orthogonal',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 },
                sourceDecorator: { style: { fill: 'black' }, shape: 'Circle', pivot: { x: 0, y: 0.5 } },
                targetDecorator: { shape: 'Arrow', style: { fill: 'blue' }, pivot: { x: 0, y: 0.5 } },
                cornerRadius: 10,
                style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({
                width: '900px', height: '700px', nodes: [node], connectors: [connector1]
            });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking drag commands', (done: Function) => {

            //drag the node by 100pixels
            diagram.drag((diagram.nodes[0] as NodeModel), 100, 140);
            //drag the node by 100pixels
            diagram.drag((diagram.connectors[0] as ConnectorModel), 300, 440);
            expect(((diagram.nodes[0] as NodeModel).wrapper.children[0].offsetX === 200)
                && ((diagram.nodes[0] as NodeModel).wrapper.children[0].offsetY === 240)
            ).toBe(true);
            done();
        });
    });

    describe('Interactive Commands', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Orthogonal',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 },
                sourceDecorator: { style: { fill: 'black' }, shape: 'Circle', pivot: { x: 0, y: 0.5 } },
                targetDecorator: { shape: 'Arrow', style: { fill: 'blue' }, pivot: { x: 0, y: 0.5 } },
                cornerRadius: 10,
                style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };

            diagram = new Diagram({ width: '500px', height: '500px', connectors: [connector1] });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking source end dragging', (done: Function) => {

            //drag the srcend by 100pixels
            diagram.dragSourceEnd((diagram.connectors[0] as ConnectorModel), 130, 190);
            expect((diagram.connectors[0].sourcePoint.x === 230)
                && (diagram.connectors[0].sourcePoint.y === 290)
            ).toBe(true);
            done();
        });
    });
    describe('Interactive Commands', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Orthogonal',
                sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 },
                sourceDecorator: { style: { fill: 'black' }, shape: 'Arrow', pivot: { x: 0, y: 0.5 } },
                targetDecorator: { shape: 'Diamond', style: { fill: 'blue' }, pivot: { x: 0, y: 0.5 } },
                cornerRadius: 10,
                style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({ width: '500px', height: '500px', connectors: [connector1] });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking target end dragging', (done: Function) => {
            //drag the targetend by 100pixels
            diagram.dragTargetEnd((diagram.connectors[0] as ConnectorModel), 100, 140);
            expect((diagram.connectors[0].targetPoint.x === 400)
                && (diagram.connectors[0].targetPoint.y === 440)
            ).toBe(true);
            done();
        });
    });
    describe('Interactive Commands', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'noder',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100, rotateAngle: 40,
                shape: {
                    type: 'Path', data: pathData
                },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center',
                    height: 50,
                    width: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1',
                width: 100, height: 100,
                offsetX: 300, offsetY: 100, rotateAngle: 1, style: { fill: 'orange' },
                shape: {
                    type: 'Path', data: pathData
                },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center',
                    height: 50,
                    width: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            diagram = new Diagram({ width: '1500px', height: '1500px', nodes: [node, node1] });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking rotate command', (done: Function) => {

            //rotate the node by 105deg
            diagram.rotate(diagram.nodes[0], 65);
            //rotate the node1 by 45deg
            diagram.rotate(diagram.nodes[1], 45);
            expect((diagram.nodes[0] as NodeModel).wrapper.children[0].parentTransform == 105
            ).toBe(true);
            done();
        });
    });
    describe('Interactive Commands', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele); let node: NodeModel = {
                id: 'node', width: 100, height: 100,
                offsetX: 250, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50, width: 50,
                    offset: { x: 0.5, y: 0.5 }, horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100,
                offsetX: 700, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50, width: 50,
                    offset: { x: 0.5, y: 0.5 }, horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100,
                offsetX: 1100, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50, width: 50,
                    offset: { x: 0.5, y: 0.5 }, horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            diagram = new Diagram({
                width: '1500px', height: '1500px', nodes: [node, node1, node2],
                connectors: [{
                    id: 'connector1', sourcePoint: { x: 200, y: 300 },
                    targetPoint: { x: 300, y: 400 }
                }]
            });
            diagram.appendTo('#diagram');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking resize commands - nodes', (done: Function) => {
            diagram.scale(diagram.nodes[0], 210 / 100, 210 / 100, { x: 0, y: 0 });
            diagram.scale(diagram.nodes[1], 210 / 100, 210 / 100, { x: 0.5, y: 0.5 });
            diagram.scale(diagram.nodes[2], 210 / 100, 210 / 100, { x: 1, y: 1 });
            expect(((diagram.nodes[0] as NodeModel).wrapper.children[0].actualSize.width === 210
                && (diagram.nodes[0] as NodeModel).wrapper.children[0].actualSize.height === 210 &&
                (diagram.nodes[0] as NodeModel).wrapper.children[0].offsetX === 305 &&
                (diagram.nodes[0] as NodeModel).wrapper.children[0].offsetY === 255)
                && ((diagram.nodes[1] as NodeModel).wrapper.children[0].actualSize.width === 210
                    && (diagram.nodes[1] as NodeModel).wrapper.children[0].actualSize.height === 210 &&
                    (diagram.nodes[1] as NodeModel).wrapper.children[0].offsetX === 700 &&
                    (diagram.nodes[1] as NodeModel).wrapper.children[0].offsetY === 200)
                && ((diagram.nodes[2] as NodeModel).wrapper.children[0].actualSize.width === 210
                    && (diagram.nodes[2] as NodeModel).wrapper.children[0].actualSize.height === 210 &&
                    (diagram.nodes[2] as NodeModel).wrapper.children[0].offsetX === 1045 &&
                    (diagram.nodes[2] as NodeModel).wrapper.children[0].offsetY === 145)).toBe(true);
            done();
        });

        it('Checking resize commands - connectors', (done: Function) => {
            diagram.scale(diagram.connectors[0], 1.5, 1.5, { x: 0, y: 0 });
            expect(diagram.connectors[0].wrapper.actualSize.width == 150 && diagram.connectors[0].wrapper.actualSize.height == 150 &&
                diagram.connectors[0].wrapper.offsetX == 275 && diagram.connectors[0].wrapper.offsetY == 375).toBe(true);
            done();
        });
    });

    describe('Interactive Commands', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100, offsetX: 250, offsetY: 200, rotateAngle: 240,
                shape: {
                    type: 'Basic', shape: 'Rectangle'
                },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 }, content: 'center center',
                    height: 50, width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center', verticalAlignment: 'Center',
                }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 600, offsetY: 200, style: { fill: 'red' },
                shape: {
                    type: 'Basic', shape: 'Rectangle'
                },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 }, content: 'center center',
                    height: 50, width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center', verticalAlignment: 'Center',
                }]
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 900, offsetY: 200,
                style: { fill: 'yellow' },
                shape: {
                    type: 'Basic', shape: 'Rectangle'
                },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 }, content: 'center center',
                    height: 50, width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center', verticalAlignment: 'Center',
                }]
            };
            diagram = new Diagram({ width: '1500px', height: '1500px', nodes: [node, node3, node6] });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking resize commands - after rotation', (done: Function) => {
            //rotate the node by 45deg
            diagram.rotate(diagram.nodes[0], 45);
            //resize the node by 210 with pivot 0.5
            diagram.scale(diagram.nodes[0], 210 / 100, 210 / 100, { x: 0.5, y: 0.5 });
            //rotate the node by 90deg 
            diagram.rotate(diagram.nodes[1], 90);
            //resize the node by 210 with pivot 0
            diagram.scale(diagram.nodes[1], 210 / 100, 210 / 100, { x: 0, y: 0 });
            //rotate the node by 90deg
            diagram.rotate(diagram.nodes[2], 90);
            //resize the node by 210 with pivot 1
            diagram.scale(diagram.nodes[2], 210 / 100, 210 / 100, { x: 1, y: 1 });
            expect(((diagram.nodes[1] as NodeModel).wrapper.children[0].actualSize.width === 210
                && (diagram.nodes[1] as NodeModel).wrapper.children[0].actualSize.height === 210 &&
                (diagram.nodes[1] as NodeModel).wrapper.children[0].offsetX === 545 &&
                (diagram.nodes[1] as NodeModel).wrapper.children[0].offsetY === 255)
                && ((diagram.nodes[2] as NodeModel).wrapper.children[0].actualSize.width === 210
                    && (diagram.nodes[2] as NodeModel).wrapper.children[0].actualSize.height === 210 &&
                    (diagram.nodes[2] as NodeModel).wrapper.children[0].offsetX === 955 &&
                    (diagram.nodes[2] as NodeModel).wrapper.children[0].offsetY === 145)).toBe(true);
            done();
        });
    });

    describe('Add and remove commands', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100, offsetX: 250, offsetY: 200, rotateAngle: 240,
                shape: {
                    type: 'Basic', shape: 'Rectangle'
                },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 }, content: 'center center',
                    height: 50, width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center', verticalAlignment: 'Center',
                }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 600, offsetY: 200, style: { fill: 'red' },
                shape: {
                    type: 'Basic', shape: 'Rectangle'
                },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 }, content: 'center center',
                    height: 50, width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center', verticalAlignment: 'Center',
                }]
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 900, offsetY: 200,
                style: { fill: 'yellow' },
                shape: {
                    type: 'Basic', shape: 'Rectangle'
                },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 }, content: 'center center',
                    height: 50, width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center', verticalAlignment: 'Center',
                }]
            };
            diagram = new Diagram({ width: '1500px', height: '1500px', nodes: [node, node3, node6] });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Adding a node', (done: Function) => {
            diagram.add({ id: 'node4', width: 50, height: 50, offsetX: 100, offsetY: 100 });
            expect(diagram.nodes.length).toBe(4);
            done();
        });

        it('Adding a disconnected connector', (done: Function) => {
            diagram.add({ id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 300, y: 300 } });
            expect(diagram.connectors.length).toBe(1);
            done();
        });

        it('Adding a connected connector', (done: Function) => {
            diagram.add({ id: 'connector2', sourceID: 'node', targetID: 'node4' });
            expect(diagram.connectors.length).toBe(2);
            expect(diagram.nameTable['connector2'].sourceWrapper != undefined && diagram.nameTable['connector2'].targetWrapper != undefined).toBe(true);
            done();
        });
    });
});