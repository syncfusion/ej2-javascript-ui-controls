
import {
    Diagram, Segments, ConnectorModel, Node, NodeModel, DataBinding, HierarchicalTree, randomId
} from '../../src/diagram/index';

import { DataManager } from '@syncfusion/ej2-data';

Diagram.Inject(DataBinding, HierarchicalTree);


/**
 * Node spec
 */

let diagram: Diagram = new Diagram({
    width: 1000, height: 1000,
    dataSourceSettings: {
        id: 'Name',
        crudAction:
        {
            read: 'https://ej2services.syncfusion.com/development/web-services/api/Crud/GetNodes',
            create: 'https://ej2services.syncfusion.com/development/web-services/api/Crud/AddNodes',
            update: 'https://ej2services.syncfusion.com/development/web-services/api/Crud/UpdateNodes',
            destroy: 'https://ej2services.syncfusion.com/development/web-services/api/Crud/DeleteNodes',
            customFields: [
                'Id',
                'Description',
                'Color'
            ],
        },
        connectionDataSource:
        {
            id: 'Name',
            sourceID: 'sourceID',
            targetID: 'targetID',
            crudAction: {
                read: 'https://ej2services.syncfusion.com/development/web-services/api/Crud/GetConnectors',
                create: 'https://ej2services.syncfusion.com/development/web-services/api/Crud/AddConnectors',
                update: 'https://ej2services.syncfusion.com/development/web-services/api/Crud/UpdateConnectors',
                destroy: 'https://ej2services.syncfusion.com/development/web-services/api/Crud/DeleteConnectors',
                customFields: [
                    'Id',
                ],
            }
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


document.getElementById('addnode').onclick = () => {
    let selectedItem: any = diagram.selectedItems.nodes[0];
    let description: string = "data";
    let color: string = "red";
    let node: any = {
        id: randomId(), style: { fill: color }, Description: description, Color: color
    }
    let connector: any = {
        id: randomId(), sourceID: selectedItem.id, targetID: node.id
    }
    diagram.add(node);
    diagram.add(connector);
    diagram.doLayout();
    diagram.insertData();
};

document.getElementById('updatenode').onclick = () => {
    let selectedItem: any = diagram.selectedItems.nodes[0];
    selectedItem.Description = 'sametor';
    selectedItem.Color = 'blue';
    diagram.dataBind();
    diagram.updateData();
};

document.getElementById('deletenode').onclick = () => {
    let selectedItem: any = diagram.selectedItems.nodes[0];
    diagram.remove(selectedItem);
    diagram.doLayout();
    diagram.removeData();
};