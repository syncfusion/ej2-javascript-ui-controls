import { Diagram } from '../../src/diagram/diagram';

import { NodeModel } from '../../src/diagram/objects/node-model';
/**
 * pageSettings
 */
let diagram: Diagram;

diagram = new Diagram({
    width: '1000px', height: '500px',
    nodes: [
        {
            id: 'node1', width: 75, height: 75, offsetX: 300, offsetY: 100,
            annotations: [{
                id: 'label1',
                content: 'The text element given with property of overflow as clip and wrapping as wrap, so pls refer the content',
                style: { textOverflow: 'Clip', textWrapping: 'Wrap' }
            }]
        },
        {
            id: 'node2', width: 75, height: 75, offsetX: 450, offsetY: 100,
            annotations: [{
                id: 'label2',
                content: 'The text element given with property of overflow as Ellipsis and wrapping as wrap so that element to be clipped',
                style: { textOverflow: 'Ellipsis', textWrapping: 'Wrap' }
            }]
        },
        {
            id: 'node3', width: 75, height: 75, offsetX: 600, offsetY: 100,
            annotations: [{
                id: 'label3',
                content: 'The text element given with property of overflow as Wrap and wrapping as wrap so that element not to be Wrapped',
                style: { textOverflow: 'Wrap', textWrapping: 'Wrap' }
            }]
        },
        {
            id: 'node4', width: 75, height: 75, offsetX: 300, offsetY: 200,
            annotations: [{
                id: 'label4',
                content: "The text element's wrapping as WrapWithOverflow and overflow is Clip",
                style: { textOverflow: 'Clip', textWrapping: 'WrapWithOverflow' }
            }]
        },
        {
            id: 'node5', width: 75, height: 75, offsetX: 450, offsetY: 200,
            annotations: [{
                id: 'label5',
                content: "The text element's wrapping as WrapWithOverflow and overflow is Ellipsis",
                style: { textOverflow: 'Ellipsis', textWrapping: 'WrapWithOverflow' }
            }]
        },
        {
            id: 'node6', width: 75, height: 75, offsetX: 600, offsetY: 200,
            annotations: [{
                id: 'label6',
                content: "The text element's wrapping as WrapWithOverflow and overflow is Wrap",
                style: { textOverflow: 'Wrap', textWrapping: 'WrapWithOverflow' }
            }]
        },
        {
            id: 'node7', width: 75, height: 75, offsetX: 300, offsetY: 300,
            annotations: [{
                id: 'label7',
                content: "The text element's wrapping as NoWrap and overflow is Clip",
                style: { textOverflow: 'Clip', textWrapping: 'NoWrap' }
            }]
        },
        {
            id: 'node8', width: 75, height: 75, offsetX: 450, offsetY: 300,
            annotations: [{
                id: 'label8',
                content: "The text element's wrapping as NoWrap and overflow is Ellipsis",
                style: { textOverflow: 'Ellipsis', textWrapping: 'NoWrap' }
            }]
        },
        {
            id: 'node9', width: 75, height: 75, offsetX: 600, offsetY: 300,
            annotations: [{
                id: 'label9',
                content: "The text element's wrapping as NoWrap and overflow is Wrap",
                style: { textOverflow: 'Wrap', textWrapping: 'NoWrap' }
            }]
        }
    ]
});
diagram.appendTo('#diagram');



