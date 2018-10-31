/**
 * FlowChart
 */

import {
    Diagram, ConnectorModel, NodeModel, DiagramConstraints, ComplexHierarchicalTree, DataBinding, LayoutOrientation, TreeInfo, Rect, HorizontalAlignment, VerticalAlignment,
} from '../../src/diagram/index';
import { DataManager, Query } from '@syncfusion/ej2-data';

Diagram.Inject(DataBinding, ComplexHierarchicalTree);

let data: object[] = [
    { "Name": "node11", "fillColor": "#ff6329" },
    { "Name": "node12", "ReportingPerson": ["node114"], "fillColor": "#669be5" },
    { "Name": "node13", "ReportingPerson": ["node12"], "fillColor": "#30ab5c" },
    { "Name": "node14", "ReportingPerson": ["node12"], "fillColor": "#30ab5c" },
    { "Name": "node15", "ReportingPerson": ["node12"], "fillColor": "#30ab5c" },
    { "Name": "node16", "ReportingPerson": [], "fillColor": "#14ad85" },
    { "Name": "node17", "ReportingPerson": ["node13", "node14", "node15"], "fillColor": "#ff9400" },
    { "Name": "node18", "ReportingPerson": [], "fillColor": "#14ad85" },
    { "Name": "node19", "ReportingPerson": ["node16", "node17", "node18"], "fillColor": "#99bb55" },
    { "Name": "node110", "ReportingPerson": ["node16", "node17", "node18"], "fillColor": "#99bb55" },
    { "Name": "node111", "ReportingPerson": ["node16", "node17", "node18", "node116"], "fillColor": "#99bb55" },
    { "Name": "node21", "fillColor": "#ff6329" },
    { "Name": "node22", "ReportingPerson": ["node114"], "fillColor": "#669be5" },
    { "Name": "node23", "ReportingPerson": ["node22"], "fillColor": "#30ab5c" },
    { "Name": "node24", "ReportingPerson": ["node22"], "fillColor": "#30ab5c" },
    { "Name": "node25", "ReportingPerson": ["node22"], "fillColor": "#30ab5c" },
    { "Name": "node26", "ReportingPerson": [], "fillColor": "#14ad85" },
    { "Name": "node27", "ReportingPerson": ["node23", "node24", "node25"], "fillColor": "#ff9400" },
    { "Name": "node28", "ReportingPerson": [], "fillColor": "#14ad85" },
    { "Name": "node29", "ReportingPerson": ["node26", "node27", "node28", "node116"], "fillColor": "#99bb55" },
    { "Name": "node210", "ReportingPerson": ["node26", "node27", "node28"], "fillColor": "#99bb55" },
    { "Name": "node211", "ReportingPerson": ["node26", "node27", "node28"], "fillColor": "#99bb55" },
    { "Name": "node31", "fillColor": "#ff6329" },
    { "Name": "node114", "ReportingPerson": ["node11", "node21", "node31"], "fillColor": "#941100" },
    { "Name": "node116", "ReportingPerson": ["node12", "node22"], "fillColor": "#30ab5c" },
];

let items: DataManager = new DataManager(data as JSON[], new Query().take(25));
let diagram: Diagram = new Diagram({
    width: 900, height: 1000,
    layout: { type: 'ComplexHierarchicalTree', horizontalSpacing: 30, verticalSpacing: 30 },
    dataSourceSettings: {
        id: 'Name', parentId: 'ReportingPerson', dataManager: items
    },

    getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
        obj.height = 40; obj.width = 40;
        obj.backgroundColor = 'lightgrey';
        obj.style = { fill: 'transparent', strokeWidth: 2 };
        return obj;
    }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
        connector.targetDecorator.shape = 'None';
        connector.type = 'Orthogonal';
        return connector;
    },
});
diagram.appendTo('#diagram');

document.getElementById('orientation').onchange = () => {
    let value: string = (document.getElementById('orientation') as HTMLSelectElement).value;
    diagram.layout.orientation = value as LayoutOrientation;
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

document.getElementById('marginx').onchange = () => {
    let value: string = (document.getElementById('marginx') as HTMLInputElement).value;
    diagram.layout.margin.left = Number(value);
    diagram.dataBind();
};

document.getElementById('marginy').onchange = () => {
    let value: string = (document.getElementById('marginy') as HTMLInputElement).value;
    diagram.layout.margin.top = Number(value);
    diagram.dataBind();
};

