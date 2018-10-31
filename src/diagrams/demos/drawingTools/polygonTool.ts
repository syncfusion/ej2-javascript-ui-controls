/**
 * Explores the behaviour of the Native Element and the Expand and Collapse Icon
 */

import {
    Diagram, NodeModel, BasicShapes, DiagramTools, BasicShapeModel, StackPanel, TextElement, Orientation, VerticalAlignment, HorizontalAlignment, NativeModel
} from '../../src/diagram/index';

let nodes: NodeModel[] = [
    {
        id: 'node5',
        width: 248,
        height: 90,
        offsetX: 400,
        offsetY: 200,
        shape: { type: 'Basic', shape: 'Polygon', points: [{ x: 35, y: 0 }, { x: 65, y: 0 }, { x: 100, y: 35 }, { x: 100, y: 65 }, { x: 65, y: 100 }, { x: 35, y: 100 }, { x: 0, y: 65 }, { x: 0, y: 35 }] },
        annotations: [{ content: '[{ x: 35, y: 0 }, { x: 65, y: 0 }, { x: 100, y: 35 }, { x: 100, y: 65 }, { x: 65, y: 100 }, { x: 35, y: 100 }, { x: 0, y: 65 }, { x: 0, y: 35 }]' }],
    }
];
let diagram: Diagram = new Diagram({
    width: '800px', height: '1000px', nodes: nodes
});
diagram.appendTo('#diagram');



let drawPolygon = document.getElementById('drwpolygon');
drawPolygon.onclick = function () {
    let shape: BasicShapeModel = { type: 'Basic', shape: 'Polygon' };
    let node: NodeModel =
        {
            shape: shape

        };

    diagram.tool = DiagramTools.ContinuousDraw;
    diagram.drawingObject = node;
    diagram.dataBind();
}

