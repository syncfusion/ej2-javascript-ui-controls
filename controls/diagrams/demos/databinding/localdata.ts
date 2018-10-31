
import {
    Diagram, Segments, ConnectorModel, Node, NodeModel, DataBinding, HierarchicalTree
} from '../../src/diagram/index';

import { DataManager } from '@syncfusion/ej2-data';

Diagram.Inject(DataBinding, HierarchicalTree);


/**
 * Node spec
 */

let data: object[] = [
    { 'Name': 'Diagram', 'fillColor': '#916DAF' },
    { 'Name': 'Layout', 'Category': 'Diagram' },
    { 'Name': 'Tree Layout', 'Category': 'Layout' },
    { 'Name': 'Organizational Chart', 'Category': 'Layout' },
    { 'Name': 'Hierarchical Tree', 'Category': 'Tree Layout' },
    { 'Name': 'Radial Tree', 'Category': 'Tree Layout' },
    { 'Name': 'Mind Map', 'Category': 'Hierarchical Tree' },
    { 'Name': 'Family Tree', 'Category': 'Hierarchical Tree' },
    { 'Name': 'Management', 'Category': 'Organizational Chart' },
    { 'Name': 'Human Resource', 'Category': 'Management' },
    { 'Name': 'University', 'Category': 'Management' },
    { 'Name': 'Business', 'Category': 'Management' },
];


let items: DataManager = new DataManager(data as JSON[]);
let i: number = 1;

let diagram: Diagram = new Diagram({
    width: 4000, height: 2500,
    dataSourceSettings: {
        id: 'Name', parentId: 'Category', dataManager: items,
        doBinding: 'doBinding'
    },
    layout: { type: 'HierarchicalTree', verticalSpacing: 40 },
    getNodeDefaults: (obj: Node, diagram: Diagram) => {
        obj.shape = { type: 'Basic', shape: 'Rectangle' };
        obj.style = { fill: 'transparent', strokeWidth: 2 };
        return obj;
    }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
        connector.type = 'Orthogonal';
        return connector;
    }
});

window['doBinding'] = function (nodeModel: NodeModel, data: object, diagram: Diagram): void {
    nodeModel.annotations = [{
        content: data['Name'], margin: { top: 10, left: 10, right: 10 },
    }
    ];
}
diagram.appendTo('#diagram');



