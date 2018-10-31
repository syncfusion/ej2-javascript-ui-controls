import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Connector } from '../../../src/diagram/objects/connector';


/**
 * ClipBoard Command spec
 */

describe('Diagram Control', () => {


    describe('Copy and Paste a single node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Basic',
                    shape: 'Rectangle'
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
            diagram = new Diagram({
                width: '900px', height: '700px', nodes: [node],
            });
            diagram.appendTo('#diagram1');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
            //copy the single node
            let object: object = diagram.copy();
            //paste the single node
            diagram.paste(object as NodeModel[]);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking diagram instance creation -  copy and paste the single node', (done: Function) => {
            expect(diagram.nodes.length === 2 && diagram.nodes[1].offsetX === 110 &&
                diagram.nodes[1].offsetY === 110 && diagram.nodes[0].offsetX === 100).toBe(true);
            done();
        });
    });


    describe('Cut and Paste a single node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Basic',
                    shape: 'Rectangle'
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
            diagram = new Diagram({
                width: '900px', height: '700px', nodes: [node],
            });
            diagram.appendTo('#diagram2');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
            //cut the single node
            diagram.cut();
            //paste the cuted node
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking diagram instance creation -  cut and paste a single node', (done: Function) => {
            expect(diagram.nodes.length === 1 && diagram.nodes[0].offsetX === 100 &&
                diagram.nodes[0].offsetY === 100).toBe(true);
            done();
        });
    });

    describe('Copy  and Paste a single connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceDecorator: {
                    style: { fill: 'black' },
                    shape: 'Arrow', pivot: { x: 0, y: 0.5 }
                },
                targetDecorator: { shape: 'Diamond', style: { fill: 'blue' }, pivot: { x: 0, y: 0.5 } },
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({
                width: '900px', height: '700px', connectors: [connector1],
            });
            diagram.appendTo('#diagram3');
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray);
            //copy the single connector
            let object: object = diagram.copy();
            diagram.paste(object as ConnectorModel[]);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking diagram instance creation -  copy and paste a single connector', (done: Function) => {
            expect(diagram.connectors.length === 2 && diagram.connectors[0].sourcePoint.x === 200 &&
                diagram.connectors[0].sourcePoint.y === 200 && diagram.connectors[1].sourcePoint.x === 210 &&
                diagram.connectors[1].sourcePoint.x === 210 && diagram.connectors[0].targetPoint.x === 300 &&
                diagram.connectors[0].targetPoint.y === 300).toBe(true);
            done();
        });
    });

    describe('Cut and Paste a single connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceDecorator: {
                    style: { fill: 'black' },
                    shape: 'Arrow', pivot: { x: 0, y: 0.5 }
                },
                targetDecorator: { shape: 'Diamond', style: { fill: 'blue' }, pivot: { x: 0, y: 0.5 } },
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({
                width: '900px', height: '700px', connectors: [connector1],
            });
            diagram.appendTo('#diagram4');
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray);
            diagram.cut();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking diagram instance creation -  cut and paste a single connector', (done: Function) => {
            expect(diagram.connectors.length === 1 && diagram.connectors[0].sourcePoint.x === 200 &&
                diagram.connectors[0].sourcePoint.y === 200 && diagram.connectors[0].targetPoint.x === 300 &&
                diagram.connectors[0].targetPoint.y === 300).toBe(true);
            done();
        });
    });

    describe('copy and paste the connector when it is connect with node ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50,
                    width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
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
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceID: node.id, targetID: node1.id,
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node, node1], connectors: [connector1] });
            diagram.appendTo('#diagram5');
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray);
            let object: object = diagram.copy();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  connector copy and paste connector when it is connect  with nodes', (done: Function) => {
            let failure: boolean = false;
            expect(diagram.connectors[1].sourceID === '' && diagram.connectors[1].targetID === '' &&
                (diagram.nodes[0] as Node).outEdges.length === 1 && (diagram.nodes[1] as Node).inEdges.length === 1).toBe(true);
            done();
        });
    });


    describe('cut and paste the connector when it is connect with node ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50,
                    width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
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
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceID: node.id, targetID: node1.id,
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node, node1], connectors: [connector1] });
            diagram.appendTo('#diagram6');
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray);
            diagram.cut();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  connector cut and paste connector when it is connect  with nodes', (done: Function) => {
            let failure: boolean = false;
            expect(diagram.connectors[0].sourceID === '' && diagram.connectors[0].targetID === '' &&
                (diagram.nodes[0] as Node).outEdges.length === 0 && (diagram.nodes[1] as Node).inEdges.length === 0).toBe(true);
            done();
        });
    });

    describe('copy and paste the node when it has out Edges ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram7' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50,
                    width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
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
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceID: node.id, targetID: node1.id,
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node, node1], connectors: [connector1] });
            diagram.appendTo('#diagram7');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
            let object: object = diagram.copy();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  connector copy and paste node when it has out edges', (done: Function) => {
            let failure: boolean = false;
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                diagram.nodes.length === 3 && (diagram.nodes[0] as Node).outEdges[0] === 'connector1' &&
                (diagram.nodes[1] as Node).inEdges[0] === 'connector1' && diagram.nodes[2].id !== diagram.nodes[0].id).toBe(true);
            done();
        });
    });

    describe('cut and paste the node when it has out Edges ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram8' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50,
                    width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
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
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceID: node.id, targetID: node1.id,
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node, node1], connectors: [connector1] });
            diagram.appendTo('#diagram8');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
            diagram.cut();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  node cut and paste node when it has out edges', (done: Function) => {
            expect(diagram.connectors.length === 0 && diagram.nodes.length === 2 && (diagram.nodes[0] as Node).outEdges.length === 0 &&
                (diagram.nodes[1] as Node).inEdges.length === 0).toBe(true);
            done();
        });
    });


    describe('copy and paste the two selected nodes with out edges ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram9' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50,
                    width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
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
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceID: node.id, targetID: node1.id,
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node, node1], connectors: [connector1] });
            diagram.appendTo('#diagram9');
            selArray.push(diagram.nodes[0]);
            selArray.push(diagram.nodes[1]);
            diagram.select(selArray, true);
            let object: object = diagram.copy();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  copy and paste the two selected nodes with out edges', (done: Function) => {
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                diagram.nodes.length === 4 && (diagram.nodes[0] as Node).outEdges[0] === 'connector1' &&
                (diagram.nodes[1] as Node).inEdges[0] === 'connector1' && (diagram.nodes[2] as Node).outEdges.length === 0 &&
                (diagram.nodes[3] as Node).inEdges.length === 0).toBe(true);
            done();
        });
    });

    describe('cut and paste the two selected nodes with out edges ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram10' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50,
                    width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
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
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceID: node.id, targetID: node1.id,
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node, node1], connectors: [connector1] });
            diagram.appendTo('#diagram10');
            selArray.push(diagram.nodes[0]);
            selArray.push(diagram.nodes[1]);
            diagram.select(selArray, true);
            diagram.cut();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  cut and paste the two selected nodes with out edges', (done: Function) => {
            expect(diagram.connectors.length === 0 && diagram.nodes.length === 2 &&
                (diagram.nodes[0] as Node).outEdges.length === 0 && (diagram.nodes[1] as Node).inEdges.length === 0
            ).toBe(true);
            done();
        });
    });


    describe('copy and paste two selected nodes with edges ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram11' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50,
                    width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
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
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceID: node.id, targetID: node1.id,
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node, node1], connectors: [connector1] });
            diagram.appendTo('#diagram11');
            selArray.push(diagram.nodes[0]);
            selArray.push(diagram.nodes[1]);
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray, true);
            let object: object = diagram.copy();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  copy and paste two selected nodes with edges', (done: Function) => {
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                diagram.nodes.length === 4 && diagram.connectors.length === 2 &&
                (diagram.nodes[2] as Node).outEdges[0] === diagram.connectors[1].id
                && diagram.connectors[1].sourceID === diagram.nodes[2].id && diagram.connectors[1].targetID === diagram.nodes[3].id).toBe(true);
            done();
        });
    });

    describe('cut  and paste the two selected nodes with edges ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50,
                    width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
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
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceID: node.id, targetID: node1.id,
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node, node1], connectors: [connector1] });
            diagram.appendTo('#diagram12');
            selArray.push(diagram.nodes[0]);
            selArray.push(diagram.nodes[1]);
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray, true);
            diagram.cut();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  cut and paste the two selected nodes with edges', (done: Function) => {
            expect(diagram.nodes.length === 2 && diagram.connectors.length === 1 &&
                (diagram.nodes[1] as Node).inEdges[0] === diagram.connectors[0].id &&
                (diagram.nodes[0] as Node).outEdges[0] === diagram.connectors[0].id &&
                diagram.connectors[0].sourceID === diagram.nodes[0].id
                && diagram.connectors[0].targetID === diagram.nodes[1].id).toBe(true);
            done();
        });
    });

    describe('Copy and subsequent Paste of single node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Basic',
                    shape: 'Rectangle'
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
            diagram = new Diagram({
                width: '900px', height: '700px', nodes: [node],
            });
            diagram.appendTo('#diagram');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
            let object: object = diagram.copy();
            diagram.paste();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking subsequent paste of single node', (done: Function) => {
            expect(diagram.nodes.length === 3 && diagram.nodes[1].offsetX === 110 &&
                diagram.nodes[1].offsetY === 110 && diagram.nodes[0].offsetX === 100 && diagram.nodes[2].offsetX === 120).toBe(true);
            done();
        });
    });

    describe('Copy and Paste a single node after the original node moving', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram0' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Basic',
                    shape: 'Rectangle'
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
            diagram = new Diagram({
                width: '900px', height: '700px', nodes: [node],
            });
            diagram.appendTo('#diagram0');
            selArray.push(diagram.nodes[0]);
            diagram.select(selArray);
            let object: object = diagram.copy();
            diagram.nodes[0].offsetX = 200;
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking copy and paste after original node move', (done: Function) => {
            expect(diagram.nodes.length === 2 && diagram.nodes[1].offsetX === 110 &&
                diagram.nodes[1].offsetY === 110 && diagram.nodes[0].offsetX === 200).toBe(true);
            done();
        });
    });

    describe('Copy and subsequent Paste a single connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramj' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceDecorator: {
                    style: { fill: 'black' },
                    shape: 'Arrow', pivot: { x: 0, y: 0.5 }
                },
                targetDecorator: { shape: 'Diamond', style: { fill: 'blue' }, pivot: { x: 0, y: 0.5 } },
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({
                width: '900px', height: '700px', connectors: [connector1],
            });
            diagram.appendTo('#diagramj');
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray);
            let object: object = diagram.copy();
            diagram.paste();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking subsequent paste of single connector', (done: Function) => {
            expect(diagram.connectors.length === 3 && diagram.connectors[0].sourcePoint.x === 200 &&
                diagram.connectors[0].sourcePoint.y === 200 && diagram.connectors[1].sourcePoint.x === 210 &&
                diagram.connectors[1].sourcePoint.x === 210 && diagram.connectors[0].targetPoint.x === 300 &&
                diagram.connectors[0].targetPoint.y === 300 && diagram.connectors[2].sourcePoint.x === 220 &&
                diagram.connectors[2].sourcePoint.y === 220).toBe(true);
            done();
        });
    });

    describe('subsequent paste two selected nodes with edges ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'dia' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
                shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'center center', height: 50,
                    width: 50, offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 200,
                shape: { type: 'Basic', shape: 'Rectangle' },
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
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 200, y: 200 },
                targetPoint: { x: 300, y: 300 }, sourceID: node.id, targetID: node1.id,
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node, node1], connectors: [connector1] });
            diagram.appendTo('#dia');
            selArray.push(diagram.nodes[0]);
            selArray.push(diagram.nodes[1]);
            selArray.push(diagram.connectors[0]);
            diagram.select(selArray, true);
            let object: object = diagram.copy();
            diagram.paste();
            diagram.paste();
            diagram.paste();
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking  subsequent paste two selected nodes with edges', (done: Function) => {
            expect(diagram.connectors[0].sourceID === 'node' && diagram.connectors[0].targetID === 'node1' &&
                diagram.nodes.length === 8 && diagram.connectors.length === 4 &&
                (diagram.nodes[2] as Node).outEdges[0] === diagram.connectors[1].id
                && diagram.connectors[1].sourceID === diagram.nodes[2].id
                && diagram.connectors[1].targetID === diagram.nodes[3].id).toBe(true);
            done();
        });
    });
    describe('Copy and paste with inEdges and outEdges', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramcopyPaste' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node1: NodeModel = {
                id: "node1", width: 90, height: 40, annotations: [{ content: 'Start' }],
                offsetX: 400, offsetY: 30, shape: { type: 'Flow', shape: 'Terminator' }
            };
            let node2: NodeModel = {
                id: "node2", offsetX: 400, offsetY: 100, width: 90, height: 40, annotations: [{ content: 'Design' }],
                shape: { type: 'Flow', shape: 'Process' }
            };
            let node3: NodeModel = {
                id: "node3", offsetX: 400, offsetY: 180, width: 90, height: 40, annotations: [{ content: 'Coding' }],
                shape: { type: 'Flow', shape: 'Process' }
            };
            let node4: NodeModel = {
                id: "node4", width: 90, height: 40, offsetX: 400, offsetY: 260,
                annotations: [{ content: 'Testing' }], shape: { type: 'Flow', shape: 'Process' },
            };
            let node5: NodeModel = {
                id: "node5", width: 90, height: 40, offsetX: 400, offsetY: 340,
                annotations: [{ content: 'Errors?' }], shape: { type: 'Flow', shape: 'Decision' },
            };
            let node6: NodeModel = {
                id: "node6", width: 90, height: 40, offsetX: 400, offsetY: 450,
                annotations: [{ content: 'End' }], shape: { type: 'Flow', shape: 'Terminator' },
            };
            let node7: NodeModel = {
                id: "node7", width: 110, height: 60, offsetX: 220, offsetY: 180,
                annotations: [{ content: 'Design Error?' }], shape: { type: 'Flow', shape: 'Decision' }
            };


            let connector1: ConnectorModel = { id: "connector1", sourceID: node1.id, targetID: node2.id };

            let connector2: ConnectorModel = { id: "connector2", sourceID: node2.id, targetID: node3.id };
            let connector3: ConnectorModel = { id: "connector3", sourceID: node3.id, targetID: node4.id };
            let connector4: ConnectorModel = { id: "connector4", sourceID: node4.id, targetID: node5.id };
            let connector5: ConnectorModel = {
                id: "connector5", sourceID: node5.id, targetID: node6.id,
                annotations: [{ content: "No", style: { fill: 'white' } }]
            };
            let connector6: ConnectorModel = {
                id: "connector6", sourceID: node5.id, targetID: node7.id, type: "Orthogonal",
                annotations: [{ content: "Yes", style: { fill: "white" } }]
            };
            let connector7: ConnectorModel = {
                id: "connector7", sourceID: node7.id, targetID: node3.id, type: "Orthogonal",
                annotations: [{ content: "No", style: { fill: "white" } }]
            };
            let connector8: ConnectorModel = {
                id: "connector8", sourceID: node7.id, targetID: node2.id, type: "Orthogonal",
                annotations: [{ content: "Yes", style: { fill: "white" } }]
            };

            diagram = new Diagram({
                width: '850px', height: '700px', nodes: [node1, node2, node3, node4, node5, node6, node7],
                connectors: [connector1, connector2, connector3, connector4, connector5, connector6, connector7, connector8]
            });
            diagram.appendTo('#diagramcopyPaste');
            selArray.push(diagram.nodes[1]);
            selArray.push(diagram.nodes[2]);
            selArray.push(diagram.connectors[1]);
            diagram.select(selArray, true);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking copy and paste two selected nodes with inEdges and outEdges', (done: Function) => {
            diagram.copy();
            diagram.paste();
            expect((diagram.connectors[8] as ConnectorModel).sourceID !== undefined && (diagram.connectors[8] as ConnectorModel).targetID !== undefined).toBe(true);
            done();
        });
        it('Checking copy and paste two selected nodes with inEdges and outEdges', (done: Function) => {
            diagram.undo();
            diagram.selectedItems.nodes = [];
            diagram.selectedItems.connectors = [];
            let selArray: (NodeModel | ConnectorModel)[] = [diagram.nodes[6], diagram.nodes[2], diagram.connectors[6]];
            diagram.select(selArray, true);
            diagram.copy();
            diagram.paste();
            expect((diagram.connectors[8] as ConnectorModel).sourceID !== undefined && (diagram.connectors[8] as ConnectorModel).targetID !== undefined).toBe(true);
            done();
        });
    });
    describe('paste a  node ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramml' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100,
                shape: {
                    type: 'Basic',
                    shape: 'Rectangle'
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
            diagram = new Diagram({
                width: '900px', height: '700px', nodes: [node],
            });
            diagram.appendTo('#diagramml');
            diagram.paste([{
                id: "node2", width: 190, height: 100,
                offsetX: 500, offsetY: 100
            }]);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking diagram instance creation -  copy and paste the single node', (done: Function) => {
            expect(diagram.nodes.length === 2 && diagram.nodes[1].offsetX === 510 &&
                diagram.nodes[1].offsetY === 110).toBe(true);
            done();
        });
    });
    describe(' Paste a connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrammn' });
            document.body.appendChild(ele);
            let selArray: (NodeModel | ConnectorModel)[] = [];
            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 }, sourceDecorator: {
                    style: { fill: 'black' },
                    shape: 'Arrow', pivot: { x: 0, y: 0.5 }
                },
                targetDecorator: { shape: 'Diamond', style: { fill: 'blue' }, pivot: { x: 0, y: 0.5 } },
                cornerRadius: 10, style: { strokeColor: 'red', strokeWidth: 3, opacity: 3 }
            };
            diagram = new Diagram({
                width: '900px', height: '700px', connectors: [connector1],
            });
            diagram.appendTo('#diagrammn');
          
             diagram.paste([{
                id: 'connector2',
                type: 'Straight',
                sourcePoint: { x: 300, y: 300 },
                targetPoint: { x: 400, y: 400 }
            }]);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking diagram instance creation -  copy and paste a single connector', (done: Function) => {
            expect(diagram.connectors.length === 2 && diagram.connectors[1].sourcePoint.x === 310 &&
                diagram.connectors[1].sourcePoint.y === 310 &&
                diagram.connectors[1].targetPoint.x === 410 && diagram.connectors[1].targetPoint.y === 410).toBe(true);
            done();
        });
    });
});