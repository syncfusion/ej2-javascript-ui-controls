/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import {
    ConnectorModel, Node,
    DataBinding, PointModel, GraphLayoutManager, Layout, IConnector,
    HierarchicalTree, NodeModel, Rect, BasicShapeModel, SymmetricLayout
} from '../../../src/diagram/index';
Diagram.Inject(SymmetricLayout);

let nodes: NodeModel[] = [];
let connectors: ConnectorModel[] = [];
/**
 * Connection between nodes
 */
export function ConnectNodes(parentNode: NodeModel, childNode: NodeModel): ConnectorModel {
    let connector: ConnectorModel = {
        id: parentNode.id + childNode.id,
        sourceID: parentNode.id,
        targetID: childNode.id,
        targetDecorator: { shape: 'None' }
    }
    return connector;
}

export function GetRectangle(name: string): NodeModel {
    let shape: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
    let node: NodeModel = { id: name, height: 25, width: 25, borderColor: '#5e5e5e', borderWidth: 1, style: { fill: '#ff6329' }, shape: shape };
    return node;
}

export function populateNodes() {
    let parentRect: NodeModel = GetRectangle("p");
    nodes.push(parentRect);
    for (let i: number = 0; i < 2; i++) {
        let childRect_i: NodeModel = GetRectangle("c" + i);
        nodes.push(childRect_i);
        for (let j: number = 0; j < 2; j++) {
            let childRect_j: NodeModel = GetRectangle("c" + i + j);
            nodes.push(childRect_j);
            for (let k: number = 0; k < 6; k++) {
                let childRect_k: NodeModel = GetRectangle("c" + i + j + k);
                nodes.push(childRect_k);
                connectors.push(ConnectNodes(childRect_j, childRect_k));
            }
            connectors.push(ConnectNodes(childRect_i, childRect_j));
        }
        connectors.push(ConnectNodes(parentRect, childRect_i));
    }
    return nodes;
}

describe('Diagram Control', () => {
    describe('Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            populateNodes();
            diagram = new Diagram({
                width: '1200px', height: '580px',
                layout: { type: 'SymmetricalLayout', springLength: 80, springFactor: 0.8, maxIteration: 500, margin: { left: 20, top: 20 } },
                nodes: nodes, connectors: connectors,
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking SymmetricalLayout springLength', (done: Function) => {
            let smtLayout: SymmetricLayout = new SymmetricLayout();
            smtLayout.springLength = 100;
            diagram.layout.springLength = smtLayout.springLength;
            diagram.dataBind();
            expect(diagram.layout.springLength === 100).toBe(true);
            expect(diagram.nodes[0].offsetX == 571.3053454248899 && diagram.nodes[0].offsetY == 367.3182758134246).toBe(true);
            done();
        });
        it('Checking SymmetricalLayout springFactor', (done: Function) => {
            let smtLayout: SymmetricLayout = new SymmetricLayout();
            smtLayout.springFactor = 1;
            diagram.layout.springFactor = smtLayout.springFactor;
            diagram.dataBind();
            expect(diagram.layout.springFactor === 1).toBe(true);
            expect(diagram.nodes[0].offsetX == 630.4421464511472 && diagram.nodes[0].offsetY == 310.87140251007924).toBe(true);
            done();
        });
        it('Checking SymmetricalLayout maxIteration', (done: Function) => {
            let smtLayout: SymmetricLayout = new SymmetricLayout();
            smtLayout.maxIteration = 700;
            diagram.layout.maxIteration = smtLayout.maxIteration;
            diagram.dataBind();
            expect(diagram.layout.maxIteration === 700).toBe(true);
            expect(diagram.nodes[0].offsetX == 647.4827144644246 && diagram.nodes[0].offsetY == 283.32750048873606).toBe(true);
            done();
        });
    });
});