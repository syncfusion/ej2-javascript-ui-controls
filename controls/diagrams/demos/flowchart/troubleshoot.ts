/**
 * Trouble shooting process
 */

import {
    Diagram, NodeModel, Segments, ConnectorModel, StopModel, LinearGradientModel, NodeConstraints, SnapConstraints
} from '../../src/diagram/index';

let nodes: NodeModel[] = [
    {
        id: 'start', width: 150, height: 50, offsetX: 500, offsetY: 35,
        shape: { type: 'Flow', shape: 'Terminator' },
        annotations: [{
            content: 'Start', margin: { left: 20, right: 20 }
        }]
    },
    {
        id: 'collect', width: 150, height: 60, offsetX: 500, offsetY: 115,
        shape: { type: 'Flow', shape: 'Document' },
        annotations: [{
            content: 'Collect error Documents'
        }]
    },
    {
        id: 'interview', width: 150, height: 50, offsetX: 500, offsetY: 195,
        shape: { type: 'Flow', shape: 'Process' },
        annotations: [{
            content: 'Interview the operator'
        }]
    },
    {
        id: 'checkcause', width: 150, height: 75, offsetX: 500, offsetY: 285,
        shape: { type: 'Flow', shape: 'Decision' },
        annotations: [{
            content: 'Mistake by operator?'
        }]
    },
    {
        id: 'clear', width: 150, height: 50, offsetX: 705, offsetY: 285,
        shape: { type: 'Flow', shape: 'Process' },
        annotations: [{
            content: 'Clear trouble'
        }]
    },
    {
        id: 'instruct', width: 150, height: 50, offsetX: 705, offsetY: 370,
        shape: { type: 'Flow', shape: 'Data' },
        annotations: [{
            content: 'Give Instructions'
        }]
    },
    {
        id: 'try', width: 150, height: 50, offsetX: 295, offsetY: 285,
        shape: { type: 'Flow', shape: 'PreDefinedProcess' },
        annotations: [{
            content: 'Try quick fixes'
        }]
    },
    {
        id: 'checkfix', width: 150, height: 75, offsetX: 295, offsetY: 375,
        shape: { type: 'Flow', shape: 'Decision' },
        annotations: [{
            content: 'Solved?'
        }]
    },
    {
        id: 'parallelfix', width: 150, height: 50, offsetX: 295, offsetY: 475,
        shape: { type: 'Flow', shape: 'Process' },
        annotations: [{
            content: 'Try to fix parallelly'
        }]
    },

    {
        id: 'finalcheck', width: 125, height: 75, offsetX: 500, offsetY: 375,
        shape: { type: 'Flow', shape: 'ManualOperation' },
        annotations: [{

            content: 'Confirm proper operation'
        }]
    },
    {
        id: 'preparationdoc', width: 150, height: 70, offsetX: 500, offsetY: 475,
        shape: { type: 'Flow', shape: 'Preparation' },
        annotations: [{
            content: 'Prepare/Change user Guide', margin: { left: 20, right: 20 }
        }]
    },
    {
        id: 'paperwork', width: 150, height: 60, offsetX: 500, offsetY: 565,
        shape: { type: 'Flow', shape: 'Document' },
        annotations: [{
            content: 'Do paper work'
        }]
    },
    {
        id: 'complete', width: 150, height: 50, offsetX: 500, offsetY: 640,
        shape: { type: 'Flow', shape: 'Terminator' },
        annotations: [{
            content: 'Complete Process'
        }]
    }
];

let connectors: ConnectorModel[] = [{ sourceID: 'start', targetID: 'collect' },
{ sourceID: 'collect', targetID: 'interview' },
{ sourceID: 'interview', targetID: 'checkcause' },
{ sourceID: 'checkcause', targetID: 'clear', annotations: [{ content: 'Yes' }] },
{ sourceID: 'checkcause', targetID: 'try', annotations: [{ content: 'No' }] },
{ sourceID: 'try', targetID: 'checkfix' },
{ sourceID: 'checkfix', targetID: 'parallelfix', annotations: [{ content: 'No' }] },
{ sourceID: 'parallelfix', targetID: 'checkfix' },
{ sourceID: 'checkfix', targetID: 'finalcheck', annotations: [{ content: 'Yes' }] },
{ sourceID: 'clear', targetID: 'instruct' },
{ sourceID: 'instruct', targetID: 'preparationdoc' },
{ sourceID: 'finalcheck', targetID: 'preparationdoc' },
{ sourceID: 'preparationdoc', targetID: 'paperwork' },
{ sourceID: 'paperwork', targetID: 'complete' },];

let diagram: Diagram = new Diagram({
    width: 1500, height: 1000, nodes: nodes, connectors: connectors,
    getNodeDefaults: (node: NodeModel) => {
        node.style.fill = '#11CDAA';
        node.style.strokeColor = 'none';
        node.annotations[0].style.color = 'white';
        node.constraints = NodeConstraints.Default | NodeConstraints.Shadow;
    },
    getConnectorDefaults: (connectorModel: ConnectorModel) => {
        connectorModel.cornerRadius = 5;
        connectorModel.type = 'Orthogonal';
        connectorModel.style.strokeColor = 'green';
        connectorModel.targetDecorator.shape = 'Arrow';
        connectorModel.targetDecorator.style.fill = connectorModel.targetDecorator.style.strokeColor = 'green';
        if (connectorModel.annotations.length > 0) {
            connectorModel.annotations[0].alignment = 'Before';
        }
    },
    snapSettings: { constraints: SnapConstraints.None }
});

diagram.appendTo('#diagram');