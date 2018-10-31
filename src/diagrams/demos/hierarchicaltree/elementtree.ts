/**
 * Element Tree
 */

import {
    Diagram, ConnectorModel, Node, DataBinding, HierarchicalTree, LayoutOrientation, TreeInfo,
    LayoutType, Rect, HorizontalAlignment, VerticalAlignment, NodeModel, ISelectionChangeEventArgs, IRotationEventArgs, DiagramAction, TextModel
} from '../../src/diagram/index';

import { DataManager, Query } from '@syncfusion/ej2-data';
Diagram.Inject(DataBinding, HierarchicalTree);

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
    width: '900px', height: '550px',
    layout: { type: 'HierarchicalTree' },
    dataSourceSettings: { id: 'id', parentId: 'parentId', dataManager: items },
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

document.getElementById('orientation').onchange = () => {
    let value: string = (document.getElementById('orientation') as HTMLSelectElement).value;
    diagram.layout.orientation = value as LayoutOrientation;
    diagram.dataBind();
};

document.getElementById('type').onchange = () => {
    let value: string = (document.getElementById('type') as HTMLInputElement).value;
    diagram.layout.type = value as LayoutType;
    diagram.dataBind();
};

document.getElementById('fixednode').onchange = () => {
    diagram.layout.fixedNode = diagram.selectedItems.nodes.length ? diagram.selectedItems.nodes[0].id : '';
    diagram.dataBind();
};

document.getElementById('hspacing').onchange = () => {
    let value: string = (document.getElementById('hspacing') as HTMLInputElement).value;
    diagram.layout.horizontalSpacing = Number(value);
    diagram.dataBind();
};

document.getElementById('vspacing').onchange = () => {
    let value: string = (document.getElementById('vspacing') as HTMLInputElement).value;
    diagram.layout.verticalSpacing = Number(value);
    diagram.dataBind();
};

document.getElementById('bounds').onchange = () => {
    if (diagram.layout.bounds) {
        diagram.layout.bounds = null;
    } else {
        diagram.layout.bounds = new Rect(0, 0, 500, 500);
    }
};

document.getElementById('halignment').onchange = () => {
    let value: string = (document.getElementById('halignment') as HTMLSelectElement).value;
    diagram.layout.horizontalAlignment = value as HorizontalAlignment;
    diagram.dataBind();
};

document.getElementById('valignment').onchange = () => {
    let value: string = (document.getElementById('valignment') as HTMLSelectElement).value;
    diagram.layout.verticalAlignment = value as VerticalAlignment;
    diagram.dataBind();
};

document.getElementById('balanced').onchange = () => {
    let checked: boolean = (document.getElementById('balanced') as HTMLInputElement).checked;
    if (checked) {
        diagram.layout.type = 'OrganizationalChart';
        diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
            if (!options.hasSubTree) {
                options.type = 'Balanced';
                options.orientation = 'Horizontal';
            }
        };
    }
};

diagram.selectionChange = (arg: ISelectionChangeEventArgs) => {
    document.getElementById('eventtracker').innerHTML += '<br /> Selection Change : ' + arg.state + ', ' + arg.type;
    document.getElementById('eventtracker').scrollTop = document.getElementById('eventtracker').scrollHeight;
}
diagram.rotateChange = (arg) => {
    document.getElementById('eventtracker').innerHTML += '<br /> Rotation Change : ' + arg.state;
    document.getElementById('eventtracker').scrollTop = document.getElementById('eventtracker').scrollHeight;
}
diagram.collectionChange = (arg) => {
    document.getElementById('eventtracker').innerHTML += '<br /> Collection Change : ' + arg.state + ', ' + String(arg.cause === 2 ? DiagramAction[arg.cause] : DiagramAction[arg.cause - 2]);
    document.getElementById('eventtracker').scrollTop = document.getElementById('eventtracker').scrollHeight;
}
diagram.sizeChange = (arg) => {
    document.getElementById('eventtracker').innerHTML += '<br /> Size Change : ' + arg.state;
    document.getElementById('eventtracker').scrollTop = document.getElementById('eventtracker').scrollHeight;
}
diagram.positionChange = (arg) => {
    document.getElementById('eventtracker').innerHTML += '<br /> Position Change : ' + arg.state;
    document.getElementById('eventtracker').scrollTop = document.getElementById('eventtracker').scrollHeight;
}
diagram.sourcePointChange = (arg) => {
    document.getElementById('eventtracker').innerHTML += '<br /> Source end change: ';
    document.getElementById('eventtracker').scrollTop = document.getElementById('eventtracker').scrollHeight;
}
diagram.targetPointChange = (arg) => {
    document.getElementById('eventtracker').innerHTML += '<br /> Target end change: ';
    document.getElementById('eventtracker').scrollTop = document.getElementById('eventtracker').scrollHeight;
}
diagram.connectionChange = (arg) => {
    document.getElementById('eventtracker').innerHTML += '<br /> connection change: ';
    document.getElementById('eventtracker').scrollTop = document.getElementById('eventtracker').scrollHeight;
}
