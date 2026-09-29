import { Component, ViewEncapsulation } from '@angular/core';
import { DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import {
    Diagram, NodeModel, UndoRedo, PointPortModel, Connector, FlowShapeModel,
    IDragEnterEventArgs, SnapSettingsModel, MarginModel, TextStyleModel, StrokeStyleModel,
    OrthogonalSegmentModel, Node,
} from '@syncfusion/ej2-diagrams';
Diagram.Inject(UndoRedo);

/**
 * Default FlowShape sample
 */

@Component({
    selector: 'control-content',
    templateUrl: 'default-functionalities.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FlowDiagramComponent {
    //Diagram Properties
    public diagram: DiagramComponent;
    public terminator: FlowShapeModel = { type: 'Flow', shape: 'Terminator' };
    public process: FlowShapeModel = { type: 'Flow', shape: 'Process' };
    public decision: FlowShapeModel = { type: 'Flow', shape: 'Decision' };
    public data: FlowShapeModel = { type: 'Flow', shape: 'Data' };
    public directdata: FlowShapeModel = { type: 'Flow', shape: 'DirectData' };

    public margin: MarginModel = { left: 25, right: 25 };
    public connAnnotStyle: TextStyleModel = { fill: 'white' };
    public strokeStyle: StrokeStyleModel = { strokeDashArray: '2,2' };

    public segments: OrthogonalSegmentModel = [{ type: 'Orthogonal', direction: 'Top', length: 120 }];
    public segments1: OrthogonalSegmentModel = [
        { type: 'Orthogonal', direction: 'Right', length: 100 }
    ];

    public nodeDefaults(node: NodeModel): NodeModel {
        let obj: NodeModel = {};
        if (obj.width === undefined) {
            obj.width = 145;
        } else {
            let ratio: number = 100 / obj.width;
            obj.width = 100;
            obj.height *= ratio;
        }
        obj.style = { fill: '#357BD2', strokeColor: 'white' };
        obj.annotations = [{ style: { color: 'white', fill: 'transparent' } }];
        obj.ports = getPorts(node);
        return obj;
    }
    public connDefaults(obj: Connector): void {
        if (obj.id.indexOf('connector') !== -1) {
            obj.type = 'Orthogonal';
            obj.targetDecorator = { shape: 'Arrow', width: 10, height: 10 };
        }
    }
    public interval: number[] = [
        1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25,
        9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75
    ];

    public snapSettings: SnapSettingsModel = {
        horizontalGridlines: { lineColor: '#e0e0e0', lineIntervals: this.interval },
        verticalGridlines: { lineColor: '#e0e0e0', lineIntervals: this.interval }
    };

    public dragEnter(args: IDragEnterEventArgs): void {
        let obj: NodeModel = args.element as NodeModel;
        if (obj instanceof Node) {
            let oWidth: number = obj.width;
            let oHeight: number = obj.height;
            let ratio: number = 100 / obj.width;
            obj.width = 100;
            obj.height *= ratio;
            obj.offsetX += (obj.width - oWidth) / 2;
            obj.offsetY += (obj.height - oHeight) / 2;
            obj.style = { fill: '#357BD2', strokeColor: 'white' };
        }
    }

}

function getPorts(obj: NodeModel): PointPortModel[] {
    let ports: PointPortModel[] = [
        { id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 } },
        { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 1 } },
        { id: 'port3', shape: 'Circle', offset: { x: 1, y: 0.5 } },
        { id: 'port4', shape: 'Circle', offset: { x: 0.5, y: 0 } }
    ];
    return ports;
}