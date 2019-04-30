import { Diagram, Matrix, ConnectorConstraints, DecoratorShapes, DiagramElement, Connector, UndoRedo, ConnectorBridging } from '../../src/diagram/index';
import { ConnectorModel, DecoratorModel } from '../../src/diagram/objects/connector-model';
Diagram.Inject(ConnectorBridging, UndoRedo);

/**
 * Connectors
 */

let connectors: ConnectorModel[] = [
    {
        id: 'connector1',
        type: 'Straight',
        sourcePoint: { x: 100, y: 100 },
        targetPoint: { x: 200, y: 200 },
        sourceDecorator: {
            style: { fill: 'black' },
            shape: 'Diamond',
            pivot: { x: 0, y: 0.5 }
        },
        targetDecorator: {
            shape: 'Circle',
            style: { fill: 'blue' },
            pivot: { x: 0, y: 0.5 }
        }
    },
    {
        id: 'connector2',
        type: 'Orthogonal',
        sourcePoint: { x: 300, y: 100 },
        targetPoint: { x: 400, y: 200 },
        sourceDecorator: {
            style: { fill: 'black' },
            shape: 'Diamond',
            pivot: { x: 0, y: 0.5 }
        },
        targetDecorator: {
            shape: 'Square',
            style: { fill: 'blue' },
            pivot: { x: 0, y: 0.5 }
        }
    },
    {
        id: 'connector3',
        type: 'Bezier',
        sourcePoint: { x: 500, y: 100 },
        targetPoint: { x: 600, y: 200 },
        sourceDecorator: {
            style: { fill: 'black' },
            shape: 'Arrow',
            pivot: { x: 0, y: 0.5 }
        },
        targetDecorator: {
            shape: 'Diamond',
            style: { fill: 'blue' },
            pivot: { x: 0, y: 0.5 }
        }
    },
];

let diagram: Diagram = new Diagram({
    width: '1050px', height: '500px', connectors: connectors,
});

diagram.appendTo('#diagram');

let obj: ConnectorModel;
let decorator: DecoratorModel;

document.getElementById('selectionoption').onchange = selectionOption;
function selectionOption() {
    let e: HTMLSelectElement = (document.getElementById('selectionoption')) as HTMLSelectElement;
    diagram.select([diagram.connectors[Number(e.value)]]);
    obj = diagram.selectedItems.connectors[0];
    decorator = ((document.getElementById('sourceDecRadio') as HTMLInputElement).checked) ? obj.sourceDecorator : obj.targetDecorator;
}
document.getElementById('unSelect').onclick = () => {
    diagram.clearSelection();
    (document.getElementById('selectionoption') as HTMLInputElement).value = 'unSelect';
}
document.getElementById('decoratorShapes').onchange = () => {
    decorator.shape = (document.getElementById('decoratorShapes') as HTMLInputElement).value as DecoratorShapes;
    if ((document.getElementById('decoratorShapes') as HTMLInputElement).value === 'Custom') {
        document.getElementById('path').style.display = 'block';
    }
}

document.getElementById('sourceDecRadio').onchange = () => {
    if(diagram.selectedItems.connectors.length>0){
    decorator = diagram.selectedItems.connectors[0].sourceDecorator;
    }
}

document.getElementById('targetDecRadio').onchange = () => {
    if(diagram.selectedItems.connectors.length>0){
    decorator = diagram.selectedItems.connectors[0].targetDecorator;
    }
}

document.getElementById('pathData').onchange = () =>{
    decorator.pathData = (document.getElementById('pathData') as HTMLInputElement).value;
}

document.getElementById('pivotX').onchange = () =>{
    decorator.pivot.x = Number((document.getElementById('pivotX') as HTMLInputElement).value);
}
document.getElementById('pivotY').onchange = () =>{
    decorator.pivot.y = Number((document.getElementById('pivotY') as HTMLInputElement).value);
}

document.getElementById('fillColor').onchange = () => {
    if ((document.getElementById('fillColorRadio') as HTMLInputElement).checked) {
        decorator.style.fill = (document.getElementById('fillColor') as HTMLInputElement).value;
    } else {
        decorator.style.strokeColor = (document.getElementById('fillColor') as HTMLInputElement).value;
    }
    diagram.dataBind();
}
document.getElementById('widthHeight').onchange = () => {
    if ((document.getElementById('widthRadio') as HTMLInputElement).checked) {
        decorator.width = Number((document.getElementById('widthHeight') as HTMLInputElement).value);
    } else {
        decorator.height = Number((document.getElementById('widthHeight') as HTMLInputElement).value);
    }
    diagram.dataBind();
}
document.getElementById('strokeWidth').onchange = () => {
    decorator.style.strokeWidth = Number((document.getElementById('strokeWidth') as HTMLInputElement).value);
    diagram.dataBind();
}
document.getElementById('strokeDashArray').onchange = () => {
    decorator.style.strokeDashArray = (document.getElementById('strokeDashArray') as HTMLInputElement).value;
    diagram.dataBind();
}
document.getElementById('opacity').onchange = () => {
    decorator.style.opacity = Number((document.getElementById('opacity') as HTMLInputElement).value);
    diagram.dataBind();
}
let undo = document.getElementById('undo');
undo.onclick = function () {
    diagram.undo();
};

let redo = document.getElementById('redo');
redo.onclick = function () {
    diagram.redo();
};

let copy = document.getElementById('copy');
copy.onclick = function () {
    diagram.copy();

}

let paste = document.getElementById('paste');
paste.onclick = function () {
    diagram.paste();
}
