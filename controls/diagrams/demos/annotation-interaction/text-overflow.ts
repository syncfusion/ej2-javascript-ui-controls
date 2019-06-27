import { Diagram } from '../../src/diagram/diagram';

import { NodeModel } from '../../src/diagram/objects/node-model';
/**
 * pageSettings
 */
let diagram: Diagram;
let node: NodeModel = {
    id: 'node1', width: 75, height: 75, offsetX: 300, offsetY: 200,
    annotations: [{
        content: 'The text element given with property of overflow as clip and wrapping as wrap so that element to be clipped',
        style: { textWrapping: 'Wrap', textOverflow: 'Clip' }
    }]
};
let node2: NodeModel = {
    id: 'node2', width: 75, height: 75, offsetX: 400, offsetY: 200,
    annotations: [{
        content: 'The text element given with property of overflow as clip and wrapping as wrap so that element to be clipped',
        style: { textOverflow: 'Ellipsis', textWrapping: 'Wrap' }
    }]
};
let node3: NodeModel = {
    id: 'node3', width: 75, height: 75, offsetX: 500, offsetY: 200, annotations: [{ content: 'Node3', style: { textOverflow: 'Clip', textWrapping: 'WrapWithOverflow' } }]
};
diagram = new Diagram({
    width: '1000px', height: '500px', nodes: [node, node2, node3]
});
diagram.appendTo('#diagram');



