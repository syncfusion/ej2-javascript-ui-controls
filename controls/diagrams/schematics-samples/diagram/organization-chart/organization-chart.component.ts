import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ChangeEventArgs as NumericChangeEventArgs } from '@syncfusion/ej2-inputs';
import {
    DiagramComponent, Diagram, NodeModel, ConnectorModel, LayoutOrientation, LayoutAnimation, TreeInfo, SnapSettingsModel,
    SubTreeOrientation, SubTreeAlignments, DiagramTools, Node, DataBinding, HierarchicalTree, SnapConstraints
} from '@syncfusion/ej2-angular-diagrams';
import { DataManager } from '@syncfusion/ej2-data';
import { localBindData } from './../diagram-data';
Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);

export interface EmployeeInfo {
    Role: string;
    color: string;
}
export interface DataInfo {
    [key: string]: string;
}

/**
 * Sample for Organizational Chart
 */
@Component({
    selector: 'control-content',
    templateUrl: 'organization-chart.component.html',
    encapsulation: ViewEncapsulation.None
})
export class OrganizationalChartDiagramComponent {
    @ViewChild('diagram')
    public diagram: DiagramComponent;
    public snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None };
    public tool: DiagramTools = DiagramTools.ZoomPan;
    public data: Object = {
        id: 'Id', parentId: 'Manager',
        dataManager: new DataManager(localBindData as JSON[]),
        doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
            nodeModel.shape = {
                type: 'Text', content: (data as EmployeeInfo).Role,
                margin: { left: 10, right: 10, top: 10, bottom: 10 }
            };
        }
    };
    public layout: Object = {
        type: 'OrganizationalChart',
        getLayoutInfo: (node: Node, options: TreeInfo) => {
            /* tslint:disable:no-string-literal */
            if ((node.data as DataInfo)['Role'] === 'General Manager') {
                options.assistants.push(options.children[0]);
                options.children.splice(0, 1);
            }
            if (!options.hasSubTree) {
                options.type = 'Right';
            }
        }
    };

    //Defines the default node and connector properties
    public nodeDefaults(obj: NodeModel): NodeModel {
        obj.backgroundColor = (obj.data as EmployeeInfo).color;
        obj.style = { fill: 'none', strokeColor: 'none', color: 'white' };
        obj.expandIcon = { height: 10, width: 10, shape: 'None', fill: 'lightgray', offset: { x: .5, y: 1 } };
        obj.expandIcon.verticalAlignment = 'Center';
        obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
        obj.collapseIcon.offset = { x: .5, y: 1 };
        obj.collapseIcon.verticalAlignment = 'Center';
        obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
        obj.collapseIcon.height = 10;
        obj.collapseIcon.width = 10;
        obj.collapseIcon.shape = 'None';
        obj.collapseIcon.fill = 'lightgray';
        obj.width = 120;
        obj.height = 30;
        return obj;
    };
    public connDefaults(connector: ConnectorModel, diagram: Diagram): ConnectorModel {
        connector.targetDecorator.shape = 'None';
        connector.type = 'Orthogonal';
        connector.constraints = 0;
        connector.cornerRadius = 0;
        return connector;
    }
    ngOnInit(): void {
        document.getElementById('appearance').onclick = this.documentClick.bind(this);
    }
    private documentClick(args: MouseEvent): void {
        let layoutOrientation: LayoutOrientation;
        let subTreeOrientation: SubTreeOrientation;
        let subTreeAlignment: SubTreeAlignments;
        let target: HTMLElement = args.target as HTMLElement;
        let selectedElement: HTMLCollection = document.getElementsByClassName('e-selected-style');
        if (selectedElement.length) {
            selectedElement[0].classList.remove('e-selected-style');
        }
        if (target.className === 'image-pattern-style') {
            switch (target.id) {
                case 'pattern1':
                    subTreeOrientation = 'Vertical';
                    subTreeAlignment = 'Alternate';
                    break;
                case 'pattern2':
                    subTreeOrientation = 'Vertical';
                    subTreeAlignment = 'Left';
                    break;
                case 'pattern3':
                    subTreeOrientation = 'Vertical';
                    subTreeAlignment = 'Left';
                    break;
                case 'pattern4':
                    subTreeOrientation = 'Vertical';
                    subTreeAlignment = 'Right';
                    break;
                case 'pattern5':
                    subTreeOrientation = 'Vertical';
                    subTreeAlignment = 'Right';
                    break;
                case 'pattern6':
                    subTreeOrientation = 'Horizontal';
                    subTreeAlignment = 'Balanced';
                    break;
                case 'pattern7':
                    subTreeOrientation = 'Horizontal';
                    subTreeAlignment = 'Center';
                    break;
                case 'pattern8':
                    subTreeOrientation = 'Horizontal';
                    subTreeAlignment = 'Left';
                    break;
                case 'pattern9':
                    subTreeOrientation = 'Horizontal';
                    subTreeAlignment = 'Right';
                    break;
                case 'topToBottom':
                    layoutOrientation = 'TopToBottom';
                    break;
                case 'bottomToTop':
                    layoutOrientation = 'BottomToTop';
                    break;
                case 'leftToRight':
                    layoutOrientation = 'LeftToRight';
                    break;
                case 'rightToLeft':
                    layoutOrientation = 'RightToLeft';
                    break;
            }
            if (layoutOrientation || subTreeOrientation) {
                if (layoutOrientation) {
                    this.diagram.layout.orientation = layoutOrientation;
                }
                target.classList.add('e-selected-style');
            }
            this.diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (target.id === 'pattern4' || target.id === 'pattern3') {
                    options.offset = -50;
                }
                if ((node.data as DataInfo)['Role'] === 'General Manager') {
                    options.assistants.push(options.children[0]);
                    options.children.splice(0, 1);
                }
                if (!options.hasSubTree) {
                    options.orientation = subTreeOrientation;
                    options.type = subTreeAlignment;
                }
            };

            this.diagram.doLayout();
            this.diagram.dataBind();
        }
    };

    public onhSpacingChange(args: NumericChangeEventArgs): void {
        this.diagram.layout.horizontalSpacing = Number(args.value);
        this.diagram.dataBind();
    }

    public onvSpacingChange(args: NumericChangeEventArgs): void {
        this.diagram.layout.verticalSpacing = Number(args.value);
        this.diagram.dataBind();
    }

}