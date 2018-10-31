import {
    Diagram, NodeModel, BasicShapeModel
} from '../../src/diagram/index';

/**
 * Basic Shapes
 */
let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle', cornerRadius: 10 };
let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, width: 50, height: 50, shape: shape, borderColor: "red" };
let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
let node2: NodeModel = { id: 'node2', offsetX: 300, offsetY: 100, shape: shape2 };
let shape3: BasicShapeModel = { type: 'Basic', shape: 'Hexagon' };
let node3: NodeModel = { id: 'node3', offsetX: 600, offsetY: 100, shape: shape3 };
let shape4: BasicShapeModel = { type: 'Basic', shape: 'Parallelogram' };
let node4: NodeModel = { id: 'node4', offsetX: 900, offsetY: 100, shape: shape4 };
let shape5: BasicShapeModel = { type: 'Basic', shape: 'Triangle' };
let node5: NodeModel = { id: 'node5', offsetX: 1200, offsetY: 100, shape: shape5 };
let shape6: BasicShapeModel = { type: 'Basic', shape: 'Plus' };
let node6: NodeModel = { id: 'node6', offsetX: 100, offsetY: 300, shape: shape6 };
let shape7: BasicShapeModel = { type: 'Basic', shape: 'Star' };
let node7: NodeModel = { id: 'node7', offsetX: 300, offsetY: 300, shape: shape7 };
let shape8: BasicShapeModel = { type: 'Basic', shape: 'Pentagon' };
let node8: NodeModel = { id: 'node8', offsetX: 600, offsetY: 300, shape: shape8 };
let shape9: BasicShapeModel = { type: 'Basic', shape: 'Heptagon' };
let node9: NodeModel = { id: 'node9', offsetX: 900, offsetY: 300, shape: shape9 };
let shape10: BasicShapeModel = { type: 'Basic', shape: 'Octagon' };
let node10: NodeModel = { id: 'node10', offsetX: 1200, offsetY: 300, shape: shape10 };
let shape11: BasicShapeModel = { type: 'Basic', shape: 'Trapezoid' };
let node11: NodeModel = { id: 'node11', offsetX: 100, offsetY: 500, shape: shape11 };
let shape12: BasicShapeModel = { type: 'Basic', shape: 'Decagon' };
let node12: NodeModel = { id: 'node12', offsetX: 300, offsetY: 500, shape: shape12 };
let shape13: BasicShapeModel = { type: 'Basic', shape: 'RightTriangle' };
let node13: NodeModel = { id: 'node13', offsetX: 600, offsetY: 500, shape: shape13 };
let shape14: BasicShapeModel = { type: 'Basic', shape: 'Cylinder' };
let node14: NodeModel = { id: 'node14', offsetX: 900, offsetY: 500, shape: shape14 };
let shape15: BasicShapeModel = { type: 'Basic', shape: 'Diamond', };
let node15: NodeModel = { id: 'node15', offsetX: 1200, offsetY: 500, shape: shape15 };
let diagram: Diagram = new Diagram({
    width: 1500, height: 1000, nodes: [node1, node2, node3, node4, node5, node6, node7,
        node8, node9, node10, node11, node12, node13, node14, node15]
});
diagram.appendTo('#diagram');
document.getElementById('bgcolor').onchange = () => {
    diagram.nodes[0].style.strokeColor = (document.getElementById('bgcolor') as HTMLSelectElement).value;
    diagram.dataBind();
};