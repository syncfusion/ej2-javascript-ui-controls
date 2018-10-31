/**
 * Explores the types of nodes
 */

import {
    Diagram, NodeModel, StackPanel, PathAnnotationModel, TextWrap, TextAlign, TextDecoration, TextOverflow, WhiteSpace, SnapConstraints, HorizontalAlignment, PortVisibility, AnnotationModel, ShapeAnnotationModel, Node, TextElement, AnnotationConstraints, ConnectorModel, Orientation, VerticalAlignment, Port, PointPort, PortModel, PointPortModel, Selector, ShapeAnnotation, PathAnnotation
} from '../../src/diagram/index';
let nodes: NodeModel[] = [
    {
        id: 'industry', width: 130, height: 50, offsetX: 400, offsetY: 200,
        annotations: [{ content: 'Shape Annotation', constraints: AnnotationConstraints.Interaction }]
    }
];

let connectors: ConnectorModel[] = [
    {
        id: 'connector1', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 },
        annotations: [{ content: 'Path Annotation', constraints: AnnotationConstraints.Interaction }]
    }
];

let diagram: Diagram = new Diagram({
    width: '800px', height: '500px', nodes: nodes, connectors: connectors,
    snapSettings: { constraints: SnapConstraints.None },
    getNodeDefaults: function (node: NodeModel) {
        var obj = {
            width: 130, height: 50, style: { fill: '#D5EDED', strokeColor: '#7DCFC9', strokeWidth: 1 },
            shape: { cornerRadius: 5 }
        };
        return obj;
    },
});
diagram.appendTo('#diagram');

let addlabel: HTMLElement = document.getElementById('addlabel');
addlabel.onclick = function () {
    if (diagram.selectedItems.nodes.length + diagram.selectedItems.connectors.length > 0) {
        let isNode: boolean = (diagram.selectedItems.nodes.length > 0) ? true : false;
        let node: NodeModel | ConnectorModel = (isNode) ? diagram.selectedItems.nodes[0] : diagram.selectedItems.connectors[0];
        let label: ShapeAnnotationModel[] | PathAnnotationModel[] = (isNode) ?
            (
                [{ id: 'label1', content: 'Label1', offset: { x: 0 } },
                { id: 'label2', content: 'Label2', offset: { y: 0 } },
                { id: 'label3', content: 'Label3', offset: { x: 1 } },
                { id: 'label4', content: 'Label4', offset: { y: 1 } }]
            ) :
            (
                [{ id: 'label1', content: 'Text2', offset: 0 },
                { id: 'label2', content: 'Text3', offset: 1 },]
            );
        diagram.addLabels(node, label);
    }
}

let removelabel: HTMLElement = document.getElementById('removelabel');
removelabel.onclick = function () {
    if (diagram.selectedItems.nodes.length + diagram.selectedItems.connectors.length > 0) {
        let isNode: boolean = (diagram.selectedItems.nodes.length > 0) ? true : false;
        let node: Node | ConnectorModel = (isNode) ? (diagram.selectedItems.nodes[0] as Node) : diagram.selectedItems.connectors[0];
        let label: ShapeAnnotationModel[] | PathAnnotationModel[] = (isNode) ?
            (
                [{ id: 'label1' },
                { id: 'label2' },
                { id: 'label3' },
                { id: 'label4' }]
            ) :
            (
                [{ id: 'label1' },
                { id: 'label2' },]
            );
        diagram.removeLabels(node, label);
    }
}


let changeContent: HTMLElement = document.getElementById('content');
changeContent.onchange = function () {
    if ((diagram.selectedItems as Selector).annotation) {
        (diagram.selectedItems as Selector).annotation.content = (changeContent as HTMLInputElement).value;
        diagram.dataBind(); diagram.updateSelector();
    }
}

let expanded: boolean = false;
document.getElementById('selectBox').onclick = showCheckboxes;
function showCheckboxes() {
    let checkboxes: HTMLElement = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}
