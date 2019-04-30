import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import {
    Diagram, NodeModel, DiagramTools, BasicShapeModel, SnapSettingsModel,
    NodeConstraints, DataBinding, RadialTree, SnapConstraints, ZoomOptions
} from '@syncfusion/ej2-diagrams';
import { DataManager } from '@syncfusion/ej2-data';
import { radialTree, DataInfo } from './assets/diagram-data';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
Diagram.Inject(DataBinding, RadialTree);

/**
 * Sample for Radial Tree layout
 */
@Component({
    selector: 'app-root',
    templateUrl: 'annotations.component.html',
   // styleUrls: ['diagram-style.css'],
    encapsulation: ViewEncapsulation.None
})
export class RadialTreeDiagramComponent {
    @ViewChild('diagram')
    public diagram: DiagramComponent;
    public tool: DiagramTools = DiagramTools.ZoomPan;
    public data: Object = {
        //sets the fields to bind
        id: 'Id', parentId: 'ReportingPerson',
        dataManager: new DataManager(radialTree as JSON[]),
        //binds the data with the nodes
        doBinding: (nodeModel: NodeModel, data: DataInfo, diagram: Diagram) => {
            nodeModel.annotations = [{
                content: data.Name,
                style: data.Id === 'parent' ? { color: 'white', fontSize: 50 } : { color: 'black', fontSize: 20 }
            }];
            nodeModel.constraints = NodeConstraints.Default & ~NodeConstraints.InheritTooltip | NodeConstraints.Tooltip;
            nodeModel.tooltip = {
                content: data.Name + '<br/>' + data.Designation, relativeMode: 'Object',
                position: 'TopCenter', showTipPointer: true,
            };
            if (data.Designation === 'Managing Director') {
                nodeModel.width = 400;
                nodeModel.height = 400;
                nodeModel.shape = { shape: 'Ellipse' } as BasicShapeModel;
                nodeModel.style = { fill: 'black' };
            } else if (data.Designation === 'Project Manager') {
                nodeModel.width = 130;
                nodeModel.height = 130;
                nodeModel.height = 130;
                nodeModel.style = { fill: '#f8ab52' };
            } else {
                nodeModel.width = 100;
                nodeModel.height = 100;
                nodeModel.shape = { shape: 'Ellipse' } as BasicShapeModel;
                nodeModel.style = { fill: '#afeeee' };
            }
        }
    };
    public layout: Object = {
        type: 'RadialTree', verticalSpacing: 30, horizontalSpacing: 20,
        root: 'Category'
    };

    public create(args: Object): void {
        this.diagram.fitToPage();
        this.diagram.dataBind();
    }

    public snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None };
    public onItemClick(args: ClickEventArgs): void {
        switch (args.item.text) {
            case 'Zoom In':
                let zoomin: ZoomOptions = { type: 'ZoomIn', zoomFactor: 0.2 };
                this.diagram.zoomTo(zoomin);
                this.diagram.dataBind();
                break;
            case 'Zoom Out':
                let zoomout: ZoomOptions = { type: 'ZoomOut', zoomFactor: 0.2 };
                this.diagram.zoomTo(zoomout);
                this.diagram.dataBind();
                break;
            case 'Reset':
                this.diagram.reset();
                this.diagram.fitToPage();
                break;
        }
    }
}