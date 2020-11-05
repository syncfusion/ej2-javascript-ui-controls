import {
    Diagram, ConnectorModel, Node, DataBinding, HierarchicalTree, TreeInfo, SnapConstraints, NodeModel,ComplexHierarchicalTree,LineDistribution,ConnectionPointOrigin,ChildArrangement
} from '../../src/diagram/index';
Diagram.Inject(DataBinding, HierarchicalTree,ComplexHierarchicalTree,LineDistribution);

import { DataManager, Query } from '@syncfusion/ej2-data';

// export interface EmployeeInfo {
//     Name: string;
//     Role: string;
//   }
  
  
  var data = [
                {
                    id: '0',
                    parent: ['1', '2']
                },
                {
                    id: '1',
                },
                {
                    id: '2',
                },
                {
                    id: '3',
                    parent: ['0']
                },
                {
                    id: '4',
                    parent: ['0']
                },
                {
                    id: '5',
                    parent: ['4']
                },
                {
                    id: '6',
                    parent: ['4']
                },
                {
                    id: '7',
                    parent: ['17', '6']
                },
                {
                    id: '8',
                    parent: ['0']
                },
                {
                    id: '9',
                    parent: ['8']
                },
                {
                    id: '10',
                    parent: ['9', '19']
                },
                {
                    id: '11',
                    parent: ['10', '19']
                },
                {
                    id: '12',
                    parent: ['10', '19']
                },
                {
                    id: '13',
                    parent: ['9', '19']
                },
                {
                    id: '14',
                    parent: ['13', '19']
                },
                {
                    id: '15',
                    parent: ['13', '19']
                },
                {
                    id: '16',
                    parent: ['9', '24']
                },
                {
                    id: '17',
                    parent: ['9']
                },
                {
                    id: '18',
                    parent: ['0']
                },
                {
                    id: '19',
                    parent: ['0']
                },
                {
                    id: '20',
                    parent: ['19']
                },
                {
                    id: '21',
                    parent: ['19']
                },
                {
                    id: '22',
                    parent: ['19']
                },
                {
                    id: '23',
                    parent: ['0']
                },
                {
                    id: '24',
                    parent: ['0']
                },
                {
                    id: '25',
                    parent: ['0']
                },
                {
                    id: '26',
                    parent: ['25']
                },
                {
                    id: '27',
                    parent: ['0']
                },
                {
                    id: '28',
                    parent: ['27']
                },
                {
                    id: '29',
                    parent: ['27']
                },
                {
                    id: '30',
                    parent: ['0']
                },
                {
                    id: '31',
                    parent: ['30']
                },
                {
                    id: '32',
                    parent: ['0']
                }
            ]
  
  //let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
  function getConnectorDefaults(connector: ConnectorModel) {
                connector.id = connector.sourceID + '_' + connector.targetID;
                connector.type = 'Orthogonal';
                connector.cornerRadius = 7;
                connector.targetDecorator.height = 7;
                connector.targetDecorator.width = 7;
                connector.style.strokeColor = '#6d6d6d';
                return connector;
            }
            function getNodeDefaults(node: NodeModel, diagram: Diagram) {
                var obj = {
                    width: 75,
                    height: 45,
                    //shape: { shape: 'Ellipse' },
                    style: { fill: '#37909A', strokeColor: '#024249' },
                    annotations: [
                        {
                            content: node.id,
                            margin: { left: 10, right: 10 },
                            style: {
                                color: 'white',
                                fill: 'none',
                                strokeColor: 'none',
                                bold: true
                            }
                        }
                    ],
                };
                return obj;
            }
  
  let diagram: Diagram = new Diagram({
                width: '100%', height: '500px', dataSourceSettings: {
                    id: 'id', parentId: 'parent', dataSource: new DataManager(data),
                },
                layout: {
                    type: 'ComplexHierarchicalTree', horizontalSpacing: 40, verticalSpacing: 40,connectionPointOrigin:ConnectionPointOrigin.DifferentPoint,horizontalAlignment:"Left",verticalAlignment:"Top",
                    enableAnimation: true,
                    margin: { left: 10, right: 0, top: 50, bottom: 0 }
                },
                getNodeDefaults: getNodeDefaults, getConnectorDefaults: getConnectorDefaults
            });
  

diagram.appendTo('#diagram');
function created(): void {
        diagram.fitToPage({ mode: 'Width' });
    }

document.getElementById('orientation').onchange = () => {
    let value: string = (document.getElementById('orientation') as HTMLSelectElement).value;
    diagram.layout.orientation = value as any;
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
    diagram.layout.horizontalAlignment = value as any;
    diagram.dataBind();
};

document.getElementById('valignment').onchange = () => {
    let value: string = (document.getElementById('valignment') as HTMLSelectElement).value;
    diagram.layout.verticalAlignment = value as any;
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