document.getElementById('None').onchange = function () {
    annotationConstriants('None', (document.getElementById('None') as HTMLInputElement).checked);
}
document.getElementById('Select').onchange = function () {
    annotationConstriants('Select', (document.getElementById('Select') as HTMLInputElement).checked);
}
document.getElementById('Drag').onchange = function () {
    annotationConstriants('Drag', (document.getElementById('Drag') as HTMLInputElement).checked);
}
document.getElementById('Resize').onchange = function () {
    annotationConstriants('Resize', (document.getElementById('Resize') as HTMLInputElement).checked);
}
document.getElementById('Rotate').onchange = function () {
    annotationConstriants('Rotate', (document.getElementById('Rotate') as HTMLInputElement).checked);
}
document.getElementById('Interaction').onchange = function () {
    annotationConstriants('Interaction', (document.getElementById('Interaction') as HTMLInputElement).checked);
}
document.getElementById('ReadOnly').onchange = function () {
    annotationConstriants('ReadOnly', (document.getElementById('ReadOnly') as HTMLInputElement).checked);
}
document.getElementById('InheritReadOnly').onchange = function () {
    annotationConstriants('InheritReadOnly', (document.getElementById('InheritReadOnly') as HTMLInputElement).checked);
}


function annotationConstriants(constraints: string, checked: boolean) {
    if ((diagram.selectedItems as Selector).annotation) {
        let annotation: ShapeAnnotationModel | PathAnnotationModel = (diagram.selectedItems as Selector).annotation;
        switch (constraints) {
            case 'None':
                annotation.constraints = AnnotationConstraints.None;
                break;
            case 'Select':
                if (checked) {
                    annotation.constraints |= AnnotationConstraints.Select;
                } else {
                    annotation.constraints = annotation.constraints & ~AnnotationConstraints.Select;
                }
                break;
            case 'Drag':
                if (checked) {
                    annotation.constraints |= AnnotationConstraints.Drag;
                } else {
                    annotation.constraints = annotation.constraints & ~AnnotationConstraints.Drag;
                }
                break;
            case 'Resize':
                if (checked) {
                    annotation.constraints |= AnnotationConstraints.Resize;
                } else {
                    annotation.constraints = annotation.constraints & ~AnnotationConstraints.Resize;
                }
                break;
            case 'Rotate':
                if (checked) {
                    annotation.constraints |= AnnotationConstraints.Rotate;
                } else {
                    annotation.constraints = annotation.constraints & ~AnnotationConstraints.Rotate;
                }
                break;
            case 'Interaction':
                if (checked) {
                    annotation.constraints |= AnnotationConstraints.Interaction;
                } else {
                    annotation.constraints = annotation.constraints & ~AnnotationConstraints.Interaction;
                }
                break;
            case 'ReadOnly':
                if (checked) {
                    annotation.constraints |= AnnotationConstraints.ReadOnly;
                } else {
                    annotation.constraints = annotation.constraints & ~AnnotationConstraints.ReadOnly;
                }
                break;
            case 'InheritReadOnly':
                if (checked) {
                    annotation.constraints |= AnnotationConstraints.InheritReadOnly;
                } else {
                    annotation.constraints = annotation.constraints & ~AnnotationConstraints.InheritReadOnly;
                }
                break;
                
        }
        diagram.dataBind();
        diagram.updateSelector();
    }
}

document.getElementById('size').onclick = function () {
    let width: number = Number((document.getElementById('width') as HTMLInputElement).value);
    let height: number = Number((document.getElementById('height') as HTMLInputElement).value);
    if ((diagram.selectedItems as Selector).annotation) {
        (diagram.selectedItems as Selector).annotation.width = width;
        (diagram.selectedItems as Selector).annotation.height = height;
        diagram.dataBind(); diagram.updateSelector();
    }
}

