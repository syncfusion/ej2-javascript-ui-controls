/**
 * FlowChart
 */

import {
    Diagram, ConnectorModel, NodeModel, DiagramConstraints, ComplexHierarchicalTree,LineDistribution, ConnectionPointOrigin, ChildArrangement
} from '../../src/diagram/index';

Diagram.Inject(ComplexHierarchicalTree,LineDistribution);


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
    nodes: [node1, node2, node3, node4,node5,node6,node7 ,node8,node9,node10,
    node11,
    node12
    ],
    connectors: [connector1, connector2,connector5,
        connector3, connector4, connector6,connector7,connector8,connector9,connector10,
        connector11,
        connector12,
        connector13,
        //connector14
    ],
    created: created,
    getConnectorDefaults: function (connector:any, diagram:any) {
        // connector.targetDecorator.shape = 'None';
        connector.type = 'Orthogonal';
        return connector;
    },
    layout: {
        type: 'ComplexHierarchicalTree', horizontalSpacing: 32, verticalSpacing: 32,
        //orientation: 'RightToLeft',
        //orientation: 'LeftToRight',
         //connectionPointOrigin: index_1.ConnectionPointOrigin.DifferentPoint,
          horizontalAlignment: "Left", 
          //verticalAlignment: "Top",
        enableAnimation: true,
        enableRouting: true,
        ///margin: { left: 10, right: 0, top: 50, bottom: 0 }
    },
});
diagram.appendTo('#diagram');

