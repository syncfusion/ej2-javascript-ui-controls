import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { AlignmentOptions } from '../../../src/diagram/index';
import { MouseEvents } from './mouseevents.spec';


/**
 * Align Spec
 */
describe('Alignment Commands', () => {

    describe('Nodes with alignment left', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3, node4],
                connectors: [connector]
            });
            diagram.appendTo('#diagram');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            alignObjects(objects, 'Left');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 85 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 75 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 110 && diagram.nodes[3].offsetY === 350) &&
                (diagram.connectors[0].sourcePoint.x === 35 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 235 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Nodes with alignment Right', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3, node4],
                connectors: [connector]
            });
            diagram.appendTo('#diagram1');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            alignObjects(objects, 'Right');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 115 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 125 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 90 && diagram.nodes[3].offsetY === 350)).toBe(true);
            done();
        });
    });
    describe('Nodes with alignment Top', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 120, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3, node4],
                connectors: [connector]
            });
            diagram.appendTo('#diagram3');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            alignObjects(objects, 'Top');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 110) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 100) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 85) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 50) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 50)).toBe(true);
            done();
        });
    });
    describe('Nodes with alignment Bottom', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 120, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3, node4],
                connectors: [connector]
            });
            diagram.appendTo('#diagram4');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            alignObjects(objects, 'Bottom');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 90) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 100) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 115) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 150) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 150)).toBe(true);
            done();
        });
    });
    describe('Nodes with alignment Center', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3, node4],
                connectors: [connector]
            });
            diagram.appendTo('#diagram5');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            alignObjects(objects, 'Center');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 100 && diagram.nodes[1].offsetY === 200) &&
                (diagram.nodes[2].offsetX === 100 && diagram.nodes[2].offsetY === 450) &&
                (diagram.nodes[3].offsetX === 100 && diagram.nodes[3].offsetY === 350) &&
                (diagram.connectors[0].sourcePoint.x === 0 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 200 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Nodes with alignment Middle', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 200,
                annotations: [{ content: 'Node2', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 80, height: 100, offsetX: 200, offsetY: 450,
                annotations: [{ content: 'Node3', style: { strokeColor: 'black', opacity: 1 } }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 150, height: 70, offsetX: 400, offsetY: 350,
                annotations: [{ content: 'Node4', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node, node2, node3, node4],
                connectors: [connector]
            });
            diagram.appendTo('#diagram6');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.nodes[0], diagram.nodes[1], diagram.nodes[2], diagram.nodes[3], diagram.connectors[0]);
            alignObjects(objects, 'Middle');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 100) &&
                (diagram.nodes[1].offsetX === 300 && diagram.nodes[1].offsetY === 100) &&
                (diagram.nodes[2].offsetX === 200 && diagram.nodes[2].offsetY === 100) &&
                (diagram.nodes[3].offsetX === 400 && diagram.nodes[3].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 100) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 100)).toBe(true);
            done();
        });
    });
    describe('Connectors with alignment Left', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram7' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({ width: '1000px', height: '1000px', nodes: [node], connectors: [connector] });
            diagram.appendTo('#diagram7');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            alignObjects(objects, 'Left');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 465 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Connectors with alignment Right', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram8' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({ width: '1000px', height: '1000px', nodes: [node], connectors: [connector] });
            diagram.appendTo('#diagram8');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            alignObjects(objects, 'Right');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 535 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Connectors with alignment Top', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram9' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({ width: '1000px', height: '1000px', nodes: [node], connectors: [connector] });
            diagram.appendTo('#diagram9');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            alignObjects(objects, 'Top');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 550) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Connectors with alignment Bottom', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram10' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({ width: '1000px', height: '1000px', nodes: [node], connectors: [connector] });
            diagram.appendTo('#diagram10');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            alignObjects(objects, 'Bottom');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 450) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe
            done();
        });
    });
    describe('Connectors with alignment Center', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram11' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({ width: '1000px', height: '1000px', nodes: [node], connectors: [connector] });
            diagram.appendTo('#diagram11');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            alignObjects(objects, 'Center');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 500 && diagram.nodes[0].offsetY === 100) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Connectors with alignment Middle', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let alignObjects: Function = (objects: (NodeModel | ConnectorModel)[], options: AlignmentOptions) => {
            diagram.align(options, objects);
        };

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 400, y: 500 }, targetPoint: { x: 600, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 130, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', style: { strokeColor: 'black', opacity: 1 } }]
            };
            diagram = new Diagram({ width: '1000px', height: '1000px', nodes: [node], connectors: [connector] });
            diagram.appendTo('#diagram12');
            let objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(diagram.connectors[0], diagram.nodes[0]);
            alignObjects(objects, 'Middle');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram instance creation', (done: Function) => {
            expect((diagram.nodes[0].offsetX === 100 && diagram.nodes[0].offsetY === 500) &&
                (diagram.connectors[0].sourcePoint.x === 400 && diagram.connectors[0].sourcePoint.y === 500) &&
                (diagram.connectors[0].targetPoint.x === 600 && diagram.connectors[0].targetPoint.y === 500)).toBe(true);
            done();
        });
    });
    describe('Nodes with alignment type selector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramSelector' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200
            };
            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 100, offsetY: 100
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 100, offsetX: 200, offsetY: 350
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 100, offsetX: 400, offsetY: 450
            };
            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 600, offsetY: 250
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 800, offsetY: 450
            };
            diagram = new Diagram({
                width: '1000px', height: '1000px', nodes: [node1, node2, node3, node4, node5, node6]
            });
            diagram.appendTo('#diagramSelector');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking left and top align', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 300, 200, true);
            mouseEvents.clickEvent(diagramCanvas, 100, 100, true);
            diagram.align('Left', undefined, 'Selector');
            console.log(diagram.nodes[0].offsetX);
            expect(diagram.nodes[0].offsetX === 100).toBe(true);
            diagram.align('Top', undefined, 'Selector');
            console.log(diagram.nodes[0].offsetY);
            expect(diagram.nodes[0].offsetY === 100).toBe(true);
            diagram.clearSelection();
            done();
        });
        it('Checking right and bottom align', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 200, 350, true);
            mouseEvents.clickEvent(diagramCanvas, 400, 450, true);
            diagram.align('Right', undefined, 'Selector');
            console.log(diagram.nodes[2].offsetX);
            expect(diagram.nodes[2].offsetX === 400).toBe(true);
            diagram.align('Bottom', undefined, 'Selector');
            console.log(diagram.nodes[2].offsetY);
            expect(diagram.nodes[2].offsetY === 450).toBe(true);
            diagram.clearSelection();
            done();
        });
        it('Checking middle and center align', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 600, 250, true);
            mouseEvents.clickEvent(diagramCanvas, 800, 450, true);
            diagram.align('Center', undefined, 'Selector');
            console.log(diagram.nodes[4].offsetX);
            expect(diagram.nodes[4].offsetX === (800 + 600) / 2).toBe(true);
            diagram.align('Middle', undefined, 'Selector');
            console.log(diagram.nodes[4].offsetY);
            expect(diagram.nodes[4].offsetY === (450 + 250) / 2).toBe(true);
            diagram.clearSelection();
            done();
        });
    });
});