document.getElementById('position').onclick = function () {
    let x: number = Number((document.getElementById('offsetX') as HTMLInputElement).value);
    let y: number = Number((document.getElementById('offsetY') as HTMLInputElement).value);
    if ((diagram.selectedItems as Selector).annotation) {
        if ((diagram.selectedItems as Selector).annotation instanceof ShapeAnnotation) {
            ((diagram.selectedItems as Selector).annotation as ShapeAnnotation).offset.x = x;
            ((diagram.selectedItems as Selector).annotation as ShapeAnnotation).offset.y = y;
        } else {
            ((diagram.selectedItems as Selector).annotation as PathAnnotation).offset = x;
        }
        diagram.dataBind(); diagram.updateSelector();
    }
}
document.getElementById('horizontalAlignment').onchange = () => {
    let value: string = (document.getElementById('horizontalAlignment') as HTMLInputElement).value;
    if ((diagram.selectedItems as Selector).annotation) {
        (diagram.selectedItems as Selector).annotation.horizontalAlignment = value as HorizontalAlignment;
        diagram.dataBind(); diagram.updateSelector();
    }
}
document.getElementById('verticalAlignment').onchange = () => {
    let value: string = (document.getElementById('verticalAlignment') as HTMLInputElement).value;
    if ((diagram.selectedItems as Selector).annotation) {
        (diagram.selectedItems as Selector).annotation.verticalAlignment = value as VerticalAlignment;
        diagram.dataBind(); diagram.updateSelector();
    }
}

document.getElementById('margin').onclick = function () {
    let left: number = Number((document.getElementById('marginLeft') as HTMLInputElement).value);
    let right: number = Number((document.getElementById('marginRight') as HTMLInputElement).value);
    let top: number = Number((document.getElementById('marginTop') as HTMLInputElement).value);
    let bottom: number = Number((document.getElementById('marginBottom') as HTMLInputElement).value);
    if ((diagram.selectedItems as Selector).annotation) {
        (diagram.selectedItems as Selector).annotation.margin.left = left;
        (diagram.selectedItems as Selector).annotation.margin.right = right;
        (diagram.selectedItems as Selector).annotation.margin.top = top;
        (diagram.selectedItems as Selector).annotation.margin.bottom = bottom;
        diagram.dataBind(); diagram.updateSelector();
    }

}
document.getElementById('textWrapping').onchange = () => {
    let textWrapping: string = (document.getElementById('textWrapping') as HTMLInputElement).value;
    if ((diagram.selectedItems as Selector).annotation) {
        (diagram.selectedItems as Selector).annotation.style.textWrapping = textWrapping as TextWrap;
        diagram.dataBind(); diagram.updateSelector();
    }
}

document.getElementById('textAlign').onchange = () => {
    let textAlign: string = (document.getElementById('textAlign') as HTMLInputElement).value;
    if ((diagram.selectedItems as Selector).annotation) {
        (diagram.selectedItems as Selector).annotation.style.textAlign = textAlign as TextAlign;
        diagram.dataBind(); diagram.updateSelector();
    }
}

document.getElementById('textDecoration').onchange = () => {
    let textDecoration = (document.getElementById('textDecoration') as HTMLInputElement).value;
    if ((diagram.selectedItems as Selector).annotation) {
        (diagram.selectedItems as Selector).annotation.style.textDecoration = textDecoration as TextDecoration;
        diagram.dataBind(); diagram.updateSelector();
    }
}

document.getElementById('textOverflow').onchange = () => {
    let textOverflow: string = (document.getElementById('textOverflow') as HTMLInputElement).value;
    if ((diagram.selectedItems as Selector).annotation) {
        (diagram.selectedItems as Selector).annotation.style.textOverflow = textOverflow as TextOverflow;
        diagram.dataBind(); diagram.updateSelector();
    }
}

document.getElementById('whiteSpace').onchange = () => {
    let whiteSpace: string = (document.getElementById('whiteSpace') as HTMLInputElement).value;
    if ((diagram.selectedItems as Selector).annotation) {
        (diagram.selectedItems as Selector).annotation.style.whiteSpace = whiteSpace as WhiteSpace;
        diagram.dataBind(); diagram.updateSelector();
    }
}

document.getElementById('segmentAngle').onchange = function () {
    let value: boolean = (document.getElementById('segmentAngle') as HTMLInputElement).checked ? true : false;
    if ((diagram.selectedItems as Selector).connectors.length) {
        (diagram.selectedItems as Selector).connectors[0].annotations[0].segmentAngle = value;
        diagram.dataBind();  diagram.updateSelector();
    }
}