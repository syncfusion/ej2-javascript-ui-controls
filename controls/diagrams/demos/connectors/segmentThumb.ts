import { Diagram, ConnectorEditing, Matrix, ConnectorConstraints, transformPointByMatrix, rotateMatrix, identityMatrix, DiagramElement, ConnectorBridging, DiagramConstraints, Connector, UndoRedo, Segments, DiagramTools, PointModel, PathAnnotationModel, Html } from '../../src/diagram/index';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { MouseEvents } from '../../spec/diagram/interaction/mouseevents.spec';
Diagram.Inject(ConnectorEditing, UndoRedo);

/**
 * Segement Thumb - Hide Option
 */

let connector2: ConnectorModel = {};
connector2.id = 'connector2';
connector2.type = 'Orthogonal';
connector2.sourcePoint = { x: 250, y: 250 };
connector2.targetPoint = { x: 350, y: 350 };
connector2.segments = [{ type: 'Orthogonal', direction: "Right", length: 70 }, { type: 'Orthogonal', direction: "Bottom", length: 20 }]


let diagram: Diagram = new Diagram({
    width: '900px', height: '500px', connectors: [connector2],
    getConnectorDefaults: function (connector: ConnectorModel) {
        connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
    }

});

diagram.appendTo('#diagram');


document.getElementById('submit').onclick = function () {
    let index: number = Number((document.getElementById('segIndex') as HTMLInputElement).value);
    let allowDrag: boolean = (document.getElementById('allowDrag') as HTMLInputElement).checked ? true : false;
    let connector = diagram.connectors[0];
    connector.segments[index].allowDrag = allowDrag;
    diagram.dataBind();
}

diagram.segmentCollectionChange = function (args) {
    let allowDrag: boolean = (document.getElementById('allowDrag') as HTMLInputElement).checked ? true : false;
    document.getElementById('eventtracker').innerHTML += '<br /> Segement Collection Change : ' + ((args.type == 'Addition') ? args.addSegments.length + ', ' : '') + args.type;
    document.getElementById('eventtracker').scrollTop = document.getElementById('eventtracker').scrollHeight;
    if (args.type == 'Addition') {
        for (let i: number = 0; i < args.addSegments.length; i++) {
            args.addSegments[i].allowDrag = allowDrag;
        }
    }
}