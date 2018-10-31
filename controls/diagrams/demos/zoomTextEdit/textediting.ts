import {
    Diagram, NodeModel, UndoRedo, AlignmentOptions, AlignmentMode, DiagramConstraints
} from '../../src/diagram/index';
Diagram.Inject(UndoRedo);

let diagram: Diagram;
let nodes: NodeModel[] = [
    {
        id: 'node1', width: 100, height: 100, offsetX: 100,
        offsetY: 200, annotations: [{content: 'node1'}]
    }, {
        id: 'node2', width: 200, height: 100, offsetX: 400,
        offsetY: 400, annotations: [{content: 'node2'}]
    },
    {
        id: 'node3', width: 100, height: 100, offsetX: 700,
        offsetY: 400, annotations: [{content: 'node3'}]
    },
    {
        id: 'node4', width: 100, height: 100, offsetX: 950,
        offsetY: 300, annotations: [{content: 'node4'}]
    }
];

diagram = new Diagram(
    {
        width: '1200px', height: '600px', nodes: nodes,
    });
diagram.appendTo('#diagram');

let checkbox: HTMLElement = document.getElementById('constraints');
checkbox.onchange = constraintChange;
function constraintChange() {
    if((checkbox as HTMLInputElement).checked) {
        diagram.constraints = DiagramConstraints.Default | DiagramConstraints.ZoomTextEdit;
    } else if (!(checkbox as HTMLInputElement).checked) {
        diagram.constraints = DiagramConstraints.Default;
    }
}

let alignmentMode: HTMLElement = document.getElementById('alignmentMode');
alignmentMode.onchange = align;


let alignmentOption: HTMLElement = document.getElementById('alignmentOption');
alignmentOption.onchange = align;

function align () {
    diagram.align(
        ((alignmentOption as HTMLInputElement).value) as AlignmentOptions, diagram.selectedItems.nodes,
        ((alignmentMode as HTMLInputElement).value) as AlignmentMode
    );
}
