/**
 * Element Tree
 */

import {
    Diagram, ConnectorModel, IConnector, DataBinding, HierarchicalTree, LayoutOrientation,
    LayoutType, Rect, HorizontalAlignment, VerticalAlignment, NodeModel, BasicShapeModel, SymmetricLayout
} from '../../src/diagram/index';


Diagram.Inject(SymmetricLayout);
let nodes: NodeModel[] = [];
let connectors: ConnectorModel[] = [];

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

populateNodes();
let diagram: Diagram = new Diagram({
    width: '100%', height: '550px',
    layout: { type: 'SymmetricalLayout', springLength: 80, springFactor: 0.8, maxIteration: 500, margin: { left: 20, top: 20 } },
    nodes: nodes, connectors: connectors,
});

diagram.appendTo('#diagram');
document.getElementById('layout').onclick = () => {
    diagram.layout.springLength = Number((document.getElementById('springlength') as HTMLSelectElement).value);
    diagram.layout.springFactor = Number((document.getElementById('springfactor') as HTMLInputElement).value);
    diagram.layout.maxIteration = Number((document.getElementById('maxiteration') as HTMLInputElement).value);
    diagram.doLayout();
};


