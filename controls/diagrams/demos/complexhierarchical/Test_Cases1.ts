/**
 * FlowChart
 */

import {
    Diagram, ConnectorModel, NodeModel, DiagramConstraints, DataBinding, ComplexHierarchicalTree, LineDistribution, ConnectionPointOrigin, ChildArrangement
} from '../../src/diagram/index';

Diagram.Inject(ComplexHierarchicalTree, LineDistribution, DataBinding);

var node1 = { id: 'n1', width: 70, height: 70, annotations: [{ content: 'node1' }] };
var node2 = { id: 'n2', width: 70, height: 70, annotations: [{ content: 'node2' }] };
var node3 = { id: 'n3', width: 70, height: 70, annotations: [{ content: 'node3' }] };
var node4 = { id: 'n4', width: 70, height: 70, annotations: [{ content: 'node4' }] };
var node5 = { id: 'n5', width: 70, height: 70, annotations: [{ content: 'node5' }] };
var node6 = { id: 'n6', width: 70, height: 70, annotations: [{ content: 'node6' }] };
var node7 = { id: 'n7', width: 70, height: 70, annotations: [{ content: 'node7' }] };
var node8 = { id: 'n8', width: 70, height: 70, annotations: [{ content: 'node8' }] };
var node9 = { id: 'n9', width: 70, height: 70, annotations: [{ content: 'node9' }] };
var node10 = { id: 'n10', width: 70, height: 70, annotations: [{ content: 'node10' }] };
var node11 = { id: 'n11', width: 70, height: 70, annotations: [{ content: 'node11' }] };
var node12 = { id: 'n12', width: 70, height: 70, annotations: [{ content: 'node12' }] };

var connector1 = { id: 'connector1', sourceID: 'n1', targetID: 'n2' };
var connector2 = { id: 'connector2', sourceID: 'n1', targetID: 'n3' };
var connector3 = { id: 'connector3', sourceID: 'n2', targetID: 'n4' };
var connector4 = { id: 'connector4', sourceID: 'n4', targetID: 'n1' };
var connector5 = { id: 'connector5', sourceID: 'n1', targetID: 'n5' };
var connector6 = { id: 'connector6', sourceID: 'n1', targetID: 'n6' };
var connector7 = { id: 'connector7', sourceID: 'n6', targetID: 'n7' };
var connector8 = { id: 'connector8', sourceID: 'n6', targetID: 'n8' };
var connector9 = { id: 'connector9', sourceID: 'n6', targetID: 'n9' };
var connector10 = { id: 'connector10', sourceID: 'n6', targetID: 'n10' };
var connector11 = { id: 'connector11', sourceID: 'n4', targetID: 'n11' };
var connector12 = { id: 'connector12', sourceID: 'n9', targetID: 'n12' };
var connector13 = { id: 'connector13', sourceID: 'n7', targetID: 'n1' };
var connector14 = { id: 'connector14', sourceID: 'n12', targetID: 'n6' };
let diagram: Diagram = new Diagram({
    width: "1150px", height: 1000,
    nodes: [node1, node2, node3, node4, node5, node6, node7, node8, node9, node10,
        node11,
        node12
    ],
    connectors: [connector1, connector2, connector5,
        connector3, connector4, connector6, connector7, connector8, connector9, connector10,
        connector11,
        connector12,
        connector13,
    ],
    getConnectorDefaults: function (connector: any, diagram: any) {

        connector.type = 'Orthogonal';
        return connector;
    },
    layout: {
        type: 'ComplexHierarchicalTree', horizontalSpacing: 32, verticalSpacing: 32,

        horizontalAlignment: "Left",

        enableAnimation: true,
        enableRouting: true,

    },
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
    if (log.checked) {
        diagram.layout.enableRouting = true

    } else {
        diagram.layout.enableRouting = false
    }
}
var linear1: any = document.getElementById('linear');
linear1.onclick = linear;
var oldProp, newProp;
function linear() {
    var connectorpath6 = document.getElementById("connector6_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath6.children[0].getAttribute("d"))
    var connectorpath4 = document.getElementById("connector4_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath4.children[0].getAttribute("d"))





    var connectorpath6 = document.getElementById("connector6_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath6.children[0].getAttribute("d"))
    var connectorpath4 = document.getElementById("connector4_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath4.children[0].getAttribute("d"))



    diagram.layout.orientation = "BottomToTop"
    diagram.dataBind()
    var connectorpath6 = document.getElementById("connector6_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath6.children[0].getAttribute("d"))
    var connectorpath4 = document.getElementById("connector4_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath4.children[0].getAttribute("d"))


    diagram.layout.orientation = "LeftToRight"
    diagram.dataBind()
    var connectorpath6 = document.getElementById("connector6_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath6.children[0].getAttribute("d"))
    var connectorpath4 = document.getElementById("connector4_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath4.children[0].getAttribute("d"))

    diagram.layout.orientation = "RightToLeft"
    diagram.dataBind()
    var connectorpath6 = document.getElementById("connector6_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath6.children[0].getAttribute("d"))
    var connectorpath4 = document.getElementById("connector4_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath4.children[0].getAttribute("d"))



    diagram.layout.horizontalSpacing = 60
    diagram.layout.verticalSpacing = 60
    diagram.dataBind()
    var connectorpath6 = document.getElementById("connector6_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath6.children[0].getAttribute("d"))
    var connectorpath4 = document.getElementById("connector4_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath4.children[0].getAttribute("d"))

    diagram.layout.horizontalSpacing = 80
    diagram.layout.verticalSpacing = 80
    diagram.dataBind()
    var connectorpath6 = document.getElementById("connector6_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath6.children[0].getAttribute("d"))
    var connectorpath4 = document.getElementById("connector4_path_groupElement")
    console.log("connector6_path_groupElement" + connectorpath4.children[0].getAttribute("d"))


    diagram.layout.horizontalAlignment = "Right"
    diagram.dataBind()

}

