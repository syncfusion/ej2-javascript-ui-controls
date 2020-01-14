import { Diagram } from '../../src/diagram/diagram';
import { SnapConstraints, NodeConstraints } from '../../src/diagram/enum/enum';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { DiagramContextMenu } from '../../src/diagram/index';
import { IConnectionChangeEventArgs, IEndChangeEventArgs } from '../../src';
Diagram.Inject(DiagramContextMenu);
/**
 * pageSettings
 */
let diagram: Diagram;
let connector: ConnectorModel = {
    id: 'connector1', sourcePoint: { x: 400, y: 100 }, targetPoint: { x: 500, y: 100 }, annotations: [ {content: 'Connector'}]
};
let connector2: ConnectorModel = {
    id: 'connector2', sourceID: 'node2', targetID: 'node3' , annotations: [ {content: 'Connector'}]
};
let node: NodeModel = {
    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [ { content: 'Node1'}]
};
let node2: NodeModel = {
    id: 'node2', width: 100, height: 100, offsetX: 250, offsetY: 200, annotations: [ { content: 'Node2'}],
    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
};
let node3: NodeModel = {
    id: 'node3', width: 100, height: 75, offsetX: 500, offsetY: 200, annotations: [ { content: 'Node3'}]
};
let node4: NodeModel = {
    id: 'node4', width: 100, height: 100, offsetX: 250, offsetY: 350, annotations: [ { content: 'Node2'}]
};
let node5: NodeModel = {
    id: 'node5', width: 100, height: 75, offsetX: 500, offsetY: 350, annotations: [ { content: 'Node3'}]
};
diagram = new Diagram({
    width: '1000px', height: '500px', nodes: [node, node2, node3, node4, node5], connectors: [connector, connector2],
    connectionChange: connectionChange,
    sourcePointChange: sourcePointChange, contextMenuSettings: { show: true} 
});
diagram.appendTo('#diagram');
function connectionChange(args: IConnectionChangeEventArgs): void {
    if(args.state === 'Changed') {
        console.log('Hit');
    }
}
function sourcePointChange(args: IEndChangeEventArgs) {
    if(args.state === 'Completed') {
        let i: number = 0;  
    }
}



