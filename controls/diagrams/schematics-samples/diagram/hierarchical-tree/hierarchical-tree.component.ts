/**
 * Sample for Hierarchical layout
 */

import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import {
    Diagram, NodeModel, ConnectorModel, LayoutAnimation, DataBinding,
    HierarchicalTree, SnapConstraints, SnapSettingsModel, TextModel, LayoutOrientation
} from '@syncfusion/ej2-diagrams';
import { DataManager } from '@syncfusion/ej2-data';
import { hierarchicalTree } from './diagram-data';
Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);

export interface EmployeeInfo {
    Name: string;
}

@Component({
    selector: 'control-content',
    templateUrl: 'hierarchical-tree.component.html',
    encapsulation: ViewEncapsulation.None
})

export class HierarchyDiagramComponent {
    @ViewChild('diagram')
    public diagram: DiagramComponent;

    public data: Object = {
        //sets the fields to bind
        id: 'Name', parentId: 'Category',
        dataManager: new DataManager(hierarchicalTree as JSON[]),
        //binds the data with the nodes
        doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
            nodeModel.shape = { type: 'Text', content: (data as EmployeeInfo).Name };
        }
    };

    public snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None };

    public layout: Object = {
        type: 'HierarchicalTree', verticalSpacing: 30, horizontalSpacing: 40,
        enableAnimation: true
    };

    //Defines the default node and connector properties
    public nodeDefaults(obj: NodeModel): NodeModel {
        obj.style = { fill: '#659be5', strokeColor: 'none', color: 'white', strokeWidth: 2 };
        obj.borderColor = '#3a6eb5';
        obj.backgroundColor = '#659be5';
        (obj.shape as TextModel).margin = { left: 5, right: 5, bottom: 5, top: 5 };
        obj.expandIcon = { height: 10, width: 10, shape: 'None', fill: 'lightgray', offset: { x: .5, y: 1 } };
        obj.expandIcon.verticalAlignment = 'Auto';
        obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
        obj.collapseIcon.offset = { x: .5, y: 1 };
        obj.collapseIcon.verticalAlignment = 'Auto';
        obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
        obj.collapseIcon.height = 10;
        obj.collapseIcon.width = 10;
        obj.collapseIcon.padding.top = 5;
        obj.collapseIcon.shape = 'None';
        obj.collapseIcon.fill = 'lightgray';
        return obj;
    };

    public connDefaults(connector: ConnectorModel, diagram: Diagram): ConnectorModel {
        connector.targetDecorator.shape = 'None';
        connector.type = 'Orthogonal';
        connector.constraints = 0;
        connector.cornerRadius = 5;
        connector.style.strokeColor = '#6d6d6d';
        return connector;
    }

}