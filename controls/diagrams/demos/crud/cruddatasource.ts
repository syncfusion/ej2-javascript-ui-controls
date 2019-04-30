
import {
    Diagram, Segments, ConnectorModel, Node, NodeModel, DataBinding, HierarchicalTree, randomId
} from '../../src/diagram/index';

import { DataManager } from '@syncfusion/ej2-data';

Diagram.Inject(DataBinding, HierarchicalTree);


let nodedata: any = [
    { 'Id': '1', 'Name': 'diagram', 'Color': '#0f688d', 'Description': 'diagram' },
    { 'Id': '2', 'Name': 'layout', 'Color': '#0f688d', 'Description': 'layout' },
    { 'Id': '3', 'Name': 'treelayout', 'Color': '#0f688d', 'Description': 'treelayout' },
    { 'Id': '4', 'Name': 'orgchart', 'Color': '#0f688d', 'Description': 'orgchart' },
    { 'Id': '5', 'Name': 'htree', 'Color': '#0f688d', 'Description': 'htree' },
    { 'Id': '6', 'Name': 'rtree', 'Color': '#0f688d', 'Description': 'rtree' },
    { 'Id': '7', 'Name': 'mindmap', 'Color': '#0f688d', 'Description': 'mindmap' },
    { 'Id': '8', 'Name': 'ftree', 'Color': '#0f688d', 'Description': 'ftree' },
    { 'Id': '9', 'Name': 'management', 'Color': '#0f688d', 'Description': 'management' },
    { 'Id': '10', 'Name': 'hr', 'Color': '#0f688d', 'Description': 'hr' },
    { 'Id': '11', 'Name': 'university', 'Color': '#0f688d', 'Description': 'university' },
    { 'Id': '12', 'Name': 'business', 'Color': '#0f688d', 'Description': 'business' },
];

let connectorData: any = [
    {'Id': '1', 'Name': 'Line1', 'sourceID': 'diagram', 'targetID': 'layout' },
    {'Id': '2', 'Name': 'Line2', 'sourceID': 'layout', 'targetID': 'treelayout' },
    {'Id': '3', 'Name': 'Line3', 'sourceID': 'layout', 'targetID': 'orgchart' },
    {'Id': '4', 'Name': 'Line4', 'sourceID': 'treelayout', 'targetID': 'htree' },
    {'Id': '5', 'Name': 'Line5', 'sourceID': 'treelayout', 'targetID': 'rtree' },
    {'Id': '6', 'Name': 'Line6', 'sourceID': 'orgchart', 'targetID': 'management' },
    {'Id': '7', 'Name': 'Line7', 'sourceID': 'htree', 'targetID': 'mindmap' },
    {'Id': '8', 'Name': 'Line8', 'sourceID': 'htree', 'targetID': 'ftree' },
    {'Id': '9', 'Name': 'Line9', 'sourceID': 'management', 'targetID': 'hr' },
    {'Id': '10', 'Name': 'Line10', 'sourceID': 'management', 'targetID': 'university' },
    {'Id': '11', 'Name': 'Line11', 'sourceID': 'management', 'targetID': 'business' },
];

/**
 * Node spec
 */

let diagram: Diagram = new Diagram({
    width: 1000, height: 1000,
    dataSourceSettings: {
        id: 'Name',
        crudAction: {
            customFields: [
                'Id',
                'Description',
                'Color'
            ],
        },
        dataManager: nodedata,
        connectionDataSource:
        {
            id: 'Name',
            sourceID: 'sourceID',
            targetID: 'targetID',
            crudAction: {
                customFields: [
                    'Id',
                ],
            },
            dataManager: connectorData,
        }
    },
    layout: { type: 'HierarchicalTree', verticalSpacing: 40 },
    getNodeDefaults: (obj: Node, diagram: Diagram) => {
        obj.width = 100;
        obj.height = 100;
        obj.shape = { type: 'Basic', shape: 'Rectangle' };
        obj.style = { fill: 'transparent', strokeWidth: 2 };
        return obj;
    }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
        connector.type = 'Orthogonal';
        return connector;
    },
    setNodeTemplate: (obj: Node, diagram: Diagram): void => {
        return null;
    }
});


diagram.appendTo('#diagram');
 