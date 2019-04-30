/**
 * Element Tree
 */

import {
    Diagram, ConnectorModel, Node, DataBinding, LayoutOrientation, TreeInfo, 
    LayoutType, Rect, HorizontalAlignment, VerticalAlignment, NodeModel, HierarchicalTree, ISelectionChangeEventArgs, IRotationEventArgs, DiagramAction, TextModel
} from '../../src/diagram/index';
import { MindMap } from '../../src/diagram/layout/mind-map';
import { DataManager, Query } from '@syncfusion/ej2-data';
Diagram.Inject(DataBinding, MindMap, HierarchicalTree);

// let node: NodeModel = { id: 'node1', width: 70, height: 70, annotations: [{ content: 'node1' }] };
// let node1: NodeModel = { id: 'node2', width: 70, height: 70, annotations: [{ content: 'node2' }] };
// let node2: NodeModel = { id: 'node3', width: 70, height: 70, annotations: [{ content: 'node3' }] };

// let connector: ConnectorModel = { id: 'connectr', sourceID: 'node1', targetID: 'node2' };
// let connector1: ConnectorModel = { id: 'connectr1', sourceID: 'node2', targetID: 'node3' };

// let diagram: Diagram = new Diagram({
//    width: 1000, height: 1000, nodes: [node, node1, node2],
//     connectors: [connector, connector1,
//        ],
//     layout: { type: 'MindMap' },

// });

// diagram.appendTo('#diagram');
let data: object[] = [
    { id: 1, Label: 'StackPanel' },
    { id: 2, Label: 'Label', parentId: 1 },
    { id: 3, Label: 'ListBox', parentId: 1 },
    { id: 4, Label: 'StackPanel', parentId: 1 },
    { id: 5, Label: 'Border', parentId: 2 },
    { id: 6, Label: 'Border', parentId: 3 },
    { id: 7, Label: 'Button', parentId: 4 },
    { id: 8, Label: 'ContentPresenter', parentId: 5 },
    { id: 9, Label: 'Text Block', parentId: 8 },
    { id: 10, Label: 'ScrollViewer', parentId: 6 },
    { id: 11, Label: 'Grid', parentId: 10 },
    { id: 12, Label: 'Rectangle', parentId: 11 },
    { id: 13, Label: 'ScrollContentPresenter', parentId: 11 },
    { id: 14, Label: 'ScrollBar', parentId: 11 },
    { id: 15, Label: 'ScrollBar', parentId: 11 },
    { id: 16, Label: 'ItemsPresenter', parentId: 13 },
    { id: 17, Label: 'AdornerLayer', parentId: 13 },
    { id: 18, Label: 'VirtualizingStackPanel', parentId: 15 },
    { id: 19, Label: 'ListBoxItem', parentId: 18 },
    { id: 20, Label: 'ListBoxItem', parentId: 18 },
    { id: 21, Label: 'Border', parentId: 19 },
    { id: 22, Label: 'ContentPresenter', parentId: 19 },
    { id: 23, Label: 'TextBlock', parentId: 19 },
    { id: 24, Label: 'Border', parentId: 20 },
    { id: 25, Label: 'ContentPresenter', parentId: 20 },
    { id: 26, Label: 'TextBlock', parentId: 20 },
    { id: 27, Label: 'ButtonChrome', parentId: 7 },
    { id: 28, Label: 'ContentPresenter', parentId: 27 },
    { id: 29, Label: 'TextBlock', parentId: 28 }
];

let items: DataManager = new DataManager(data as JSON[], new Query().take(7));

let diagram: Diagram = new Diagram({
    width: '100%', height: '550px',
    layout: { type: 'MindMap' },
    dataSourceSettings: { id: 'id', parentId: 'parentId', dataManager: items, root: String(1) },
    getNodeDefaults: (obj: Node) => {
        obj.shape = { type: 'Text', content: (obj.data as { Label: 'string' }).Label };
        obj.style = { fill: 'lightgrey', strokeColor: 'none', strokeWidth: 2 };
        obj.borderColor = 'black';
        obj.backgroundColor = 'lightgrey';
        obj.borderWidth = 1;
        (obj.shape as TextModel).margin = { left: 5, right: 5, top: 5, bottom: 5 };
        return obj;
    }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
        connector.type = 'Orthogonal';
        return connector;
    }
});

diagram.appendTo('#diagram');