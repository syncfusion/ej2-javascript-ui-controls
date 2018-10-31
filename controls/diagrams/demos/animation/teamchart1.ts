/**
 * Team Organizational Chart
 */

import {
    Diagram, ConnectorModel, Node, Animation,
    Container, TextElement, StackPanel, SelectorConstraints, ImageElement, DataBinding, HierarchicalTree, LayoutAnimation
} from '../../src/diagram/index';

Diagram.Inject(DataBinding, HierarchicalTree);

import { DataManager, Query } from '@syncfusion/ej2-data';
import {
    NodeModel, Orientation, VerticalAlignment, PathElement, HorizontalAlignment
} from '../../src/diagram/index';
import { DiagramNativeElement } from '../../src/diagram/core/elements/native-element';
import { IconShapeModel } from '../../src/diagram/objects/icon-model';
Diagram.Inject(LayoutAnimation);
let data: object[] = [
    {
        'Id': 'parent1', 'Name': 'Maria ', 'Designation': 'Managing Director',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': 'parent', 'Name': ' sam', 'Designation': 'Managing Director', 'ReportingPerson': 'parent1',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': 'parent3', 'Name': ' sam geo', 'Designation': 'Managing Director', 'ReportingPerson': 'parent1',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': '80', 'Name': ' david', 'Designation': 'Managing Director', 'ReportingPerson': 'parent3',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': '81', 'Name': ' andres', 'Designation': 'Managing Director', 'ReportingPerson': 'parent3',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': '82', 'Name': ' pirlo', 'Designation': 'Managing Director', 'ReportingPerson': '81',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': '83', 'Name': ' antonio', 'Designation': 'Managing Director', 'ReportingPerson': '81',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': '84', 'Name': ' antonio', 'Designation': 'Managing Director', 'ReportingPerson': '84',
        'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    },
    {
        'Id': 1, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
        'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },
    {
        'Id': 1111, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
        'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'true',
        'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    },
    {
        'Id': 2, 'Name': 'Anto damien', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': '1111'
    },
    {
        'Id': 39, 'Name': 'sathik', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': '2'
    },
    {
        'Id': 69, 'Name': 'Anto savilla', 'Designation': 'Project Lead',
        'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
        'RatingColor': '#93B85A', 'ReportingPerson': '39    '
    },
    // {
    //     'Id': 21, 'Name': 'Anto Martin', 'Designation': 'Project Lead',
    //     'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
    //     'RatingColor': '#93B85A', 'ReportingPerson': '1111'
    // },
    // {
    //     'Id': 22, 'Name': 'Anto gali', 'Designation': 'Project Lead',
    //     'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
    //     'RatingColor': '#93B85A', 'ReportingPerson': '1111'
    // },
    // {
    //     'Id': 29, 'Name': 'Anto gali', 'Designation': 'Project Lead',
    //     'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
    //     'RatingColor': '#93B85A', 'ReportingPerson': '22'
    // },
    // {
    //     'Id': 3, 'Name': 'kane', 'Designation': 'Senior S/w Engg',
    //     'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
    //     'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
    // },
    // {
    //     'Id': 31, 'Name': 'ric', 'Designation': 'Senior S/w Engg',
    //     'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
    //     'RatingColor': '#68C2DE', 'ReportingPerson': '3'
    // },
    // {
    //     'Id': 32, 'Name': 'mics', 'Designation': 'Senior S/w Engg',
    //     'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
    //     'RatingColor': '#68C2DE', 'ReportingPerson': '3'
    // },
    // {
    //     'Id': 33, 'Name': 'mics', 'Designation': 'Senior S/w Engg',
    //     'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
    //     'RatingColor': '#68C2DE', 'ReportingPerson': '32'
    // },
    // {
    //     'Id': '5', 'Name': 'Maria gan', 'Designation': 'Managing Director', 'ReportingPerson': 'parent1',
    //     'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    // },
    // {
    //     'Id': '6', 'Name': 'Maria sopie', 'Designation': 'Managing Director', 'ReportingPerson': '5',
    //     'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    // },
    // {
    //     'Id': '67', 'Name': 'Maria nale ', 'Designation': 'Managing Director', 'ReportingPerson': '6',
    //     'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    // },
    // {
    //     'Id': '68', 'Name': 'Maria nale ', 'Designation': 'Managing Director', 'ReportingPerson': '67',
    //     'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
    // },
    // {
    //     'Id': '7', 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
    //     'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'true',
    //     'RatingColor': '#68C2DE', 'ReportingPerson': '5'
    // },
    // {
    //     'Id': '8', 'Name': 'Ana saga', 'Designation': 'Project Manager',
    //     'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'true',
    //     'RatingColor': '#68C2DE', 'ReportingPerson': '7'
    // },
    // {
    //     'Id': '9', 'Name': 'Ana tarza', 'Designation': 'Project Manager',
    //     'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'true',
    //     'RatingColor': '#68C2DE', 'ReportingPerson': '7'
    // },


];

let items: DataManager = new DataManager(data as JSON[], new Query().take(7));

let diagram: Diagram = new Diagram({
    width: '1250px', height: '590px', selectedItems: { constraints: ~SelectorConstraints.ResizeAll },
    snapSettings: { constraints: 0 },
    layout: {
        enableAnimation: true,
        type: 'OrganizationalChart', margin: { top: 20 },
        getLayoutInfo: (node: Node, tree: TreeInfo) => {
            if (!tree.hasSubTree) {
                tree.orientation = 'vertical';
                tree.type = 'alternate';
            }
        }
    },
    dataSourceSettings: {
        id: 'Id', parentId: 'ReportingPerson', dataManager: items
    },

    getNodeDefaults: (obj: Node, diagram: Diagram) => {
        //obj.isAnimation=true;
        //obj.collapseIcon 
        obj.expandIcon = { height: 15, width: 15, shape: "Plus", fill: 'lightgray', offset: { x: .5, y: .85 } }
        //obj.expandIcon :{height: 20, width: 20, shape: "ArrowDown",}
        obj.collapseIcon.offset = { x: .5, y: .85 }
        obj.collapseIcon.height = 15;
        obj.collapseIcon.width = 15;
        obj.collapseIcon.shape = "Minus";
        obj.collapseIcon.fill = 'lightgray';
        obj.height = 50;
        obj.backgroundColor = 'lightgrey';
        obj.style = { fill: 'transparent', strokeWidth: 2 };
        return obj;
    }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
        connector.targetDecorator.shape = 'None';
        connector.type = 'Orthogonal';
        return connector;
    },

    setNodeTemplate: (obj: Node, diagram: Diagram): Container => {
        let content: StackPanel = new StackPanel();
        content.id = obj.id + '_outerstack';
        content.style.strokeColor = 'darkgreen';
        content.orientation = 'Horizontal';
        content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
        let innerStack: StackPanel = new StackPanel();
        innerStack.style.strokeColor = 'none';
        innerStack.margin = { left: 15, right: 15, top: 15, bottom: 15 };
        innerStack.id = obj.id + '_innerstack';

        let text: TextElement = new TextElement();
        text.content = obj.data['Name'];

        text.style.color = 'blue';
        text.style.strokeColor = 'none';
        text.style.fill = 'none';
        text.id = obj.id + '_text1';

        let desigText: TextElement = new TextElement();
        desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
        desigText.content = obj.data['Designation'];
        desigText.style.color = 'blue';
        desigText.style.strokeColor = 'none';
        desigText.style.fill = 'none';
        desigText.style.textWrapping = 'Wrap';
        desigText.id = obj.id + '_desig';
        innerStack.children = [text, desigText];

        content.children = [innerStack];

        return content;
    }
});

diagram.appendTo('#diagram');
diagram.animationComplete = () => {
    //if (args.state === 'Completed') {
    //.//.done();
    //}
};
// diagram.diagramev
export interface TreeInfo {
    orientation?: string; type?: string; offset?: number; enableRouting?: boolean; children?: string[];
    assistants?: string[]; level?: number; hasSubTree?: boolean; rows?: number;
}