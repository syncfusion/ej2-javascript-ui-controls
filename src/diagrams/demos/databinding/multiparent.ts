
import {
    Diagram, Segments, ConnectorModel, Node, NodeModel, DataBinding, HierarchicalTree
} from '../../src/diagram/index';

import { DataManager, Query } from '@syncfusion/ej2-data';

Diagram.Inject(DataBinding, HierarchicalTree);

/**
 * Node spec
 */
let data: object[] = [{ 'Name': 'Customer Support', 'fillColor': '#0f688d' },
{ 'Name': 'OEM Support', 'fillColor': '#0f688d' },
{ 'Name': 'Customer Care', 'ReportingPerson': ['Customer Support', 'OEM Support'], 'fillColor': '#14ad85' },
{ 'Name': 'Central Region', 'fillColor': '#0f688d' },
{ 'Name': 'Eastern Region', 'fillColor': '#0f688d' },
{ 'Name': 'ServiceCare', 'ReportingPerson': ['Central Region', 'Eastern Region'], 'fillColor': '#14ad85' },
{ 'Name': 'National Channel Marketing', 'fillColor': '#0f688d' },
{ 'Name': 'Retail Channel Marketing', 'fillColor': '#0f688d' },
{
    'Name': 'Channel Marketing', 'ReportingPerson': ['National Channel Marketing', 'Retail Channel Marketing'],
    'fillColor': '#14ad85'
},
{ 'Name': 'Northern Region', 'fillColor': '#0f688d' },
{ 'Name': 'Western Region', 'fillColor': '#0f688d' },
{ 'Name': 'Channel Field Sales', 'ReportingPerson': ['Northern Region', 'Western Region'], 'fillColor': '#14ad85' },
{ 'Name': 'Customer', 'ReportingPerson': ['Customer Care', 'ServiceCare'], 'fillColor': '#0aa6ce' },
{ 'Name': 'SalesMan', 'ReportingPerson': ['Channel Marketing', 'Channel Field Sales'], 'fillColor': '#0aa6ce' },
{ 'Name': 'Adventure Work Cycle', 'ReportingPerson': ['Customer', 'SalesMan'], 'fillColor': '#f16f62' },
];
let items: DataManager = new DataManager(data as JSON[], new Query().take(7));

let diagram: Diagram = new Diagram({
    width: 1500, height: 2500,
    layout: { type: 'HierarchicalTree', verticalSpacing: 40 },
    dataSourceSettings: {
        id: 'Name', parentId: 'ReportingPerson', dataManager: items,
        doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
            nodeModel.annotations = [{
                content: data['Name'], margin: { top: 10 }
            }];
        }
    },
    getNodeDefaults: (obj: Node, diagram: Diagram) => {
        obj.width = 150; obj.height = 50; obj.shape = { type: 'Basic', shape: 'Rectangle' };
        obj.style = { fill: 'transparent', strokeWidth: 2 };
        return obj;
    }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
        connector.type = 'Orthogonal';
        return connector;
    }
});

diagram.appendTo('#diagram');



