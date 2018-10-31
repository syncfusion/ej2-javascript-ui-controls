/**
 * Explores the types of nodes
 */

import {
    Diagram, NodeModel, StackPanel, PortVisibility, AnnotationModel, ShapeAnnotationModel, Node, TextElement, ConnectorModel, Orientation, VerticalAlignment, Port, PointPort, PortModel, PointPortModel
} from '../../src/diagram/index';

let nodes: NodeModel[] = [
    {
        id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
    },
    {
        id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
        shape: { type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z' },
        annotations: [{ content: 'Path Element' }]
    },
    {
        id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, shape: { type: 'Text', content: 'Text Element' },
        style: { strokeColor: 'none', fill: 'none', color: 'blue', bold: true }
    },
    {
        id: 'node4', width: 50, height: 50, offsetX: 700, offsetY: 100, style: { fill: 'none' },
        shape: { type: 'Image', source: './employee.PNG' }
    },
    {
        id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
        annotations: [{ content: 'Custom Template', offset: { y: 1 }, verticalAlignment: 'Top' }]
    }
];

let getTextElement: Function = (text: string) => {
    let textElement: TextElement = new TextElement();
    textElement.width = 50;
    textElement.height = 20;
    textElement.content = text;
    return textElement;
};

let addRows: Function = (column: StackPanel) => {
    column.children.push(getTextElement('Row1'));
    column.children.push(getTextElement('Row2'));
    column.children.push(getTextElement('Row3'));
    column.children.push(getTextElement('Row4'));
};

let diagram: Diagram = new Diagram({
    width: '800px', height: '500px', nodes: nodes,
    setNodeTemplate: (obj: NodeModel, diagram: Diagram): StackPanel => {
        if (obj.id === 'node5') {
            //it will be replaced with grid panel
            let table: StackPanel = new StackPanel();
            table.orientation = 'Horizontal';

            let column1: StackPanel = new StackPanel();
            column1.children = [];
            column1.children.push(getTextElement('Column1'));
            addRows(column1);

            let column2: StackPanel = new StackPanel();
            column2.children = [];
            column2.children.push(getTextElement('Column2'));
            addRows(column2);

            table.children = [column1, column2];
            return table;
        }
        return null;
    }
});
diagram.appendTo('#diagram');
let addport = document.getElementById('addport');
addport.onclick = function () {
    let nodes: Node = diagram.nodes[0] as Node
    let port: PointPortModel[] =
        [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0 } },
        { id: 'port2', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 1, y: 0 } },
        { id: 'port3', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 1 } },
        { id: 'port4', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 1, y: 1 } }
        ]
    diagram.addPorts(nodes, port)
}
let addlabel = document.getElementById('addlabel');
addlabel.onclick = function () {
    let nodes: Node = diagram.nodes[0] as Node
    let label: ShapeAnnotationModel[] =
        [{ id: 'label1', content: 'Default Shape', offset: { x:0  } },
         { id: 'label2', content: 'Default Shape', offset: { y: 0 } },
         { id: 'label3', content: 'Default Shape', offset: { x: 1 } },
         { id: 'label4', content: 'Default Shape', offset: { y: 1 } }]
    diagram.addLabels(nodes, label);
}

let removeport = document.getElementById('removeport');
removeport.onclick = function () {
    let nodes: Node = diagram.nodes[0] as Node
    let port: PointPortModel[] = [
        {id: 'port1',},{id: 'port2',},{id: 'port3',},{id: 'port4',}
    ]
    diagram.removePorts(nodes, port);
}

let removelabel = document.getElementById('removelabel');
removelabel.onclick = function () {
    let nodes: Node = diagram.nodes[0] as Node
    let port: ShapeAnnotationModel[] = [
        { id: 'label1', content: 'Default Shape', offset: { y: .4 } },
        { id: 'label2', content: 'Default Shape', offset: { y: .4 } }
        ,{ id: 'label3', content: 'Default Shape', offset: { y: .4 } },
        { id: 'label4', content: 'Default Shape', offset: { y: .4 } }]
    diagram.removeLabels(nodes, port);
}