function created(): void {
    let diag1 = `
{
    "enableRtl": false,
    "locale": "en-US",
    "animationComplete": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "click": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "collectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "commandExecute": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "connectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "contextMenuBeforeItemRender": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "contextMenuClick": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "contextMenuOpen": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "created": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "dataLoaded": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "doubleClick": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "dragEnter": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "dragLeave": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "dragOver": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "drop": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "expandStateChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "fixedUserHandleClick": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "historyChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "historyStateChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "keyDown": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "keyUp": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "mouseEnter": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "mouseLeave": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "mouseOver": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "onImageLoad": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "onUserHandleMouseDown": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "onUserHandleMouseEnter": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "onUserHandleMouseLeave": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "onUserHandleMouseUp": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "positionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "propertyChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "rotateChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "scrollChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "segmentCollectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "selectionChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "sizeChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "sourcePointChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "targetPointChange": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "textEdit": { "_isScalar": false, "closed": false, "isStopped": false, "hasError": false, "thrownError": null, "isAsync": false },
    "commandManager": {
        "commands": [
            { "name": "undo", "parameter": "node", "canExecute": {}, "execute": {}, "gesture": { "key": 90, "keyModifiers": 1 } },
            { "name": "redo", "parameter": "node", "canExecute": {}, "execute": {}, "gesture": { "key": 89, "keyModifiers": 1 } },
            { "name": "copy", "parameter": "node", "canExecute": {}, "execute": {}, "gesture": { "key": 67, "keyModifiers": 1 } },
            { "name": "cut", "parameter": "node", "canExecute": {}, "execute": {}, "gesture": { "key": 88, "keyModifiers": 1 } },
            { "name": "paste", "parameter": "node", "canExecute": {}, "gesture": { "key": 86, "keyModifiers": 1 } },
            { "name": "delete", "parameter": "node", "canExecute": {}, "execute": {}, "gesture": {} }
        ]
    },
    "connectors": [
        {
            "shape": { "type": "None" },
            "id": "node8-node1",
            "sourceID": "node8",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node1",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#0000FE", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 18,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 63, "y": 393.8 },
            "targetPoint": { "x": 40.5, "y": 119 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 22.5, "height": 274.8 }, "offsetX": 51.75, "offsetY": 256.4 },
            "style": { "strokeWidth": 1, "strokeColor": "#0000FE", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "False",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "c0Jhr",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node11-node2",
            "sourceID": "node11",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node2",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#0000FE", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 19,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 306, "y": 409.3 },
            "targetPoint": { "x": 472, "y": 347.5 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 166, "height": 61.80000000000001 }, "offsetX": 389, "offsetY": 378.4 },
            "style": { "strokeWidth": 1, "strokeColor": "#0000FE", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "False",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "ZRp2N",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node9-node3",
            "sourceID": "node9",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node3",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 20,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 720, "y": 746 },
            "targetPoint": { "x": 39, "y": 393.94 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 681, "height": 352.06 }, "offsetX": 379.5, "offsetY": 569.97 },
            "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node0-node3",
            "sourceID": "node0",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node3",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 21,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 40, "y": 189.41 },
            "targetPoint": { "x": 39, "y": 333.94 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 1, "height": 144.53 }, "offsetX": 39.5, "offsetY": 261.675 },
            "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node12-node4",
            "sourceID": "node12",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node4",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#0000FE", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 22,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 590, "y": 148.3 },
            "targetPoint": { "x": 715, "y": 72.5 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 125, "height": 75.80000000000001 }, "offsetX": 652.5, "offsetY": 110.4 },
            "style": { "strokeWidth": 1, "strokeColor": "#0000FE", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "False",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "C4L4W",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node13-node5",
            "sourceID": "node13",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node5",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#0000FE", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 23,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 837, "y": 80.11 },
            "targetPoint": { "x": 694.5, "y": 217 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 142.5, "height": 136.89 }, "offsetX": 765.75, "offsetY": 148.555 },
            "style": { "strokeWidth": 1, "strokeColor": "#0000FE", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "False",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "a0lUa",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node17-node6",
            "sourceID": "node17",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node6",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#0000FE", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 24,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 1094.53, "y": 273.71 },
            "targetPoint": { "x": 874.5, "y": 247 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 220.02999999999997, "height": 26.70999999999998 }, "offsetX": 984.515, "offsetY": 260.355 },
            "style": { "strokeWidth": 1, "strokeColor": "#0000FE", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "False",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "ixIyQ",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node19-node7",
            "sourceID": "node19",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node7",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#0000FE", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 25,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 1215.53, "y": 198.71 },
            "targetPoint": { "x": 1009.5, "y": 247 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 206.02999999999997, "height": 48.28999999999999 }, "offsetX": 1112.5149999999999, "offsetY": 222.85500000000002 },
            "style": { "strokeWidth": 1, "strokeColor": "#0000FE", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "False",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "eiBGI",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node3-node8",
            "sourceID": "node3",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node8",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 26,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": -6, "y": 363.94 },
            "targetPoint": { "x": 93, "y": 421 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 139, "height": 107.06 }, "offsetX": 43.5, "offsetY": 417.47 },
            "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node8-node9",
            "sourceID": "node8",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node9",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#007f00", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 27,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 63, "y": 448.4 },
            "targetPoint": { "x": 720, "y": 746 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 657, "height": 297.6 }, "offsetX": 391.5, "offsetY": 597.2 },
            "style": { "strokeWidth": 1, "strokeColor": "#007f00", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "True",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "TXToT",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node11-node9",
            "sourceID": "node11",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node9",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#007f00", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 28,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 306, "y": 463.9 },
            "targetPoint": { "x": 720, "y": 746 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 414, "height": 282.1 }, "offsetX": 513, "offsetY": 604.95 },
            "style": { "strokeWidth": 1, "strokeColor": "#007f00", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "True",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "VFUw9",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node12-node9",
            "sourceID": "node12",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node9",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#007f00", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 29,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 590, "y": 202.9 },
            "targetPoint": { "x": 720, "y": 746 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 130, "height": 543.1 }, "offsetX": 655, "offsetY": 474.45000000000005 },
            "style": { "strokeWidth": 1, "strokeColor": "#007f00", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "True",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "X4XEy",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node13-node9",
            "sourceID": "node13",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node9",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#007f00", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 30,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 837, "y": 80.11 },
            "targetPoint": { "x": 720, "y": 746 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 117, "height": 665.89 }, "offsetX": 778.5, "offsetY": 413.055 },
            "style": { "strokeWidth": 1, "strokeColor": "#007f00", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "True",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "OLJsV",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node17-node9",
            "sourceID": "node17",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node9",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#007f00", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 31,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 1121, "y": 301.11 },
            "targetPoint": { "x": 720, "y": 746 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 401, "height": 444.89 }, "offsetX": 920.5, "offsetY": 523.5550000000001 },
            "style": { "strokeWidth": 1, "strokeColor": "#007f00", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "True",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "uiaev",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "hitPadding": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node19-node9",
            "sourceID": "node19",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node9",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#007f00", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 32,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 1242, "y": 226.11 },
            "targetPoint": { "x": 720, "y": 746 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 522, "height": 519.89 }, "offsetX": 981, "offsetY": 486.055 },
            "style": { "strokeWidth": 1, "strokeColor": "#007f00", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "True",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "qFXao",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "hitPadding": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node21-node9",
            "sourceID": "node21",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node9",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#007f00", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 33,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 1280, "y": 445.11 },
            "targetPoint": { "x": 720, "y": 746 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 560, "height": 300.89 }, "offsetX": 1000, "offsetY": 595.5550000000001 },
            "style": { "strokeWidth": 1, "strokeColor": "#007f00", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "True",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "PWTUB",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "hitPadding": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node1-node11",
            "sourceID": "node1",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node11",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 34,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 40.5, "y": 119 },
            "targetPoint": { "x": 306, "y": 409.3 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 265.5, "height": 290.3 }, "offsetX": 173.25, "offsetY": 264.15 },
            "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node2-node12",
            "sourceID": "node2",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node12",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 35,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 472, "y": 287.5 },
            "targetPoint": { "x": 590, "y": 202.9 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 118, "height": 84.6 }, "offsetX": 531, "offsetY": 245.2 },
            "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node4-node13",
            "sourceID": "node4",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node13",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 36,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 760, "y": 42.5 },
            "targetPoint": { "x": 810.53, "y": 52.71 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 50.52999999999997, "height": 10.21 }, "offsetX": 785.265, "offsetY": 47.605000000000004 },
            "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node5-node17",
            "sourceID": "node5",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node17",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 37,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 739.5, "y": 247 },
            "targetPoint": { "x": 1094.53, "y": 273.71 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 355.03, "height": 26.70999999999998 }, "offsetX": 917.015, "offsetY": 260.355 },
            "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node6-node19",
            "sourceID": "node6",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node19",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 38,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 874.5, "y": 247 },
            "targetPoint": { "x": 1215.53, "y": 198.71 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 341.03, "height": 48.28999999999999 }, "offsetX": 1045.0149999999999, "offsetY": 222.85500000000002 },
            "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node7-node21",
            "sourceID": "node7",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node21",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 39,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 964.5, "y": 277 },
            "targetPoint": { "x": 1280, "y": 390.51 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 315.5, "height": 113.50999999999999 }, "offsetX": 1122.25, "offsetY": 333.755 },
            "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node21-node23",
            "sourceID": "node21",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node23",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#0000FE", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 40,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 1310, "y": 417.71 },
            "targetPoint": { "x": 1474.5, "y": 479.17 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 164.5, "height": 61.460000000000036 }, "offsetX": 1392.25, "offsetY": 448.44 },
            "style": { "strokeWidth": 1, "strokeColor": "#0000FE", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [
                {
                    "content": "False",
                    "margin": { "top": -10, "left": 0, "bottom": 0, "right": 0 },
                    "constraints": 2,
                    "id": "HZLIT",
                    "annotationType": "String",
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "strokeDashArray": "",
                        "opacity": 1,
                        "gradient": { "type": "None" },
                        "fontSize": 12,
                        "fontFamily": "Arial",
                        "textOverflow": "Wrap",
                        "textDecoration": "None",
                        "whiteSpace": "CollapseSpace",
                        "textWrapping": "WrapWithOverflow",
                        "textAlign": "Center",
                        "color": "black",
                        "italic": false,
                        "bold": false
                    },
                    "offset": 0.5,
                    "alignment": "Center",
                    "segmentAngle": false
                }
            ],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        },
        {
            "shape": { "type": "None" },
            "id": "node23-node24",
            "sourceID": "node23",
            "sourceDecorator": {
                "shape": "None",
                "style": { "fill": "black", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "width": 10,
                "height": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "targetID": "node24",
            "cornerRadius": 10,
            "targetDecorator": {
                "shape": "Arrow",
                "style": { "fill": "#778899", "strokeColor": "#778899", "strokeWidth": 1, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
                "height": 8,
                "width": 10,
                "pivot": { "x": 0, "y": 0.5 }
            },
            "type": "Orthogonal",
            "constraints": 486918,
            "zIndex": 41,
            "sourcePortID": "",
            "targetPortID": "",
            "sourcePoint": { "x": 1564.5, "y": 479.17 },
            "targetPoint": { "x": 1670.26, "y": 479.17 },
            "sourcePadding": 0,
            "targetPadding": 0,
            "segments": [{ "type": "Orthogonal", "direction": null }],
            "wrapper": { "actualSize": { "width": 105.75999999999999, "height": 0 }, "offsetX": 1617.38, "offsetY": 479.17 },
            "style": { "strokeWidth": 1, "strokeColor": "black", "fill": "transparent", "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "annotations": [],
            "fixedUserHandles": [],
            "visible": true,
            "bridgeSpace": 10,
            "parentId": ""
        }
    ],
    "constraints": 502,
    "getCustomTool": {},
    "height": "1000px",
    "nodes": [
        {
            "shape": { "type": "Bpmn", "shape": "Event", "event": { "event": "Start", "trigger": "None" }, "activity": { "subProcess": {} }, "annotations": [] },
            "id": "node0",
            "width": 30,
            "height": 30,
            "annotations": [
                {
                    "id": "node0-label",
                    "content": "Start",
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Top",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "bold": false,
                        "color": "black",
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0.5, "y": 1 },
                    "margin": { "left": 0, "top": 2, "right": 0, "bottom": 0 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0
                }
            ],
            "offsetX": 40,
            "offsetY": 174.408,
            "style": { "fill": "#FFFFFF", "strokeColor": "#62A716", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795174,
            
            "zIndex": 0,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 30, "height": 30 }, "offsetX": 40, "offsetY": 174.408 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": [],
            "outEdges": ["node0-node3"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "shape": "Activity", "type": "Bpmn", "activity": { "task": { "type": "User", "call": false, "compensation": false, "loop": "None" }, "subProcess": { "type": "None" }, "activity": "Task" }, "annotations": [] },
            "id": "node1",
            "width": 90,
            "height": 60,
            "annotations": [
                {
                    "id": "node1-label",
                    "content": "Document Review",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "color": "#000000",
                        "bold": false,
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0.5, "y": 0.5 },
                    "margin": { "top": 10, "right": 2, "bottom": 3, "left": 2 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 40.5,
            "offsetY": 89,
            "style": { "fill": "#E3EDF3", "strokeColor": "#7fadc8", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 1,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 90, "height": 60 }, "offsetX": 40.5, "offsetY": 89 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node8-node1"],
            "outEdges": ["node1-node11"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "shape": "Activity", "type": "Bpmn", "activity": { "activity": "Task", "task": { "type": "Service", "call": false, "compensation": false, "loop": "None" }, "subProcess": { "type": "None" } }, "annotations": [] },
            "id": "node2",
            "width": 90,
            "height": 60,
            "annotations": [
                {
                    "id": "node2-label",
                    "content": "Extraction",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "color": "#000000",
                        "bold": false,
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0.5, "y": 0.5 },
                    "margin": { "top": 10, "right": 2, "bottom": 3, "left": 2 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 472,
            "offsetY": 317.5,
            "style": { "fill": "#E3EDF3", "strokeColor": "#7fadc8", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 2,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 90, "height": 60 }, "offsetX": 472, "offsetY": 317.5 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node11-node2"],
            "outEdges": ["node2-node12"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "shape": "Activity", "type": "Bpmn", "activity": { "activity": "Task", "task": { "type": "Service", "call": false, "compensation": false, "loop": "None" }, "subProcess": { "type": "None" } }, "annotations": [] },
            "id": "node3",
            "width": 90,
            "height": 60,
            "annotations": [
                {
                    "id": "node3-label",
                    "content": "    ",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "color": "#000000",
                        "bold": false,
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0.5, "y": 0.5 },
                    "margin": { "top": 10, "right": 2, "bottom": 3, "left": 2 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 39,
            "offsetY": 363.944444444444,
            "style": { "fill": "#E3EDF3", "strokeColor": "#7fadc8", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 3,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 90, "height": 60 }, "offsetX": 39, "offsetY": 363.944444444444 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node9-node3", "node0-node3"],
            "outEdges": ["node3-node8"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "shape": "Activity", "type": "Bpmn", "activity": { "task": { "type": "User", "call": false, "compensation": false, "loop": "None" }, "subProcess": { "type": "None" }, "activity": "Task" }, "annotations": [] },
            "id": "node4",
            "width": 90,
            "height": 60,
            "annotations": [
                {
                    "id": "node4-label",
                    "content": "Validation Round 1",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "color": "#000000",
                        "bold": false,
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0.5, "y": 0.5 },
                    "margin": { "top": 10, "right": 2, "bottom": 3, "left": 2 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 715,
            "offsetY": 42.5,
            "style": { "fill": "#E3EDF3", "strokeColor": "#7fadc8", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 4,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 90, "height": 60 }, "offsetX": 715, "offsetY": 42.5 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node12-node4"],
            "outEdges": ["node4-node13"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "shape": "Activity", "type": "Bpmn", "activity": { "task": { "type": "User", "call": false, "compensation": false, "loop": "None" }, "subProcess": { "type": "None" }, "activity": "Task" }, "annotations": [] },
            "id": "node5",
            "width": 90,
            "height": 60,
            "annotations": [
                {
                    "id": "node5-label",
                    "content": "Validation Round 2",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "color": "#000000",
                        "bold": false,
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0.5, "y": 0.5 },
                    "margin": { "top": 10, "right": 2, "bottom": 3, "left": 2 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 694.5,
            "offsetY": 247,
            "style": { "fill": "#E3EDF3", "strokeColor": "#7fadc8", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 5,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 90, "height": 60 }, "offsetX": 694.5, "offsetY": 247 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node13-node5"],
            "outEdges": ["node5-node17"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "shape": "Activity", "type": "Bpmn", "activity": { "task": { "type": "User", "call": false, "compensation": false, "loop": "None" }, "subProcess": { "type": "None" }, "activity": "Task" }, "annotations": [] },
            "id": "node6",
            "width": 90,
            "height": 60,
            "annotations": [
                {
                    "id": "node6-label",
                    "content": "Validation Round 3",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "color": "#000000",
                        "bold": false,
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0.5, "y": 0.5 },
                    "margin": { "top": 10, "right": 2, "bottom": 3, "left": 2 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 829.5,
            "offsetY": 247,
            "style": { "fill": "#E3EDF3", "strokeColor": "#7fadc8", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 6,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 90, "height": 60 }, "offsetX": 829.5, "offsetY": 247 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node17-node6"],
            "outEdges": ["node6-node19"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "shape": "Activity", "type": "Bpmn", "activity": { "task": { "type": "User", "call": false, "compensation": false, "loop": "None" }, "subProcess": { "type": "None" }, "activity": "Task" }, "annotations": [] },
            "id": "node7",
            "width": 90,
            "height": 60,
            "annotations": [
                {
                    "id": "node7-label",
                    "content": "Verification",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "color": "#000000",
                        "bold": false,
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0.5, "y": 0.5 },
                    "margin": { "top": 10, "right": 2, "bottom": 3, "left": 2 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 964.5,
            "offsetY": 247,
            "style": { "fill": "#E3EDF3", "strokeColor": "#7fadc8", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 7,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 90, "height": 60 }, "offsetX": 964.5, "offsetY": 247 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node19-node7"],
            "outEdges": ["node7-node21"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "type": "Bpmn", "shape": "Gateway", "activity": { "subProcess": {} }, "gateway": { "type": "None" }, "annotations": [] },
            "id": "node8",
            "width": 60,
            "height": 60,
            "annotations": [
                {
                    "id": "node8-label",
                    "content": "Has Rejections?",
                    "horizontalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "bold": false,
                        "color": "black",
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0, "y": 1 },
                    "margin": { "left": 0, "top": 1, "right": 0, "bottom": 0 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 63,
            "offsetY": 421,
            "style": { "fill": "#FFFFFF", "strokeColor": "#d5dc43", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 8,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 60, "height": 60 }, "offsetX": 63, "offsetY": 421 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node3-node8"],
            "outEdges": ["node8-node1", "node8-node9"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "shape": "Activity", "type": "Bpmn", "activity": { "task": { "type": "User", "call": false, "compensation": false, "loop": "None" }, "subProcess": { "type": "None" }, "activity": "Task" }, "annotations": [] },
            "id": "node9",
            "width": 90,
            "height": 60,
            "annotations": [
                {
                    "id": "node9-label",
                    "content": "Rescan",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "color": "#000000",
                        "bold": false,
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0.5, "y": 0.5 },
                    "margin": { "top": 10, "right": 2, "bottom": 3, "left": 2 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 720,
            "offsetY": 776,
            "style": { "fill": "#E3EDF3", "strokeColor": "#7fadc8", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 9,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 90, "height": 60 }, "offsetX": 720, "offsetY": 776 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node8-node9", "node11-node9", "node12-node9", "node13-node9", "node17-node9", "node19-node9", "node21-node9"],
            "outEdges": ["node9-node3"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "type": "Bpmn", "shape": "Gateway", "activity": { "subProcess": {} }, "gateway": { "type": "None" }, "annotations": [] },
            "id": "node11",
            "width": 60,
            "height": 60,
            "annotations": [
                {
                    "id": "node11-label",
                    "content": "Has Rejections?",
                    "horizontalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "bold": false,
                        "color": "black",
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0, "y": 1 },
                    "margin": { "left": 0, "top": 1, "right": 0, "bottom": 0 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 306,
            "offsetY": 436.5,
            "style": { "fill": "#FFFFFF", "strokeColor": "#d5dc43", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 10,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 60, "height": 60 }, "offsetX": 306, "offsetY": 436.5 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node1-node11"],
            "outEdges": ["node11-node2", "node11-node9"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "type": "Bpmn", "shape": "Gateway", "activity": { "subProcess": {} }, "gateway": { "type": "None" }, "annotations": [] },
            "id": "node12",
            "width": 60,
            "height": 60,
            "annotations": [
                {
                    "id": "node12-label",
                    "content": "Has Rejections?",
                    "horizontalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "bold": false,
                        "color": "black",
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0, "y": 1 },
                    "margin": { "left": 0, "top": 1, "right": 0, "bottom": 0 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 590,
            "offsetY": 175.5,
            "style": { "fill": "#FFFFFF", "strokeColor": "#d5dc43", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 11,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 60, "height": 60 }, "offsetX": 590, "offsetY": 175.5 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node2-node12"],
            "outEdges": ["node12-node4", "node12-node9"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "type": "Bpmn", "shape": "Gateway", "activity": { "subProcess": {} }, "gateway": { "type": "None" }, "annotations": [] },
            "id": "node13",
            "width": 60,
            "height": 60,
            "annotations": [
                {
                    "id": "node13-label",
                    "content": "Has Rejections?",
                    "horizontalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "bold": false,
                        "color": "black",
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0, "y": 1 },
                    "margin": { "left": 0, "top": 1, "right": 0, "bottom": 0 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 837,
            "offsetY": 52.7066858410835,
            "style": { "fill": "#FFFFFF", "strokeColor": "#d5dc43", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 12,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 60, "height": 60 }, "offsetX": 837, "offsetY": 52.7066858410835 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node4-node13"],
            "outEdges": ["node13-node5", "node13-node9"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "type": "Bpmn", "shape": "Gateway", "activity": { "subProcess": {} }, "gateway": { "type": "None" }, "annotations": [] },
            "id": "node17",
            "width": 60,
            "height": 60,
            "annotations": [
                {
                    "id": "node17-label",
                    "content": "Has Rejections?",
                    "horizontalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "bold": false,
                        "color": "black",
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0, "y": 1 },
                    "margin": { "left": 0, "top": 1, "right": 0, "bottom": 0 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 1121,
            "offsetY": 273.706685841084,
            "style": { "fill": "#FFFFFF", "strokeColor": "#d5dc43", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 13,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 60, "height": 60 }, "offsetX": 1121, "offsetY": 273.706685841084 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node5-node17"],
            "outEdges": ["node17-node6", "node17-node9"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "type": "Bpmn", "shape": "Gateway", "activity": { "subProcess": {} }, "gateway": { "type": "None" }, "annotations": [] },
            "id": "node19",
            "width": 60,
            "height": 60,
            "annotations": [
                {
                    "id": "node19-label",
                    "content": "Has Rejections?",
                    "horizontalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "bold": false,
                        "color": "black",
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0, "y": 1 },
                    "margin": { "left": 0, "top": 1, "right": 0, "bottom": 0 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 1242,
            "offsetY": 198.706685841084,
            "style": { "fill": "#FFFFFF", "strokeColor": "#d5dc43", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 14,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 60, "height": 60 }, "offsetX": 1242, "offsetY": 198.706685841084 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node6-node19"],
            "outEdges": ["node19-node7", "node19-node9"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "type": "Bpmn", "shape": "Gateway", "activity": { "subProcess": {} }, "gateway": { "type": "None" }, "annotations": [] },
            "id": "node21",
            "width": 60,
            "height": 60,
            "annotations": [
                {
                    "id": "node21-label",
                    "content": "Has Rejections?",
                    "horizontalAlignment": "Center",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "bold": false,
                        "color": "black",
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0, "y": 1 },
                    "margin": { "left": 0, "top": 1, "right": 0, "bottom": 0 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 1280,
            "offsetY": 417.706685841084,
            "style": { "fill": "#FFFFFF", "strokeColor": "#d5dc43", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 15,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 60, "height": 60 }, "offsetX": 1280, "offsetY": 417.706685841084 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node7-node21"],
            "outEdges": ["node21-node9", "node21-node23"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "shape": "Activity", "type": "Bpmn", "activity": { "activity": "Task", "task": { "type": "Service", "call": false, "compensation": false, "loop": "None" }, "subProcess": { "type": "None" } }, "annotations": [] },
            "id": "node23",
            "width": 90,
            "height": 60,
            "annotations": [
                {
                    "id": "node23-label",
                    "content": "Export",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "color": "#000000",
                        "bold": false,
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0.5, "y": 0.5 },
                    "margin": { "top": 10, "right": 2, "bottom": 3, "left": 2 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0,
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Center"
                }
            ],
            "offsetX": 1519.5,
            "offsetY": 479.166666666667,
            "style": { "fill": "#E3EDF3", "strokeColor": "#7fadc8", "strokeWidth": 2, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 16,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 90, "height": 60 }, "offsetX": 1519.5, "offsetY": 479.166666666667 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node21-node23"],
            "outEdges": ["node23-node24"],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        },
        {
            "shape": { "type": "Bpmn", "shape": "Event", "event": { "event": "End", "trigger": "None" }, "activity": { "subProcess": {} }, "annotations": [] },
            "id": "node24",
            "width": 30,
            "height": 30,
            "annotations": [
                {
                    "id": "node24-label",
                    "content": "End",
                    "horizontalAlignment": "Center",
                    "verticalAlignment": "Top",
                    "style": {
                        "strokeWidth": 0,
                        "strokeColor": "transparent",
                        "fill": "transparent",
                        "fontFamily": "Noto Sans, Helvetica, Arial, sans-serif",
                        "fontSize": 11,
                        "textOverflow": "Wrap",
                        "textWrapping": "WrapWithOverflow",
                        "whiteSpace": "CollapseSpace",
                        "bold": false,
                        "color": "black",
                        "italic": false,
                        "opacity": 1,
                        "strokeDashArray": "",
                        "textAlign": "Center",
                        "textDecoration": "None"
                    },
                    "offset": { "x": 0.5, "y": 1 },
                    "margin": { "left": 0, "top": 2, "right": 0, "bottom": 0 },
                    "constraints": 0,
                    "annotationType": "String",
                    "hyperlink": { "link": "", "content": "", "textDecoration": "None" },
                    "visibility": true,
                    "rotateAngle": 0
                }
            ],
            "offsetX": 1684.5,
            "offsetY": 479.166666666667,
            "style": { "fill": "#FFFFFF", "strokeColor": "#9b0000", "strokeWidth": 4, "strokeDashArray": "", "opacity": 1, "gradient": { "type": "None" } },
            "constraints": 38795238,
            
            "zIndex": 17,
            "container": null,
            "visible": true,
            "horizontalAlignment": "Left",
            "verticalAlignment": "Top",
            "backgroundColor": "transparent",
            "borderColor": "none",
            "borderWidth": 0,
            "rotateAngle": 0,
            "pivot": { "x": 0.5, "y": 0.5 },
            "margin": {},
            "flip": "None",
            "wrapper": { "actualSize": { "width": 30, "height": 30 }, "offsetX": 1684.5, "offsetY": 479.166666666667 },
            "ports": [],
            "isExpanded": true,
            "expandIcon": { "shape": "None" },
            "fixedUserHandles": [],
            "inEdges": ["node23-node24"],
            "outEdges": [],
            "parentId": "",
            "processId": "",
            "umlIndex": -1,
            "isPhase": false,
            "isLane": false
        }
    ],
    "scrollSettings": {
        "canAutoScroll": true,
        "scrollLimit": "Infinity",
        "padding": { "left": 10, "right": 30, "top": 10, "bottom": 30 },
        "viewPortWidth": 1404,
        "viewPortHeight": 829,
        "currentZoom": 1,
        "horizontalOffset": 0,
        "verticalOffset": 0
    },
    "selectedItems": {
        "nodes": [],
        "connectors": [],
        "wrapper": null,
        "constraints": 4096,
        "userHandles": [
            { "name": "connector", "backgroundColor": "transparent", "pathColor": "#5a5a64", "side": "Top", "offset": 1, "visible": true, "size": 33, "pathData": "M4,11v2h8v7l8-8L12,4v7Z", "margin": { "top": 17 }, "template": "" },
            {
                "name": "delete",
                "backgroundColor": "transparent",
                "pathColor": "#5a5a64",
                "side": "Top",
                "offset": 1,
                "visible": true,
                "size": 25,
                "pathData": "M828.2096467757849,-5.547905384373092c-3.201999999999998,-2.8130000000000006,-8.105999999999995,-2.455,-11.119,0.5579999999999998l-34.179,34.205l-34.337,-34.362c-3.093,-3.0920000000000005,-8.108,-3.0920000000000005,-11.201,0l-0.11299999999999956,0.11299999999999956c-3.093,3.093,-3.093,8.107,0,11.201l34.341,34.366l-34.34,34.366c-3.093,3.0930000000000035,-3.093,8.108000000000004,0,11.201000000000008l0.11299999999999956,0.11299999999999956c3.093,3.0930000000000035,8.107,3.0930000000000035,11.201,0l34.337,-34.363l34.17900000000001,34.205c3.0130000000000052,3.0130000000000052,7.917000000000002,3.3700000000000045,11.119,0.5580000000000069c3.507000000000005,-3.081000000000003,3.6370000000000005,-8.429000000000002,0.38800000000000534,-11.677999999999997l-34.37899999999999,-34.403l34.37700000000001,-34.404c3.25,-3.2489999999999988,3.1200000000000045,-8.596,-0.38800000000000534,-11.677Z",
                "margin": { "top": 10, "right": 10 },
                "template": ""
            },
            {
                "name": "node",
                "backgroundColor": "transparent",
                "pathColor": "#e9f8ff",
                "side": "Right",
                "offset": 0,
                "visible": true,
                "size": 33,
                "pathData": "M17.75,13.89H2.5a2,2,0,0,1-2-2V2.5a2,2,0,0,1,2-2H17.75a2,2,0,0,1,2,2v9.39A2,2,0,0,1,17.75,13.89Z",
                "margin": { "right": 15 },
                "template": ""
            },
            {
                "name": "decision",
                "backgroundColor": "transparent",
                "pathColor": "#fff6df",
                "side": "Right",
                "offset": 0.5,
                "visible": true,
                "size": 33,
                "pathData": "M19.94,11.93l-8,8a2,2,0,0,1-2.83,0l-8-8a2,2,0,0,1,0-2.83l8-8a2,2,0,0,1,2.83,0l8,8A2,2,0,0,1,19.94,11.93Z",
                "margin": { "right": 15 },
                "template": ""
            },
            {
                "name": "end",
                "backgroundColor": "transparent",
                "pathColor": "#ffedef",
                "side": "Right",
                "offset": 1,
                "visible": true,
                "size": 33,
                "pathData": "M16.92,8.71A8.21,8.21,0,1,1,8.71.5,8.21,8.21,0,0,1,16.92,8.71Z",
                "margin": { "right": 15 },
                "template": ""
            },
            {
                "name": "annotation",
                "backgroundColor": "transparent",
                "pathColor": "#5a5a64",
                "side": "Bottom",
                "offset": 1,
                "visible": true,
                "size": 33,
                "pathData": "M8,11h8v2H8Zm8-4H8V9h8Zm0,8H8v2h8ZM18,2H10V4h8V20H10v2h8a2,2,0,0,0,2-2V4A2,2,0,0,0,18,2ZM6,4H8V2H6A2,2,0,0,0,4,4v6L2,12l2,2v6a2,2,0,0,0,2,2H8V20H6Z",
                "margin": { "right": 10, "bottom": 9, "left": 5 },
                "template": ""
            },
            {
                "name": "attachment",
                "backgroundColor": "transparent",
                "pathColor": "#5a5a64",
                "side": "Bottom",
                "offset": 0.5,
                "visible": true,
                "size": 33,
                "pathData": "M11,9h5.5L11,3.5V9M4,2h8l6,6V20a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2M9,4H4V20H16V11H9Z",
                "margin": { "bottom": 9 },
                "template": ""
            }
        ],
        "rotateAngle": 0
    },
    "snapSettings": {
        "constraints": 0,
        "horizontalGridlines": { "lineIntervals": [1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75], "snapIntervals": [10] },
        "verticalGridlines": { "lineIntervals": [1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75], "snapIntervals": [10] },
        "gridType": "Lines"
    },
    "width": "1000px",
    "enablePersistence": false,
    "rulerSettings": { "showRulers": true },
    "backgroundColor": "transparent",
    "layout": { "type": "None", "enableAnimation": true, "connectionPointOrigin": "SamePoint", "arrangement": "Nonlinear" },
    "contextMenuSettings": {},
    "dataSourceSettings": { "dataManager": null, "dataSource": null, "crudAction": { "read": "" }, "connectionDataSource": { "crudAction": { "read": "" } } },
    "mode": "SVG",
    "layers": [
        {
            "id": "default_layer",
            "visible": true,
            "lock": false,
            "objects": [
                "node0",
                "node1",
                "node2",
                "node3",
                "node4",
                "node5",
                "node6",
                "node7",
                "node8",
                "node9",
                "node11",
                "node12",
                "node13",
                "node17",
                "node19",
                "node21",
                "node23",
                "node24",
                "node8-node1",
                "node11-node2",
                "node9-node3",
                "node0-node3",
                "node12-node4",
                "node13-node5",
                "node17-node6",
                "node19-node7",
                "node3-node8",
                "node8-node9",
                "node11-node9",
                "node12-node9",
                "node13-node9",
                "node17-node9",
                "node19-node9",
                "node21-node9",
                "node1-node11",
                "node2-node12",
                "node4-node13",
                "node5-node17",
                "node6-node19",
                "node7-node21",
                "node21-node23",
                "node23-node24"
            ],
            "zIndex": 0,
            "objectZIndex": 41
        }
    ],
    "pageSettings": { "orientation": "Landscape", "height": null, "width": null, "background": { "source": "", "color": "transparent" }, "showPageBreaks": false, "fitOptions": { "canFit": false }, "boundaryConstraints": "Infinity" },
    "basicElements": [],
    "tooltip": { "content": "" },
    "diagramSettings": { "inversedAlignment": true },
    "bridgeDirection": "Top",
    "tool": 3,
    "customCursor": [],
    "version": 17.1
}

`;
    diagram.loadDiagram(diag1);
    diagram.layout.enableRouting = true;
    
    diagram.layout.type = 'ComplexHierarchicalTree';
   
    diagram.layout.horizontalAlignment = "Left"
    diagram.layout.verticalAlignment = "Top"
    diagram.dataBind();
    diagram.doLayout();
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
    var id = diagram.connectors[2].id
    var connectorpath6 = document.getElementById(id+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath6.children[0].getAttribute("d"))
    var id1 = diagram.connectors[9].id
    var connectorpath4 = document.getElementById(id1+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath4.children[0].getAttribute("d"))



   

    var id = diagram.connectors[2].id
    var connectorpath6 = document.getElementById(id+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath6.children[0].getAttribute("d"))
    var id1 = diagram.connectors[9].id
    var connectorpath4 = document.getElementById(id1+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath4.children[0].getAttribute("d"))



    diagram.layout.orientation = "BottomToTop"
    diagram.dataBind()
    var id = diagram.connectors[2].id
    var connectorpath6 = document.getElementById(id+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath6.children[0].getAttribute("d"))
    var id1 = diagram.connectors[9].id
    var connectorpath4 = document.getElementById(id1+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath4.children[0].getAttribute("d"))


    diagram.layout.orientation = "LeftToRight"
    diagram.dataBind()
    var id = diagram.connectors[2].id
    var connectorpath6 = document.getElementById(id+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath6.children[0].getAttribute("d"))
    var id1 = diagram.connectors[9].id
    var connectorpath4 = document.getElementById(id1+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath4.children[0].getAttribute("d"))

    diagram.layout.orientation = "RightToLeft"
    diagram.dataBind()
    var id = diagram.connectors[2].id
    var connectorpath6 = document.getElementById(id+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath6.children[0].getAttribute("d"))
    var id1 = diagram.connectors[9].id
    var connectorpath4 = document.getElementById(id1+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath4.children[0].getAttribute("d"))


   
    diagram.layout.horizontalSpacing = 60
    diagram.layout.verticalSpacing = 60
    diagram.dataBind()
    var id = diagram.connectors[2].id
    var connectorpath6 = document.getElementById(id+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath6.children[0].getAttribute("d"))
    var id1 = diagram.connectors[9].id
    var connectorpath4 = document.getElementById(id1+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath4.children[0].getAttribute("d"))

    diagram.layout.horizontalSpacing = 80
    diagram.layout.verticalSpacing = 80
    diagram.dataBind()
    var id = diagram.connectors[2].id
    var connectorpath6 = document.getElementById(id+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath6.children[0].getAttribute("d"))
    var id1 = diagram.connectors[9].id
    var connectorpath4 = document.getElementById(id1+"_path_groupElement")
    console.log("connector6_path_groupElement"+connectorpath4.children[0].getAttribute("d"))


    diagram.layout.horizontalAlignment = "Right"
    diagram.dataBind()
  
}

