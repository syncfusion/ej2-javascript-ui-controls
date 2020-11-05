/**
 * FlowChart
 */

import {
    Diagram, ConnectorModel, NodeModel, DiagramConstraints,ConnectionPointOrigin,LineDistribution, ChildArrangement,ComplexHierarchicalTree, DataBinding, LayoutOrientation, TreeInfo, Rect, HorizontalAlignment, VerticalAlignment,DiagramTools,
} from '../../src/diagram/index';
import { DataManager, Query } from '@syncfusion/ej2-data';

Diagram.Inject(DataBinding, ComplexHierarchicalTree,LineDistribution);

let Data: object[] =  [
        {
            "Name": "node11",
            "fillColor": "#e7704c",
            "border": "#c15433"
        },
        {
            "Name": "node12",
            "ReportingPerson": [
                "node114"
            ],
            "fillColor": "#efd46e",
            "border": "#d6b123"
        },
        {
            "Name": "node13",
            "ReportingPerson": [
                "node12"
            ],
            "fillColor": "#58b087",
            "border": "#16955e"
        },
        {
            "Name": "node14",
            "ReportingPerson": [
                "node12"
            ],
            "fillColor": "#58b087",
            "border": "#16955e"
        },
        {
            "Name": "node15",
            "ReportingPerson": [
                "node12"
            ],
            "fillColor": "#58b087",
            "border": "#16955e"
        },
        {
            "Name": "node116",
            "ReportingPerson": [
                "node22",
                "node12",
                
            ],
            "fillColor": "#58b087",
            "border": "#16955e"
        },
        {
            "Name": "node16",
            "ReportingPerson": [],
            "fillColor": "#14ad85"
        },
        {
            "Name": "node17",
            "ReportingPerson": [
                "node13",
                "node14",
                "node15"
            ],
            "fillColor": "#659be5",
            "border": "#3a6eb5"
        },
        {
            "Name": "node18",
            "ReportingPerson": [],
            "fillColor": "#14ad85"
        },
        {
            "Name": "node19",
            "ReportingPerson": [
                "node16",
                "node17",
                "node18"
            ],
            "fillColor": "#8dbe6c",
            "border": "#489911"
        },
        {
            "Name": "node110",
            "ReportingPerson": [
                "node16",
                "node17",
                "node18"
            ],
            "fillColor": "#8dbe6c",
            "border": "#489911"
        },
        {
            "Name": "node111",
            "ReportingPerson": [
                "node16",
                "node17",
                "node18",
                "node116"
            ],
            "fillColor": "#8dbe6c",
            "border": "#489911"
        },
        {
            "Name": "node21",
            "fillColor": "#e7704c",
            "border": "#c15433"
        },
        {
            "Name": "node22",
            "ReportingPerson": [
                "node114"
            ],
            "fillColor": "#efd46e",
            "border": "#d6b123"
        },
        {
            "Name": "node23",
            "ReportingPerson": [
                "node22"
            ],
            "fillColor": "#58b087",
            "border": "#16955e"
        },
        {
            "Name": "node24",
            "ReportingPerson": [
                "node22"
            ],
            "fillColor": "#58b087",
            "border": "#16955e"
        },
        {
            "Name": "node25",
            "ReportingPerson": [
                "node22"
            ],
            "fillColor": "#58b087",
            "border": "#16955e"
        },
        {
            "Name": "node26",
            "ReportingPerson": [],
            "fillColor": "#14ad85"
        },
        {
            "Name": "node27",
            "ReportingPerson": [
                "node23",
                "node24",
                "node25"
            ],
            "fillColor": "#659be5",
            "border": "#3a6eb5"
        },
        {
            "Name": "node28",
            "ReportingPerson": [],
            "fillColor": "#14ad85"
        },
        {
            "Name": "node29",
            "ReportingPerson": [
                "node26",
                "node27",
                "node28",
                "node116"
            ],
            "fillColor": "#8dbe6c",
            "border": "#489911"
        },
        {
            "Name": "node210",
            "ReportingPerson": [
                "node26",
                "node27",
                "node28"
            ],
            "fillColor": "#8dbe6c",
            "border": "#489911"
        },
        {
            "Name": "node211",
            "ReportingPerson": [
                "node26",
                "node27",
                "node28"
            ],
            "fillColor": "#8dbe6c",
            "border": "#489911"
        },
        {
            "Name": "node31",
            "fillColor": "#e7704c",
            "border": "#c15433"
        },
        {
            "Name": "node114",
            "ReportingPerson": [
                "node11",
                "node21",
                "node31"
            ],
            "fillColor": "#f3904a",
            "border": "#d3722e"
        },
        
    ];
//Sets the default values of nodes
function getNodeDefaults(obj: NodeModel): NodeModel {
    obj.width = 40; obj.height = 40;
    //Initialize shape
    obj.shape = { type: 'Basic', shape: 'Rectangle', cornerRadius: 7 };
    return obj;
}
//Sets the default values of connectors
function getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    connector.targetDecorator.height = 7;
    connector.targetDecorator.width = 7;
    connector.style.strokeColor = '#6d6d6d';
    return connector;
}

export interface DataInfo {
    [key: string]: string;
}

let items: DataManager = new DataManager(Data as JSON[], new Query().take(25));
let diagram: Diagram = new Diagram({
        width: '100%', height: 580,mode:"SVG",
        //applyLineDistribution:true,
        //Configrues hierarchical tree layout
        layout: {
         type: 'ComplexHierarchicalTree', 
         connectionPointOrigin:ConnectionPointOrigin.DifferentPoint,
            horizontalSpacing: 40, verticalSpacing: 40, horizontalAlignment:"Left",verticalAlignment:"Top",
            margin: { left: 0, right: 0, top: 0, bottom: 0 },
            orientation: 'LeftToRight',
        },
        //Sets the default values of nodes
        getNodeDefaults: getNodeDefaults,
        //Sets the default values of connectors
        getConnectorDefaults: getConnectorDefaults,
        //Configures data source
        dataSourceSettings: {
            id: 'Name', parentId: 'ReportingPerson',
            dataSource: new DataManager((Data as any)),
            //binds the external data with node
            doBinding: (nodeModel: NodeModel, data: DataInfo, diagram: Diagram) => {
                /* tslint:disable:no-string-literal */
                nodeModel.style = { fill: data['fillColor'], strokeWidth: 1, strokeColor: data['border'] };
            }
        },
        //Disables all interactions except zoom/pan
        tool: DiagramTools.ZoomPan,
        snapSettings: { constraints: 0 },
        created: created
    });
diagram.appendTo('#diagram');
 function created(): void {
        diagram.fitToPage({ mode: 'Width' });
    }

document.getElementById('orientation').onchange = () => {
     for(var i=0;i<diagram.connectors.length;i++){
        var connector = diagram.connectors[i].id
        var pathElement = document.getElementById(connector+"_path_groupElement")
        console.log("Connector_"+i+"  "+pathElement.children[0].getAttribute("d"))
        }
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
var log: any = document.getElementById('log');
log.onclick = selectable;
var oldProp, newProp;
function selectable() {
    if(log.checked){
        diagram.layout.connectionPointOrigin =ConnectionPointOrigin.DifferentPoint
    }else{
        diagram.layout.connectionPointOrigin =ConnectionPointOrigin.SamePoint
    }
}
var linear1: any = document.getElementById('linear');
linear1.onclick = linear;
var oldProp, newProp;
function linear() {
    if (linear1.checked) {
        diagram.layout.arrangement = ChildArrangement.Linear
    } else {
        diagram.layout.arrangement = ChildArrangement.Nonlinear
    }
}

