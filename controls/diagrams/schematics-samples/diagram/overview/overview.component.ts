import { Component, ViewEncapsulation } from '@angular/core';
import {
    NodeModel, DiagramTools, ScrollSettingsModel, LayoutModel,
    Diagram, ConnectorModel, Node, SnapConstraints, SnapSettingsModel,
    Container, TextElement, StackPanel, ImageElement, DataBinding, HierarchicalTree, TreeInfo
} from '@syncfusion/ej2-diagrams';
import { DataManager } from '@syncfusion/ej2-data';
import { data } from './overview-data';
Diagram.Inject(DataBinding, HierarchicalTree);
/**
 * Sample for Overview layout
 */
@Component({
    selector: 'control-content',
    templateUrl: 'overview.component.html',
    encapsulation: ViewEncapsulation.None
})
export class OverviewDiagramComponent {

    public data: Object = {
        id: 'Id', parentId: 'ReportingPerson', dataManager: new DataManager(data)
    };

    public layout: LayoutModel = {
        type: 'OrganizationalChart', margin: { top: 20 },
        getLayoutInfo: (node: Node, tree: TreeInfo) => {
            if (!tree.hasSubTree) {
                tree.orientation = 'Vertical';
                tree.type = 'Right';
            }
        }
    };

    public nodeDefaults(obj: NodeModel): NodeModel {
        obj.height = 50;
        obj.style = { fill: 'transparent', strokeWidth: 2 };
        return obj;
    };

    public connDefaults(connector: ConnectorModel): ConnectorModel {
        connector.targetDecorator.shape = 'None';
        connector.type = 'Orthogonal';
        connector.style.strokeColor = 'gray';
        return connector;
    };

    public tool: DiagramTools = DiagramTools.ZoomPan;
    public snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None };
    public scrollSettings: ScrollSettingsModel = { scrollLimit: 'Infinity' };

    public setNodeTemplate(obj: NodeModel, diagram: Diagram): Container {
        let content: StackPanel = new StackPanel();
        content.id = obj.id + '_outerstack';
        content.orientation = 'Horizontal';
        content.style.strokeColor = 'gray';
        content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
        let image: ImageElement = new ImageElement();
        image.width = 50;
        image.height = 50;
        image.style.strokeColor = 'none';
        image.source = (obj.data as EmployeeInfo).ImageUrl;
        image.id = obj.id + '_pic';
        let innerStack: StackPanel = new StackPanel();
        innerStack.style.strokeColor = 'none';
        innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
        innerStack.id = obj.id + '_innerstack';

        let text: TextElement = new TextElement();
        text.content = (obj.data as EmployeeInfo).Name;
        text.style.color = 'black';
        text.style.bold = true;
        text.style.strokeColor = 'none';
        text.horizontalAlignment = 'Left';
        text.style.fill = 'none';
        text.id = obj.id + '_text1';

        let desigText: TextElement = new TextElement();
        desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
        desigText.content = (obj.data as EmployeeInfo).Designation;
        desigText.style.color = 'black';
        desigText.style.strokeColor = 'none';
        desigText.style.fontSize = 12;
        desigText.style.fill = 'none';
        desigText.horizontalAlignment = 'Left';
        desigText.style.textWrapping = 'Wrap';
        desigText.id = obj.id + '_desig';
        innerStack.children = [text, desigText];

        content.children = [image, innerStack];

        return content;
    };
}
export interface EmployeeInfo {
    Name: string;
    Designation: string;
    ImageUrl: string;
}