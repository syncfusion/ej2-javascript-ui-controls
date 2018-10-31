
import {
    Diagram, Segments, ConnectorModel, Node, NodeModel, DataBinding, HierarchicalTree
} from '../../src/diagram/index';

import { DataManager, Query } from '@syncfusion/ej2-data';
Diagram.Inject(DataBinding, HierarchicalTree);

/**
 * Node spec
 */
const SERVICE_URI = 'http://mvc.syncfusion.com/Services/Northwnd.svc';
let items: DataManager = new DataManager({ url: SERVICE_URI }, new Query().from('Employees').
    select('EmployeeID, ReportsTo, FirstName'));


let diagram: Diagram = new Diagram({
    width: 1500, height: 2500,
    layout: { type: 'HierarchicalTree', verticalSpacing: 40 },
    dataSourceSettings: {
        id: 'EmployeeID', parentId: 'ReportsTo', dataManager: items,
        doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
            nodeModel.annotations = [{
                content: data['FirstName']
            }];
        }
    },

    getNodeDefaults: (obj: Node, diagram: Diagram) => {
        obj.width = 100; obj.height = 50;
        obj.shape = { type: 'Basic', shape: 'Rectangle' };
        obj.style = { fill: 'transparent', strokeWidth: 2 };
        return obj;
    },
    getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
        connector.type = 'Orthogonal';
        return connector;
    }
});

diagram.appendTo('#diagram');



