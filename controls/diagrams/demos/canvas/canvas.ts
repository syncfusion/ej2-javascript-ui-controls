/**
 * Explores the behaviour of the Native Element and the Expand and Collapse Icon
 */

import {
    Diagram, NodeModel, UndoRedo, Size, Canvas, DiagramElement, Thickness, StackPanel, TextElement, Orientation, VerticalAlignment, HorizontalAlignment, NativeModel, NodeConstraints,
} from '../../src/diagram/index';
import { IconShapeModel } from '../../src/diagram/objects/icon-model';
import { DiagramNativeElement } from '../../src/diagram/core/elements/native-element';
import { Shape, Native } from '../../src/index';
Diagram.Inject(UndoRedo);

let nodes: NodeModel[] = [
    {
        id: 'node1', width: 50, height: 50,
    }, {
        id: 'node2', width: 50, height: 50, margin: { left: 150, top: 50 }
    },
    {
        id: 'group', children: ['node1', 'node2'],
        constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
        width: 300, height: 100, offsetX: 200, offsetY: 200,
        container: { type: 'Canvas', orientation: 'Vertical' }
    },
];

let diagram: Diagram = new Diagram({
    width: '800px', height: '1000px', nodes: nodes
});
diagram.appendTo('#diagram');

// diagram.addChild(diagram.nodes[2], {id: 'node3', width: 50, height: 50, margin:{left: 200}});
// diagram.refreshDiagramLayer();

// document.getElementById('drag').onclick = function(){
//     diagram.drag(diagram.nodes[1], 5, 5);
// }
