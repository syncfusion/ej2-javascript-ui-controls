
import {
    Diagram, Segments, ConnectorModel, Node, NodeModel, DataBinding, HierarchicalTree, randomId, NodeConstraints, IEndChangeEventArgs
} from '../../src/diagram/index';

import { DataManager } from '@syncfusion/ej2-data';
import { Ajax } from '@syncfusion/ej2-base';

Diagram.Inject(DataBinding, HierarchicalTree);


/**
 * Node spec
 */

let diagram: Diagram = new Diagram({
    width: '100%',
    height: 600,
    dataSourceSettings: {
        id: 'Name',
        //Define URL to perform CRUD operations with nodes records in database.
        crudAction: {
            read: 'https://js.syncfusion.com/demos/ejServices/api/Diagram/GetNodes',
            create: 'https://js.syncfusion.com/demos/ejServices/api/Diagram/AddNodes',
            update: 'https://js.syncfusion.com/demos/ejServices/api/Diagram/UpdateNodes',
            destroy: 'https://js.syncfusion.com/demos/ejServices/api/Diagram/DeleteNodes',
            customFields: ['Id', 'Description', 'Color']
        },
        connectionDataSource: {
            id: 'Name',
            sourceID: 'SourceNode',
            targetID: 'TargetNode',
            //Define URL to perform CRUD operations with connector records in database.
            crudAction: {
                read: 'https://js.syncfusion.com/demos/ejServices/api/Diagram/GetConnectors',
                create: 'https://js.syncfusion.com/demos/ejServices/api/Diagram/AddConnectors',
                update: 'https://js.syncfusion.com/demos/ejServices/api/Diagram/UpdateConnectors',
                destroy: 'https://js.syncfusion.com/demos/ejServices/api/Diagram/DeleteConnectors',
                customFields: ['Id']
            }
        }
    },
    layout: { type: 'HierarchicalTree', verticalSpacing: 40 },
    snapSettings: { constraints: 0 },
    //Set node default properties.
    getNodeDefaults: (obj: Node): Node => {
        obj.width = 100;
        obj.height = 50;
        obj.shape = { type: 'Basic', shape: 'Rectangle' };
        obj.style = { strokeWidth: 1, strokeColor: '#DDDDDD' };
        return obj;
    },
    //Set connector default properties.
    getConnectorDefaults: (connector: ConnectorModel): ConnectorModel => {
        connector.type = 'Orthogonal';
        connector.style.fill = '#707070';
        connector.style.strokeColor = '#707070';
        connector.targetDecorator = {
            style: {
                strokeColor: '#707070',
                fill: '#707070'
            },
        };
        return connector;
    },

    sourcePointChange: connectionChange,
    targetPointChange: connectionChange,
    setNodeTemplate: setNodeTemplate

});


diagram.appendTo('#diagram');

function connectionChange(args: IEndChangeEventArgs): void {
    if (args.state === 'Completed') {
        if (!args.connector.targetID || !args.connector.sourceID) {
            args.cancel = true;
        }
    }
}

//Set an label for each node.
function setNodeTemplate(obj: NodeModel): void {
    obj.annotations = [{ style: { color: 'black' } }];
    obj.annotations[0].content = (obj as DataInfo).Description;
    obj.style = { fill: (obj as DataInfo).Color };
    if ((obj as DataInfo).Id === 1) {
        //Restrict Delete Constraints for root node.
        obj.constraints = NodeConstraints.Default & ~NodeConstraints.Delete;
    }
}


interface DataInfo {
    Description: string;
    Color: string;
    Id: number;
}



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


document.getElementById('resetData').onclick = () => {


    var callback = new Ajax("https://js.syncfusion.com/demos/ejServices/api/Diagram/ResetData", 'POST');

    callback.send().then();
    callback.onSuccess = function () {
        debugger;
    };
    callback.onFailure = function () {
        debugger
    }

};
